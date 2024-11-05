const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.createToken = (_id, email) => {
  return jwt.sign({ _id, email }, JWT_SECRET, { expiresIn: "1d" });
};
