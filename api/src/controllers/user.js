const ResponseService = require('../services/responce');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
class Users {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.response = new ResponseService(this.req, this.res);
  }

  async register() {
    try {
        const { username, email, password } = this.req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        this.response.success({ message: 'User registered successfully'});
      } catch (error) {
        //res.status(500).json({ error: error.message });
        this.response.serverError(error)
      }
  }

  async login() {
    try {
      const req = this.req;
      const res = this.res;
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      let options = {
        maxAge: 20 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };
      const token = jwt.sign({ userId: user._id }, "vooshAiJWTtokentoday", {
        expiresIn: "1h",
      });
      res.cookie("SessionToken", token, options);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async viewProfile() {
    try {
      const { userId, viewerId } = this.req.body;
      const userDetails = await User.findOne({ _id: userId }, { password: 0 });

      if (userId === viewerId) {
        res.json({
          data: userDetails,
          message: "Profile fetched successfully",
        });
        return;
      }
      const viewerDetails = await User.findOne({ _id: viewerId });
      let resData = { data : {}, message : "this profile is private"}

      if (userDetails.isPublic) {
        resData = {
            data: userDetails,
            message: "Profile fetched successfully",
        }
      } else if (viewerDetails.userType === "ADMIN") {
        resData = {
            data: userDetails,
            message: "Profile fetched successfully",
        }
      }
       this.response.success(resData);
    } catch (error) {
       this.response.serverError(error);
    }
  }
}

module.exports = Users;