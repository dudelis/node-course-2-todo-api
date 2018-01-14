//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);


MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
    if (err){
        return console.log('Unable to connect to the MongoDB server!');
    };
    console.log('Connected to MongoDB server!');
    
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: true
    // }, (err, result)=>{
    //     if (err){
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // })

    // db.collection('Users').insertOne({
    //     name: 'Konstantin',
    //     age: 33,
    //     location: 'Erkrath'
    // }, (err, result) =>{
    //     if (err){
    //         return console.log('Unable to insert a todo', err);
    //     } else{
    //         console.log(JSON.stringify(result.ops, undefined, 2))
    //     }
    // });

    client.close();
});