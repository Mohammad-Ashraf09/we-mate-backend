const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');

//REGISTER
router.post('/register', async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            name: req.body.name,
            mobile: req.body.mobile,
            password: hashedPassword,
            profilePicture: req.body.profilePicture,
        });

        //save user and respond
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ mobile: req.body.mobile });
        !user && res.status(404).json('user not found');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json('wrong password');

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
