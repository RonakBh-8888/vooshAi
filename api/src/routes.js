const express = require('express');
const router = express.Router();
const Users = require('./controllers/user')

// Register a new user
router.post('/register', async (req, res) => {
  const userApi  = new Users(req, res);
  return await userApi.register(); 
});

// Login
router.post('/login', async (req, res) => {
  const userApi  = new Users(req, res);
  return await userApi.login();
});

//@tessting
// router.get('/read', (req, res)=>{
//   return res.status(200).json({ message: 'hello from the other side!!!!!!!!' });
// })

//profile view
router.post('/viewProfile', async (req, res)=>{
      const userApi  = new Users(req, res);
      return await userApi.viewProfile();
})


module.exports = router;
