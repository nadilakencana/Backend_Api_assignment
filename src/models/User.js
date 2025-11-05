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

  static async updateProfile(id, userData) {
    const { first_name, last_name } = userData;
    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, email, first_name, last_name, profile_image
    `;
    const values = [first_name, last_name, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateProfileImage(id, imagePath) {
    const query = `
      UPDATE users
        SET profile_image = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, email, first_name, last_name, profile_image
    `;
    const values = [imagePath, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }


  static async updateBalance(id, amount, operation = 'add') {
    const operator = operation === 'add' ? '+' : '-';
    const query = `
      UPDATE users 
      SET balance = balance ${operator} $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING balance
    `;
    const values = [amount, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getBalance(id) {
    const query = 'SELECT balance FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateProfileImage(id, imageUrl) {
    const query = `
      UPDATE users 
      SET profile_image = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, first_name, last_name, profile_image
    `;
    const values = [imageUrl, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = User;