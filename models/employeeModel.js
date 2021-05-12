const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    email:{
        type: String, 
        unique:[true, 'Already Exixts with this mail'],
        required: true
    },
    employeeId:{
        type: String, 
        unique:[true, 'Already Exixts'],
        required: [true, 'Enter EmployeeID']
    },
    name:{
        type: String, 
        required: [true, 'Enter a name ']
    },
    designation:{
        type: String, 
        validate: {
            validator: value => ["HR","BDM","DEV"].includes(value),
            message: 'Invalid Designation'
          },
        default: "DEV",
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    status:{
        type:String,
        validate:{
            validator: value => ["IN-ACTIVE","ACTIVE"].includes(value),
            message:'Invalid Status'
        },
        default: "ACTIVE"
    }
}
,
{
    collection:'employee'
}
);

module.exports = mongoose.model("Employee", employeeSchema);
