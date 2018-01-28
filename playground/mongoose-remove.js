const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

// Todo.findOneAndRemove().then(()=>{

// });
Todo.findByIdAndRemove('5a6d1a5b4917256138f2e37a').then((todo)=>{
    console.log(todo);
});