const Project = require('../../models/projectModel');
module.exports = async(req, res)=>{
    const {projectId,projectTitle,projectDesc,managerId,startDate,endDate,last_update,doc}=req.body;
    try {
        Project.create(
            {
                projectId,
                projectTitle,
                projectDesc,
                managerId,
                startDate,
                last_update,
                doc,
                endDate
            }
            ,async(error,data)=>{
                if(error) return res.status(400).send({type:'error',message: error});
                return res.status(200).send({type:'success',message:'Project Added'});
            }
            
        )
        
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}