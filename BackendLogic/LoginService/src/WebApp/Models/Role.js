const ServerError = require('./ServerError.js');

class RolePostBody {
    constructor (body) {

        if (!body.value) {
            throw new ServerError("Value is missing", 400);
        }
       
        this.value = body.value;
    }

    get Value () {
        return this.value;
    }
}

class RoleResponse {
    constructor(role) {
        this.value = role.value;
        this.id = role.id;
    }
}

module.exports =  {
    RolePostBody,
    RoleResponse
}