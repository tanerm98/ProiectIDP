#!/usr/local/bin/python3

import json
import logging
import os
import subprocess

from flask import Flask, request, jsonify, Response

logging.getLogger().setLevel(logging.INFO)

GET = "GET"
POST = "POST"

RESULTS_FILE = "results.json"
SUMMARY_FILE = "summary"

app = Flask(__name__)

BUSY = False


@app.route("/api/run/<string:bundle_id>", methods=[POST])
def run_tests(bundle_id):
    """
    Route for running performance tests on iOS application
    :param bundle_id: mandatory parameter
    """
    global BUSY

    logging.info("Received request to test application '{BUNDLE_ID}'".format(BUNDLE_ID=bundle_id))

    if BUSY:
        logging.error("Another test already running.")
        response = app.response_class(
            response=json.dumps({"message": "Another test already running. Try again later."}),
            status=401,
            mimetype='application/json'
        )
        return response
    else:
        BUSY = True

    try:
        command = ["python3", "src/mock_measure_performance.py"]
        command += ["--bundle_id", str(bundle_id)]
    except:
        logging.error("Mandatory argument `bundle_id` invalid.")
        response = app.response_class(
            response=json.dumps({"message": "Mandatory argument `bundle_id` invalid."}),
            status=400,
            mimetype='application/json'
        )
        BUSY = False
        return response

    try:
        payload = request.get_json()
        logging.info("Payload: '{PAYLOAD}'".format(PAYLOAD=payload))
        if payload:
            if "file_id" in payload:
                command += ["--file_id", str(payload["file_id"])]
            if "app_path" in payload:
                command += ["--app_path", str(payload["app_path"])]

            if "device" in payload:
                command += ["--device", str(payload["device"])]
            if "launch_type" in payload:
                command += ["--launch_type", str(payload["launch_type"])]
            if "launch_nr" in payload:
                try:
                    command += ["--launch_nr", str(int(payload["launch_nr"]))]
                except:
                    logging.error("'launch_nr' parameter invalid. Using default value...")

            if "duration_limit" in payload:
                try:
                    command += ["--duration_limit", str(int(payload["duration_limit"]))]
                except:
                    logging.error("'duration_limit' parameter invalid. Using default value...")
            if "memory_limit" in payload:
                try:
                    command += ["--memory_limit", str(int(payload["memory_limit"]))]
                except:
                    logging.error("'memory_limit' parameter invalid. Using default value...")
            if "size_limit" in payload:
                try:
                    command += ["--size_limit", str(int(payload["size_limit"]))]
                except:
                    logging.error("'size_limit' parameter invalid. Using default value...")

            if "repo_github_token" in payload:
                command += ["--repo_github_token", str(payload["repo_github_token"])]
            if "repo_owner" in payload:
                command += ["--repo_owner", str(payload["repo_owner"])]
            if "repo_name" in payload:
                command += ["--repo_name", str(payload["repo_name"])]
            if "pr_number" in payload:
                try:
                    command += ["--pr_number", str(int(payload["pr_number"]))]
                except:
                    logging.error("'pr_number' parameter invalid. Will skip posting results on PR.")

    except Exception as e:
        logging.error("Failed parsing parameters with error '{ERROR}'".format(ERROR=e))
        logging.error("Will use default values for parameters...")

    logging.info("Command for running the tests: '{COMMAND}'".format(COMMAND=command))
    p = subprocess.Popen(command, universal_newlines=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    logging.info("Test is running...")
    output, error = p.communicate()
    logging.info("Job output: '{OUTPUT}'".format(OUTPUT=error.strip() + "\n" + output.strip()))

    test_results_data = None
    if os.path.exists(RESULTS_FILE):
        with open(RESULTS_FILE) as results_file:
            test_results_data = json.load(results_file)
        logging.info("Job results: '{RESULTS}'".format(RESULTS=test_results_data))
    else:
        logging.error("No test results found!")

    test_results_summary = None
    if os.path.exists(SUMMARY_FILE):
        f = open(SUMMARY_FILE, "r")
        test_results_summary = f.read()
    else:
        logging.error("No test summary found!")

    response = app.response_class(
        response=json.dumps(
            {
                "results": test_results_data,
                "summary": test_results_summary
            }
        ),
        status=200,
        mimetype='application/json'
    )
    BUSY = False
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3004)