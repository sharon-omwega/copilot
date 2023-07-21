// Create web server 
// 1. Get all comments
// 2. Get comment by ID
// 3. Create a new comment
// 4. Update a comment
// 5. Delete a comment
// 6. Get all comments by Post ID
// 7. Get all comments by User ID
// 8. Get all comments by User ID and Post ID
// 9. Get all comments by User ID and Post ID and Comment ID

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const db = require('../db/connection');

const comments = db.get('comments');

const schema = Joi.object().keys({
    name: Joi.string().min(1).max(50).required(),
    content: Joi.string().min(1).max(500).required(),
    post_id: Joi.number().required(),
    user_id: Joi.number().required()
});

// Get all comments
router.get('/', (req, res, next) => {
    comments.find().then((comments) => {
        res.json(comments);
    }).catch((err) => {
        next(err);
    });
});

// Get comment by ID
router.get('/:id', (req, res, next) => {
    comments.findOne({
        _id: req.params.id
    }).then((comment) => {
        res.json(comment);
    }).catch((err) => {
        next(err);
    });
});

// Create a new comment
router.post('/', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if(result.error === null) {
        const comment = {
            ...req.body,
            created: new Date()
        };
        comments.insert(comment).then((comment) => {
            res.json(comment);
        }).catch((err) => {
            next(err);
        });
    } else {
        next(result.error);
    }
});

// Update a comment
router.put('/:id', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if(result.error === null) {
        comments.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                name: req.body.name,
                content: req.body.content,
                post_id: req.body.post_id,
                user_id: req.body.user_id
            }
        }).then((comment) => {
            res
                .json(comment)
                .status(200);
        }).catch((err) => {
            next(err);
        }
        );
    } else {
        next(result.error);
    }
});