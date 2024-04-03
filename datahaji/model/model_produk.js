const connection = require("../config/database");

class ModelProduk {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM produk", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM produk WHERE produk_id = ?",
        id,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows[0]);
          }
        }
      );
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO produk SET ?", data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE produk SET ? WHERE produk_id = ?",
        [data, id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM produk WHERE produk_id = ?",
        id,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

module.exports = ModelProduk;
