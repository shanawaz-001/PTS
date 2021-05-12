const Task = require('../../models/projectTaskModel');
const assignTask = require('../../models/assignTaskModel');
module.exports = async(req, res)=>{
    try {
        Task.findByIdAndDelete(req.body.id,async(er,dt)=>{
            if(er) return res.status(400).send({type:'error',message: er.message});
            else{
                const assignedTask = await assignTask.findOneAndDelete({taskRef: req.body.id})
                .exec((e,d)=>{
                    if(e) return res.status(400).send({type:'error',message: e.message});
                    return res.status(200).send({type:'success',message:'Task Deleted'});
                })
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}