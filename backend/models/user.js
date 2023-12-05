const mongoose = require("mongoose");
const multer = require("multer")
const path = require("path");
const AVATAR_PATH = path.join('/','uploads', 'users', 'avatar');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: function() {
          // Make password required only if not an OAuth user
          return !this.oauthId;
        },
      },
      // ... other fields ...
    oauthId: {
        type: String,
      },
    username:{
        type:String,
        required:true
    },
    avatar : {
        type : String
    },
    friendships: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }
    ],
    pendingFriendRequests: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }
    ],
    sentFriendRequests: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }
    ],
    bio : {
        type:String,
        default:""
    },
    isPrivate:{
        type:Boolean,
        default:false
    },
    saved: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post' 
        }
    ]
},{
    timestamps:true
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      return cb(null, file.fieldname + '-' + Date.now() )
    }
  })

  //static

  userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
  userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model("User",userSchema)

module.exports = User