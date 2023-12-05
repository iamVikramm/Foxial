const User = require("../models/user")

const sendRequest = async(req,res)=>{
    const senderId = req.user.userID;
    const receiverId = req.params.receiverId;
    try {
        await User.findByIdAndUpdate(receiverId, { $push: { pendingFriendRequests: senderId } });
        await User.findByIdAndUpdate(senderId, { $push: { sentFriendRequests: receiverId } });
        res.status(200).send("Friend request sent successfully")
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const acceptRequest = async (req, res) => {
    const receiver = req.user.userID;
    const sender = req.params.senderId;
  
    const senderData = await User.findById(sender);
    try {

      const receiverData = await User.findById(receiver);

      // Check if the sender already exists in the friendships array of the receiver
      const isAlreadyFriend = receiverData.friendships.includes(sender);
      if (isAlreadyFriend) {
        // Handle the case where the sender is already a friend
        return res.status(400).json({ error: 'User is already a friend' });
      }

      await User.findByIdAndUpdate(sender, { $pull: { sentFriendRequests: receiver } });
      await User.findByIdAndUpdate(receiver, { $pull: { pendingFriendRequests: sender } });
      await User.findByIdAndUpdate(receiver, { $push: { friendships: sender } });
      await User.findByIdAndUpdate(sender, { $push: { friendships: receiver } });
      res.status(200).json({ newFriend: senderData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const unFriend = async (req, res) => {
    const receiverId = req.user.userID;
    const senderId = req.params.senderId;
  
    try {
      // Find and update the receiver's friendships array
      await User.findByIdAndUpdate(
        receiverId,
        { $pull: { friendships: senderId } },
        { new: true }
      );
  
      // Find and update the sender's friendships array
      await User.findByIdAndUpdate(
        senderId,
        { $pull: { friendships: receiverId } },
        { new: true }
      );
  
      res.status(200).json({ message: 'Unfriended successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

const getAllFriendshipsAndPendingRequests = async(req,res)=>{
    const user = req.user.userID
    try {
      const userData = await User.findById(user).populate('friendships').populate('pendingFriendRequests')
        res.status(200).send([{friendships:userData.friendships,pendingrequests:userData.pendingFriendRequests,sentrequests:userData.sentFriendRequests}])
    } catch (error) {
        
    }
}

const getNonFriends = async (req, res) => {
  const userId = req.user.userID;

  try {
      const currentUser = await User.findById(userId);
      let allUsers = await User.find({ _id: { $ne: userId } });
      allUsers = shuffleArray(allUsers);

      // Extract IDs of friends if currentUser.friendships is defined
      const friendIds = currentUser?.friendships?.map(friend => friend.toString('hex')) || [];

      const pendingRequestIds = currentUser?.pendingFriendRequests?.map(request => request.toString('hex')) || [];
      // Extract IDs of users in sent requests
      const sentRequestIds = currentUser?.sentFriendRequests?.map(request => request.toString('hex')) || [];
      // Filter out users who are already friends or in sent requests of the current user
      let nonFriends = allUsers.filter(user => !friendIds.includes(user.id) && !sentRequestIds.includes(user.id) &&!pendingRequestIds.includes(user.id));

      // Limit to 4 non-friends if available, otherwise include all
      nonFriends = nonFriends.slice(0, 4);

      // Populate user for the limited non-friends
      nonFriends = await User.populate(nonFriends, { path: 'User' });

      res.json(nonFriends);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

module.exports = {sendRequest,acceptRequest,getAllFriendshipsAndPendingRequests,getNonFriends,unFriend}