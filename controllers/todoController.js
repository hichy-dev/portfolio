var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//Connect to the database
mongoose.connect('mongodb://test:test@ds157380.mlab.com:57380/todobase');

//Create a schema - This is like a blueprint for our data
var todoSchema = new mongoose.Schema({
	item: String
});

var Todo = mongoose.model('Todo', todoSchema);

/*var itemOne = Todo({item: 'This is a test'}).save(function(err){
	if (err) throw err;
	console.log('item saved'); 
});*/




// var data = [{item: 'sleep'}, {item: 'eat'}, {item: 'go to bathroom'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){


	// For database connection

	app.get('/todo', function(req, res){
		//Get data from MongoDB and passing it to the view
		Todo.find({}, function(err, data) {
			if (err) throw err;
			res.render('to-do', {todos: data});
		});
	});

	app.post('/todo', urlencodedParser, function(req, res){
		//Get data from the view and add it to MongoDB
		var newTodo = Todo(req.body).save(function(err, data) {
			if (err) throw err;
			res.json(data);
		});
	});

	app.delete('/todo/:item', function(req, res){
		//Delete the requested item from MongoDB
		Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data) {
			if (err) throw err;
			res.json(data);
		});
	});



	//For static Data
	/*app.get('/todo', function(req, res){
		res.render('to-do', {todos: data});
	});

	app.post('/todo', urlencodedParser, function(req, res){
		data.push(req.body);
		res.json(data);
	});

	app.delete('/todo/:item', function(req, res){
		data = data.filter(function(todo){
			return todo.item.replace(/ /g, '-') !== req.params.item;
		});
		res.json(data);
	});*/

};