const jwt = require('jsonwebtoken');
const userModel = require('./../models/User')
exports.authenticate = (req,res,next)=>{
    let token = req.cookies.token;

    jwt.verify(token,process.env.JWTSECRET, (err, tokenDec)=>{
        if(err){
             res.status(400).json({
                err: 'Error', err
            })
        }
        if(!tokenDec){
             res.status(400).json({
                err: 'Token Error'
            })
        }
        const userId = tokenDec.id;
        userModel.findById(userId).exec(function(err, user){
            if(err){
                 next(err)
            }
            if(!user){
                 res.status(400).json({
                    err: 'No user'
                })
            }
            req.user = user;
            next();
        })
    })

}