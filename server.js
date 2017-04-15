var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req,res){
    res.send('Todo Api Root');
});

// GET /todos
app.get('/todos',function(req,res){
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed')) {
        if (query.completed === 'true') {
            where.completed = true;
        } else if (query.completed === 'false') {
            where.completed = false;
        } 
    };

    if (query.hasOwnProperty('q')) {
        if (query.q.length > 0) {
            where.description = {
                $like: '%'+query.q+'%'
            }
        };
    };

    console.log({where});

    db.todo.findAll({where: where}).then(function (todos) {
        res.json(todos)
    }, function (e) {
        res.status(500).send();
    })
});

//GET /todos/:id
app.get('/todos/:id',function(req,res){
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function (todo) {
    if (todo) {
        res.json(todo.toJSON());          
    } else {
        res.status(404).send();
    }}).catch(function(e) {
        res.status(500).send();
    });
});


//POST /todos
app.post('/todos', function (req,res) {
    var body = _.pick(req.body, "description", "completed");

    body.description = body.description.trim();
    db.todo.create(body).then(function (todo) {
        res.status(200).json(todo.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});

//DELETE /todos/:id
app.delete('/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({  
    where: { 
        id: todoId
     }
    }).then(function (deletedRaws) {
         if (deletedRaws>0) {
            res.status(204).send();
        }  else {
            res.status(404).json({
                error: 'No todo found with this id'
            });
        };            
    }, function () {
            res.status(500).send();
    }).catch(function (e) {
        res.status(500).send();
    });




//    db.todo.findById(todoId).then(function (todo) {
//         if (!!todo) {
//             db.pets.destory({  
//             where: { name: 'Max' }
//             })
//         .then(deletedPet => {
//         console.log(`Has the Max been deleted? 1 means yes, 0 means no: ${deletedPet}`);
//         });
//         console.log('todo found!');
//         console.log(todo.toJSON());            
//     } else {
//         console.log('no todo found!');
//     }
//     }).catch(function(e) {
//         console.log(e);
//     });



    // var matchedTodo = _.findWhere(todos, {id: todoId});

    // if (!matchedTodo){
    //     res.status(404).json({"error":"no todo item found with that id"});
    // } else {
    //     todos = _.without(todos, matchedTodo);
    //     //todos.splice(todoId-1, 1);
    //     res.json(matchedTodo);        
    // };
});

//PUT /todos/:id
app.put('/todos/:id', function (req,res) {
    var body = _.pick(req.body, "description", "completed");
    var validAttributes = {};
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (!matchedTodo) {
       res.status(404).json({"error":"no todo item found with that id"}); 
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed) ) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')){
        res.status(400).json({"error":"bad request (completed field) "});
    } 

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0 ) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')){
        res.status(400).json({"error":"bad request (description field)"});
    } 

    res.json(_.extend(matchedTodo, validAttributes));
});

db.sequelize.sync({
    //force: true
}).then(function(){
    app.listen(PORT, function(){
    console.log('Express listening on port: ' + PORT + '!');
    });
});
