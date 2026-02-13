const express = require('express');
const router = express.Router();
const User = require('../module/user');
const controller = require('../../controller/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../../middleware/authLogin');
const Post = require('../module/post');
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 * GET /
 * Admin - Login Page
*/
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "admin",
            description: "Admin panel"
        };
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        res.status(500).render('error in catch get', { error: error.message });
    }
});


/**
 * POST /
 * Admin - Check Login
*/
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.render('admin/dashboard');

    } catch (error) {
        console.log(error);
    }
});


// /**
//  * POST /
//  * Admin - Register
// */
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await new User({ ...req.body, password: hashedPassword }).save();
        console.log(newUser);
        res.status(201).json({ status: 'success', data: newUser });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        data = await Post.find();
        res.render('admin/dashboard', { data });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});


/**
 * GET /
 * Admin - Create New Post
*/
router.get('/add-post', verifyToken, async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }

});



/**
 * POST /
 * Admin - Create New Post
*/
router.post('/add-post', verifyToken, async (req, res) => {
    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Create New Post
*/
router.get('/edit-post/:id', verifyToken, async (req, res) => {
    try {

        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
        };

        const data = await Post.findOne({ _id: req.params.id });

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }

});

/**
 * PUT /
 * Admin - Create New Post
*/
router.put('/edit-post/:id', verifyToken, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }

});

/**
 * DELETE /
 * Admin - Delete Post
*/
router.delete('/delete-post/:id', verifyToken, async (req, res) => {

    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }

});


router.route('/admin/users')
    .get(controller.getAllUsers)
    .post(controller.createUser)
router.route('/admin/users/:id')
    .get(controller.findUser)
    .delete(controller.deleteUser)



module.exports = router;