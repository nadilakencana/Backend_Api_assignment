const pool = require('../utils/database');

class Banner {
    static async getAll(){
        try {
            const query = 'SELECT banner_name, banner_image, description FROM banners ORDER BY id';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Banner getAll error:', error);
            throw error;
        }
    }
}

module.exports = Banner;