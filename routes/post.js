const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const upload = require('../middlewares/upload.middleware')

// Create Post
router.post('/create',upload.array('photos'), async (req, res) => {
    const newPost = new Post(req.body);
    newPost.user = req.user._id;
    req.files.map(file=>{
        newPost.photos.push(file.filename)
    })
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(200).json(err)
    }
})

// Update Post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (`${post.user}` === `${req.user._id}`) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, { new: true })
                res.status(200).json(updatedPost);
            } catch (err) {
                res.status(500).json(err)
            }
        } else {
            res.status(401).json('Only Update')
        }

    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete Post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (`${post.user}` === `${req.user._id}`) {
            try {
                await post.delete()
                res.status(200).json('Post has been deleted..');
            } catch (err) {
                res.status(500).json(err)
            }
        } else {
            res.status(401).json('Only Update')
        }

    } catch (err) {
        res.status(500).json(err)
    }
})


// get one post
router.get('/:id', async (req, res) => {
   
    try {
        const post = await Post.findById(req.params.id).populate('Category').populate('user');
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err)
    }
})


// Get all posts
router.get('/', async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        // post array
        let posts;
        if (username) {
            posts = await Post.find({ username })
        } else if (catName) {
            posts = await Post.find({
                categories: {
                    $in: [catName]
                }
            })
        } else {
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;