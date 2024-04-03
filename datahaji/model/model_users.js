const connection = require('../config/database');

class Model_users {
    static async Store(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO User SET ?', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async Login(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User WHERE email = ?', email, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User WHERE user_id = ?', id, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = Model_users;
