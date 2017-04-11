var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
    var queryParams = req.query;
    var filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed')) {
        if (queryParams.completed === 'true') {
            console.log('completed is true');
            filteredTodos = _.where(filteredTodos, {completed: true});
        } else if (queryParams.completed === 'false') {
            console.log('completed is false');
            filteredTodos = _.where(filteredTodos, {completed: false});
        }        
    }
   
    if (queryParams.hasOwnProperty('q')) {    
        if (queryParams.q.length > 0) {
            filteredTodos = _.filter(filteredTodos, function(todo){
            return todo.description.indexOf(queryParams.q) > -1;
            });
        };       
    };

    // .indexOf(work);
    // if (queryParams.hasOwnProperty('completed')) {
    //     if (queryParams.completed === 'true') {
    //         console.log('completed is true');
    //         filteredTodos = _.where(filteredTodos, {completed: true});
    //     } else if (queryParams.completed === 'false') {
    //         console.log('completed is false');
    //         filteredTodos = _.where(filteredTodos, {completed: false});
    //     }        
    // }
    
    res.json(filteredTodos);
});

//GET /todos/:id
app.get('/todos/:id',function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (matchedTodo){
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

//POST /todos
app.post('/todos', function (req,res) {
    var body = _.pick(req.body, "description", "completed");

    if (!_.isBoolean(body.completed) || !_.isString(body.description) 
    || body.description.trim().length === 0){
        // || _.keys(body).length > 2
        return res.status(400).send();
    }

    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});

//DELETE /todos/:id
app.delete('/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (!matchedTodo){
        res.status(404).json({"error":"no todo item found with that id"});
    } else {
        todos = _.without(todos, matchedTodo);
        //todos.splice(todoId-1, 1);
        res.json(matchedTodo);        
    }
})

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

app.listen(PORT, function(){
    console.log('Express listening on port: ' + PORT + '!');
});