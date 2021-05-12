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
            if(e) {console.log(e);} 
            else{
                const validPass = await bcrypt.compare(req.body.password, d.passwordHash);
                if(!validPass) console.log('Access Denied');
                else{
                    Employee.findOneAndUpdate(
                        {employeeId: req.body.employeeId},
                        {status: process.env.ACTIVE},{
                        runValidators:true,new:true},
                        async(err,data)=>{
                        if (err) return res.send('error');
                        else {
                            const salt = await bcrypt.genSalt();
                            const passwordHash = await bcrypt.hash(req.body.employeeId, salt);
                                User.create({employeeId:req.body.employeeId, passwordHash}, async(er,dt)=>{
                                if(er) return console.log(er.message);
                                else {console.log('User Activated');
                                res.status(200).send({type: 'success', message: 'User Activated:' + req.body.employeeId });
                            }
                            });
                            
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
