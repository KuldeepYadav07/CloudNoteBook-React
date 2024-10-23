const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "$signatureBy$Kuldeep$Singh";
const fetchuser = require("../middleware/fetchuser");

//ROUTE -1 create user for first time . /api/auth/createUser : no login reqired
router.post(
  "/createUser",
  [
    body("email", "Enter valid Name").isEmail(),
    body("name", "Enter valid email").isLength({ min: 3 }),
    body("password", "Password must be atleast 5 cherectors").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "user already exists. !" });
      }
      const salt = bcrypt.genSaltSync(10);
      const secPassword = bcrypt.hashSync(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      let success=true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      let success=false;
      res.status(500).send(success,"some went wrong. please check server");
    }
  }
);

//ROUTE -2// Authenticate user using POST . /api/auth/login : no login reqired
router.post(
  "/login",
  [
    body("email", "Enter valid Name").isEmail(),
    body("password", "Password can not be blank ").exists(),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success=false;
      return res.status(400).json({success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success,errors: "Please try to login with correct details.!  " });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success ,errors: "Please try to login with correct details.!  " });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success,authtoken });
    } catch (error) {
      console.error(error.message);
      success=false;
      res.status(500).send( success ,"some went wrong. please check server");
    }
  }
);

//ROUTE -3// get loggedin user deatils using POST . /api/auth/getUser : login reqired
router.post("/getUser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some went wrong. please check server");
  }
});
module.exports = router;
