var express = require('express');
var glicko = require('glicko2');
var url = require('url');
var ejs = require('ejs');
var fs = require('fs');
var mongodb = require('mongodb');
var mongojs = require('mongojs');
//var server = new mongodb.Server('127.0.0.1',27017,{});
var db = mongojs('glicko',['data']);
var port = process.env.port||8080;
var app = express();
app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'));
app.get('/',function(req,res){
	db.data.find(function(err,docs){
		res.render('main',docs[1]);
		});
	});

app.get('/checker',function(req,res){
    var query = url.parse(req.url, true).query;
    console.log(query);
    var data = Number(query['data']);
    var _id = '"'+query['_id']+'"';
    console.log("User input "+data);
    // console.log(typeof(usr_ans));
    db.data.find(function(err,docs){
    	if(err) throw err;
    	for(var  i =0;i<docs.length;i++){
    		var id = JSON.stringify(docs[i]['_id']);
    		
    		if(_id===id&&data==Number(docs[i]['key'])){
    			console.log("database id are "+id);
    			console.log("Your matched id"+_id);
    			res.json({status:"True"});
    			break;
    		}
    		else if(_id===id&&data!=Number(docs[i]['key'])){
    			res.json({status:"False"});
    		}
      	}
    	// console.log("Your question id"+_id);
    	//     		console.log(typeof(id));
    	//     		console.log(typeof(_id));

    });
    var result = data;
    // res.json({result:result});
	});
app.get('/admin',function(req,res){
	res.render('admin');
});
app.post('/admin',function(req,res){

});
// app.post('/',function(req,res){
// 	db.data.update(function(err,docs){
// 		console.log(docs[1]);
		
// 	});
// });
// app.get('/',function(req,res){
// 		db.open(function(err){
// 		if(err) throw err;
// 			db.collection('data',function(err,collection){
// 				if(err) throw err;
// 				collection.findOne(function(err,result){
// 					res.render("main",result);
// 					res.end();
// 				});
// 			});
// 	});
// 	});
app.listen(port);
console.log("Server is running on "+ port);
