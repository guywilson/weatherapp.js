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

function get2DigitNumber(n) {
    return n > 9 ? "" + n: "0" + n;
}

function getISODateStr(dt) {
    var tmStr = dt.toLocaleTimeString(undefined, {
        hours: '2-digit',
        minutes: '2-digit',
        seconds: '2-digit'
    });

    var year = dt.getFullYear();
    var month = get2DigitNumber(dt.getMonth() + 1);
    var day = get2DigitNumber(dt.getDate());

    var isoDateStr = year + "-" + month + "-" + day + " " + tmStr;

    return isoDateStr;
}

function cleanupData() {
    console.log('Cleaning up data');

    var now = new Date();

    var hours_ago_24 = new Date();
    hours_ago_24.setDate(now.getDate() - 1);
    var hours_ago_24Str = getISODateStr(hours_ago_24);
    
    var days_ago_7 = new Date();
    days_ago_7.setDate(now.getDate() - 7);
    var days_ago_7Str = getISODateStr(days_ago_7);

    var days_ago_28 = new Date();
    days_ago_28.setDate(now.getDate() - 28);
    var days_ago_28Str = getISODateStr(days_ago_28);
    
    console.log('24 hours ago: ' + hours_ago_24Str + ', 7 days ago: ' + days_ago_7Str + ', 28 days ago: ' + days_ago_28Str);
    
    /*
    ** Delete all AVG rows after 28 days ago...
    */
    pool.query('DELETE FROM tph WHERE type = \'AVG\' AND ts < $1::timestamp', [days_ago_28Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });
    /*
    ** Delete all AVG rows after 7 days ago and (hour is not 12 or (hour is 12 and minute is > 19)
    */
    pool.query('DELETE FROM tph WHERE type = \'AVG\' AND ts < $1::timestamp AND (EXTRACT (\'hour\' FROM ts) NOT IN (12) OR (EXTRACT (\'hour\' FROM ts) IN (12) AND EXTRACT (\'minute\' FROM ts) > 19))', [days_ago_7Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });
    /*
    ** Delete all AVG rows after 24 hours ago and (hour is not (0, 6, 12 or 18) or (hour is (0, 6, 12 or 18) and minute is > 19)
    */
    pool.query('DELETE FROM tph WHERE type = \'AVG\' AND ts < $1::timestamp AND (EXTRACT (\'hour\' FROM ts) NOT IN (0, 6, 12, 18) OR (EXTRACT (\'hour\' FROM ts) IN (0, 6, 12, 18) AND EXTRACT (\'minute\' FROM ts) > 19))', [hours_ago_24Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });

    /*
    ** Delete all AVG rows after 28 days ago...
    */
    pool.query('DELETE FROM wind WHERE type = \'AVG\' AND ts < $1::timestamp', [days_ago_28Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });
    /*
    ** Delete all AVG rows after 7 days ago and (hour is not 12 or (hour is 12 and minute is > 19)
    */
    pool.query('DELETE FROM wind WHERE type = \'AVG\' AND ts < $1::timestamp AND (EXTRACT (\'hour\' FROM ts) NOT IN (12) OR (EXTRACT (\'hour\' FROM ts) IN (12) AND EXTRACT (\'minute\' FROM ts) > 19))', [days_ago_7Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });
    /*
    ** Delete all AVG rows after 24 hours ago and (hour is not (0, 6, 12 or 18) or (hour is (0, 6, 12 or 18) and minute is > 19)
    */
    pool.query('DELETE FROM wind WHERE type = \'AVG\' AND ts < $1::timestamp AND (EXTRACT (\'hour\' FROM ts) NOT IN (0, 6, 12, 18) OR (EXTRACT (\'hour\' FROM ts) IN (0, 6, 12, 18) AND EXTRACT (\'minute\' FROM ts) > 19))', [hours_ago_24Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });

    /*
    ** Delete all AVG rows after 28 days ago...
    */
    pool.query('DELETE FROM rain WHERE type = \'AVG\' AND ts < $1::timestamp', [days_ago_28Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });
    /*
    ** Delete all AVG rows after 7 days ago and (hour is not 12 or (hour is 12 and minute is > 19)
    */
    pool.query('DELETE FROM rain WHERE type = \'AVG\' AND ts < $1::timestamp AND (EXTRACT (\'hour\' FROM ts) NOT IN (12) OR (EXTRACT (\'hour\' FROM ts) IN (12) AND EXTRACT (\'minute\' FROM ts) > 19))', [days_ago_7Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
            throw error;
        }
    });
    /*
    ** Delete all AVG rows after 24 hours ago and (hour is not (0, 6, 12 or 18) or (hour is (0, 6, 12 or 18) and minute is > 19)
    */
    pool.query('DELETE FROM rain WHERE type = \'AVG\' AND ts < $1::timestamp AND (EXTRACT (\'hour\' FROM ts) NOT IN (0, 6, 12, 18) OR (EXTRACT (\'hour\' FROM ts) IN (0, 6, 12, 18) AND EXTRACT (\'minute\' FROM ts) > 19))', [hours_ago_24Str], (error, results) => {
        if (error) {
            console.log("Error deleting TPH data");
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
