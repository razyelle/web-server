var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

Todo.findAll({
        where: {
            description: {
                $like: '%%'
            }
        }}).then(function (todos) {
    if (todos) {
        todos.forEach(function (todo) {
            console.log(todo.toJSON());
        });
        
    } else {
        console.log('no todo found!');
    }
    console.log('Step1 Finish');
}).then(function () {
    sequelize.sync({
	 //force: true
    }).then(function () {
        // Todo.create({
        // description: 'Meet Hamdi'
        // });  
    });
    console.log('Step2 Finish');
}).then(function () {
    sequelize.sync({
	 //force: true
}).then(function () {
    console.log('Step3 start');
    // ********* Find ALL ************
    // Todo.findAll({
    //         where: {
    //             description: {
    //                 $like: '%%'
    //             }
    //         }}).then(function (todos) {
    //     if (todos) {
    //         todos.forEach(function (todo) {
    //             console.log(todo.toJSON());
    //         });
            
    //     } else {
    //         console.log('no todo found!');
    //     }
    // ********* Find By ID ************
    // Todo.findById(0).then(function (todo) {
    // if (todo) {
    //     console.log('todo found!');
    //     console.log(todo.toJSON());            
    // } else {
    //     console.log('no todo found!');
    // }
    // ********* Find One ************
    Todo.findOne({
            where: {
                description: {
                    $like: '%mom%'
                }
            }}).then(function (todo) {
    if (todo) {
        console.log('todo found!');
        console.log(todo.toJSON());            
    } else {
        console.log('no todo found!');
    }
    }).catch(function(e) {
        console.log(e);
    });
});
}).catch(function(e) {
    console.log(e);
});



