const Project = require('../../models/projectModel');
module.exports = async(req, res)=>{
    try {
        Project.findOneAndUpdate({projectId:req.body.projectId},
            {$set: req.body,last_update:Date.now()},
            {runValidators:true,upsert:true,new:true},
            async(error,data)=>{
                if(error) return res.status(400).send({type:'error',message: error.message});
                return res.status(200).send({type:'success',message:'Project Updated'});
            }
        )
        
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}