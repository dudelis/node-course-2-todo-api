var request = require('supertest');
var expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', ()=>{
    it('should create a new todo for authenticated user', (done)=>{
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
                expect(res.body._creator).toBe(users[0]._id.toHexString());
            })
            .end((err, res)=>{
                if (err){
                    return done(err);
                }
                
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=>{done(e)});
            });
    });
    it('should not create a todo with invalid body data', (done)=>{
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err,res)=>{
                if (err){
                    return done(err);
                }

                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=>{done(e)})
            });
    });
});
describe('GET /todos', ()=>{
    it('should get all todos for an authenticated user', (done)=>{
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) =>{
                expect(res.body.todos.length).toBe(1)
            })
            .end(done);
    });
});
describe('GET /todos/:id', ()=>{
    it('Should return object id', (done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('Should not return object for another user', (done)=>{
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should return 404, if todo not found', (done)=>{
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should return 404, if _id is not valid', (done)=>{
        request(app)
            .get(`/todos/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});
describe('DELETE /todos/:id', ()=>{
    it('Should remove a todo by id', (done)=>{
        var id = todos[1]._id;
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((err, res)=>{
                if (err){
                    return done(err);
                };
                Todo.findById(id).then((todo)=>{
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e)=>{done(e)});
            });
    });
    it('Should return 404 if todo not found', (done)=>{
        var id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('Should return 404 if Object Id is invalid', (done)=>{
        request(app)
            .delete(`/todos/abc`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', ()=>{
    it('Should update the todo', (done)=>{
        var id = todos[0]._id.toHexString();
        var text = 'Updated Text';
        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text: text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });
    it('Should clear completedAt when todo is not completed', (done)=>{
        var id = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: false
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});

describe('GET /users/me', ()=>{
    it('should return user if authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', ()=>{
    it('should create a user', (done)=>{
        var email = 'example@abc.com';
        var password = '123ABC123';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if (err){
                    return done(err);
                }
                User.findOne({email}).then((user)=>{
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e)=>{
                    done(e);
                });
            });
    });

    it('should return validation errors if request invalid', (done)=>{
        request(app)
            .post('/users')
            .send({email: 'abc123', password: '123abcdef'})
            .expect(400)
            .end(done);           
    });
    it('should not create a user if an email in use', (done)=>{
        request(app)
            .post('/users')
            .send({email: users[0].email, password: '123abcdef'})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login',()=>{
    it('should return a token if email and password is valid', (done)=>{
        request(app)
            .post('/users/login')
            .send({email: users[1].email, password: users[1].password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.email).toBe(users[1].email);
            })
            .end((err, res)=>{
                if (err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens[1].token).toBe(res.headers['x-auth']);
                    done();
                }).catch((e)=> done(e));
            });
    });
    it('should return 400, if user credentials do not match', (done)=>{
        request(app)
            .post('/users/login')
            .send({email: users[0].email, password: users[0].password + 1})
            .expect(400)
            .end(done);
    });
});
describe('DELETE /users/me/token', ()=>{
    it('should remove auth token on logout', (done)=>{
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res)=>{
                if (err){
                    return done(err);
                }
                User.findById(users[0]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e)=>done(e));
            });
    });
})
