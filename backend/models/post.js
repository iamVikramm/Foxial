const mongoose = require("mongoose");
const path = require("path")
const multer = require("multer")
const POST_PATH = path.join('/','uploads', 'users', 'posts');

const postSchema = new  mongoose.Schema({
    
    content:{
        type:String,
        validate: {
            validator: function (value) {
                // Check if either content or image is present
                return value || this.image;
            },
            message: 'Either content or image is required',
        },
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    likes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Like"   
        }
    ],
    image:
        {
            type:String
        },
    tags:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]

},{timestamps:true})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, path.join(__dirname,'..',POST_PATH));
    },
    filename: function (req, file, cb) {
      return cb(null, file.fieldname + '-' + Date.now() )
    }
  })

  //static

  postSchema.statics.uploadedImage = multer({storage}).single('image');
  postSchema.statics.imagePath = POST_PATH;

const Post = mongoose.model('Post',postSchema)

module.exports = Post;