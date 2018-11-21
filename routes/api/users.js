const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User model
const User = require('../../models/User');



// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/register
// @desc    Registers the user
// @access  Public
router.post('/register', (req, res) => {
    // check if user exists
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'Email already exists in the database' });
            }
            else {
                const newUser = new User(
                    {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    }
                );

                // password hashing
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
})

// @route   GET api/users/login
// @desc    Returning JWT token
// @access  Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: 'User not found' });
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // generate JWT token
                        res.json({ msg: 'Success' });
                    } else {
                        return res.status(400).json({ password: 'Password incorrect' });
                    }
                });
        })

});

module.exports = router;
