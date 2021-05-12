const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const Employee = require('../../models/employeeModel');

module.exports = async (req, res) =>{
    try {
        const token = req.header('authorization');
        const decode = jwt.decode(token);
        User.findOne({employeeId:decode.employeeId},
            async(e,d)=>{
            if(e) console.log(e); 
            else{
                const validPass = await bcrypt.compare(req.body.password, d.passwordHash);
                if(!validPass) return res.status(400).send({type:'error', message:'Incorrect Password'});
                else{
                    Employee.findOneAndUpdate(
                        {employeeId:req.body.employeeId},
                        {status: process.env.INACTIVE},{
                        runValidators:true,new:true},
                        async(err,data)=>{
                        if (err) console.log(err);
                        else {
                                User.findOneAndDelete({employeeId:req.body.employeeId}, async(er,dt)=>{
                                if(er) console.log(er);
                                else console.log('User removed');
                            });
                            res.status(200).send({type: 'success', message: 'User removed:' + req.body.employeeId });
                        }
                    })
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}
