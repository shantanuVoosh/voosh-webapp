const { OAuth2Client } = require("google-auth-library");

// TODO: remove this
const documentName = "operationsdb";
// const collection = "users";
const LocalDB = "mongodb://localhost:27017/VooshApp";
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
// ! dont change the CLIENT_ID to any other name, or it wont work
CLIENT_ID =
  "780953688776-s0jujjc4hmro0jth97edb3o82qis73eq.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// !Google Login Middleware
const checkAuthenticationByGoogle = async (req, res, next) => {
  const { token } = req.body;
  try {
    const response = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const { email_verified } = response.payload;
    if (email_verified) {
      req.payload = response.payload;
      next();
    } else {
      res.json({ status: "error", message: "Token Expired!", isAuth: false });
    }
  } catch (err) {
    res.json({
      status: "error",
      message: `Error while verifyIdToken:${err}`,
      isAuth: false,
    });
  }
};

module.exports = { checkAuthenticationByGoogle };
