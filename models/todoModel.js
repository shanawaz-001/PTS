const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    employeeRef:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        unique: [true, 'Already exists'],
        required: true
    },
    
    todos:[
        {
            id:{
                type:String,
                required:true
            },
            note:{
                type: String,
                required:true
            },
            isDone:{
                type:Boolean,
                default: false
            }
        }
    ]
},
{
    collection:'todo'
}
);

module.exports = mongoose.model("Todo", todoSchema);
