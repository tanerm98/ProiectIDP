const ServerError = require('./ServerError.js');

class AuthorPostBody {
    constructor (body) {
        this.firstName = body.firstName;
        this.lastName = body.lastName;

        if (this.firstName == null || this.firstName.length < 4) {
            throw new ServerError("First name is missing", 400);
        }
    
        if (this.lastName == null || this.lastName.length < 4) {
            throw new ServerError("Last name is missing", 400);
        }
    }

    get FirstName () {
        return this.firstName;
    }

    get LastName () {
        return this.lastName;
    }
}

class AuthorPutBody extends AuthorPostBody {
    constructor (body, id) {
        super(body);
        this.id = parseInt(id);

        if (!this.id || this.id < 1) {
            throw new ServerError("Id should be a positive integer", 400);
        }
    }

    get Id () {
        return this.id;
    }
}

class AuthorResponse {
    constructor(author) {
        this.firstName = author.first_name;
        this.lastName = author.last_name;
        this.id = author.id;
    }
}

module.exports =  {
    AuthorPostBody,
    AuthorPutBody,
    AuthorResponse
}