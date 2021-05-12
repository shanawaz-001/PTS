const Task = require('../../models/projectTaskModel');
module.exports = async(req, res)=>{
    const {taskDesc, priority, createdDate, last_update,doc, status, projectRef}=req.body;
    try {
        Task.create({
            taskDesc,
            priority,
            status,
            createdDate,
            last_update,
            doc,
            projectRef   
        },async(er,dt)=>{
            if(er) return res.status(400).send({type:'error',message: er.message});
            return res.status(200).send({type:'success',message:'Task Added'});
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}