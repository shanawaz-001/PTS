const Emp = require('../models/employeeModel')
const Project = require('../models/projectModel')
const Task = require('../models/projectTaskModel');
const assignedTask = require('../models/assignTaskModel');
const Team = require('../models/projectTeamModel');
const jwt = require('jsonwebtoken');
//all employees---------------------------------------
module.exports.empActive = async(req, res)=>{
    await Emp.find({status: process.env.ACTIVE}).sort('employeeId')
    .then(data => res.send(data))
    .catch(error => console.error(error))
}


//all employees Inactive------------------------------
module.exports.empInactive = async(req, res)=>{
    await Emp.find({status: process.env.INACTIVE}).sort('employeeId')
    .then(data => res.send(data))
    .catch(error => console.error(error))
}


//All Projects----------------------------------------

module.exports.projects = async(req, res) =>{
    await Project.find().sort('projectTitle').populate('managerId','name')
    .then(data => res.send(data))
    .catch(error => console.error(error))
}


//All developers----------------------------------------
module.exports.empDev = async(req, res)=>{
    await Emp.find({status: process.env.ACTIVE,designation: process.env.DEV}).sort('employeeId')
    .then(data => res.send(data))
    .catch(error => console.error(error))
}
//Project Tasks-------------------------------------------
module.exports.projectTasks = async(req, res)=>{
    await Task.find({projectRef: req.params.projectRef})
    .then(data => res.send(data))
    .catch(error => console.error(error))
}
//View Teams-----------------------------------------------
module.exports.projectTeams = async(req, res)=>{
    await Team.find({projectRef: req.params.projectRef})
    .then(data => res.send(data))
    .catch(error => console.error(error))
}

//assigned projects of pm---------------------------------
module.exports.projectsPM = async(req, res) =>{
    const token = req.header('authorization');
    const decode = jwt.decode(token);
    await Project.find({managerId: decode.id}).sort('projectTitle')
    .then(data => res.send(data))
    .catch(error => console.error(error))
}

//get assigned projects of TL----------------------------------------------------------------------------
module.exports.projectsTL = async(req, res) =>{
    const token = req.header('authorization');
    const decode = jwt.decode(token);
    await Team.find({},{teamLeader: decode.id}).populate('projectRef','projectTitle').sort('projectTitle')
    .then(data => res.send(data))
    .catch(error => console.error(error))
}
//assigned Team Members of TL------------------------------------
module.exports.assignedTeamMem = async(req, res) =>{
    try {
        const task = await Task.find({projectRef: req.params.projectRef},async(er,dt)=>{
            if(er) res.status(400).send({type: 'warn', message: 'No Tasks'});
            else{
                await assignedTask.find({taskRef:{$in: dt}}).populate('devRef','name')
                .exec((e,d)=>{
                 if(e) res.status(400).send({type: 'warn', message: 'No Tasks'});
                 else{
                     console.log(d)
                 }
             })
            }
        })
     
 } catch (error) {
     console.error(error);
     res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
 }

//get team members task unassigned TL -----------------------------------------
module.exports.unassignedTeamMem = async(req, res) =>{
    try {
      team =  await Team.find({projectRef: req.params.projectRef}).populate('teamMembers','_id');
      if(!team) res.status(500).send({type: 'warn', message: 'No Tasks'});
      else{
          var teamMem
         team.forEach(element => {
             teamMem = element.teamMembers;
         });
         console.log(teamMem)
     }
     const astask = await assignedTask.find({devRef:{$in:teamMem}}).populate('devRef','name')
     .exec((e,d)=>{
         if(e) res.status(400).send({type: 'warn', message: 'No uTasks'});
         else{
             console.log(d)
         }
     })
     
 } catch (error) {
     console.error(error);
     res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
 }

 //get confirmation of Dev----------------------------------------------
 module.exports.confirmationDev = async(req,res)=>{
    const token = req.header('authorization');
    try {
        const decode = jwt.decode(token);
        const isManager = await Project.find({managerId: decode.id});
        const isTL = await Team.find({teamLeader: decode.id});
        if(isManager.length>0 && isTL.length>0) return res.status(200).send({isManager:true, isTL:true});
        if(isManager.length>0 && isTL.length===0) return res.status(200).send({isManager:true, isTL:false});
        if(isManager.length===0 && isTL.length>0) return res.status(200).send({isManager:false, isTL:true});
        if(isTL.length===0 && isManager.length===0) return res.status(200).send({isManager:false, isTL:false});
    } catch (error) {
        console.log(error);
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
 //get assigned Projects of Dev----------------------------------------- 
 module.exports.projectsDev = async(req,res)=>{
    const token = req.header('authorization');
    try {
        const decode = jwt.decode(token);
        const team = await Team.findOne({"teamMembers.devRef": decode.id});
        if(team){
            await Project.findById(team.projectRef).populate("managerId","name").exec((err,data)=>{
                if(err) return res.status(400).send({type:'error', message:err.message});
                return res.status(200).send(data);
            });
        }
        if(!team) res.send({message: 'No Projects assigned'});
       
    } catch (error) {
        console.log(error);
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}

//View assigned Project Tasks of Dev---------------------------------------------------------
module.exports.tasksDev = async(req,res)=>{
    const token = req.header('authorization');
    try {
        const decode = jwt.decode(token);
        const task = await Task.find({devRef: decode.id}).populate('taskRef').exec(async(e,d)=>{
            if(e) return res.status(401).send({type: 'error', message: e.message})
            if(d.length>0) return res.send(d)
            if(d.length===0) return res.send({message: 'No Tasks assigned'});
        });  
    } catch (error) {
        console.log(error);
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
