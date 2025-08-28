const Product = require("../models/Product")

exports.CreateProduct = async (req,res)=>{
    try{
        const {title , description , price, category , discount,brand} = req.body

        // Validation
        if(!title || !description ||  price === undefined ){
            return res.status(404).json({ message: "title, description, and price and image are required" });
        }

        // Create Product
         const NewProduct = new Product({
            title,
            description,
            brand,
            price,
            category,
            discount,
            image: req.files['image'] ? `/images/${req.files['image'][0].filename}` : null, 
            images: req.files['images'] ? req.files['images'].map(file => `/images/${file.filename}`) : []            
          });
        await NewProduct.save()
        res.status(201).json({
          status:"Success",
          message: "Product Created Successfully!",
          product:NewProduct
        })
    }catch(err){
         res.status(500).json(err)
    }
}

exports.GetProducts = async (req,res)=>{
    try{
        const GetProducts = await Product.find()
        res.status(200).json({
           status:"Success",
           message: "All Product!",
           products:GetProducts
        })
    }catch(err){
        res.status(500).json({ message: "Failed to fetch Products", error: err.message })
    }
}

exports.UpdateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body, // العناوين والوصف والسعر اللي جايين من body
    };

    // لو فيه صورة أساسية جديدة
    if (req.files && req.files["image"]) {
      updateData.image = `/images/${req.files["image"][0].filename}`;
    }

    // لو فيه صور إضافية جديدة
    if (req.files && req.files["images"]) {
      updateData.images = req.files["images"].map(file => `/images/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      status: "Success",
      message: "Product Updated Successfully!",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};


exports.DeleteProduct = async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Prodcut Delete Successfully!"})
    }catch(err){
        res.status(500).json(err)
    }
}

exports.GetProduct = async (req,res)=>{
    try{
        const GetProduct = await Product.findById(req.params.id)
        if(!GetProduct){
          return res.status(404).json({ message: "Product Not Found!" });
        }
        return res.status(200).json({
          status:"Success",
          message: "Product!",
          product: GetProduct
        })
    }catch(err){
        res.status(500).json(err)
    }
}