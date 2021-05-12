const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const Team = require('../models/projectTeamModel');
const Employee = require('../models/employeeModel');
//Login verification------------------------------------------------------------------------------------
module.exports.verifyLogin = async(req,res)=>{
    const token = req.header('authorization');
    if(!token) return res.status(401).send({ type:'error',message: 'Access Denied'});
    else{
        const decode = jwt.decode(token);
    try {
        const verified = jwt.verify(token, process.env.SECRETKEY);
        if(!verified) return res.status(401).send({ type:'error',message: 'Token Invalid'});
        else{
            const user = await User.findOne({ employeeId: decode.employeeId});
            if(!user) res.send({type:'error', message: 'User Not found'})
            else{
                const decodePass = decode.password;
                const userPass = user.passwordHash;  
                if(decodePass!=userPass){
                    res.send({isLogin:false});
                }else{
                    await Employee.findOne({employeeId:decode.employeeId},async(e,d)=>{
                    if(e) return res.status(400).send({ type:'error',message: 'Employeed Not found'});
                    else{
                        res.send({isLogin:true, user:d});
                    }
                })
            }
            }
            
        }
      
    } catch (error) {
        res.status(400).send({isLogin:false});
    }
}
};

//-------------------------------verify Token-----------------------------------------------------------
module.exports.verify = async(req,res,next)=>{
    const token = req.header('authorization');
    const decode = jwt.decode(token);
    if(!token) return res.status(401).send({ type:'error',message: 'Access Denied'});
    try {
        const verified = jwt.verify(token, process.env.SECRETKEY);
        if(!verified) return res.status(401).send({ type:'error',message: 'Token Invalid'});
        const user = await User.findOne({ employeeId: decode.employeeId});
        if(!user) res.status(404).send({type:'error', message: 'User Not found'})
        else{
            const decodePass = decode.password;
            const userPass = user.passwordHash;  
            if(decodePass!=userPass){
                res.status(400).send({type:'error', message:'Please Login token is Invalid'});
            } 
            else{
                next(); 
            }
        }
      
    } catch (error) {
        res.status(400).send({type:'error', message:'Please Login token is Invalid'});
    }
};

//--------------------------HR Verification--------------------------------------------------------------
module.exports.HR = async(req,res,next)=>{
    const token = req.header('authorization');
    if(!token) return res.status(401).send({ type:'error',message: 'Access Denied'});
    try {
        const decode = jwt.decode(token);
        const user = await User.findOne({employeeId: decode.employeeId},async(err,data)=>{
            if(err) res.status(401).send({ type:'error',message: 'something went wrong, try again'});
        });
        if(user && decode.designation ==process.env.HR ){
            next();
        }
        if(!user) res.status(404).send({type: 'error', message: 'User not found'});  
    } catch (error) {
        console.log(error);
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
};

//--------------------------BDM Verification--------------------------------------------------------------
module.exports.BDM = async(req,res,next)=>{
    const token = req.header('authorization');
    if(!token) return res.status(401).send({ type:'error',message: 'Access Denied'});
    try {
        const decode = jwt.decode(token);
        const user = await User.findOne({employeeId: decode.employeeId},async(err,data)=>{
            if(err) res.status(401).send({ type:'error',message: 'something went wrong, try again'});
        });
        if(user && decode.designation ==process.env.BDM ){
            next();
        }
        if(!user) res.status(404).send({type: 'error', message: 'User not found'});  
    } catch (error) {
        console.log(error);
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
};

//--------------------------PM Verification---------------------------------------------------------------
module.exports.PM = async (req,res,next)=>{
    const token = req.header('authorization');
    if(!token) return res.status(401).send({ type:'error',message: 'Access Denied'});
    try {
        const decode = jwt.decode(token);
        const user = await User.findOne({employeeId: decode.employeeId},async(err,data)=>{
            if(err) res.status(401).send({ type:'error',message: 'something went wrong, try again'});
        });
        if(user){
            const isManager = await Project.find({managerId: decode.id});
        
            if(isManager){next();}
            else{
                res.status(401).send({type:'error',message: 'Access Denied'})
            }
        }
        if(!user) res.status(404).send({type: 'error', message: 'User not found'});
            
    } catch (error) {
        console.log(error);
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
};

//--------------------------TL Verification---------------------------------------------------------------
module.exports.TL = async (req,res,next)=>{
    const token = req.header('authorization');
    if(!token) return res.status(401).send({ type:'error',message: 'Access Denied'});
    try {
        const decode = jwt.decode(token);
        const user = await User.findOne({employeeId: decode.employeeId},async(err,data)=>{
            if(err) res.status(401).send({ type:'error',message: 'something went wrong, try again'});
            if(user){
                const isTL = await Team.find({teamLeader: decode.id});
            
                if(isTL){
                    next();
                }
                    
                else{
                    res.status(401).send({type:'error',message: 'Access Denied'})
                }
            }
        });
        if(!user) res.status(404).send({type: 'error', message: 'User not found'});     
    } catch (error) {
        console.log(error);
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
};

//--------------------------DEV Verification--------------------------------------------------------------
module.exports.DEV = async(req,res,next)=>{
    const token = req.header('authorization');
    if(!token) return res.status(401).send({ type:'error',message: 'Access Denied'});
    try {
        const decode = jwt.decode(token);
        const user = await User.findOne({employeeId: decode.employeeId},async(err,data)=>{
            if(err) res.status(401).send({ type:'error',message: 'something went wrong, try again'});
        });
        if(user && decode.designation ==process.env.DEV ){
            next();
        }
        if(!user) res.status(404).send({type: 'error', message: 'User not found'});  
    } catch (error) {
        console.log(error);
        res.status(400).send({type:'error', message:`can't connect to the server`});
    }
};