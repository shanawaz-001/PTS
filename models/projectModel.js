const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectId:{
        type: String, 
        unique:[true, 'Already exixts'],
        required: true
    },
    projectDesc:{
        type: String,
    },
    projectTitle:{
        type: String,
        required: true
    },
    managerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    startDate:{
        type: Date,
        required:[true, ''],
        default:Date.now
    },
    last_update:{
        type: Date,
        default: Date.now
    },
    doc:{
        type: Date
    },
    endDate:{
        type: Date,
        default:''
    }
}
,
{
    collection:'project'
}
);

module.exports = mongoose.model("Project", projectSchema);