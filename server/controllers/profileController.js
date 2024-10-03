const profileModel = require("../models/Profile.js");

const createCompanyProfile = async (req, res) => {
  const { Name, Industry, FoundedDate, Headquarters, Description, Website, Email } = req.body;

  try {
    // required
    if (!Name || !Industry || !Description) {
      return res.status(400).json({ message: "Name, Industry, and Description are required!" });
    }

    // duplicates
    const duplicateCompanyName = await profileModel.findOne({ Name });
    const duplicateCompanyWebsite = await profileModel.findOne({ Website });
    
    if (duplicateCompanyName) {
      return res.status(400).json({ message: "Company Name already exists!" });
    }
    if (duplicateCompanyWebsite) {
      return res.status(400).json({ message: "Company Website already exists!" });
    }


    const newCompanyProfile = await profileModel.create({
      Name,
      Industry,
      FoundedDate,
      Headquarters,
      Description,
      Website,
      Email,
    });

    await newCompanyProfile.save();

    res.status(201).json({
      message: "Company profile created successfully",
      companyProfile: newCompanyProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating company profile", error });
  }
};

const getCompanyProfiles = async (req, res) => {
  try {
    const companyProfiles = await profileModel.find();
    res.status(200).json(companyProfiles);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving company profiles", error });
  }
};

const getCompanyProfileById = async (req, res) => {
  const { id } = req.params;

  try {
    const companyProfile = await profileModel.findById(id);

    if (!companyProfile) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    res.status(200).json({
      message: "Company profile found",
      companyProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving company profile", error });
  }
};

const updateCompanyProfile = async (req, res) => {
  const { id } = req.body;
  const { Name, Industry, FoundedDate, Headquarters, Description, Website, Email } = req.body;

  try {
    const updatedCompanyProfile = await profileModel.findByIdAndUpdate(
      id,
      { Name, Industry, FoundedDate, Headquarters, Description, Website, Email },
      { new: true }
    );

    if (!updatedCompanyProfile) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    res.status(200).json({
      message: "Company profile updated successfully",
      companyProfile: updatedCompanyProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating company profile", error });
  }
};

const deleteCompanyProfile = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedCompanyProfile = await profileModel.findByIdAndDelete(id);

    if (!deletedCompanyProfile) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    res.status(200).json({ message: "Company profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company profile", error });
  }
};

module.exports = {
  createCompanyProfile,
  getCompanyProfiles,
  getCompanyProfileById,
  updateCompanyProfile,
  deleteCompanyProfile,
};
