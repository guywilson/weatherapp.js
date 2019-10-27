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

module.exports = {
    getUserByEmail,
    getChartDataTPH_24h,
    getChartDataTPH_7d,
    getChartDataTPH_28d,
    putChartDataTPH,
    putChartDataWind,
    putChartDataRain
}
