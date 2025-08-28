const express = require("express");
const {
  GetProducts,
  CreateProduct,
  DeleteProduct,
  UpdateProduct,
  GetProduct,
} = require("../controllers/Product");

const upload = require("../middleware/images");
const router = express.Router();

router.get("/", GetProducts);
router.get("/:id", GetProduct);
router.post("/", upload.fields([
    { name: "image", maxCount: 1 },   
    { name: "images", maxCount: 5 }   
  ]), CreateProduct); 
router.delete("/:id", DeleteProduct);
router.put("/:id",upload.fields([
    { name: "image", maxCount: 1 },   
    { name: "images", maxCount: 5 }   
  ]), UpdateProduct);

module.exports = router;
