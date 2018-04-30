const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');

const RecipesSchema = require(path.resolve('models/user_recipes_schema'))

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    recipes: [RecipesSchema]
});

UserSchema.pre('save', function (next) {
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password)
    }
    next();
});

UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
    } else {
        return password;
    }
};

module.exports = mongoose.model('User', UserSchema);