#!/usr/local/bin/python3

import argparse
import os
import subprocess
import time

import logging
logging.getLogger().setLevel(logging.INFO)

from utils import download_file_from_google_drive
from utils import unzip_archive
from utils import comment_on_pr


GDRIVE_API_CREDENTIALS_JSON = "gdrive_api_service_credentials.json"
APP_ARCHIVE = "app.zip"

TIMEOUT = 10

LAUNCHES = "LAUNCHES"
DEVICE = "DEVICE"
LAUNCH_TYPE = "LAUNCH_TYPE"
APP_SIZE = "APP_SIZE"
LAUNCH_DURATION = "LAUNCH_DURATION"
MEMORY_USAGE = "MEMORY_USAGE"


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
    parser.add_argument('--duration_limit', required=False, default=5, type=float, help='Launch duration acceptable limit in seconds')
    parser.add_argument('--memory_limit', required=False, default=250, type=float, help='Launch memory usage acceptable limit in MB')
    parser.add_argument('--size_limit', required=False, default=500, type=float, help='App size acceptable limit in MB')

    # App information for installing app
    parser.add_argument('--app_name', required=True, type=str, help='Name of the tested iOS APP file')
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
        logging.error("No APP location provided!")
        raise Exception("No APP location provided!")

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

            app_pid = launch_app(simulator_name, bundle_id)
            time.sleep(TIMEOUT)

            memory_usage += compute_memory_usage(app_pid)
            terminate_app(simulator_name, bundle_id)
            time.sleep(2)

        memory_usage /= launch_nr

    except Exception as e:
        logging.error("Running launches failed with error {ERROR}".format(ERROR=e))
        return None

    logging.info("Launches executed successfuly!")
    return memory_usage


def run_tests(args):
    TEST_RESULTS = {
        LAUNCHES: []
    }

    logging.info("----------------------------------------------------------------------------------------------------")
    app_path = get_app(args)
    if app_path is None:
        return False
    app_size = compute_app_size(app_path)
    TEST_RESULTS[APP_SIZE] = app_size

    shutdown_simulators()

    logging.info("----------------------------------------------------------------------------------------------------")
    logging.info("Beginning test sequence...")
    for simulator_name in args.device:
        logging.info("----------------------------------------------------------------------------------------------------")
        logging.info("Running tests on device {DEVICE}:".format(DEVICE=simulator_name))

        prepare_simulator(simulator_name)
        boot_simulator(simulator_name)

        if app_path is not None:
            install_app(simulator_name, app_path)
        logging.info("Launching app to make sure first launch after install is not altering the results...")
        launch_app(simulator_name, args.bundle_id)
        time.sleep(TIMEOUT)
        terminate_app(simulator_name, args.bundle_id)

        for launch_type in args.launch_type:
            logging.info("----------------------------------------------------------------------------------------------------")
            logging.info("Testing '{LAUNCH_TYPE}' launch on '{SIMULATOR}':".format(LAUNCH_TYPE=launch_type, SIMULATOR=simulator_name))

            memory_usage = run_launches(simulator_name, launch_type, args.launch_nr, args.bundle_id)
            # TODO - get logs and parse launch time

            launch_data = {
                DEVICE: simulator_name,
                LAUNCH_TYPE: launch_type,
                MEMORY_USAGE: memory_usage,
                LAUNCH_DURATION: None
            }
            TEST_RESULTS[LAUNCHES].append(launch_data)

        shutdown_simulators()
        logging.info("Finished running tests on device {DEVICE}".format(DEVICE=simulator_name))
        logging.info("----------------------------------------------------------------------------------------------------")

    return test_results


def main():
    args = parse_args()
    test_results = run_tests(args)


if __name__ == "__main__":
    main()
