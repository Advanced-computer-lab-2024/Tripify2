const { default: mongoose } = require('mongoose');
const AdminModel = require('../models/Admin.js');

const createAdmin = async(req,res) => {
    const {UserName, Email, Password, UserId}=req.body;

    if(!Email || !Password || !UserName) return res.status(400).json({'message': 'All Fields Must Be Given!'})

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
            Role: "Admin",
        });

        await newUser.save();
        
        const admin = await AdminModel.create({
            UserId,
            Products: [],
        });

        res.status(200).json(admin);
    }
    catch(error) {
        return res.status(500).json({ message: 'Error fetching admin', error: e.message })
    }
}

   const getAdmin = async (req, res) => {
    try{
        const { id } = req.params
        const Admin = await AdminModel.findById(id)
        if(Admin){
            return res.status(200).json({msg:"Admin found successfully with id "+id})
        }
        else{
            return res.status(404).json({msg:"Cannot find any admin with id "+id});
        }
    }
    catch(error){
        return res.status(500).json({ message: 'Error fetching admin', error: e.message })
    }
   }
    const getAdmins = async (req, res) => {
        try 
        {
            const admins = await AdminModel.find().lean().exec();
            res.status(200).json(admins);
        } 
        catch (error) 
        {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    }

    const getAdminProducts = async (req, res) => {
        if(!req._id) return res.status(400).json({'message': 'Unauthorized Advertiser!'})
      
        try 
        {
          const products = await AdminModel.findOne({ UserId: req._id }, "Products").lean().populate("Products");
          if (!products) return res.status(400).json({ message: "No Products where found!" });
          return res.status(200).json(products);
        } 
        catch (error) 
        {
          return res.status(500).json({ message: error.message });
        }
      }

 module.exports = {createAdmin, getAdmin, getAdmins, getAdminProducts}
