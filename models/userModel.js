const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'A user must have a name']
    },
    email: {
        type: String,
        required: [true,'A user must have a email'],
        unique: true,
        lowercase: true
    },
    photo: String,
    password: {
        type: String,
        required: [true,'A user must have a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true,'A user must have a confirm password'],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: "password and confirm password must be same!"
        }
    }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next()
})

const User = mongoose.model('User',userSchema);
module.exports = User;