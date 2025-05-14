require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const productosRouter = require('./routes/productos');
const fs = require('fs');
// const pagoRouter = require('./routes/pago');
const path = require('path');
const webpayPlusRouter = require('./routes/webpay_plus');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use('/productos', productosRouter); // Ruta base para productos
app.use('/webpay_plus', webpayPlusRouter);
// app.use('/pago', pagoRouter);
app.use(express.static(path.join(__dirname, 'public'))); 

app.listen(PORT, () => {
  console.log(`Sucursal API escuchando en http://localhost:${PORT}`);
});
