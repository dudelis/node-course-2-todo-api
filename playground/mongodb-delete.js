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

    //deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // });
    //deleteOne
    // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // })
    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
    //     console.log(result);
    // });


    db.collection('Users').deleteMany({name:'Bob'}).then((result)=>{
        console.log(result);
    });

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5a5b6fa8ebd4f31e34abf71f')}).then((result)=>{
        console.log(result);
    });

    //client.close();
});