const Team = require('../../models/projectTeamModel');

module.exports = async(req,res)=>{
    try {
        const { projectRef, teamLeader, teamMembers} = req.body;
        const teamOld = await Team.find({projectRef: projectRef}).select('teamMembers.devRef');
        var teamOldMembers = teamOld.map(item => item.teamMembers)[0];
        teamOldMembers = teamOldMembers.map(({devRef}) => devRef)
        //     if(typeof devRef === 'string' || devRef instanceof String)
        //         return devRef
        //     else
        //         return JSON.stringify(devRef)
        // })
        console.log(teamOldMembers, 'qwer')
        var teamNewMembers = teamMembers;
        var test = teamOldMembers.filter(x => {
            for(let newMember of teamNewMembers) {
                return !(newMember.includes(x) || newMember == x)
            }
        });
               // var second = [ 4, 5, 6 ];
    
                // var difference = first.filter(x => !second.includes(x));
                // console.log(difference);
    
    /*
        Output: [ 1, 2, 3]
    */
        console.log(teamNewMembers)
        console.log(teamOldMembers)
        console.log(test)
        // await Team.findOneAndUpdate({projectRef: projectRef},{
        //     teamLeader,
        //     teamMembers
        // },{upsert:true},async(err,dt)=>{
        //     if(err) return res.status(400).send({type:'error', message: err.message});
        //     return res.status(200).send({type:'success',message:'Team is added to the project'});
        // })
        
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}