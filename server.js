const port = process.env.PORT;
const isDebug = process.env.WEATHERAPP_DEBUG;

var app = require('./app');

/*
** Listen for incoming requests..
*/
app.listen(port, function () {
	console.log('Weather app listening on port: ' + port);
	console.log('Is debug mode on: ' + isDebug);
})
