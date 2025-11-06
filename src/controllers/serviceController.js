const Services = require('../models/Services');

const getServices = async (req, res) => {
    try {
       const Service = await Services.getService();

       res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: Service.map(service => ({
                service_code: service.service_code,
                service_name: service.service_name,
                service_icon: service.service_icon,
                service_tariff: service.service_tariff
            }))
       })
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: "Internal server error",
            data: null
        });
    }
}

module.exports = { getServices };

