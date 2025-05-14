const WebpayPlus = require("transbank-sdk").WebpayPlus;
const asyncHandler = require("../utils/async_handler");



exports.create = asyncHandler(async (req, res) => {
  const buyOrder = `O-${Math.floor(Math.random() * 10000) + 1}`;
  const sessionId = `S-${Math.floor(Math.random() * 10000) + 1}`;
  const amount = req.body.monto;
  const returnUrl = `${req.protocol}://${req.get("host")}/commit`;

  const webpay = new WebpayPlus.Transaction();
  const response = await webpay.create(
    buyOrder,
    sessionId,
    amount,
    returnUrl
  );

  const { token, url } = response;
  res.json({ token, url });
});

exports.commit = asyncHandler(async (req, res) => {
  const params = req.method === "GET" ? req.query : req.body;

  const { token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA, TBK_ID_SESION } = params;

  if (token_ws && !TBK_TOKEN) {
    const commitResponse = await new WebpayPlus.Transaction().commit(token_ws);
    res.redirect('/commit.html');
  } else {
    res.redirect('/commit-error.html');
  }
});

exports.status = asyncHandler(async (req, res) => {
  const token = req.body.token;
  const statusResponse = await new WebpayPlus.Transaction().status(token);
  res.json(statusResponse);
});

exports.refund = asyncHandler(async (req, res) => {
  const { token, amount } = req.body;
  const refundResponse = await new WebpayPlus.Transaction().refund(token, amount);
  res.json(refundResponse);
});
