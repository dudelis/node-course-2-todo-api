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

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5a5bc8edaf79cd32eefc0a8e')
    // }, {
    //     $set:{
    //         completed: true
    //     }
    // },{
    //     returnOriginal: false
    // }).then((result)=>{
    //     console.log(result);
    // });
    
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a5b71a32ded2f777097620e')
    }, {
        $set:{
            name: 'Ashley'
        },
        $inc:{
            age: 1
        }
    },{
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    });

    //client.close();
});