const mongoose = require("mongoose");

const projectTaskSchema = new mongoose.Schema({
    taskDesc:{
        type: String,
    },
    priority:{
        type:String,
        validate:{
            validator: value =>[ 'LOW', 'NORMAL', 'HIGH'].includes(value),
            message: 'Invalid Priority'
        },
        default: 'NORMAL'
    },
    status:{
        type: String,
        required: true,
        validate: {
            validator: value => ["NOT_STARTED","ACTIVE","ON_HOLD","COMPLETED","BACKLOG"].includes(value),
            message: 'Invalid Status'
          },
          default: 'NOT_STARTED'
    },
    createdDate:{
        type: Date,
        required:[true, ''],
        default: Date.now
    },
    last_update:{
        type: Date,
        default: Date.now
    },
    doc:{
        type: Date
    },
    projectRef:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project',
        required: true
    },

},
{
    collection:'projectTask'
});

module.exports = mongoose.model("ProjectTask", projectTaskSchema);
