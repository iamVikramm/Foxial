const Like = require("../models/like")
const Post = require("../models/post")
const Comment = require("../models/comment")


module.exports.toggleLike = async function (req, res) {
    try {
      // Validate request parameters
      if (!req.query.id || !req.query.type || !['Post', 'Comment'].includes(req.query.type)) {
        return res.status(400).json({
          message: 'Invalid request parameters',
        });
      }
  
      let likeable;
  
      if (req.query.type === 'Post') {
        likeable = await Post.findById(req.query.id).populate('likes');
      } else {
        likeable = await Comment.findById(req.query.id).populate('likes');
      }
  
      if (!likeable) {
        return res.status(404).json({
          message: 'Likeable entity not found',
        });
      }
  
      // Check if a like already exists
      let existingLike = await Like.findOne({
        likeable: req.query.id,
        onModel: req.query.type,
        user: req.user.userID,
      });
  
      // If a like already exists, delete it
      if (existingLike) {
        likeable.likes.pull(existingLike._id);
        likeable.save();
  
        await existingLike.deleteOne();
  
        return res.status(200).json({
          message: 'Like deleted successfully',
          data: {
            deleted: true,
          },
        });
      } else {
        // Else, make a new like
        let newLike = await Like.create({
          user: req.user.userID,
          likeable: req.query.id,
          onModel: req.query.type,
        });
  
        likeable.likes.push(newLike._id);
        likeable.save();
  
        return res.status(200).json({
          message: 'Like added successfully',
          data: {
            deleted: false,
          },
        });
      }
    } catch (err) {
      console.error(err);
  
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  };
  