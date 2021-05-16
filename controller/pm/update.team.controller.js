const Team = require('../../models/projectTeamModel');

module.exports = async(req,res)=>{
    try {
        Team.findOneAndUpdate({projectRef: req.body.projectRef},{$set: req.body},
            {runValidators:true,upsert:true,new:true},async(err,dt)=>{
            if(err) return res.status(400).send({type:'error', message: err.message});
            return res.status(200).send({type:'success',message:'Team is updated to the project'});
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}
 //  team =  await Team.find({projectRef: req.body.projectRef}).populate('teamMembers','name');
    //  if(!team) res.status(500).send({type: 'warn', message: 'No Tasks'});
    //  else{
    //      var teamMem
    //     team.forEach(element => {
    //         teamMem = element.teamMembers;
    //     });
    // }