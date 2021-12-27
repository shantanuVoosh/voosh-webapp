const jwt = require("jsonwebtoken");
const secret = "secret";

const checkAuthentication = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    res.json({
      status: "error",
      message: `Please log in no token present!`,
      isAuth: false,
    });
  } else {
    try {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          res.json({
            status: "error",
            message: `Error while verifying token:${err}`,
            isAuth: false,
          });
        } else {
          req.payload = decoded;
          next();
        }
      });
    } catch (err) {
      console.log("Error while verifying token:", err);
    }
  }
};

module.exports = {checkAuthentication};
