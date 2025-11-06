const pool = require('../utils/database');

class Transaction {

  static async getBalance(email) {
    const query = 'SELECT balance FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async topup(email, amount) {
    const query = 'UPDATE users SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING balance';
    const values = [amount, email];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async createTransection(transactionData) {
    const { user_email, invoice_number, service_code, service_name, transaction_type, total_amount } = transactionData;
    const query = `
      INSERT INTO transactions (user_id, invoice_number, service_code, service_name, transaction_type, total_amount)
      VALUES ((SELECT id FROM users WHERE email = $1), $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [user_email, invoice_number, service_code, service_name, transaction_type, total_amount];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timestamp = Date.now();
    return `INV${year}${month}${day}-${timestamp}`;
  }

  static async getHistoryTransection(email, limit = null) {
    let query = `
      SELECT invoice_number, transaction_type, service_code, service_name, total_amount, created_on 
      FROM transactions t JOIN users u ON t.user_id = u.id 
      WHERE u.email = $1
      ORDER BY t.created_on DESC
    `;

    const values = [email];

    if (limit) {
      query += ' LIMIT $2';
      values.push(limit);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = Transaction;