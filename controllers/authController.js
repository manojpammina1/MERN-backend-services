const User = require('../model/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const handelLogin = async (req, res) => {
    const {user, password} = req.body;

    if(!user || !password) return res.status(400).json({message: 'Please include a username and password'});

    const foundUser = await User.findOne({username: user}).exec();
    if(!foundUser) return res.status(401).json({message: 'User not found'});

    try {
        if(await bcrypt.compare(password, foundUser.password)) {
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                { "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s'}
            );
            const refreshToken = jwt.sign(
                { "username": foundUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d'}
            );

            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();
            console.log(result);
            res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
            return res.status(200).json({
                message: 'Login successful',
                accessToken
            });
        } else {
            res.status(401).json({message: 'Invalid password'});
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

module.exports = {handelLogin};