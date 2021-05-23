const ServerError = require('./ServerError.js');

class MetricPostBody {
    constructor (app_bundle_id_str, body) {
        this.app_bundle_id = app_bundle_id_str;
        this.device = body.device;
        this.launch_type = body.launch_type;
        this.limit = body.limit;
    }

    get App_bundle_id () {
        return this.app_bundle_id;
    }

    get Device () {
        return this.device;
    }

    get Launch_type () {
        return this.launch_type;
    }

    get Limit () {
        return this.limit;
    }
}

class MetricResponse {
    constructor(launch_duration_data, launch_memory_data, install_duration_data, install_memory_data, app_size_data) {
        this.launch_duration_data = launch_duration_data;
        this.launch_memory_data = launch_memory_data;
        this.install_duration_data = install_duration_data;
        this.install_memory_data = install_memory_data;
        this.app_size_data = app_size_data;
    }
}

module.exports =  {
    MetricPostBody,
    MetricResponse
}