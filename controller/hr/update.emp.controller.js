const Employee = require('../../models/employeeModel');

module.exports = async (req, res) =>{
    try {
        Employee.findOneAndUpdate(
            {employeeId:req.body.employeeId},
            {$set: req.body},{
            runValidators:true,upsert:true,new:true},
            async(err,data)=>{
            if (err) {
                res.status(400).send({type: 'error', message: err.message});
            } else {
                res.status(200).send({type: 'success', message: `Employee with ${req.body.employeeId} is updated`});
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}