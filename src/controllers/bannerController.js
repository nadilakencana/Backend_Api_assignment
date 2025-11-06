const Banner = require('../models/Banner');

const getBanners = async (req, res) => {
    try{
        const banner = await Banner.getAll();
        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: banner.map(banner => ({
                banner_name: banner.banner_name,
                banner_image: banner.banner_image,
                description: banner.description
            }))

        });
    }catch(error){
        console.error('Get banners error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
}

module.exports = { getBanners };