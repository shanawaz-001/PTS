const Team = require('../../models/projectTeamModel');
const assignTask = require('../../models/assignTaskModel');
module.exports = async(req,res)=>{
    try {
        const { projectRef, teamLeader, teamMembers} = req.body;
        const teamOld = await Team.find({projectRef: projectRef}).select('teamMembers.devRef');
        var teamOldMembers = teamOld.map(item => item.teamMembers)[0];
        teamOldMembers = teamOldMembers.map(({devRef}) => devRef)
        var teamNewMembers = teamMembers;
        var test = teamOldMembers.filter(x => {
            for(let newMember of teamNewMembers) {
                return !(newMember.includes(x) || newMember == x)
            }
        });
        await Team.findOneAndUpdate({projectRef: projectRef},{
            teamLeader,
            teamMembers
        },{upsert:true},async(err,dt)=>{
            if(err) return res.status(400).send({type:'error', message: err.message});
        })
        if(test){
         await assignTask.findOneAndDelete({devRef: {$in: test}}).exec((e,d)=>{
             if(e) return res.status(400).send({type:'error', message: e.message});
             else return res.status(200).send({type:'success',message:'Team is added/updated to the project'});
         })
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}