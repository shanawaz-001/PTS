const jwt = require('jsonwebtoken');
const Todo = require('../models/todoModel');

module.exports.todos = async (req, res) =>{
    try {
        
        await Todo.findOne({employeeRef: req.params._id}).then(data => res.send(data)).catch(error => res.send(error));
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
};

module.exports.todoAdd = async(req, res)=>{
    try {
        const {_id, todos} = req.body;
        const todo = await Todo.find({ employeeRef: _id});
        if(todo.length===0){
            Todo.create({
                employeeRef: _id,
                todos: todos
            }).then(data => res.send(data)).catch(error => res.send(error))
        }
        if(todo.length>0){
            Todo.findOneAndUpdate({ employeeRef: _id},{
                todos: todos
            },{new:true}).then(data => res.send(data)).catch(error => res.send(error));
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'}); 
    }
}




