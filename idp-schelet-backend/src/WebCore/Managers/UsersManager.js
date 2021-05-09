const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const AuthenticatedUserDto = require('../DTOs/AuthenticatedUserDto.js');
const RegisteredUserDto = require('../DTOs/RegisteredUserDto.js');
const JwtPayloadDto = require('../DTOs/JwtPayloadDto.js');

const { hashPasswordAsync, comparePlainTextToHashedPasswordAsync } = require('../Security/Password')
const { generateTokenAsync } = require('../Security/Jwt');
const ServerError = require('../../WebApp/Models/ServerError.js');

const authenticateAsync = async (username, plainTextPassword) => {

    console.info(`Authenticates user with username ${username}`);

    const user = await UsersRepository.getByUsernameWithRoleAsync(username);
    
    if (!user) {
        throw new ServerError(`Utilizatorul cu username ${username} nu exista in sistem!`, 404);
    }

    var isOk = await comparePlainTextToHashedPasswordAsync(plainTextPassword, user.password);

    if (!isOk) {
        throw new ServerError('Wrong password!', 403);
    }

    const token = await generateTokenAsync(new JwtPayloadDto(user.id, user.role));

    return new AuthenticatedUserDto(token, user.username, user.role);
};

const registerAsync = async (username, plainTextPassword) => {

    const hashedPassword = await hashPasswordAsync(plainTextPassword);

    const user = await UsersRepository.addAsync(username, hashedPassword);

    return new RegisteredUserDto(user.id, username);
};

module.exports = {
    authenticateAsync,
    registerAsync
}