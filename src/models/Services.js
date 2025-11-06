const pool = require('../utils/database');

class Services {
    static async getService() {
        const query = 'SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY service_name';
        const result = await pool.query(query);
        return result.rows;
    }

    static async findByCode(serviceCode) {
        const query = 'SELECT * FROM services WHERE service_code = $1';
        const result = await pool.query(query, [serviceCode]);
        return result.rows[0];
    }
}

module.exports = Services;