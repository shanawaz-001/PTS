const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    employeeId:{
        type: String, 
        unique: [true, 'Already exists'],
        required: true
    },
    passwordHash:{
        type: String,
        required: true
    }
},
{
    collection:'user'
}
);

module.exports = mongoose.model("User", userSchema);
