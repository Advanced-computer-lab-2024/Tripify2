const userModel = require('../models/Tourguide.js');
const { default: mongoose } = require('mongoose');

const createTourguideProfile = async(req,res) => {
  const {MobileNumber,YearsOfExperience,PreviousWork,UserId,Accepted}=req.body;
  try{
    
   const tourguide= await userModel.create({MobileNumber,YearsOfExperience,PreviousWork,UserId,Accepted});
   res.status(200).json(tourguide);
    }
catch(error){
   res.status(400).json({error:error.message});

}}

const getTourguideProfile = async (req, res) => {
    const {MobileNumber,YearsOfExperience,PreviousWork,UserId,Accepted}=req.body;
    try{
    const tourguide= await userModel.find({Accepted:true});
    res.status(200).json({message:"Tourguides read successfully"});
    if (acceptedTourGuides.length === 0) {
        return res.status(404).json({
          message: "No tour guides found",
        })}
 }catch(error){
    res.status(400).json({error:error.message});
 
 }  };


const updateTourguideProfile = async (req, res) => {
    const {MobileNumber,YearsOfExperience,PreviousWork,UserId,Accepted}=req.body;
   try {
    if(Accepted){
     const updatedUser=await userModel.findOne({UserId:req.body.UserId});
     updatedUser.MobileNumber=req.body.MobileNumber;
     updatedUser.YearsOfExperience=req.body.YearsOfExperience;
     updatedUser.PreviousWork=req.body.PreviousWork;
      await updatedUser.save();

      res.status(200).json(" Update is successful");}
        else{
            res.status(400).json({message:"Tourguide is not accepted yet by Admin"});
        }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};


module.exports = {createTourguideProfile, getTourguideProfile, updateTourguideProfile};
