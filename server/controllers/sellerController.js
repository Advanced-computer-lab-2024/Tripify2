const { default: mongoose } = require('mongoose');
const SellerModel = require('../models/Seller.js');

const createSeller = async(req,res) => {
    const {Name, Description, UserId, Accepted}=req.body;
    try {
        if (Accepted){
            const Seller = await SellerModel.create({Name, Description, UserId, Accepted});
            res.status(200).json({msg:"Seller created Successfully"});
        }
        else{
            res.status(200).json({msg:"Seller is not accepted on the system"});
        }
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
            return res.status(404).json({msg:"Seller found successfully with id "+id})
        }
        else if(Seller){
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

 module.exports = {createSeller, getSeller, updateSeller}
