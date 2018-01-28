var request = require('supertest');
var expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text:'first test todo'
},
{
    _id: new ObjectID(),
    text:'second test todo',
    completed: true,
    completedAt: 333    
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>done());
});

describe('POST /todos', ()=>{
    it('should create a new todo', (done)=>{
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
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
    it('should get all todos', (done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) =>{
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
    });
describe('GET /todos/:id', ()=>{
    it('Should reqturn object id', (done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('should return 404, if todo not found', (done)=>{
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('should return 404, if _id is not valid', (done)=>{
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});
describe('DELETE /todos/:id', ()=>{
    it('Should remove a todo by id', (done)=>{
        var id = todos[1]._id;
        request(app)
            .delete(`/todos/${id}`)
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
            .expect(404)
            .end(done);
    });
    it('Should return 404 if Object Id is invalid', (done)=>{
        request(app)
            .delete(`/todos/abc`)
            .expect(404)
            .end(done);
    });
});
describe('DELETE /todos/:id', ()=>{
    it('Should remove a todo by id', (done)=>{
        var id = todos[1]._id;
        request(app)
            .delete(`/todos/${id}`)
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
            .expect(404)
            .end(done);
    }); 
    it('Should return 404 if Object Id is invalid', (done)=>{
        request(app)
            .delete(`/todos/abc`)
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

});