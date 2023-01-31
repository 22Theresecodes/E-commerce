const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/User");
// const User = require("../models/user")

//REGISTER
router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { password, username, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      salt,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const { password, username } = req.body;
    const incominguser = await User.findOne({
      username,
    });
    console.log(incominguser);
    if (!incominguser) {
      res.status(401).json({ Error: "wrong credentials!" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      incominguser.password
    );
    if (!isPasswordCorrect) {
      res.status(401).json({ Error: "wrong password" });
    }
    console.log(isPasswordCorrect);
    if (incominguser && isPasswordCorrect) {
        const accessToken = jwt.sign(
            {
            id:user.id,
            isAdmin:user.isAdmin
          },
          process.env.JWT_SEC,
          {expiresIn:"2d"}
          )
      res.status(200).json({
        message: "You have successfully logged in",
        accessToken
      });

    
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
