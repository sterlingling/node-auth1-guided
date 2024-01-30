const express = require('express');
const bcrypt = require('bcryptjs')
const router = express.Router();
const User = require('../users/users-model')

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const hash = bcrypt.hashSync(password, 8) // 2^8
        const newUser = { username, password: hash }
        const result = await User.add(newUser)
        res.status(201).json({
            message: `nice to have you, ${result.username}`
        })
    } catch (err) {
        next(err)
    }
})
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const [user] = await User.findBy({ username })
        if (user && bcrypt.compareSync(password, user.password)) {
            //start session
            req.session.user = user;
            res.json({ message: `welcome back, ${user.username}` })
        } else {
            next({ status: 401, message: 'bad credentials' })
        }
    } catch (err) {
        next(err)
    }

})
router.get('/logout', async (req, res, next) => {
    if (req.session.user) {
        const { username } = req.session.user;
        req.session.destroy(err => {
            if (err) {
                res.json({ message: 'you can never leaves' })
            } else {
                res.json({ message: `goodbye, ${username}` })
            }
        })
    } else {
        res.json({ message: 'sorry, have we met' })
    }

})

module.exports = router