const express = require("express");
const axios = require("axios");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post("/", validateRequest, async (req, res) => {
  const { store_code, payment_method, payment_amount, customer, items } = req.body;

  if (!store_code || !payment_method || !payment_amount || !customer || !items) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const response = await axios.post(`${process.env.BASE_URL}/api/v1/payment`, {
      store_code,
      payment_method,
      payment_amount,
      customer,
      items,
    }, {
      headers: {
        Authorization: process.env.SECRET_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

module.exports = router;
