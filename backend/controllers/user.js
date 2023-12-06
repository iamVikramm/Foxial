const User = require("../models/user");
require("dotenv").config()

const getUserDetails = async (req,res)=>{

        const id = req.user.userID;
        const userData = await User.findById(id)
        const {password:pass,...rest} = userData._doc
        res.status(200).send({user : rest})

}

const updateUserDetails = async (req, res) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user.userID);

    // Handle avatar, username, and bio updates using multer
    User.uploadedAvatar(req, res, async function (err) {
      try {
        if (err) {
          console.log("Multer Error", err);
          throw new Error("File upload failed");
        }

        // If a file is uploaded, update the avatar path in the user object
        if (req.file) {
          console.log(req.file);
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }

        // Update username if provided
        if (req.body.username) {
          user.username = req.body.username;
        }

        // Update bio if provided
        if (req.body.bio) {
          user.bio = req.body.bio;
        }

        // Save the user object with updated details
        await user.save();

        return res.status(200).send({user});
      } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};


const searchUser = async (req,res)=>{
    const searchTerm = req.query.q
    const users = await User.find({
        $and: [
          { username: { $regex: new RegExp(`^${searchTerm}`, 'i') } },
          { _id: { $ne: req.user.userID } }, // Exclude the current user
        ],
      });
      
      res.json({ users });
}

const searchUserById = async (req,res)=>{
    const user = req.params.userId
    if(user){
        try {
            const userDetails = await User.findById(user)
            if(userDetails){
                return res.status(200).send({user:userDetails})
            }
            return res.status(404).send("No user found")
        } catch (error) {
            
        }
    }
    return res.status(404).send("No user found")
}

const checkUsernameAvailable = async (req, res) => {
    try {
      const username = req.query.username
      const user = await User.findOne({ username });
      if (user) {
        // Username already exists
        res.status(409).send("Not Available");
      } else {
        // Username is available
        res.status(200).send("Available");
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  const updatePrivacy = async (req, res) => {
    const userId = req.user.userID;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      // Toggle the value of isPrivate
      user.isPrivate = !user.isPrivate;
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: 'Privacy updated successfully', isPrivate: user.isPrivate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

module.exports = {
    getUserDetails,
    updateUserDetails,
    searchUser,
    searchUserById,
    checkUsernameAvailable,
    updatePrivacy
}