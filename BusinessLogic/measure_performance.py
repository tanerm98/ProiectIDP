#!/usr/local/bin/python3

import argparse
import os
import subprocess
import time
from datetime import datetime

import logging
logging.getLogger().setLevel(logging.INFO)

from utils import download_file_from_google_drive
from utils import unzip_archive
from utils import comment_on_pr

from logs_enum import Logs


GDRIVE_API_CREDENTIALS_JSON = "gdrive_api_service_credentials.json"
APP_ARCHIVE = "app.zip"

TIMEOUT = 10

LAUNCHES = "LAUNCHES"
DEVICE = "DEVICE"
LAUNCH_TYPE = "LAUNCH_TYPE"
APP_SIZE = "APP_SIZE"
LAUNCH_DURATION = "LAUNCH_DURATION"
MEMORY_USAGE = "MEMORY_USAGE"
INSTALL_LAUNCH_DURATION = "INSTALL_LAUNCH_DURATION"
INSTALL_MEMORY_USAGE = "INSTALL_MEMORY_USAGE"


def parse_args():
    """
    Parses parameters of the script.
    :return: arguments
    """
    logging.info("Parsing script parameters...")
    parser = argparse.ArgumentParser(description='Measure iOS application performance.')

    # Mandatory arguments - test information
    parser.add_argument('--device', required=False, nargs='*', choices=["iPhone 8", "iPhone 11"], default=["iPhone 8", "iPhone 11"], help='iPhone type for running the tests on')
    parser.add_argument('--launch_type', required=False, nargs='*', choices=["WARM", "COLD"], default=["WARM", "COLD"], help='Tested launch type')
    parser.add_argument('--launch_nr', required=False, default=3, type=int, help='Number of launches for computing the average metric')

    # Test baselines
    parser.add_argument('--duration_limit', required=False, default=5000, type=int, help='Launch duration acceptable limit in milliseconds')
    parser.add_argument('--memory_limit', required=False, default=250, type=int, help='Launch memory usage acceptable limit in MB')
    parser.add_argument('--size_limit', required=False, default=500, type=int, help='App size acceptable limit in MB')

    # App information for installing app
    # There are 2 mutually exclusive options for getting the APP
    # Option 1 - from local machine
    parser.add_argument('--app_path', required=False, default=None, type=str, help='Path of the APP file')
    # Option 2 - from Google Drive
    parser.add_argument('--file_id', required=False, default=None, type=str, help='Google Drive ID of archive that contains the tested application - used for downloading the app')

    # App information for running app
    parser.add_argument('--bundle_id', required=True, type=str, help='Bundle ID of the tested iOS application')

    # Arguments necessary for posting test results on the Github repository of the iOS application
    parser.add_argument('--repo_github_token', required=False, default=None, type=str, help='Github token')
    parser.add_argument('--repo_owner', required=False, default=None, type=str, help='Owner of the repository')
    parser.add_argument('--repo_name', required=False, default=None, type=str, help='Name of the repository')
    parser.add_argument('--pr_number', required=False, default=None, type=str, help='PR number on which to post the comment')

    args = parser.parse_args()

    if args.app_path is None and args.file_id is None:
        logging.error("No APP location provided! Will check if it is installed on the device already...")

    if args.app_path is not None and args.file_id is not None:
        logging.error("Both local path APP and Google Drive file ID provided! Will try to use local path first.")

    if None in [args.repo_github_token, args.repo_owner, args.repo_name, args.pr_number]:
        logging.error("Test report will not be posted on Github PR - at least one Github parameter is missing!")

    return args


def prepare_simulator(simulator_name):
    """
    Erases the contents of tested simulator - similar to factory reset
    :param simulator_name: the simulator name to prepare (ex: iPhone 8, iPhone 11)
    :return: True if everything worked fine - False instead
    """
    logging.info("Preparing simulator {SIMULATOR}...".format(SIMULATOR=simulator_name))

    try:
        subprocess.Popen(
            "xcrun simctl erase '{SIMULATOR}'".format(SIMULATOR=simulator_name),
            shell=True
        ).wait()

    except Exception as e:
        logging.error("Preparing the simulator {SIMULATOR} failed with error '{ERROR}'".format(SIMULATOR=simulator_name, ERROR=e))
        return False

    logging.info("Simulator {SIMULATOR} clean!".format(SIMULATOR=simulator_name))
    return True


def boot_simulator(simulator_name):
    """
    Boots the simulator and waits for it to be ready.
    :param simulator_name: the simulator name to boot (ex: iPhone 8, iPhone 11)
    :return: True if everything worked fine - False instead
    """
    logging.info("Booting simulator {SIMULATOR}...".format(SIMULATOR=simulator_name))

    try:
        subprocess.Popen(
            "xcrun simctl boot '{SIMULATOR}'".format(SIMULATOR=simulator_name),
            shell=True
        ).wait()
        subprocess.Popen(
            "xcrun simctl launch '{SIMULATOR}' com.apple.Preferences".format(SIMULATOR=simulator_name),
            stdout=subprocess.PIPE,
            shell=True
        ).wait()
        subprocess.Popen(
            "xcrun simctl terminate '{SIMULATOR}' com.apple.Preferences".format(SIMULATOR=simulator_name),
            stdout=subprocess.PIPE,
            shell=True
        ).wait()

    except Exception as e:
        logging.error("Booting the simulators failed with error '{ERROR}'".format(ERROR=e))
        return False

    logging.info("Simulator booted!")
    return True


def shutdown_simulators():
    """
    Shuts down all the simulators
    :return: True if everything worked fine - False instead
    """
    logging.info("Shutting down all simulators...")

    try:
        subprocess.Popen(
            "xcrun simctl shutdown all",
            shell=True
        ).wait()

    except Exception as e:
        logging.error("Shutting down the simulators failed with error '{ERROR}'".format(ERROR=e))
        return False

    logging.info("Simulators shut down!")
    return True


def reboot_simulator(simulator_name):
    """
    Reboots simulator for COLD launch
    :param simulator_name: name of simulator to be rebooted
    :return: True if everything worked fine - False instead
    """
    logging.info("Rebooting simulator {SIMULATOR}...".format(SIMULATOR=simulator_name))

    r1 = shutdown_simulators()
    r2 = boot_simulator(simulator_name)

    if r1 is False or r2 is False:
        logging.error("Rebooting simulator failed!")
        return False

    return True


def get_app(args):
    """
    Searches the APP file in local paths or downloads it from Google Drive.
    :param args: script arguments
    :return: app path. If not found, returns None.
    """
    logging.info("Getting the APP...")

    try:
        if args.app_path is not None and os.path.exists(args.app_path):
            logging.info("Getting APP from local path {PATH}...".format(PATH=args.app_path))
            app_path = args.app_path

        elif args.file_id is not None:
            logging.info("Downloading APP from Google Drive...")
            download_file_from_google_drive(GDRIVE_API_CREDENTIALS_JSON, args.file_id, APP_ARCHIVE)
            logging.info("Unzipping archive with the APP file...")
            app_path = unzip_archive(APP_ARCHIVE)

        else:
            logging.error("No valid app path provided.")
            return None

        logging.info("App retrieved successfuly: {PATH}".format(PATH=app_path))
        return app_path

    except Exception as e:
        logging.error("Error getting the app: {ERROR}.".format(ERROR=e))
        return None


def compute_app_size(app_path):
    """
    Computes the app size in MB
    :param app_path: path to the APP file
    :return: size in MB or None if error occurred
    """
    logging.info("Computing size of application...")

    try:
        p = subprocess.Popen(
            "du -shm {PATH}".format(PATH=app_path),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            shell=True
        )
        output = p.communicate()[0]
        app_size = int(str(output.strip()).split("\t")[0])
        logging.info("Size of application: [{SIZE} MB]".format(SIZE=app_size))

    except Exception as e:
        logging.error("Error computing the app size: {ERROR}.".format(ERROR=e))
        return None

    logging.info("App size computed successfuly!")
    return app_size


def install_app(simulator_name, app_path):
    """
    Installs the tested app on the simulator
    :param simulator_name: the simulator name to install the app on (ex: iPhone 8, iPhone 11)
    :param app_path: path to the iOS app file
    :return: True if everything worked fine - False instead
    """
    logging.info("Installing app {APP_PATH} on simulator {SIMULATOR}...".format(APP_PATH=app_path, SIMULATOR=simulator_name))

    try:
        subprocess.Popen(
            "xcrun simctl install '{SIMULATOR}' '{APP_PATH}'".format(SIMULATOR=simulator_name, APP_PATH=app_path),
            shell=True
        ).wait()

    except Exception as e:
        logging.error("Installing the APP failed with error '{ERROR}'".format(ERROR=e))
        return False

    logging.info("Application installed!")
    return True



def launch_app(simulator_name, bundle_id):
    """
    Launches the tested app on the simulator
    :param simulator_name: the simulator name to launch the app on (ex: iPhone 8, iPhone 11)
    :param bundle_id: bundle ID of the iOS app file
    :return: PID of launched application - None if something fails
    """
    logging.info("Launching app {BUNDLE_ID} on simulator {SIMULATOR}...".format(BUNDLE_ID=bundle_id, SIMULATOR=simulator_name))

    try:
        p = subprocess.Popen(
            "xcrun simctl launch '{SIMULATOR}' '{BUNDLE_ID}'".format(SIMULATOR=simulator_name, BUNDLE_ID=bundle_id),
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        output = p.communicate()[0].rstrip()

        app_pid = int(str(output.strip()).split(" ")[1])
        logging.info("PID of launched application: [{PID}]".format(PID=app_pid))

    except Exception as e:
        logging.error("Launching the APP failed with error '{ERROR}'".format(ERROR=e))
        return None

    logging.info("Application launched successfuly!")
    return app_pid


def terminate_app(simulator_name, bundle_id):
    """
    Terminates the tested app on the simulator
    :param simulator_name: the simulator name to terminate the app on (ex: iPhone 8, iPhone 11)
    :param bundle_id: bundle ID of the iOS app file
    :return: True if everything worked fine - False instead
    """
    logging.info("Terminating app {BUNDLE_ID} on simulator {SIMULATOR}...".format(BUNDLE_ID=bundle_id, SIMULATOR=simulator_name))

    try:
        subprocess.Popen(
            "xcrun simctl terminate '{SIMULATOR}' '{BUNDLE_ID}'".format(SIMULATOR=simulator_name, BUNDLE_ID=bundle_id),
            shell=True
        ).wait()

    except Exception as e:
        logging.error("Terminating the APP failed with error '{ERROR}'".format(ERROR=e))
        return False

    logging.info("Application terminated!")
    return True


def compute_memory_usage(app_pid):
    """
    Computes memory usage of process
    :param app_pid: PID of process
    :return: memory usage in MB or None if error occurred
    """
    logging.info("Computing memory usage...")

    try:
        p = subprocess.Popen(
            "top -l 1 -pid {PID}".format(PID=app_pid),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            shell=True
        )
        output = p.communicate()[0].strip()

        memory_usage = round(float(str(list(filter(('').__ne__, str(output.splitlines()[-1]).split(" ")))[7])[:-1]) / 1024.00, 2)
        logging.info("Memory usage: [{MEMORY} MB]".format(MEMORY=memory_usage))

    except Exception as e:
        logging.error("Computing the memory usage failed with error '{ERROR}'".format(ERROR=e))
        return None

    logging.info("Memory usage computed successfuly!")
    return memory_usage


def launch_and_terminate_app(simulator_name, bundle_id):
    """
    Launches and terminates an app.
    :param simulator_name: name of simulator
    :param bundle_id: ID of application
    :return: memory usage value
    """
    try:
        app_pid = launch_app(simulator_name, bundle_id)
        time.sleep(TIMEOUT)
        memory_usage: float = compute_memory_usage(app_pid)
        terminate_app(simulator_name, bundle_id)
        time.sleep(2)

    except Exception as e:
        logging.error("Launching app failed with error {ERROR}".format(ERROR=e))
        return None

    return memory_usage


def run_launches(simulator_name, launch_type, launch_nr, bundle_id):
    """
    Launches the app on the simulator, the requested number of times, while also computing memory usage.
    :param simulator_name: name of simulator to run the tests on
    :param launch_type: COLD or WARM
    :param launch_nr: how many times to launch the app - average value is computed
    :param bundle_id: bundle ID of the application
    :return: memory usage average value or None if error occurred
    """
    try:
        memory_usage: float = 0.00

        for nr in range(1, launch_nr + 1):
            logging.info("[{LAUNCH_NR}]. Running launch...".format(LAUNCH_NR=nr))

            if launch_type == "COLD":
                reboot_simulator(simulator_name)

            memory_usage += launch_and_terminate_app(simulator_name, bundle_id)

        memory_usage = round(memory_usage / launch_nr, 2)

    except Exception as e:
        logging.error("Running launches failed with error {ERROR}".format(ERROR=e))
        return None

    logging.info("Launches executed successfuly!")
    return memory_usage


def get_device_logs(simulator_name, bundle_id):
    """
    Extracts the logs about the tested app from the simulator
    :param simulator_name: name of simulator
    :param bundle_id: id of application
    :return: list with relevant logs or None if error occurred
    """
    logging.info("Getting device logs...")

    try:
        command = "xcrun simctl spawn '{SIMULATOR}' log show | grep '{BUNDLE_ID}'".format(
            SIMULATOR=simulator_name,
            BUNDLE_ID=bundle_id
        )
        p = subprocess.Popen(command, shell=True, universal_newlines=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        logs = p.communicate()[0].strip().splitlines()

        logging.info("Filtering logs to only keep the relevant ones...")
        filtered_logs = []
        for log in logs:
            if Logs.START_1.value in log and Logs.START_2.value in log:
                filtered_logs.append(log)
            elif Logs.LAUNCHED_1.value in log and Logs.LAUNCHED_2.value in log:
                filtered_logs.append(log)

        if not filtered_logs:
            logging.error("No relevant logs found! Showing found logs: {LOGS}".format(LOGS=logs))
            raise Exception("No relevant logs found!")

    except Exception as e:
        logging.error("Failed to get logs with error: {ERROR}".format(ERROR=e))
        return None

    logging.info("Logs retrieved successfuly!")
    return filtered_logs


def get_launch_duration_from_logs(logs, launch_nr):
    """
    Extracts timestamps from logs to compute average launch duration
    :param logs: list of logs
    :param launch_nr: number of launches/log sets to find
    :return: average launch duration or None if error occurred
    """
    logging.info("Extracting timestamps from logs to compute launch duration...")

    try:
        if launch_nr < 1:
           raise Exception("At least 1 log set must be requested!")

        found_log_sets = 0
        search_start_log = False
        loaded_timestamp = None
        average_launch_duration = 0

        for log in reversed(logs):
            if Logs.LAUNCHED_2.value in log and search_start_log is False:
                timestamp = (log.split()[0] + " " + log.split()[1])[:26]
                loaded_timestamp = datetime.strptime(timestamp, Logs.TIMESTAMP_FORMAT.value)
                search_start_log = True

            elif Logs.START_2.value in log and search_start_log is True:
                timestamp = (log.split()[0] + " " + log.split()[1])[:26]
                start_timestamp = datetime.strptime(timestamp, Logs.TIMESTAMP_FORMAT.value)
                search_start_log = False
                found_log_sets += 1

                launch_duration = int((loaded_timestamp - start_timestamp).total_seconds() * 1000)
                average_launch_duration += launch_duration
                logging.info("Launch {NR} duration: [{DURATION}]ms".format(NR=found_log_sets, DURATION=launch_duration))

                if found_log_sets >= launch_nr:
                    break

            else:
                logging.error("Logs are not in order! Skipping computing results for this run. Showing found logs: {LOGS}".format(LOGS=logs))
                raise Exception("Logs are not in order!")

        average_launch_duration = int(average_launch_duration / launch_nr)

    except Exception as e:
        logging.error("Failed getting launch duration logs with error {ERROR}!".format(ERROR=e))
        return None

    logging.info("Timestamps retrieved successfuly!")
    return average_launch_duration


def measure_performance_at_first_launch(simulator_name, bundle_id):
    """
    Measures performance metrics at first launch after install
    :param simulator_name: name of simulator
    :param bundle_id: app bundle ID
    :return: launch duration and memory usage values or None if error occurred
    """
    logging.info("Testing performance of first launch after install...")

    try:
        memory_usage = launch_and_terminate_app(simulator_name, bundle_id)
        logs = get_device_logs(simulator_name, bundle_id)
        launch_duration = get_launch_duration_from_logs(logs, 1)

    except Exception as e:
        logging.error("Measuring performance at first launch failed with error {ERROR}".format(ERROR=e))
        return None, None

    logging.info("[RESULTS] Launch duration: [{DURATION}]ms;\tMemory usage: [{MEMORY}]MB".format(
        DURATION=launch_duration,
        MEMORY=memory_usage)
    )
    return launch_duration, memory_usage


def measure_average_performance_of_launches(simulator_name, launch_type, launch_nr, bundle_id):
    """
    Measures average performance metrics from multiple launches
    :param simulator_name: name of simulator
    :param bundle_id: app bundle ID
    :return: launch_data or None if error occurred
    """
    logging.info("Testing '{LAUNCH_TYPE}' average launch performance on '{SIMULATOR}':".format(
        LAUNCH_TYPE=launch_type, SIMULATOR=simulator_name))

    try:
        memory_usage = run_launches(simulator_name, launch_type, launch_nr, bundle_id)
        logs = get_device_logs(simulator_name, bundle_id)
        launch_duration = get_launch_duration_from_logs(logs, launch_nr)

        launch_data = {
            DEVICE: simulator_name,
            LAUNCH_TYPE: launch_type,
            MEMORY_USAGE: memory_usage,
            LAUNCH_DURATION: launch_duration
        }

    except Exception as e:
        logging.error("Measuring average performance failed with error {ERROR}".format(ERROR=e))
        return None

    logging.info("[RESULTS] Average launch duration: [{DURATION}]ms;\tAverage memory usage: [{MEMORY}]MB".format(
        DURATION=launch_duration,
        MEMORY=memory_usage)
    )
    return launch_data


def run_tests(args):
    """
    Method that runs all the tests
    :param args: script argument
    :return: dictionary with test results
    """
    TEST_RESULTS = {
        LAUNCHES: [],
        INSTALL_LAUNCH_DURATION: None,
        INSTALL_MEMORY_USAGE: None
    }

    logging.info("----------------------------------------------------------------------------------------------------")
    app_path = None
    if args.app_path is not None or args.file_id is not None:
        app_path = get_app(args)
        if app_path is None:
            return None
        app_size = compute_app_size(app_path)
        TEST_RESULTS[APP_SIZE] = app_size

    shutdown_simulators()

    logging.info("----------------------------------------------------------------------------------------------------")
    logging.info("Beginning test sequence...")
    for simulator_name in args.device:
        try:
            logging.info("----------------------------------------------------------------------------------------------------")
            logging.info("Running tests on device {DEVICE}:".format(DEVICE=simulator_name))

            prepare_simulator(simulator_name)
            boot_simulator(simulator_name)
            if app_path is not None:
                install_app(simulator_name, app_path)

            if TEST_RESULTS[INSTALL_LAUNCH_DURATION] is None or TEST_RESULTS[INSTALL_MEMORY_USAGE] is None:
                logging.info("---------------------------------------------")
                launch_duration, memory_usage = measure_performance_at_first_launch(simulator_name, args.bundle_id)
                TEST_RESULTS[INSTALL_LAUNCH_DURATION] = launch_duration
                TEST_RESULTS[INSTALL_MEMORY_USAGE] = memory_usage

            for launch_type in args.launch_type:
                try:
                    logging.info("---------------------------------------------")
                    launch_data = measure_average_performance_of_launches(simulator_name, launch_type, args.launch_nr, args.bundle_id)
                    TEST_RESULTS[LAUNCHES].append(launch_data)
                except Exception as e:
                    logging.error("Testing failed for {LAUNCH_TYPE} launch type with error {ERROR}. Skipping...".format(ERROR=e, LAUNCH_TYPE=launch_type))

            shutdown_simulators()
            logging.info("Finished running tests on device {DEVICE}".format(DEVICE=simulator_name))

        except Exception as e:
            logging.error("Testing failed for {SIMULATOR} device with error {ERROR}. Skipping...".format(ERROR=e, SIMULATOR=simulator_name))

    return TEST_RESULTS


def create_test_summary(args, TEST_RESULTS):
    """
    Created a text with the test results summary
    :param TEST_RESULTS: dictionary with collected metrics
    :return: string text or None if error occurred
    """
    logging.error("Creating test summary report...")

    try:
        test_summary = "Performance Metrics of {APP} Application Tested from this PR\n".format(APP=args.bundle_id)
        test_summary += "---------------------------------------------------------------\n"

        for element in TEST_RESULTS:
            if element != LAUNCHES:
                test_summary += "> {KEY}: {VALUE}".format(KEY=element, VALUE=TEST_RESULTS[element])
                if element == INSTALL_LAUNCH_DURATION:
                    if int(TEST_RESULTS[INSTALL_LAUNCH_DURATION]) > args.duration_limit:
                        test_summary += "ms  :x:\n"
                    else:
                        test_summary += "ms  :white_check_mark:\n"

                if element == INSTALL_MEMORY_USAGE:
                    if int(TEST_RESULTS[INSTALL_MEMORY_USAGE]) > args.memory_limit:
                        test_summary += "MB  :x:\n"
                    else:
                        test_summary += "MB  :white_check_mark:\n"

                if element == APP_SIZE:
                    if int(TEST_RESULTS[APP_SIZE]) > args.size_limit:
                        test_summary += "MB  :x:\n"
                    else:
                        test_summary += "MB  :white_check_mark:\n"
        test_summary += "---------------------------------------------------------------\n"

        for element in TEST_RESULTS[LAUNCHES]:
            test_summary += "> DEVICE: {DEVICE} | LAUNCH TYPE: {LAUNCH_TYPE} | ".format(DEVICE=element[DEVICE], LAUNCH_TYPE=element[LAUNCH_TYPE])
            test_summary += "DURATION: {DURATION}ms ".format(DURATION=element[LAUNCH_DURATION])
            if int(element[LAUNCH_DURATION]) > args.duration_limit:
                test_summary += " :x: | "
            else:
                test_summary += " :white_check_mark: | "

            test_summary += "MEMORY USAGE: {MEMORY_USAGE}MB ".format(MEMORY_USAGE=element[MEMORY_USAGE])
            if int(element[MEMORY_USAGE]) > args.memory_limit:
                test_summary += " :x:\n"
            else:
                test_summary += " :white_check_mark:\n"
        test_summary += "----------------------------------------------------\n"

    except Exception as e:
        logging.error("Creating test summary failed with error {ERROR}".format(ERROR=e))
        return None

    logging.info(test_summary)
    return test_summary


def report_tests(args, test_summary):
    """
    Posts test report on pull request
    :param args: script arguments
    :param test_summary: text with test summary info
    """
    try:
        if None not in [args.repo_github_token, args.repo_owner, args.repo_name, args.pr_number]:
            comment_on_pr(args.repo_github_token, test_summary, args.repo_owner, args.repo_name, args.pr_number)

    except Exception as e:
        logging.error("Posting test report on PR failed with error {ERROR}".format(ERROR=e))


def main():
    """
    Handles all the business logic
    :return: test results in dictionary/JSON format or None if error occurred
    """
    logging.info("Testing iOS application performance metrics: application size, launch duration and RAM memory usage!")

    try:
        args = parse_args()

        TEST_RESULTS = run_tests(args)
        test_summary = create_test_summary(args, TEST_RESULTS)
        report_tests(args, test_summary)

    except Exception as e:
        logging.error("Testing performance of application failed with error {ERROR}".format(ERROR=e))
        return None

    return TEST_RESULTS

if __name__ == "__main__":
    main()
