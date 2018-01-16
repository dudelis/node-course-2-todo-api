const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '15a5d34dcb98f576364045edb';
// if(!ObjectID.isValid(id)){
//     console.log('The Id is not valid')
// };

var userId = '5a5cfe9cee65fe118ceeaa481';

if (ObjectID.isValid(userId)){
    User.findById(userId).then((user)=>{
        if (!user) return console.log('Id not found');
        console.log(user);
    }).catch((e)=>console.log(e));
}

// Todo.find({_id:id}).then((todos)=>{
//     console.log(todos);
// });

// Todo.findOne({_id:id}).then((todo)=>{
//     console.log(todo);
// });

// Todo.findById(id).then((todo)=>{
//     if(!todo) return console.log('Id not found');
//     console.log(todo);
// }).catch((e)=>console.log(e));