const Team = require('../../models/projectTeamModel');

// module.exports = async(req,res)=>{
//     try {
//         Team.findOneAndUpdate({projectRef: req.body.projectRef},{ $pull: { teamMembers: { devRef:  req.body.devRef }}},
//             {runValidators:true,upsert:true,new:true},async(err,dt)=>{
//             if(err) return res.status(400).send({type:'error', message: err.message});
//             return res.status(200).send({type:'success',message:'Team is updated to the project'});
//         })
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
//     }
// }

module.exports = async(req,res)=>{
    const { projectRef, teamLeader, teamMembers} = req.body;
    try {
        await Team.findOneAndUpdate({projectRef: projectRef},{
            teamLeader,
            $addToSet: { teamMembers: { $each: [ {devRef: teamMembers}  ] } }
        },async(err,dt)=>{
            if(err) return res.status(400).send({type:'error', message: err.message});
            return res.status(200).send({type:'success',message:'Team is added to the project'});
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}