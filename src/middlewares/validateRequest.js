module.exports = (req, res, next) => {
  const secretKey = req.headers["authorization"];
  const storeCode = req.headers["store-code"];

  if (!secretKey || !storeCode) {
    return res.status(401).json({ message: "Unauthorized. Missing headers." });
  }

  if (secretKey !== process.env.SECRET_KEY || storeCode !== process.env.STORE_CODE) {
    return res.status(403).json({ message: "Forbidden. Invalid credentials." });
  }

  next();
};