// const express = require('express');
// const router = express.Router();
// const { WebpayPlus } = require('transbank-sdk');

// const webpayPlus = new WebpayPlus({
// commerceCode: '597055555532', // Código de comercio de prueba de Transbank
// apiKey: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // Reemplaza con tu API Key
// environment: 'INTEGRATION' // Cambia a 'PRODUCTION' para producción
// });

// router.post('/crear_pago', async (req, res) => {
//  const { monto, ordenCompra, sesionId } = req.body;
//    const finalUrl = 'http://localhost:3001/pago/final'; // Cambia a la URL de tu proyecto

//    try {
//      const transaction = await webpayPlus.transaction.create({
//        buyOrder: ordenCompra,
//        sessionId: sesionId,
//        amount: monto,
//        returnUrl
//      });

//      res.json({ url: transaction.url, token: transaction.token });
//    } catch (error) {
//      res.status(500).json({ error: error.message });
//    }
//  });

//  router.post('/exito', async (req, res) => {
//    const { token_ws } = req.body;

//    try {
//      const response = await webpayPlus.transaction.commit({ token: token_ws });
//      res.json(response);
//    } catch (error) {
//      res.status(500).json({ error: error.message });
//    }
//  });

//  router.post('/final', (req, res) => {
//    res.send('Gracias por tu compra!');
//  });

//  module.exports = router;
