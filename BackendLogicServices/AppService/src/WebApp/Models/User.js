const ServerError = require('./ServerError.js');

class UserPostBody {
    constructor (body) {
        this.limit = body.limit;
    }

    get Limit () {
        return this.limit;
    }
}

class UserResponse {
    constructor(registers_data, logins_data, jobs_data) {
        this.registers_data = registers_data;
        this.logins_data = logins_data;
        this.jobs_data = jobs_data;
    }
}

module.exports =  {
    UserPostBody,
    UserResponse
}