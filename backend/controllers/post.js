const Post = require("../models/post")
const User = require("../models/user")
const Like = require("../models/like")
const Comment = require("../models/comment")



const create = async (req, res) => {
  try {
      let post = new Post({
          user: req.user.userID,
      });
      Post.uploadedImage(req, res, async function (err) {
          if(err){
            console.log(err)
          }
          if (req.file) {
            console.log(req.file)
              const image = Post.imagePath + "/" + req.file.filename;
              post.image = image;
          }
          if(req.body.content){
            post.content =  req.body.content
          }
          try {
              const newPost = await post.save();
              res.status(200).send({ addedPost: newPost });
          } catch (error) {
              res.status(402).send(error);
          }
      });
  } catch (error) {
      res.status(402).send(error);
  }
};



const getAllPosts = async (req, res) => {
  const currentUser = await User.findById(req.user.userID)
    try {
        const posts = await Post.find({})
          .populate({
            path: 'user',
            select: '-password -email', // Exclude sensitive information
          })
          .populate({
            path: 'comments',
            populate: [
              { path: 'user', select: '-password -email' },
              { path: 'likes' },
            ],
          })
          .populate('likes')
          .sort({ createdAt: -1 });
      
        // Check if the post user is private and handle accordingly
        const postsToSend = posts.filter((post) => {
          if (post.user.isPrivate) {
            // Check if the requesting user is in the friendships array
            return currentUser.friendships.includes(post.user._id) || post.user._id.equals(currentUser._id)
          }
          return true; // If user is not private, include the post
        });
      
        res.status(200).send({ posts: postsToSend });
      } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
      }
      
};

const getUserPosts = async (req,res)=>{
   
    try {
        const userPosts = await Post.find({ user: req.params.userId })
        .populate('user','-password')
        .populate({
            path: 'comments',
            populate: [
                { path: 'user' },
                { path: 'likes' }
            ]
        })
        .populate('likes')
        .sort({ createdAt: -1 });
        const user = await User.findById(req.user.userID)

        res.status(200).send({posts:userPosts,user:user});

      } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
      }

}

const getLikedUsers = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate({
      path: 'likes',
      populate:'user'
  })


    res.status(200).send(post.likes);
  } catch (error) {
    console.error('Error fetching liked users:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getUserSavedPosts = async (req, res) => {
  try {
    const userId = req.user.userID;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const savedPosts = await Post.find({ _id: { $in: user.saved } })
      .populate({
        path: 'user',
        select: '-password -email', // Exclude sensitive information
      })
      .populate({
        path: 'comments',
        populate: [
          { path: 'user', select: '-password -email' },
          { path: 'likes' },
        ],
      })
      .populate('likes')
      .sort({ createdAt: -1 });

    res.status(200).json({ savedPosts });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const addToSavedPosts = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = await User.findById(req.user.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.saved.includes(postId)) {
      return res.status(400).json({ error: "Post already in saved posts" });
    }

    user.saved.push(postId);
    await user.save();
    return res.status(200).json({ message: "Post added to saved posts" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const removeFromSavedPosts = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Assuming you have a User model defined somewhere
    const user = await User.findById(req.user.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the postId is in the savedPosts array
    if (!user.saved.map(savedPostId => savedPostId.toString()).includes(postId)) {
      return res.status(404).json({ error: "Post not found in saved posts" });
    }

    // Remove the postId from the savedPosts array
    user.saved = user.saved.filter(savedPostId => savedPostId.toString() !== postId);

    // Save the updated user object
    await user.save();

    return res.status(200).json({ message: "Post removed from saved posts" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};





const deletePost = async(req,res)=>{

    try {
        const postId = req.params.postId;

        await Comment.deleteMany({post:postId})
        await Like.deleteMany({likeable:postId})
        await Post.findByIdAndDelete(postId)
        
        res.status(200).send("Deleted Post successfully")
    } catch (error) {
        return(
            res.status(500),send(error)
        )
    }
}

module.exports = {create,getAllPosts,getUserPosts,deletePost,getLikedUsers,
  addToSavedPosts,removeFromSavedPosts,getUserSavedPosts
}