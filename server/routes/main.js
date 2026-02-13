const express = require('express');
const router = express.Router();
const controller = require('../../controller/blog');
const Post = require('../module/post');
const { route } = require('./admin');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


router.post('/search', async (req, res) => {
    let searchTerm = req.body.searchTerm;
    const searchNoSpaces = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
    const data = await Post.find({
        $or: [
            { title: { $regex: new RegExp(searchNoSpaces, 'i') } },
            { body: { $regex: new RegExp(searchNoSpaces, 'i') } }
        ]
    });
    res.render('search', { data });
});


router.get('/', async (req, res) => {
    const locals = {
        title: 'NodeJs Blog',
        description: 'Simple Blog created with NodeJs, Express and MongoDB'
    }
    try {
        const query = req.query;
        const limit = parseInt(query.limit) || 4;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * limit;
        const nextPage = page + 1;
        const data = await Post.find().skip(skip).limit(limit);
        res.render('index', { locals, data, nextPage });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});


router.get('/post/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).render('error', { error: 'Post not found' });
        }
        const locals = {
            title: post.title,
            description: post.description
        };
        res.render('post', { locals, post });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/about', (req, res) => {
    const locals = {
        title: 'About Us',
        description: 'Learn more about us on this page'
    }
    res.render('about', { locals });
});

router.get('/login', (req, res) => {
    const locals = {
        title: 'Login',
        description: 'Login to access the admin panel'
    }
    res.render('login', { locals });
});



router.route('/getAllPosts')
    .get(controller.getAllPosts)

router.route('/addPost')
    .post(controller.createPost)

router.route('/deletePost/:id')
    .delete(controller.delatePost)

module.exports = router;