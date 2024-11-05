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
            Accepted: null,
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
        const { accepted, application } = req.query;
        if (UserName) {
          const user = await SellerModel.findOne({ UserName });
          if (!user) {
            return res.status(404).json("No sellers found");
          }
          res.status(200).json(user);
        } else {
          if(accepted)
          {
            const users = await SellerModel.find({ Accepted: true }).populate("UserId");
            if (!users) {
              return res.status(404).json("No sellers found");
            }
            res.status(200).json(users);
          }
          else if(application)
          {
            const users = await SellerModel.find({ Accepted: null }).populate("UserId");
            if (!users) {
              return res.status(404).json("No sellers found");
            }
            res.status(200).json(users);
          }
          else
          {
            const users = await SellerModel.find({}).populate("UserId");
            if (!users) {
              return res.status(404).json("No sellers found");
            }
            res.status(200).json(users);
          }
        }
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
      }
   }

   const updateSeller = async (req, res) => {
    try{
        const { id } = req.params
        const { Image, Description, Email, UserName } = req.body

        console.log(req.body)

      const seller = await SellerModel.findById(id).populate('UserId');

      const duplicatedUserEmail = await User.findOne({ Email });
      const duplicatedUserName = await User.findOne({ UserName });
      if (
        duplicatedUserEmail &&
        duplicatedUserEmail._id.toString() !== seller.UserId._id.toString()
      ) {
        return res.status(500).json({ message: "Email already in use" });
      }

      if (
        duplicatedUserName &&
        duplicatedUserName._id.toString() !== seller.UserId._id.toString()
      ) {
        return res.status(500).json({ message: "Username already taken" });
      }
      const userId = seller.UserId._id;
      // console.log(userId);

      await User.findByIdAndUpdate(
        userId,
        { UserName, Email }, // Update UserName and Email
        { new: true }
      );

        const Seller = await SellerModel.findByIdAndUpdate(id, { Description , Image: Image ?? (seller.Image ?? "")}, { new: true });
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
      const deletedUser = await User.findByIdAndDelete(deletedSeller.UserId);
  
      if (!deletedSeller) {
        return res.json({ message: "Seller not found" });
      }

      if (!deletedUser) {
        return res.json({ message: "User not found" });
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

  const rejectSeller = async (req, res) => {
    const { id } = req.params
  
    try
    {
      const seller = await SellerModel.findById(id)
      if(seller.Accepted) return res.status(400).json({'message': 'Seller is already accepted!'})
      seller.Accepted = false
      await seller.save()
      res.status(200).json({message: 'Seller rejected successfully!'})
    }
    catch(error)
    {
      return res.status(500).json({ message: 'Error rejecting seller', error: e.message })
    }
  }

  const getSellerProducts = async (req, res) => {
    console.log(req._id)

    if(!req._id) return res.status(400).json({'message': 'Unauthorized Advertiser!'})
  
    try 
    {
      const products = await SellerModel.findOne({ UserId: req._id }, "Products").lean().populate("Products");
      console.log(products, req._id)
      if (!products) return res.status(400).json({ message: "No Products were found!" });
      return res.status(200).json(products);
    } 
    catch (error) 
    {
      return res.status(500).json({ message: error.message });
    }
  }
  const getSellerUser = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const Seller = await SellerModel.findOne({ UserId: id }).populate('UserId');
  
      if (Seller && Seller.Accepted) {
        return res.status(200).json({Seller});
      } else if (Seller) {
        return res.status(404).json("Seller is not accepted");
      } else {
        return res.status(404).json({ msg: "Cannot find any seller with UserId " + id });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching seller', error: error.message });
    }
  };
  
  


 module.exports = {rejectSeller, createSeller, getSeller, getSellers, updateSeller, deleteSeller, acceptSeller, getSellerProducts, getSellerUser}
