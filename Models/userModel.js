const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
// name, email, password, confirmPassword, photo 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail, 'Please enter a vaild email.']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlenth: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (val) {
                return val == this.password;
            }
        },
        message: 'Passord & confirm Password not match!'
    },
    active:{
        type:Boolean, 
        default:true,
        select:false 
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // encrept the password before saving it 
    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    next();

})
userSchema.methods.comparePasswordInDb = async function (pwd, pwdDB) {
    return await bcrypt.compare(pwd, pwdDB);

}
userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const pwdChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        console.log(pwdChangedTimestamp, JWTTimestamp);
        return JWTTimestamp < pwdChangedTimestamp;
    }
    return false;
}
userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; 

    console.log(resetToken,this.passwordResetToken);

    return resetToken;
}
userSchema.pre(/^find/,function(next){
    this.find({active:{$ne: false}}); 
    next();
})
const User = mongoose.model('User', userSchema);

module.exports = User;