const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user");

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
//       profileFields: ["id", "displayName", "email", "picture.type(large)"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const { email, name, picture } = profile._json;
//       let user = await User.findOne({ email });

//       if (!user) {
//         user = await User.create({ name, email, image: picture.data.url });
//       }

//       return done(null, user);
//     }
//   )
// );

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log("profile", profile);

//       const email = profile.emails[0].value;
//       const { displayName, avatar_url } = profile;

//       let user = await User.findOne({ email });

//       if (!user) {
//         user = await User.create({
//           name: displayName,
//           email,
//           image: avatar_url,
//         });
//       }

//       return done(null, user);
//     }
//   )
// );
