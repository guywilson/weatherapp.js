const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const db = require('./db');

const port = process.env.PORT;
const isDebug = process.env.WEATHERAPP_DEBUG;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var avgTemperature = '0.00';
var avgPressure = '0.00';
var avgHumidity = '0.00';

var minTemperature = '---';
var minPressure = '---';
var minHumidity = '---';

var maxTemperature = '---';
var maxPressure = '---';
var maxHumidity = '---';

var avgWindspeed = null;
var maxWindspeed = null;

var avgRainfall = null;
var totalRainfall = null;

var wctlBuildVersion = null;
var wctlBuildDate = null;
var avrBuildVersion = null;
var avrBuildDate = null;

/*
** Listen for incoming requests..
*/
app.listen(port, function () {
	console.log('Weather app listening on port: ' + port);
	console.log('Is debug mode on: ' + isDebug);
})

/*
** Render landing page...
*/
app.get('/', function (req, res) {
	res.render(
			'index', 
			{
				avgTemperature: avgTemperature, 
			 	avgPressure: avgPressure, 
			 	avgHumidity: avgHumidity,
			 	minTemperature: minTemperature,
			 	minPressure: minPressure,
			 	minHumidity: minHumidity,
			 	maxTemperature: maxTemperature,
			 	maxPressure: maxPressure,
				maxHumidity: maxHumidity,
				avgWindspeed: avgWindspeed,
				maxWindspeed: maxWindspeed,
				avgRainfall: avgRainfall,
				totalRainfall: totalRainfall,
				wctlBuildVersion: wctlBuildVersion,
				wctlBuildDate: wctlBuildDate,
				avrBuildVersion: avrBuildVersion,
				avrBuildDate: avrBuildDate
			});
})

/*
** Render charts page...
*/
app.get('/charts', function (req, res) {
	var chartXLabel = 'Previous 24h';
	var chartTempTitle = 'Temperature last 24h';
	var chartPresTitle = 'Air Pressure last 24h';
	var chartHumiTitle = 'Humidity last 24h';
	var xLabels = [];
	var tempReadings = [];
	var pressureReadings = [];
	var humidityReadings = [];
	
	if (req.query.period == '24h') {
		xLabels = ['23', '', '', '22', '', '', '21', '', '', '20', '', '', '19', '', '', '18', '', '', '17', '', '', '16', '', '', '15', '', '', '14', '', '', '13', '', '', '12', '', '', '11', '', '', '10', '', '', '9', '', '', '8', '', '', '7', '', '', '6', '', '', '5', '', '', '4', '', '', '3', '', '', '2', '', '', '1', '', '', ''];

		chartXLabel = 'Previous 24h';
		chartTempTitle = 'Temperature last 24h';
		chartPresTitle = 'Air Pressure last 24h';
		chartHumiTitle = 'Humidity last 24h';
		
		db.getChartDataTPH_24h(function(items) {
			items.forEach(function(item, index) {
				tempReadings = tempReadings.concat(item.temperature);
				pressureReadings = pressureReadings.concat(item.pressure);
				humidityReadings = humidityReadings.concat(item.humidity);
			});
	
			/*
			** We want the readings the other way around, with the latest
			** reading last...
			*/
			tempReadings = tempReadings.reverse();
			pressureReadings = pressureReadings.reverse();
			humidityReadings = humidityReadings.reverse();
	
			res.render('charts', {
						xLabels: xLabels,
						tempReadings: tempReadings,
						pressureReadings: pressureReadings,
						humidityReadings: humidityReadings,
						chartXLabel: chartXLabel,
						chartTempTitle: chartTempTitle,
						chartPresTitle: chartPresTitle,
						chartHumiTitle: chartHumiTitle
			});
		});
	}
	else if (req.query.period == '7d') {
		xLabels = ['7.18', '7.12', '7.06', '7.00', '6.18', '6.12', '6.06', '6.00', '5.18', '5.12', '5.06', '5.00', '4.18', '4.12', '4.06', '4.00', '3.18', '3.12', '3.06', '3.00', '2.18', '2.12', '2.06', '2.00', '1.18', '1.12', '1.06', '1.00'];

		chartXLabel = 'Previous 7d';
		chartTempTitle = 'Temperature last 7d';
		chartPresTitle = 'Air Pressure last 7d';
		chartHumiTitle = 'Humidity last 7d';

		db.getChartDataTPH_7d(function(items) {
			items.forEach(function(item, index) {
				tempReadings = tempReadings.concat(item.temperature);
				pressureReadings = pressureReadings.concat(item.pressure);
				humidityReadings = humidityReadings.concat(item.humidity);
			});
	
			/*
			** We want the readings the other way around, with the latest
			** reading last...
			*/
			tempReadings = tempReadings.reverse();
			pressureReadings = pressureReadings.reverse();
			humidityReadings = humidityReadings.reverse();
	
			res.render('charts', {
						xLabels: xLabels,
						tempReadings: tempReadings,
						pressureReadings: pressureReadings,
						humidityReadings: humidityReadings,
						chartXLabel: chartXLabel,
						chartTempTitle: chartTempTitle,
						chartPresTitle: chartPresTitle,
						chartHumiTitle: chartHumiTitle
			});
		});
	}
	else if (req.query.period == '28d') {
		xLabels = [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

		chartXLabel = 'Previous 28d';
		chartTempTitle = 'Temperature last 28d';
		chartPresTitle = 'Air Pressure last 28d';
		chartHumiTitle = 'Humidity last 28d';

		db.getChartDataTPH_28d(function(items) {
			items.forEach(function(item, index) {
				tempReadings = tempReadings.concat(item.temperature);
				pressureReadings = pressureReadings.concat(item.pressure);
				humidityReadings = humidityReadings.concat(item.humidity);
			});
	
			/*
			** We want the readings the other way around, with the latest
			** reading last...
			*/
			tempReadings = tempReadings.reverse();
			pressureReadings = pressureReadings.reverse();
			humidityReadings = humidityReadings.reverse();
	
			res.render('charts', {
						xLabels: xLabels,
						tempReadings: tempReadings,
						pressureReadings: pressureReadings,
						humidityReadings: humidityReadings,
						chartXLabel: chartXLabel,
						chartTempTitle: chartTempTitle,
						chartPresTitle: chartPresTitle,
						chartHumiTitle: chartHumiTitle
			});
		});
	}
	else {
		var errorText = 'Resource not found on this server "' + req.url + '"';
		res.render('error', {
			errorText: errorText
		});
	}
})

/*
** Handle API post for average TPH data...
*/
app.post('/api/avg-tph', function(req, res) {
	var timestamp = req.body.time;
	var doSave = req.body.save;
	avgTemperature = req.body.temperature;
	avgPressure = req.body.pressure;
	avgHumidity = req.body.humidity;

	/*
	** Turn off saving when running locally...
	*/
	if (isDebug == 'true') {
		doSave = 'false';
	}

	if (doSave == 'true') {
		db.putChartDataTPH(timestamp, 'AVG', avgTemperature, avgPressure, avgHumidity);		
	}
	 	
	res.json(["OK", ""]);
})

/*
** Handle API post for min TPH data...
*/
app.post('/api/min-tph', function(req, res) {
	var timestamp = req.body.time;
	var doSave = req.body.save;
	minTemperature = req.body.temperature;
	minPressure = req.body.pressure;
	minHumidity = req.body.humidity;

	/*
	** Turn off saving when running locally...
	*/
	if (isDebug == 'true') {
		doSave = 'false';
	}

	if (doSave == 'true') {
		db.putChartDataTPH(timestamp, 'MIN', minTemperature, minPressure, minHumidity);		
	}
				 
	res.json(["OK", ""]);
})

/*
** Handle API post for max TPH data...
*/
app.post('/api/max-tph', function(req, res) {
	var timestamp = req.body.time;
	var doSave = req.body.save;
	maxTemperature = req.body.temperature;
	maxPressure = req.body.pressure;
	maxHumidity = req.body.humidity;

	/*
	** Turn off saving when running locally...
	*/
	if (isDebug == 'true') {
		doSave = 'false';
	}

	if (doSave == 'true') {
		db.putChartDataTPH(timestamp, 'MAX', maxTemperature, maxPressure, maxHumidity);		
	}
	 	
	res.json(["OK", ""]);
})

/*
** Handle API post for windspeed...
*/
app.post('/api/wind', function(req, res) {
	var timestamp = req.body.time;
	var doSaveAvg = req.body.saveAvg;
	var doSaveMax = req.body.saveMax;
	avgWindspeed = req.body.avgWindspeed;
	maxWindspeed = req.body.maxWindspeed;

	/*
	** Turn off saving when running locally...
	*/
	if (isDebug == 'true') {
		doSaveAvg = 'false';
		doSaveMax = 'false';
	}

	if (doSaveAvg == 'true') {
		db.putChartDataWind(timestamp, 'AVG', avgWindspeed);		
	}
	if (doSaveMax == 'true') {
		db.putChartDataWind(timestamp, 'MAX', maxWindspeed);		
	}
	 	
	res.json(["OK", ""]);
})

/*
** Handle API post for rainfall...
*/
app.post('/api/rain', function(req, res) {
	var timestamp = req.body.time;
	var doSaveAvg = req.body.saveAvg;
	var doSaveTotal = req.body.saveTotal;
	avgRainfall = req.body.avgRainfall;
	totalRainfall = req.body.totalRainfall;

	/*
	** Turn off saving when running locally...
	*/
	if (isDebug == 'true') {
		doSaveAvg = 'false';
		doSaveTotal = 'false';
	}

	if (doSaveAvg == 'true') {
		db.putChartDataRain(timestamp, 'AVG', avgRainfall);		
	}
	if (doSaveTotal == 'true') {
		db.putChartDataRain(timestamp, 'TOT', totalRainfall);		
	}
	 	
	res.json(["OK", ""]);
})

/*
** Handle API post for weather controller and AVR version...
*/
app.post('/api/version', function(req, res) {
	wctlBuildDate = req.body.wctlBuildDate;
	wctlBuildVersion = req.body.wctlVersion;
	avrBuildDate = req.body.avrBuildDate;
	avrBuildVersion = req.body.avrVersion;
	 	
	res.json(["OK", ""]);
})

/*
** Handle page not found errors...
*/
app.all('*', function(req, res) {
	var errorText = 'Resource not found on this server "' + req.url + '"';
	
	res.render('error', {
		errorText: errorText
	});
})
