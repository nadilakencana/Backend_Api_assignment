const pool = require('../utils/database');

class User {
  static async create(userData) {
    const { email, first_name, last_name, password } = userData;
    const query = `
      INSERT INTO users (email, first_name, last_name, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, first_name, last_name, created_at
    `;
    const values = [email, first_name, last_name, password];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, first_name, last_name, profile_image, balance FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateProfile(email, userData) {
    const { first_name, last_name } = userData;
    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP
      WHERE email = $3
      RETURNING id, email, first_name, last_name, profile_image
    `;
    const values = [first_name, last_name, email];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateProfileImage(email, imagePath) {
    const query = `
      UPDATE users
        SET profile_image = $1, updated_at = CURRENT_TIMESTAMP
        WHERE email = $2
        RETURNING id, email, first_name, last_name, profile_image
    `;
    const values = [imagePath, email];
    const result = await pool.query(query, values);
    return result.rows[0];
  }


  static async updateBalance(id, amount, operation = 'add') {
    const query = operation === 'add' 
      ? `UPDATE users SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING balance`
      : `UPDATE users SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING balance`;
    const values = [amount, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateBalanceByEmail(email, amount, operation = 'add') {
    const query = operation === 'add' 
      ? `UPDATE users SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING balance`
      : `UPDATE users SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING balance`;
    const values = [amount, email];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async topup(email, amount) {
    const query = 'UPDATE users SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING balance';
    const values = [amount, email];
    const result = await pool.query(query, values);
    return result.rows[0];
  }



}

module.exports = User;