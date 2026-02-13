const User = require('../server/module/user');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    user = await User.find().select('-__v');
    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'No users found' });
    } else {
        res.status(200).json({ status: 'success', data: user });
    }
}


const createUser = async (req, res) => {

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({ username: req.body.username, password: hashPassword });
    if (!newUser) {
        return res.status(404).json({ status: 'fail', message: 'No users found' });
    } else {
        res.status(201).json({ status: 'success', data: newUser });
    }
}

const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'No users found' });
    } else {
        res.status(200).json({ status: 'success' });
    }
}

const findUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'User not found' });
    } else {
        res.status(200).json({ status: 'success', data: user });
    }
}

module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    findUser
}