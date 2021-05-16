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
       const empDev = await Employee.find({designation: 'DEV'}).count();
       const empHr = await Employee.find({designation: 'HR'}).count();
       const empBdm = await Employee.find({designation: 'BDM'}).count();
       const empActive = await Employee.find({status:'ACTIVE'}).count();
       const empInactive = await Employee.find({status:'IN-ACTIVE'}).count();
       res.status(200).send([
           { label:'Employees',data:emp},
           { label:'EmployeesActive',data:empActive},
           { label:'EmployeesInactive',data:empInactive},
           { label:'EmployeesHr',data:empHr},
           { label:'EmployeesBdm',data:empBdm},
           { label:'EmployeesDev',data:empDev},
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
           { label:'ProjectCompleted',data: projectCompleted},
           { label:'ProjectInComplete',data: projectInComplete},
       ])
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
//tasks---------------------------------------
module.exports.tasks = async(req, res)=>{
    try {
       const tasks =  await Task.find().count();
       const projectCompleted = await Project.find({isCompleted: true}).count();
       const projectInComplete = await Project.find({isCompleted: false}).count();
       res.status(200).send([
           { label:'tasks',data: tasks},
           { label:'ProjectCompleted',data: projectCompleted},
           { label:'ProjectInComplete',data: projectInComplete},
       ])
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}