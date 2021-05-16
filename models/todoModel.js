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
            note:{
                type: String,
                required:true
            },
            isDone:{
                type:Boolean,
                default: false
            },
            createdDate:{
                type:Date,
                required:true,
                default: Date.now
            }
        }
    ]
},
{
    collection:'todo'
}
);

module.exports = mongoose.model("Todo", todoSchema);
