const Task = require('../../models/projectTaskModel');
const Project = require('../../models/projectModel');
module.exports = async(req, res)=>{
    const {taskDesc, priority, status,credits, projectRef}=req.body;
    try {
        Task.create({
            taskDesc,
            priority,
            status,
            credits,
            projectRef   
        },async(er,dt)=>{
            if(er) return res.status(400).send({type:'error',message: er.message});
            await Project.findByIdAndUpdate(projectRef,{
                isCompleted : false
            }).then(data => res.status(200).send({type:'success',message:'A new task is added'}))
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}