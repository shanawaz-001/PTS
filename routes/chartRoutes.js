const jwt = require('jsonwebtoken');
const router = require("express").Router();
const User = require('../models/userModel');
const Employee = require('../models/employeeModel');
const Project = require('../models/projectModel')
const Task = require('../models/projectTaskModel');
const assignedTask = require('../models/assignTaskModel');
const Team = require('../models/projectTeamModel');

//all employees count---------------------------------------
module.exports.emp = async(req, res)=>{
    try {
       const emp =  await Employee.find().count();
       const empDev = await Employee.find({designation: 'DEV'}).count();
       const empHr = await Employee.find({designation: 'HR'}).count();
       const empBdm = await Employee.find({designation: 'BDM'}).count();
       const empActive = await Employee.find({status:'ACTIVE'}).count();
       const empInactive = await Employee.find({status:'IN-ACTIVE'}).count();
       res.send({
           Employees: emp,
           EmployeesActive: empActive,
           EmployeesInactive: empInactive,
           EmployeesHr: empHr,
           EmployeesBdm: empBdm,
           EmployeesDev: empDev
       })
    } catch (error) {
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
}
