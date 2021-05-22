const Team = require('../../models/projectTeamModel');
const assignTask = require('../../models/assignTaskModel');
const Task = require('../../models/projectTaskModel');
const { forEach } = require('lodash');

module.exports = async(req,res)=>{
    const { projectRef, teamLeader, teamMembers} = req.body;
    try {
        const team = await Team.findOne({projectRef: projectRef}).select('teamMembers')
        //taking t as teamMembers
        let t = team.teamMembers;
        //taking teamOld as teamMembers assigned true
        var teamOldAssigned = JSON.parse(JSON.stringify(t.map(item => item.isAssigned ? item.devRef : null)));
        var teamOld = JSON.parse(JSON.stringify(t.map(item => item.devRef)));
        var test = JSON.parse(JSON.stringify(t.map(item => item)))
        //taking teamNew as new TeamMembers
        var teamNew = teamMembers.map(item => item.devRef)
        //diffrence of old and new 
        var diff = teamOldAssigned.filter(x => !teamNew.includes(x));
        //common of two teams old and new
        var inc = teamOld.filter(x => teamNew.includes(x));
        //getting only new team members
        var newTeam = teamNew.filter(x => !teamOld.includes(x));
        var teamAll = inc.concat(newTeam)
        teamAll = teamAll.map(member => ({
            devRef: member,
            isAssigned: inc.includes(member) ? test.filter(x => x.devRef===member)[0].isAssigned : false
        }))
        //finding task acc.to the project
        const task = await Task.find({projectRef : projectRef});
        //taking _id of tasks as taskRef 
        var taskRef = task.map(item => item._id)
        //deleting assigned Tasks which are not in new team that are in old
        await assignTask.deleteMany({devRef: {$in: diff}, taskRef: {$in: taskRef}})
        // updating team now 
        await Team.findOneAndUpdate({projectRef: projectRef},{teamLeader:teamLeader, teamMembers: teamAll},{new:true,upsert:true})
        .exec((e,d)=>{
            if(e) return res.status(400).send({type: 'error', message: e.message})
            return res.status(200).send({type: 'success', message: 'Team Updated to the Project'})
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}
