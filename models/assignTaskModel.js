const mongoose = require("mongoose");

const assignTaskSchema = new mongoose.Schema({

    taskRef:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ProjectTask',
        unique:[true, 'Already assigned to other developer'],
        required: true
    },
    devRef:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        }
    
},
{
    collection:'assignTask'
});

module.exports = mongoose.model("AssignTask", assignTaskSchema);
