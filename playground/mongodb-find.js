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

    // db.collection('Todos').find({_id: new ObjectID('5a555080ce41e13c9cd49e61')}).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err)=>{
    //     console.log('Unable to fetch todos',err);
    // });

    // db.collection('Todos').find().count().then((count)=>{
    //     console.log(`Todos: ${count}`);
    // }, (err)=>{
    //     console.log('Unable to fetch todos',err);
    // });

    db.collection('Users').find({name: 'Bob'}).toArray().then((docs)=>{
        console.log(`Todos: ${docs.length}`);
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err)=>{
        console.log('Unable to fetch todos',err);
    });

    //client.close();
});