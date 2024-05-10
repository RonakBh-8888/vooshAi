const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/users');
const authMiddleware = require('./authMiddleware');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'vooshAiJWTtokentoday', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/read', (req, res)=>{
  return res.status(200).json({ message: 'hello from the other side!!!!!!!!' });
})

router.get('/viewProfile', async (req, res)=>{
  try {
    const { userId , viewerId } = req.query;
    const userDetails = await User.findOne({ _id: userId },{ password : 0});

    if(userId === viewerId){
      res.json({ data: userDetails, message: 'Profile fetched successfully' });
      return;
    }
    const viewerDetails = await User.findOne({ _id: viewerId });

    if(userDetails.isPublic){
      res.json({ data: userDetails, message: 'Profile fetched successfully' });
    } else if(viewerDetails.userType === 'ADMIN'){
       res.json({ data: userDetails, message: 'Profile fetched successfully' });
    } else {
      res.json({ message: 'this profile is private' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

})

router.patch('/profile/visibility', authMiddleware, async (req, res) => {
    try {
      const { isPublic } = req.body;
      req.user.isPublic = isPublic;
      await req.user.save();
      res.json({ message: 'Profile visibility updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
