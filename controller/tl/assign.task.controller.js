const assignTask = require('../../models/assignTaskModel');
const Team = require('../../models/projectTeamModel');

module.exports = async(req, res) =>{
    try {
        const {devRef, taskRef} = req.body;
        await assignTask.create({devRef,taskRef},
            async (err, data)=>{
                if(err){
                    if( 'keyPattern' in err ) {
                        let msg = "Task already assigned to the developer"
                        res.status(400).send({type: 'error', message: msg})
                    }
                    else {
                        res.status(400).send({tyep: 'error', message: err.message})
                    }
                }
                else{
                    const team = await Team.findOne({teamMembers:{$elemMatch:{devRef : req.body.devRef}}})
                    .exec((e,d)=>{
                        if(e) console.log(e.message)
                        else{
                            let teammembers = d.teamMembers
                            teammembers = teammembers.map(dev=>({
                                devRef: dev.devRef,
                                _id: dev._id,
                                isAssigned: dev.devRef == req.body.devRef ? true : dev.isAssigned
                            }))
                            Team.findByIdAndUpdate(d._id,{$set: {teamMembers: teammembers}},{new:true},async(er,dt)=>{
                                if(er) res.send({type:'error',message:er.message})
                                else res.status(200).send({type:'success', message:'Task assigned'})
                            })
                        }
                    })
                }
            })
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
  
}