const Task = require('../../models/projectTaskModel');
const assignTask = require('../../models/assignTaskModel');
const Team = require('../../models/projectTeamModel');
const Project = require('../../models/projectModel');

module.exports = async (req, res) => {
    const id = req.body.id;
    const projectRef = req.body.projectRef
    const project = await Task.findById(id).populate('projectRef');
    const tasks = await Task.find({projectRef : project.projectRef}).countDocuments();
    const task = await Task.find({projectRef : project.projectRef}).select('status');
    await assignTask.find({taskRef: id})
    .then(async (data) => {
        if(data.length === 0) {
            Task.findByIdAndDelete(id).then(data1 => {
                var completed = task.map(item => item.status=='COMPLETED').length;
                Project.findByIdAndUpdate(project.projectRef,
                {isCompleted: tasks===completed })
                res.send(data1)
            }).catch(error => res.send(error))
            } 
            else {
                const devRef = data[0].devRef
                const teamData = await Team.findOne({projectRef: projectRef})
                let team = teamData.teamMembers.map(member => { 
                    return ({
                        isAssigned: JSON.stringify(devRef) == JSON.stringify(member.devRef) ? false : member.isAssigned,
                        _id: member._id,
                        devRef: member.devRef
                    })
                })
                await Team.findByIdAndUpdate(teamData._id,{$set: {teamMembers: team}},{new:true},async(er,dt)=>{
                    if(er) res.send({type:'error',message:er.message})
                    else {
                        Task.findByIdAndDelete(id)
                        .then(data1 => {
                            var completed = task.map(item => item.status=='COMPLETED').length;
                            Project.findByIdAndUpdate(project.projectRef,
                            {isCompleted: tasks===completed })
                            assignTask.findOneAndDelete({devRef: devRef})
                            .then(() => res.status(200).send({type:'success', message:'Task deleted'}))
                        }).catch(error => res.status(400).send({type:'error', message: error.message}))
                    }
                })
            }
        })
    }