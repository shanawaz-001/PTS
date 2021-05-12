const Task = require('../../models/projectTaskModel');
module.exports = async(req, res)=>{
    try {
        Task.findByIdAndUpdate(req.body.id,
            {$set: req.body,last_update: Date.now()},
            {runValidators:true,upsert:true,new:true},async(er,dt)=>{
            if(er) return res.status(400).send({type:'error',message: er.message});
            return res.status(200).send({type:'success',message:'Project Added'});
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}
