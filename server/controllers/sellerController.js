const { default: mongoose } = require('mongoose');
const SellerModel = require('../models/Seller.js');
const User = require("../models/User");
const bcrypt = require("bcrypt");

const createSeller = async(req,res) => {
    const {UserName, Email, Password, Description, Documents}=req.body; 

    if(!UserName || !Description || !Documents || !Email || !Password) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    try {
        const duplicateEmail = await User.findOne({ Email }, "_id").lean().exec();

        if(duplicateEmail) return res.status(400).json({'message': 'Email Already Exists!'})

        const duplicateUserName = await User.findOne({ UserName }, "_id").lean().exec();
        if(duplicateUserName) return res.status(400).json({'message': 'UserName Already Exists!'})

        const hashedPwd = await bcrypt.hash(Password, 10);

        const newUser = new User({
            Email,
            Password: hashedPwd,
            UserName,
            Role: "Seller",
        });

        await newUser.save();
        
        const seller = await SellerModel.create({
            Description,
            UserId: newUser._id,
            Accepted: false,
            Documents,
        });

        res.status(200).json(seller);
    }
    catch(error) {
        return res.status(500).json({ message: 'Error fetching seller', error: e.message })
    }
}

   const getSeller = async (req, res) => {
    try{
        const { id } = req.params
        const Seller = await SellerModel.findById(id)
        if(Seller && Seller.Accepted){
            return res.status(200).json({msg:"Seller found successfully with id "+id})
        }
        else if(Seller){
            return res.status(404).json("Seller is not accepted");
        }
        else{
            return res.status(404).json({msg:"Cannot find any seller with id "+id});
        }
    }
    catch(error){
        return res.status(500).json({ message: 'Error fetching seller', error: e.message })
    }
   }
   const getSellers = async (req, res) => {
    try {
        const { UserName } = req.body;
        if (UserName) {
          const user = await SellerModel.findOne({ UserName });
          if (!user) {
            return res.status(404).json("No sellers found");
          }
          res.status(200).json(user);
        } else {
          const users = await SellerModel.find({});
          if (!users) {
            return res.status(404).json("No sellers found");
          }
          res.status(200).json(users);
        }
        if (!users) {
          return res.status(404).json("No sellers found");
        }
        res.status(200).json(users);
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
      }
   }

   const updateSeller = async (req, res) => {
    try{
        const { id } = req.params
        const Seller = await SellerModel.findByIdAndUpdate(id, req.body, { new: true });
        if(Seller && Seller.Accepted){
            return res.status(200).json("changed Seller Info successfully with id "+id);
        }
        else if (Seller){
            return res.status(200).json("Seller is not accepted");
        }
        else{
            return res.status(200).json({msg:"Cannot find any seller with id "+id});
        }
    }
    catch(error){
        return res.status(500).json({ message: 'Error fetching seller', error: e.message })
    }

   }

   const deleteSeller = async (req, res) => {
    const { id } = req.body;
  
    try {
      const deletedSeller = await SellerModel.findByIdAndDelete(id);
  
      if (!deletedSeller) {
        return res.json({ message: "Seller not found" });
      }
  
      res.status(200).json({ message: "Seller deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting seller", error });
    }
  };

  const acceptSeller = async (req, res) => {
    const { id } = req.params
  
    try
    {
      const seller = await SellerModel.findById(id)
      if(seller.Accepted) return res.status(400).json({'message': 'Seller is already accepted!'})
      seller.Accepted = true
      await seller.save()
      res.status(200).json({message: 'Seller accepted successfully!'})
    }
    catch(error)
    {
      return res.status(500).json({ message: 'Error accepting seller', error: e.message })
    }
  }

  const getSellerProducts = async (req, res) => {
    if(!req._id) return res.status(400).json({'message': 'Unauthorized Advertiser!'})
  
    try 
    {
      const products = await SellerModel.findOne({ UserId: req._id }, "Products").lean().populate("Products");
      if (!products) return res.status(400).json({ message: "No Products where found!" });
      return res.status(200).json(products);
    } 
    catch (error) 
    {
      return res.status(500).json({ message: error.message });
    }
  }


 module.exports = {createSeller, getSeller, getSellers, updateSeller, deleteSeller, acceptSeller, getSellerProducts}
