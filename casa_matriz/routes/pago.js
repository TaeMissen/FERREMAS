// const express = require('express');
// const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys } = require('transbank-sdk');
// const router = express.Router();

// // Configuración de Transbank Webpay Plus
// const webpayOptions = new Options(
//   IntegrationCommerceCodes.WEBPAY_PLUS, // Código de comercio de integración
//   '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // API Key secreta
//   IntegrationApiKeys.WEBPAY // Llave API de integración
// );

// // Crear una transacción de pago
// router.post('/crear_pago', async (req, res) => {
//   const { monto, ordenCompra, sesionId } = req.body;
//   const returnUrl = 'http://localhost:3000/exito'; // URL de retorno en producción

//   try {
//     console.log('Creando transacción con Webpay:', { monto, ordenCompra, sesionId, returnUrl });
//     const transaction = new WebpayPlus.Transaction(webpayOptions);
//     const response = await transaction.create(ordenCompra, sesionId, monto, returnUrl);
//     console.log('Respuesta de Webpay:', response);
//     res.json({ url: response.url, token: response.token });
//   } catch (error) {
//     console.error('Error al crear la transacción:', error);
//     if (error.response) {
//       console.error('Detalles de la respuesta de error:', error.response.data);
//     }
//     res.status(500).json({ error: 'Error al procesar el pago. Detalles en el servidor.' });
//   }
// });

// // Confirmar el pago
// router.post('/exito', async (req, res) => {
//   const { token_ws } = req.body;

//   try {
//     console.log('Confirmando transacción con Webpay:', { token_ws });
//     const transaction = new WebpayPlus.Transaction(webpayOptions);
//     const response = await transaction.commit(token_ws);
//     console.log('Transacción confirmada:', response);
//     res.json(response);
//   } catch (error) {
//     console.error('Error al confirmar la transacción:', error);
//     if (error.response) {
//       console.error('Detalles de la respuesta de error:', error.response.data);
//     }
//     res.status(500).json({ error: 'Error al confirmar el pago. Detalles en el servidor.' });
//   }
// });

// // Ruta final de agradecimiento
// router.post('/final', (req, res) => {
//   res.send('Gracias por tu compra!');
// });

// module.exports = router;
