const jsonServer = require('json-server');
const jsonQuery = require('json-query');
const server = jsonServer.create();
const db = require('./db.json');
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 4000;
const base64 = require('base-64');
var Guid = require('guid');


server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/login', function(req, res){
	var authorization = req.headers.authorization.split(' ');
	var authArray = base64.decode(authorization[1]).split(':');
	console.log(authArray);
	console.log(authArray[0]);
	console.log(authArray[1]);

	var result = jsonQuery(['usuarios[cpf=? & password=?]', authArray[0], authArray[1]], {data : db});

	if (result.value) {
		result.value.token = Guid.create().value;
		res.json(result.value);
	}else{
		res.status(401).send();
	}
});

server.get('/monitoramentos', function (req, res) {

	var result = [];

    if(req.query.status){
        result = jsonQuery(['monitoramentos[*status=?]', req.query.status], {data : db});
	}else{
        result = jsonQuery(['monitoramentos[*status!=4]'], {data : db});
	}

	console.log(result);

    if (result.value) {
        res.json(result.value);
    }else{
        res.json([]);
    }
});

server.use(router);
server.listen(port, () => {
  console.log('JSON Server is running in:', port);
});
