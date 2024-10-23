const jwt = require("jsonwebtoken");
const JWT_SECRET = "$signatureBy$Kuldeep$Singh";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .staus(401)
      .send({ error: "Please authenticate using a valid Token.!" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid Token.!" });
  }
};

module.exports = fetchuser;
