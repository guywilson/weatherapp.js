const Postgres = require('pg');

const Pool = Postgres.Pool;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true'
  });

function getUserByEmail(email, callback) {
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            console.log("Error querying email");
            throw error;
        }

        return callback(results.rows);
    });
}
  
function getChartDataTPH_24h(callback) {
    pool.query('SELECT * FROM tph WHERE type = \'AVG\' ORDER BY ts DESC LIMIT 72', (error, results) => {
        if (error) {
            console.log("Error selecting chart data");
            throw error;
        }

        return callback(results.rows);
    });
}

function getChartDataTPH_7d(callback) {
    pool.query('SELECT * FROM tph WHERE type = \'AVG\' AND EXTRACT (\'hour\' from ts) IN (0, 6, 12, 18) AND EXTRACT (\'minute\' from ts) BETWEEN 0 AND 19 ORDER BY ts DESC LIMIT 28', (error, results) => {
        if (error) {
            console.log("Error selecting chart data");
            throw error;
        }

        return callback(results.rows);
    });
}

function getChartDataTPH_28d(callback) {
    pool.query('SELECT * FROM tph WHERE type = \'AVG\' AND EXTRACT (\'hour\' from ts) = 12 AND EXTRACT (\'minute\' from ts) BETWEEN 0 AND 19 ORDER BY ts DESC LIMIT 28', (error, results) => {
        if (error) {
            console.log("Error selecting chart data");
            throw error;
        }

        return callback(results.rows);
    });
}

function putChartDataTPH(ts, type, temperature, pressure, humidity) {
    console.log('Inserting TPH record');

    pool.query('INSERT INTO tph (ts, type, temperature, pressure, humidity) VALUES ($1, $2, $3, $4, $5)', [ts, type, temperature, pressure, humidity], (error, results) => {
        if (error) {
            console.log("Error inserting chart data");
            throw error;
        }
    });
}

function putChartDataWind(ts, type, windspeed) {
    console.log('Inserting windspeed record');

    pool.query('INSERT INTO wind (ts, type, windspeed) VALUES ($1, $2, $3)', [ts, type, windspeed], (error, results) => {
        if (error) {
            console.log("Error inserting chart data");
            throw error;
        }
    });
}

function putChartDataRain(ts, type, rainfall) {
    console.log('Inserting rainfall record');

    pool.query('INSERT INTO rain (ts, type, rainfall) VALUES ($1, $2, $3)', [ts, type, rainfall], (error, results) => {
        if (error) {
            console.log("Error inserting chart data");
            throw error;
        }
    });
}

function getISODateStr(dt) {
    var dtStr = dt.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    var parts = dtStr.split('/');

    var isoDateStr = parts[2] + "-" + parts[1] + "-" + parts[0];

    return isoDateStr;
}

function cleanupData() {
    console.log('Cleaning up data');

    var now = new Date();
    var nowStr = getISODateStr(now);

    var days_ago_28 = new Date();
    days_ago_28.setDate(now.getDate() - 28);
    var days_ago_28Str = getISODateStr(days_ago_28);
    
    var days_ago_7 = new Date();
    days_ago_7.setDate(now.getDate() - 7);
    var days_ago_7Str = getISODateStr(days_ago_7);
    
    console.log('Now: ' + nowStr + ', 7 days ago: ' + days_ago_7Str + ', 28 days ago: ' + days_ago_28Str);

    pool.query('DELETE FROM tph WHERE ts < $1::date', [days_ago_28Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });
    pool.query('DELETE FROM tph WHERE type = \'AVG\' AND ts < $1::date AND (EXTRACT (\'hour\' FROM ts) NOT IN (0, 6, 12, 18) OR EXTRACT (\'minute\' FROM ts) > 19)', [nowStr], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });
    pool.query('DELETE FROM tph WHERE type = \'AVG\' AND ts < $1::date AND (EXTRACT (\'hour\' FROM ts) NOT IN (12) OR EXTRACT (\'minute\' FROM ts) > 19)', [days_ago_7Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });

    pool.query('DELETE FROM wind WHERE ts < $1::date', [days_ago_28Str], (error, results) => {
        if (error) {
            console.log("Error deleting wind data");
            throw error;
        }
    });
    pool.query('DELETE FROM wind WHERE type = \'AVG\' AND ts < $1::date AND (EXTRACT (\'hour\' FROM ts) NOT IN (0, 6, 12, 18) OR EXTRACT (\'minute\' FROM ts) > 19)', [nowStr], (error, results) => {
        if (error) {
            console.log("Error deleting wind data");
            throw error;
        }
    });
    pool.query('DELETE FROM wind WHERE type = \'AVG\' AND ts < $1::date AND (EXTRACT (\'hour\' FROM ts) NOT IN (12) OR EXTRACT (\'minute\' FROM ts) > 19)', [days_ago_7Str], (error, results) => {
        if (error) {
            console.log("Error deleting wind data");
            throw error;
        }
    });

    pool.query('DELETE FROM rain WHERE ts < $1::date', [days_ago_28Str], (error, results) => {
        if (error) {
            console.log("Error deleting rain data");
            throw error;
        }
    });
    pool.query('DELETE FROM rain WHERE type = \'AVG\' AND ts < $1::date AND (EXTRACT (\'hour\' FROM ts) NOT IN (0, 6, 12, 18) OR EXTRACT (\'minute\' FROM ts) > 19)', [nowStr], (error, results) => {
        if (error) {
            console.log("Error deleting rain data");
            throw error;
        }
    });
    pool.query('DELETE FROM rain WHERE type = \'AVG\' AND ts < $1::date AND (EXTRACT (\'hour\' FROM ts) NOT IN (12) OR EXTRACT (\'minute\' FROM ts) > 19)', [days_ago_7Str], (error, results) => {
        if (error) {
            console.log("Error deleting rain data");
            throw error;
        }
    });
}

module.exports = {
    getUserByEmail,
    getChartDataTPH_24h,
    getChartDataTPH_7d,
    getChartDataTPH_28d,
    putChartDataTPH,
    putChartDataWind,
    putChartDataRain,
    cleanupData
}
