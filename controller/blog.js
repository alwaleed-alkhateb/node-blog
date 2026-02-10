const Post = require('../server/module/post');

const getAllPosts = async (req, res) => {
    const posts = await Post.find().select('-__v');
    if (!posts) {
        return res.status(404).json({ status: 'error', message: 'Posts not found' });
    }
    res.json(posts);
};

const createPost = async (req, res) => {
    const newPost = await new Post(req.body).save();
    res.status(201).json({ status: 'success', data: newPost });
};

const delatePost = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
        return res.status(404).json({ status: 'error', message: 'Post not found' });
    }
    res.json({ status: 'success', message: 'Post deleted successfully' });
}


module.exports = {
    getAllPosts,
    createPost,
    delatePost
}