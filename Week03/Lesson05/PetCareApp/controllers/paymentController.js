const services = require('../data/mockServices');

function preparePayment(req, res) {
  const { serviceId } = req.params;

  if (!/^[1-9]\d*$/.test(serviceId)) {
    return res.status(400).json({ error: 'Service ID is incorrect.' });
  }

  const service = services.find((s) => s.serviceId === Number(serviceId));

  if (!service) {
    return res.status(404).json({ error: 'Service not found.' });
  }

  res.status(200).json({
    serviceId: service.serviceId,
    serviceName: service.name,
    servicePrice: service.price,
    currency: 'SGD',
    status: 'READY_FOR_PAYMENT'
  });
}

module.exports = { preparePayment };
