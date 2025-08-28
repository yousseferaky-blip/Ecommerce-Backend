const express = require("express")
const { SignUp, Login, LogOut, Refetch, GetUser, DeleteUser, GetUsers, UpdateUser } = require("../controllers/User")
const router = express.Router()
const upload = require("../middleware/images");

router.post("/signUp" , upload.single("image") , SignUp)
router.post("/login", Login);
router.get("/logout", LogOut);
router.get("/refetch", Refetch);
router.get("/getUsers", GetUsers);
router.get("/getUser/:id", GetUser);
router.delete("/delete/:id", DeleteUser);
router.put("/update/:id", UpdateUser);



module.exports = router