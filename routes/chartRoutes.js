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
       const empActive = await Employee.find({status:process.env.ACTIVE}).count();
       const empInactive = await Employee.find({status:process.env.INACTIVE}).count();
       res.status(200).send([
           { label:'Employees',data:emp},
           { label:'Active',data:empActive},
           { label:'Inactive',data:empInactive},
           { label:'Human Resource Manager',data:empHr},
           { label:'Business Development Manager',data:empBdm},
           { label:'Developer',data:empDev},
       ])
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
//For BDM-----------------------------------------------------------------------------------------------------
module.exports.bdmEmp = async(req, res)=>{
    try {
       const empDev = await Employee.find({status: process.env.ACTIVE,designation: process.env.DEV}).count();
       const empActive = await Employee.find({status: process.env.ACTIVE}).count();
       res.status(200).send([
           { label:'Employees',data:empActive},
           { label:'Developer',data:empDev},
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
           { label:'Projects',data: projects},
           { label:'Completed',data: projectCompleted},
           { label:'InComplete',data: projectInComplete},
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
           { label:'tasks',data: tasks},
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
           { label:'tasks',data: tasks},
           { label:'Not Started',data: taskSntstarted},
           { label:'Active',data: taskSActive},
           { label:'On-hold',data: taskSOnhold},
           { label:'Completed',data: taskSCmptd},
       ])
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
