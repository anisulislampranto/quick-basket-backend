const User = require("../models/user");
const { createToken } = require("../utils/createToken");
const { oauth2Client } = require("../utils/googleClient");

exports.googleAuth = async (req, res, next) => {
  const code = req.query.code;
  //   const type = req.query.type;

  console.log("code");

  try {
    const googleRes = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const data = await userRes.json();

    const { email, name, picture } = data;

    let user = await User.findOne({ email });

    console.log("user exist", user);

    // If user does not exist, create a new user
    if (!user) {
      user = await User.create({
        // type,
        name,
        email,
        image: picture,
      });

      console.log("createdUser", user);
    }

    const token = createToken(user._id, user.email);

    res.cookie("token", token).status(200).json({
      message: "success",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    console.log("req.user._id", req.user._id);
    const userId = req.user._id;
    const user = await User.findById({ _id: userId }).select("-password");
    console.log("user", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
