const { default: mongoose } = require("mongoose");
const userModel = require("../models/User.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const NotificationService = require("../config/notification.service.js");
const notificationService = new NotificationService();

//create user Test
// const CreateUserTest = async (req,res)=>{
//     try {
//         const user = await userModel.create(req.body)
//         if(!user){
//             res.status(404).json("help")
//         }
//         res.status(201).json(user)

//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({message : error.message})
//     }

// }

const otpStore = new Map();

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await userModel.findOne({ Email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();

    otpStore.set(email, {
      otp,
      expiry: Date.now() + 600000
    });

    await notificationService.sendOTPEmail({ email, otp });

    res.status(200).json({
      message: 'OTP sent successfully',
      email: email
    });
  } catch (error) {
    console.error('Error in sendPasswordResetOTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const storedOTPData = otpStore.get(email);
    if (!storedOTPData ||
      storedOTPData.otp !== otp ||
      Date.now() > storedOTPData.expiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await userModel.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.Password = hashedPassword;
    await user.save();

    otpStore.delete(email);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

const getAllDeleteRequests = async (req, res) => {
  try {
    const users = await userModel.find({ RequestDelete: true });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}

const createUser = async (req, res) => {
  const { UserName, Email, Password } = req.body;

  if (!UserName || !Email || !Password)
    return res.status(400).json({ message: "All Fields Must Be Given!" });

  const duplicateUser = await userModel.findOne({ Email });

  if (duplicateUser)
    return res.status(400).json({ message: "Email Already Exists!" });

  const hashedPwd = await bcrypt.hash(Password, 10);

  const user = await userModel.create({
    UserName,
    Email,
    Password: hashedPwd,
    Role: "Tourist",
  });

  if (user) {
    res.status(201).json({ message: `New user ${UserName} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { UserName } = req.body;
    if (UserName) {
      const user = await userModel.findOne({ UserName });
      if (!user) {
        return res.status(404).json("No users found");
      }
      res.status(200).json(user);
    } else {
      const users = await userModel.find({});
      if (!users) {
        return res.status(404).json("No users found");
      }
      res.status(200).json(users);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
//get user by id
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
//patch user by id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json(`No user found with ID: ${id}`);
    }

    const { UserName, Email, Password } = req.body;

    if (UserName) {
      user.UserName = UserName;
    }
    if (Email) {
      user.Email = Email;
    }
    if (Password) {
      user.Password = Password;
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json(
        { Error: error.message } + "\n" + "User was not updated successfully."
      );
  }
};
//delete user by id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json("User not found");
    }
    res.status(200).json("User deleted successfully");
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) return res.status(400).json({ message: "All Fields Must Be Given!" })

  const { id } = req.params

  try {
    console.log(req._id)
    console.log(id)

    if (id !== req._id) return res.status(403).json({ message: "You are not authorized to change this user's password!" })

    const user = await userModel.findById(id)

    if (!user) return res.status(404).json({ message: "User not found!" })

    const isPasswordValid = await bcrypt.compare(oldPassword, user.Password)

    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password!" })

    const hashedPwd = await bcrypt.hash(newPassword, 10)

    user.Password = hashedPwd

    await user.save()

    res.status(200).json({ message: "Password updated successfully!" })
  }
  catch (e) {
    res.status(500).json({ message: e.message })
  }
}

const requestDeleteUser = async (req, res) => {
  const { id } = req.params

  if (id !== req._id) return res.status(403).json({ message: "You are not authorized to delete this user!" })

  try {
    const user = await userModel.findById(id)

    if (!user) return res.status(404).json({ message: "User not found!" })

    user.RequestDelete = true

    await user.save()

    res.status(200).json({ message: "User deletion requested successfully!" })
  }
  catch (e) {
    res.status(500).json({ message: e.message })
  }
}

module.exports = { getAllDeleteRequests, requestDeleteUser, getAllUsers, getUser, updateUser, deleteUser, createUser, updatePassword, sendPasswordResetOTP, resetPassword };
