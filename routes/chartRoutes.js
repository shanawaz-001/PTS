const jwt = require('jsonwebtoken');
const router = require("express").Router();
const User = require('../models/userModel');
const Employee = require('../models/employeeModel');
const Project = require('../models/projectModel')
const Task = require('../models/projectTaskModel');
const assignedTask = require('../models/assignTaskModel');
const Team = require('../models/projectTeamModel');

// employees---------------------------------------
module.exports.emp = async(req, res)=>{
    try {
       const emp =  await Employee.find().count();
       const empDev = await Employee.find({designation:process.env.DEV}).count();
       const empHr = await Employee.find({designation: process.env.HR}).count();
       const empBdm = await Employee.find({designation: process.env.BDM}).count();
       const Pm = await Project.find({managerId: {$ne: null}}).count();
       const Tl = await Team.find({teamLeader: {$ne: null}}).count();
       const Dev = empDev-Pm-Tl;
       res.status(200).send([
           { label:'Total',data:emp},
           {label: 'Project Managers', data: Pm},
           {label: 'Team Leaders', data: Tl},
           { label:'Human Resource Manager',data:empHr},
           { label:'Business Development Manager',data:empBdm},
           { label:'Developer',data:Dev},
       ])
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
//For BDM-----------------------------------------------------------------------------------------------------
module.exports.empStatus = async(req, res)=>{
    try {
       const emp =  await Employee.find().count();
        const empActive = await Employee.find({status: process.env.ACTIVE}).count();
        const empInactive = await Employee.find({status: process.env.INACTIVE}).count();
        res.status(200).send([
            { label:'Total',data:emp},
            { label:'Active',data:empActive},
            { label:'Inactive',data:empInactive},
        ])
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
//Projects------------------------------------
module.exports.projects = async(req, res)=>{
    try {
       const projects =  await Project.find().count();
       const projectCompleted = await Project.find({isCompleted: true}).count();
       const projectInComplete = await Project.find({isCompleted: false}).count();
       res.status(200).send([
           { label:'Total',data: projects},
           { label:'Completed',data: projectCompleted},
           { label:'InCompleted',data: projectInComplete},
       ])
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
//tasks---------------------------------------
module.exports.taskPriority = async(req, res)=>{
    try {
       const tasks =  await Task.find().count();
       const taskPlow = await Task.find({priority: 'LOW'}).count();
       const taskPnrml = await Task.find({priority: 'NORMAL'}).count();
       const taskPhigh = await Task.find({priority: 'HIGH'}).count();
       res.status(200).send([
           { label:'Total',data: tasks},
           { label:'Low',data: taskPlow},
           { label:'Normal',data: taskPnrml},
           { label:'High',data: taskPhigh},
       ])
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
module.exports.taskStatus = async(req, res)=>{
    try {
       const tasks =  await Task.find().count();
       const taskSntstarted = await Task.find({status: 'NOT_STARTED'}).count();
       const taskSActive = await Task.find({status: 'ACTIVE'}).count();
       const taskSOnhold = await Task.find({status: 'ON_HOLD'}).count();
       const taskSCmptd = await Task.find({status: 'COMPLETED'}).count();
       res.status(200).send([
           { label:'Total',data: tasks},
           { label:'Not Started',data: taskSntstarted},
           { label:'Active',data: taskSActive},
           { label:'On-hold',data: taskSOnhold},
           { label:'Completed',data: taskSCmptd},
       ])
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}

module.exports.devTask = async(req, res)=>{
    try {
        const token = req.header('authorization');
        const decode = jwt.decode(token);
        const total = await assignedTask.find({devRef: decode.id}).count();
        const active = await assignedTask.find({devRef: decode.id}).populate('taskRef', null,{status: 'NOT_STARTED'}).count();
        const not_started = await assignedTask.find({devRef: decode.id}).populate({path: 'taskRef', match:{taskRef: {path: 'taskRef'},status: 'NOT_STARTED'}}).count();
        const on_hold = await assignedTask.find({devRef: decode.id}).populate({path: 'taskRef', match:{status: 'ON_HOLD'}}).count();
        const completed = await assignedTask.find({devRef: decode.id}).populate({path: 'taskRef', match:{status: 'COMPLETED'}}).count();
        res.status(200).send([
            { label:'Total',data: total},
            { label:'Not Started',data: not_started},
            { label:'Active',data: active},
            { label:'On-hold',data: on_hold},
            { label:'Completed',data: completed},
        ])
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
//for HR AND BDM -------------------------------------------------------------
module.exports.projectPercent = async(req, res)=>{
    try {
        const projects = await Project.find().select('_id projectTitle');
        
        const data = await Promise.all(projects.map(async(project)=>{
            
            const task = await Task.find({projectRef: project._id})
            const taskCompletedCredits = await Task.find({projectRef: project._id,status: 'COMPLETED'},).select('credits');
    
            let totalTasksCredits = task.map(item => item.credits);

            var sumCredits = totalTasksCredits.length === 0 ? 0 : totalTasksCredits.reduce((a, b) => a+b);
            let percent = taskCompletedCredits.map(item => (item.credits/sumCredits)*100);
            let sumPercent = percent.length ===0 ? 0 : percent.reduce((a,b) => a+b);
            return ({
                'projectTitle': project.projectTitle,
                'totalTasks': task.length,
                'taskCompleted': taskCompletedCredits.length,
                'progress' : sumPercent.toFixed(2)

            })
        }))
        res.send(data)
    } catch (error) {
        console.error(error)
        res.status(400).send({type:'error', message: error.message});
    }
}
//-----------------------
module.exports.projectData = async(req, res)=>{
    try {
        const projects = await Project.find().populate('managerId','name');
        const data = await Promise.all(projects.map(async(project)=>{
            var manager;
            if(project.managerId) manager = project.managerId.name;
            else manager = null
            console.log(manager)
            const task = await Task.find({projectRef: project._id})
            const taskNotStarted = await Task.find({projectRef: project._id,status: 'NOT_STARTED'}).count();
            const taskActive = await Task.find({projectRef: project._id,status: 'ACTIVE'}).count();
            const taskOnhold = await Task.find({projectRef: project._id,status: 'ON_HOLD'}).count();
            const taskCompletedCredits = await Task.find({projectRef: project._id,status: 'COMPLETED'},).select('credits');
            let totalTasksCredits = task.map(item => item.credits);
            var sumCredits = totalTasksCredits.length === 0 ? 0 : totalTasksCredits.reduce((a, b) => a+b);
            let percent = taskCompletedCredits.map(item => (item.credits/sumCredits)*100);
            let sumPercent = percent.length ===0 ? 0 : percent.reduce((a,b) => a+b);
            
            return ({
                'projectTitle': project.projectTitle,
                'projectManager': manager,
                'startDate':project.startDate,
                'endDate':project.endDate,
                'totalTasks': task.length,
                'taskCompleted': taskCompletedCredits.length,
                'taskNotStarted': taskNotStarted,
                'taskActive': taskActive,
                'taskOnhold': taskOnhold,
                'progress' : sumPercent.toFixed(2)

            })
        }))
        res.send(data)
    } catch (error) {
        console.error(error)
        res.status(400).send({type:'error', message: error.message});
    }
}




// FOR MANAGER -----------------------------------------------------------------------
module.exports.projectPercentPM = async(req, res)=>{
    try {
        const token = req.header('authorization');
        const decode = jwt.decode(token);
        const projects = await Project.find({managerId: decode.id}).select('_id projectTitle');
        const data = await Promise.all(projects.map(async(project)=>{
        const task = await Task.find({projectRef: project._id})
        const taskCompletedCredits = await Task.find({projectRef: project._id,status: 'COMPLETED'},).select('credits');

        let totalTasksCredits = task.map(item => item.credits);

        var sumCredits = totalTasksCredits.length === 0 ? 0 : totalTasksCredits.reduce((a, b) => a+b);
        let percent = taskCompletedCredits.map(item => (item.credits/sumCredits)*100);
        let sumPercent = percent.length ===0 ? 0 : percent.reduce((a,b) => a+b);
        return ({
            'projectTitle': project.projectTitle,
            'totalTasks': task.length,
            'taskCompleted': taskCompletedCredits.length,
            'progress' : sumPercent.toFixed(2)

        })
    }))
    res.send(data)
    } catch (error) {
        console.error(error)
        res.status(400).send({type:'error', message: error.message});
    }
}


// FOR TEAMLEADER----------------------------------------------------------------------------

module.exports.projectPercentTL = async(req, res)=>{
    try {
        const token = req.header('authorization');
        const decode = jwt.decode(token);
        const team = await Team.find({teamLeader: decode.id})
        .populate('projectRef','projectTitle')
        .select('projectRef projectTitle')
        const data = await Promise.all(team.map(async(project)=>{
        const task = await Task.find({projectRef: project.projectRef})
        const taskCompletedCredits = await Task.find({projectRef: project.projectRef._id,status: 'COMPLETED'},).select('credits');

        let totalTasksCredits = task.map(item => item.credits);

        var sumCredits = totalTasksCredits.length === 0 ? 0 : totalTasksCredits.reduce((a, b) => a+b);
        let percent = taskCompletedCredits.map(item => (item.credits/sumCredits)*100);
        let sumPercent = percent.length ===0 ? 0 : percent.reduce((a,b) => a+b);
        return ({
            'projectTitle': project.projectRef.projectTitle,
            'totalTasks': task.length,
            'taskCompleted': taskCompletedCredits.length,
            'progress' : sumPercent.toFixed(2)

        })
    }))
    res.send(data)
    } catch (error) {
        console.error(error)
        res.status(400).send({type:'error', message: error.message});
    }
}

//-------------
module.exports.taskPercent = async(req, res)=>{
    try {

            const task = await Task.find({projectRef: req.params.id}).select('credits')
            const taskCompletedCredits = await Task.find({projectRef: req.params.id,status: 'COMPLETED'},).select('credits');
    
            let totalTasksCredits = task.map(item => item.credits);
            var sumCredits = totalTasksCredits.length === 0 ? 0 : totalTasksCredits.reduce((a, b) => a+b);
            let percent = taskCompletedCredits.map(item => (item.credits/sumCredits)*100);
            let sumPercent = percent.length ===0 ? 0 : percent.reduce((a,b) => a+b);
            res.status(200).send([
                { label:'totalTasks',data: task.length},
                { label:'taskCompleted',data: taskCompletedCredits.length},
                { label:'progress',data: sumPercent.toFixed(2)}
            ])
   
    } catch (error) {
        console.error(error)
        res.status(400).send({type:'error', message: error.message});
    }
}
