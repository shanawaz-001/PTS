const jwt = require('jsonwebtoken');
const router = require("express").Router();
const Todo = require('../models/todoModel');

module.exports.todos = async (req, res) =>{
    try {
        const token = req.header('authorization');
        const decode = jwt.decode(token);
        await Todo.findOne({employeeRef: decode.id}).then(data => res.send(data)).catch(error => res.send(error));
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'});
    }
};

module.exports.todoAdd = async(req, res)=>{
    try {
        const token = req.header('authorization');
        const decode = jwt.decode(token);
        await Todo.create({
            employeeRef: decode.id,
            todos: req.body.todos
        }).then(data => res.send(data)).catch(error => res.send(error));
    } catch (error) {
        console.error(error);
        res.status(500).send({type: 'error', message: 'Error while connecting to the server!'}); 
    }
}




