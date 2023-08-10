const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const { log } = require('console');

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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true,'A user must have a password'],
        minlength: 8,
        select: false
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.correctPassword = async function(password,userPassword) {
    return await bcrypt.compare(password,userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTtimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTtimestamp < changedTimestamp;
    }
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

userSchema.pre('save', function(next){
    if (this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = new Date() - 1000;
    next()
})

const User = mongoose.model('User',userSchema);

module.exports = User;