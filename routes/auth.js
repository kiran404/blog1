const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(3);
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        })
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(400).json("User Not Found");

        const validated = await bcrypt.compare(req.body.password, user.password);
        !validated && res.status(400).json('Wrong Password');

        if (user) {
            // generate an access token
            const accessToken = jwt.sign(
                { id: user.id }, process.env.JWTSECRET
            )
            // const { password, ...others } = user;
            const { password, ...others } = user._doc; // exclude password
            // res.status(200).json({ others, accessToken });
            res.cookie('token', accessToken, {httpOnly: true}).status(200).json(others)
        }    

    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/logout', (req,res)=>{
    return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully logged out!"});
})

module.exports = router;