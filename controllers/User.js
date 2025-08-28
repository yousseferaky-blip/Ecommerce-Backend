const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

exports.SignUp = async (req,res)=>{
    try{
        const {email,username,password,phone} = req.body

        const existingUser = await User.findOne({email})
        if(existingUser){
           return res.status(400).json({message:"Email Already Exists"})
        }

        const HashPassword = await bcrypt.hash(password,10)
        const NewUser = new User({
            email,
            username,
            phone,
            password:HashPassword,
            image: req.file ? `/images/${req.file.filename}` : null
        })
         await NewUser.save()
         const {password:_,...info} = NewUser._doc
        res.status(201).json({ message: "User Created Successfully!" ,User: info})

    }catch(err){
        res.status(500).json(err)``
    }
}


exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or Password is incorrect" });
    }

    const MatchPassword = await bcrypt.compare(password, user.password);
    if (!MatchPassword) {
      return res.status(400).json({ message: "Email or Password is incorrect" });
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email  },
      process.env.JWTSECRET,
      { expiresIn: "3d" }
    );

    const { password: _, ...info } = user._doc;

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true, 
      })
      .status(200)
      .json({ token, info });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.LogOut = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true, 
        sameSite: "None",
        secure: true, 
        path: "/",
      })
      .status(200)
      .json("User logged out successfully!");
  } catch (err) {
    res.status(500).json({ message: "Logout error" });
  }
};



exports.Refetch = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWTSECRET, {}, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    try {
      const user = await User.findById(decoded._id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
};

exports.GetUsers = async (req,res)=>{
    try{
        const Users = await User.find()
        res.status(200).json({Users})
    }catch(err){
        res.status(500).json({message:err})
    }
}

exports.GetUser = async (req,res)=>{
    try{
        const getUser = await User.findById(req.params.id)
        const {password,...info} = getUser._doc
        res.status(200).json({info})

    }catch(err){
        res.status(500).json({message:err})
    }
}

exports.UpdateUser = async (req,res) =>{
    try{
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            {new: true}
        )
        const {password,...info} = updated._doc
        res.status(200).json({message:"User Updated Succussfully",info})
    }catch(err){    
        res.status(500).json({message:err})
    }
}

exports.DeleteUser = async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "User deleted successfully"});
    }catch(err){
        res.status(500).json({message:err})
    }
}
