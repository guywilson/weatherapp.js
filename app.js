const isDebug = process.env.WEATHERAPP_DEBUG;

var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var AuthController = require('./auth/AuthController');
var db = require('./db');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/auth', AuthController);
app.set('view engine', 'ejs');

class tph {
    constructor(t, p, h, d) {
        this.temperature = t;
        this.pressure = p;
		this.humidity = h;
		this.dewpoint = d;
    }
}

class wind {
    constructor(aws, mws) {
        this.averageWindspeed = aws;
        this.maximumWindspeed = mws;
    }
}

class rain {
    constructor(arf, trf) {
        this.averageRainfall = arf;
        this.totalRainfall = trf;
    }
}

var ipAddress = '';

currentTPH = new tph('0.00', '0.00', '0.00', '0.00');
minimumTPH = new tph('---', '---', '---', '---');
maximumTPH = new tph('---', '---', '---', '---');

anemometer = new wind('0.00', '---');
rainguage = new rain('0.00', '---');

/*
** Render landing page...
*/
app.get('/', function (req, res) {
	res.render(
			'index', 
			{
				avgTemperature: currentTPH.temperature, 
			 	avgPressure: currentTPH.pressure, 
				avgHumidity: currentTPH.humidity,
				dewPoint: currentTPH.dewpoint,
			 	minTemperature: minimumTPH.temperature,
			 	minPressure: minimumTPH.pressure,
			 	minHumidity: minimumTPH.humidity,
			 	maxTemperature: maximumTPH.temperature,
			 	maxPressure: maximumTPH.pressure,
				maxHumidity: maximumTPH.humidity,
				avgWindspeed: anemometer.averageWindspeed,
				maxWindspeed: anemometer.maximumWindspeed,
				avgRainfall: rainguage.averageRainfall,
				totalRainfall: rainguage.totalRainfall
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
** Render ip address page...
*/
app.get('/ip/ipaddr', function (req, res) {
	res.render(
			'ipaddr', 
			{
				ipAddress: ipAddress 
			});
})

/*
** Handle API post for average TPH data...
*/
app.post('/api/avg-tph', function(req, res) {
    var token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    var timestamp = req.body.time;
    var doSave = req.body.save;

    currentTPH.temperature = req.body.temperature;
	currentTPH.pressure = req.body.pressure;
	currentTPH.humidity = req.body.humidity;
	currentTPH.dewpoint = req.body.dewpoint;

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        /*
        ** Turn off saving when running locally...
        */
        if (isDebug == 'true') {
            doSave = 'false';
        }

        if (doSave == 'true') {
            db.putChartDataTPH(timestamp, 'AVG', currentTPH.temperature, currentTPH.pressure, currentTPH.humidity);		
        }
      
        res.status(200).send({ auth: true, status: "OK" });
    });
})

/*
** Handle API post for min TPH data...
*/
app.post('/api/min-tph', function(req, res) {
    var token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

	var timestamp = req.body.time;
	var doSave = req.body.save;
    
    minimumTPH.temperature = req.body.temperature;
	minimumTPH.pressure = req.body.pressure;
	minimumTPH.humidity = req.body.humidity;
	 	
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        /*
        ** Turn off saving when running locally...
        */
        if (isDebug == 'true') {
            doSave = 'false';
        }

        if (doSave == 'true') {
            db.putChartDataTPH(timestamp, 'MIN', minimumTPH.temperature, minimumTPH.pressure, minimumTPH.humidity);		
        }
      
        res.status(200).send({ auth: true, status: "OK" });
    });
})

/*
** Handle API post for max TPH data...
*/
app.post('/api/max-tph', function(req, res) {
    var token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

	var timestamp = req.body.time;
	var doSave = req.body.save;
    
    maximumTPH.temperature = req.body.temperature;
	maximumTPH.pressure = req.body.pressure;
	maximumTPH.humidity = req.body.humidity;
	 	
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        /*
        ** Turn off saving when running locally...
        */
        if (isDebug == 'true') {
            doSave = 'false';
        }

        if (doSave == 'true') {
            db.putChartDataTPH(timestamp, 'MAX', maximumTPH.temperature, maximumTPH.pressure, maximumTPH.humidity);		
        }
      
        res.status(200).send({ auth: true, status: "OK" });
    });
})

/*
** Handle API post for windspeed...
*/
app.post('/api/wind', function(req, res) {
    var token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

	var timestamp = req.body.time;
	var doSaveAvg = req.body.saveAvg;
    var doSaveMax = req.body.saveMax;
    
	anemometer.averageWindspeed = req.body.avgWindspeed;
	anemometer.maximumWindspeed = req.body.maxWindspeed;
	 	
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        /*
        ** Turn off saving when running locally...
        */
        if (isDebug == 'true') {
            doSaveAvg = 'false';
            doSaveMax = 'false';
        }

        if (doSaveAvg == 'true') {
            db.putChartDataWind(timestamp, 'AVG', anemometer.averageWindspeed);		
        }
        if (doSaveMax == 'true') {
            db.putChartDataWind(timestamp, 'MAX', anemometer.maximumWindspeed);		
        }
      
        res.status(200).send({ auth: true, status: "OK" });
    });
})

/*
** Handle API post for rainfall...
*/
app.post('/api/rain', function(req, res) {
    var token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

	var timestamp = req.body.time;
	var doSaveAvg = req.body.saveAvg;
	var doSaveTotal = req.body.saveTotal;
    
	rainguage.averageRainfall = req.body.avgRainfall;
	rainguage.totalRainfall = req.body.totalRainfall;
	 	
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        /*
        ** Turn off saving when running locally...
        */
        if (isDebug == 'true') {
            doSaveAvg = 'false';
            doSaveTotal = 'false';
        }

        if (doSaveAvg == 'true') {
            db.putChartDataRain(timestamp, 'AVG', rainguage.averageRainfall);		
        }
        if (doSaveTotal == 'true') {
            db.putChartDataRain(timestamp, 'TOT', rainguage.totalRainfall);		
        }
      
        res.status(200).send({ auth: true, status: "OK" });
    });
})

/*
** Handle API post for cleanup...
*/
app.post('/api/cleanup', function(req, res) {
    var token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        db.cleanupData();		
      
        res.status(200).send({ auth: true, status: "OK" });
    });
})

/*
** Handle API post for ip address...
*/
app.post('/api/ipaddr', function(req, res) {
    var token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        ipAddress = req.body.address;
        
        console.log('Got IP address: ' + ipAddress);
      
        res.status(200).send({ auth: true, status: "OK" });
    });
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

module.exports = app;
