
const path=require('path')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const authRoutes=require("./models/users")
const multer=require('multer')
const { v4: uuidv4 } = require('uuid');

const app = express();
const fileStorage=multer.diskStorage({ 
  destination:(req,file,cb)=>{ 
    cb(null,'images')
  },
  filename: function(req, file, cb) {
    cb(null, uuidv4()+file.originalname)
}
})

const fileFilter=(req,file,cb)=>{ 
  if(file.mimetype==='image/png' ||file.mimetype==='image/jpg' ||file.mimetype==='image/jpeg'){ 
    cb(null,true)
  }else{ 
    cb(null,false)
  }
}
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'))
//serves images statically 
app.use('/images',express.static(path.join(__dirname,'images'))); 


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authortization');
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
//error handling 
app.use((error,req,res,next)=>{ 
  console.log(error) 
  const status=error.statusCode || 500; 
  const message=error.message; 
  res.status(status).json({message:message})
})
//add mongoose connect
mongoose
  .connect(
    "mongodb+srv://saiken1:Welcome100@cluster0.5ufzjqa.mongodb.net/rest-api?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
