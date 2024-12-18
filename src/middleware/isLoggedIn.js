const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isLoggedIn = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Authorization Failed !!" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id }).select("_id");

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid token. Authorization failed." });
    }
  }
};
