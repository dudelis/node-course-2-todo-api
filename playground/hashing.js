const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var pass = '123abc!';

bcrypt.genSalt(15, (err, salt)=>{
    bcrypt.hash(pass, salt, (err, hash)=>{
        console.log(hash);
    });
});

var hashedPassword = '$2a$15$4.2L1V/xcPsCHVi78ghNXelDOfgZ//DfWVUhE5bHNKlpR9gm96L6m';

bcrypt.compare(pass, hashedPassword, (err, res)=>{
    console.log(res);
})
// var data = {
//     id:10
// };

// var token = jwt.sign(data, '123abc');

// console.log(token);

// var decoded = jwt.verify(token, '123abc');

// console.log('Decoded: ', decoded);

// var message = 'I am user number 3';

// var hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id:4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+ 'somesecret').toString()
// }


// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash){
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!');
//}