const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Project = require('../../models/projectModel');
const Team = require('../../models/projectTeamModel');
const Task = require('../../models/projectTaskModel');
const User = require('../../models/userModel');
module.exports = async (req, res) =>{
    try {
        const token = req.header('authorization');
        const decode = jwt.decode(token);
        await User.findOne({employeeId:decode.employeeId},
            async(e,d)=>{
            if(e) console.log(e); 
            else{
                const validPass = await bcrypt.compare(req.body.password, d.passwordHash);
                if(!validPass) return res.status(400).send({type:'error', message:'Incorrect Password'});
                else{
                      await Project.findByIdAndDelete(
                        req.body.project_id,
                        async(err,data)=>{
                            if (err) console.log(err);
                            else{
                                 await Task.deleteMany({projectRef: req.body.project_id},async(er,dt)=>{
                                    if(er) console.log(er)
                                    else {
                                        await Team.deleteOne({projectRef: req.body.project_id},async(error,data)=>{
                                            if(error) console.log(error)
                                            else res.status(200).send({type: 'success', message: 'project removed:' });
                                        })
                                    }
                                
                                })
                            }
                        }
                )}
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
}
