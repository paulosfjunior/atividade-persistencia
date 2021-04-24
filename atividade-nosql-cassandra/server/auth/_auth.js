require('dotenv').config();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function genSalt(length) {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
}

function hashPasswordWithSalt(rawPassword, salt) {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(rawPassword);
    let hashedPassword = hash.digest('hex');
    return {
        salt: salt,
        hash: hashedPassword
    }
}

function hashPassword(rawPassword) {
    let salt = genSalt(16); 
    return hashPasswordWithSalt(rawPassword, salt);
}

function genRefreshToken(user) {
    return user.id.toString() + crypto.randomBytes(256).toString('hex');
}

function genAccessToken(user, jwtRefreshToken) {
    return jwt.sign({ 
        id: user.id,
        usuario: user.usuario,
        nome: user.nome,
        email: user.email,
        endereco: user.endereco,
        cargo: user.cargo,
        refreshToken: jwtRefreshToken
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = {
    hashPasswordWithSalt,
    hashPassword,
    genRefreshToken,
    genAccessToken
}