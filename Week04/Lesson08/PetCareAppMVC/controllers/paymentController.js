const services = require('../data/mockServices');
const MockProvider = require('../services/mockPaymentProvider');

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

// Copied source code from createMockPayment.txt
// Function to create a mock payment using the mock payment provider.
async function createMockPayment(req, res) {
    const serviceId = Number(req.params.serviceId);
    const service = services.find(item => item.serviceId === serviceId);
  
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
   }
   
   const paymentRequest = {
     amount: service.price,
     currency: 'SGD',
     merchantReference: 'SERVICE-' + service.serviceId,
     description: service.name,
     testStatus: req.body?.testStatus
   };
 
   // call mock provider
  const providerResult = await MockProvider.createPayment(paymentRequest);
  
  const bookingStatusByPayment = {
    APPROVED: 'CONFIRMED',
    PENDING: 'AWAITING_PAYMENT',
    DECLINED: 'PAYMENT_FAILED'
  };
  
  return res.json({
   serviceId: service.serviceId,
   providerPaymentId: providerResult.providerPaymentId,
   merchantReference: providerResult.merchantReference,
   paymentStatus: providerResult.status,
   bookingStatus: bookingStatusByPayment[providerResult.status]
  });
}

// module.exports = { preparePayment };
module.exports = {
  preparePayment,
  createMockPayment
};
