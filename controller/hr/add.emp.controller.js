const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');
const Employee = require('../../models/employeeModel');
module.exports =  async (req, res)=>{
    try {
        const { employeeId, name, email, designation} = req.body;
        // hashing password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(employeeId, salt);
        Employee.create({
            employeeId,
            name,
            email,
            designation
        }, async (err, data) => {
            if(err) {
                if( 'keyPattern' in err ) {
                    let msg = "Employee already exist with :"
                    for(let key in err.keyPattern) {
                        msg = msg + ' ' + key
                    }
                    res.status(400).send({type: 'error', message: msg})
                }
                else {
                    res.status(400).send({tyep: 'error', message: err.message})
                }
            } else {
                User.create({
                    employeeId,
                    passwordHash
                }, async (er, dta) => {
                    if(er) {
                        Employee.findOneAndDelete({employeeId}, async (e,d) => null)
                        res.status(400).send({type: 'error', message: 'Unable to add Employee'})
                    } else {
                        res.status(200).send({type: 'message', message: 'Employee added successfully'})
                    }
                })
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
        
    }
}