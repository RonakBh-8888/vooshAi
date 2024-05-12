const ResponseService = require('../services/responce');
const SerssionModel = require('../models/sessions');
const UserModel = require('../models/users');

class Session {
    constructor(req, res){
        this.req = req;
        this.res = res;
        this.responseServices =  new ResponseService(req, res);
    }
    async login(){
        try {
            const req = this.req;
            const res = this.res;
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email });
            if (!user) {
              return  this.response.unAuthorizedError({ message: "Invalid credentials" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
              return this.response.unAuthorizedError({ message: "Invalid credentials" });
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
            //res.json({ token });
            this.response.success({data: token, message: 'User registered successfully'});
          } catch (error) {
              this.response.serverError(error);
          }

    }
}