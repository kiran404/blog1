const router = require('express').Router();
const userModel = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
const upload = require('../middlewares/upload.middleware')
// Update user
router.put('/:id', upload.single('profilePic'), async (req, res) => {
    if (`${req.params.id}` === `${req.user._id}`) {
        userModel.findById(req.params.id).exec(async function (err, user) {
            if (err) {
                res.status(400).json(err)
            }
            if (!user) {
                res.status(400).json({
                    msg: 'No user found'
                })
            }
            if (req.body.password) {
                const salt = await bcrypt.genSalt(3);
                const hashedPass = await bcrypt.hash(req.body.password, salt);
                user.password = hashedPass
            }
            if (req.file) {
                user.profilePic = req.file.filename;
            }
            user.save().then(user => {
                res.status(200).json('Successfully Updated')
            })
                .catch(err => res.status(400).json(err))
        })
    }
    else{
        res.status(400).json({
            msg: 'Cannot edit this user'
        })
    }
})

// Delete user
router.delete('/:id', async (req, res) => {
    if (req.user._id === req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            try {
                await Post.deleteMany({ username: user.username })
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json('User Deleted')
            } catch (err) {
                res.status(500).json(err);
            }
        } catch (err) {
            res.status(400).json('Cannot Delete')
        }
    }
})

// get one user
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;