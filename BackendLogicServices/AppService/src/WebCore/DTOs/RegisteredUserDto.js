class RegisteredUserDto {
    constructor (id, username, role_id) {
        this.id = id;
        this.username = username;
        this.roleId = role_id;
    }

    get Id() {
        return this.id;
    }

    get Username() {
        return this.username;
    }

    get RoleId() {
        return this.roleId;
    }
}

module.exports = RegisteredUserDto;