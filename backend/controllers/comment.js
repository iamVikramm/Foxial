const Post = require("../models/post")
const Comment = require("../models/comment")


const create = async (req, res) => {
    try {
      const comment = await Comment.create({
        content: req.body.content,
        post: req.body.commentedOn,
        user: req.body.commentedBy,
      });
  
      const post = await Post.findById(req.body.commentedOn);
      post.comments.push(comment);
      await post.save();
  
      res.status(200).send(comment);
    } catch (error) {
      console.error(error);
      res.status(402).send("Error Adding comment");
    }
  };

  const deleteComment = async (req, res) => {
    const {commentId,postId} = req.body
    try {

      await Comment.findByIdAndDelete(commentId);
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { comments: commentId } },
        { new: true }
      );
      res.status(200).send("Comment deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(402).send("Error Deleting comment");
    }
  };

module.exports = {create,deleteComment}