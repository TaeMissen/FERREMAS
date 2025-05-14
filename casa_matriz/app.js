require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const productosRouter = require('./routes/productos');
// const pagoRouter = require('./routes/pago');
const webpayPlusRouter = require('./routes/webpay_plus'); 


const app = express();
const PORT = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/productos', productosRouter);


// app.use('/pago', pagoRouter);
app.use('/webpay_plus', webpayPlusRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Casa matriz API escuchando en http://localhost:${PORT}`);
});
