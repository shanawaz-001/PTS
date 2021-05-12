const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Employee = require('../models/employeeModel');
const router = require("express").Router();

// changepassword-----------------------------------------------------------------------
router.post('/changepassword',async (req, res) =>{
    try {
        const token = req.header('authorization');
        const decode = jwt.decode(token);
        User.findOne({employeeId:decode.employeeId},
            async(err,dt)=>{
            if(err) console.log(err); 
            else{
                const validPass = await bcrypt.compare(req.body.passwordOld, dt.passwordHash);
                if(!validPass) return res.status(400).send({isconfirm: false});
                else{
                    const salt = await bcrypt.genSalt();
                    const passwordHash = await bcrypt.hash(req.body.passwordNew, salt);
                    User.findOneAndUpdate(
                        {employeeId:decode.employeeId},
                        {passwordHash},{
                        runValidators:true,new:true},
                        async(e,d)=>{
                        if(e) return res.status(400).send({type: 'error', message: e.message});
                        else{
                        res.status(200).send({
                            type: 'success',
                            message: 'password changed'
                        }); 
                        }
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
});

//*******************Confirm password********************************************************************** */

router.post('/confirm-password',async (req, res) =>{
    try {
        const token = req.header('authorization');
        const decode = jwt.decode(token);
        User.findOne({employeeId:decode.employeeId},
            async(e,d)=>{
            if(e) console.log(e); 
            else{
                const validPass = await bcrypt.compare(req.body.passwordOld, d.passwordHash);
                if(!validPass) return res.status(400).send({isConfirm: false});
                else{
                    res.send({isConfirm: true})
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
});



//*******************User Profile********************************************************************** */

router.post('/profile',async (req, res) =>{
    try {
        const token = req.header('authorization');
        const decode = jwt.decode(token);
        Employee.findOneAndUpdate({employeeId:decode.employeeId},
            {$set: req.body},{
            runValidators:true,new:true},
            async(e,d)=>{
            if(e) console.log(e); 
            else{
                res.status(200).send({type:"success",message:"Profile Updated",data:d});
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}
);

module.exports = router;



