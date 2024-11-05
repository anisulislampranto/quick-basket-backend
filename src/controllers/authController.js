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
