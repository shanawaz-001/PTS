const Team = require('../../models/projectTeamModel');

module.exports = async(req,res)=>{
    try {
        const { projectRef, teamLeader, teamMembers} = req.body;
        await Team.findOneAndUpdate({projectRef: projectRef},{
            teamLeader,
            teamMembers
        },{upsert:true},async(err,dt)=>{
            if(err) return res.status(400).send({type:'error', message: err.message});
            return res.status(200).send({type:'success',message:'Team is added to the project'});
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}