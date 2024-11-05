const profileModel = require("../models/CompanyProfile.js");
const advertiserModel = require("../models/Advertiser.js");

const createCompanyProfile = async (req, res) => {
  const {
    Name,
    Industry,
    FoundedDate,
    Headquarters,
    Description,
    Website,
    Email,
    AdvertiserId,
  } = req.body;

  console.log("AdvertiserId", AdvertiserId);

  const advertiser = await advertiserModel.findById(AdvertiserId, "UserId");
  if (!advertiser || advertiser.UserId.toString() !== req._id)
    return res.status(400).json({ message: "Unauthorized Advertiser!" });

  try {
    console.log({ Name, Industry, Description });
    // required
    if (!Name || !Industry || !Description) {
      return res
        .status(400)
        .json({ message: "Name, Industry, and Description are required!" });
    }

    // duplicates
    const duplicateCompanyName = await profileModel.findOne({ Name });
    const duplicateCompanyWebsite = await profileModel.findOne({ Website });
    if (duplicateCompanyName) {
      return res.status(400).json({ message: "Company Name already exists!" });
    }
    if (duplicateCompanyWebsite) {
      return res
        .status(400)
        .json({ message: "Company Website already exists!" });
    }
    let parsedDate = new Date(FoundedDate);
    const newCompanyProfile = await profileModel.create({
      Name,
      Industry,
      FoundedDate: parsedDate,
      Headquarters,
      Description,
      Website,
      Email,
      AdvertiserId,
    });
    await advertiserModel.findByIdAndUpdate(
      { _id: AdvertiserId },
      { CompanyProfile: newCompanyProfile._id }
    );
    res.status(201).json({
      message: "Company profile created successfully",
      companyProfile: newCompanyProfile,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error creating company profile", error });
  }
};

const getCompanyProfiles = async (req, res) => {
  try {
    const companyProfiles = await profileModel.find();
    res.status(200).json(companyProfiles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving company profiles", error });
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
    res
      .status(500)
      .json({ message: "Error retrieving company profile", error });
  }
};

const updateCompanyProfile = async (req, res) => {
  const { id } = req.body;

  const advertiser = await advertiserModel.findOne(
    { UserId: req._id },
    "UserId"
  );

  const updatedCompanyProfile = await profileModel.findById(id);

  if (
    !updatedCompanyProfile ||
    updatedCompanyProfile.AdvertiserId.toString() !== advertiser._id.toString()
  )
    return res.status(400).json({ message: "Unauthorized Advertiser!" });

  const {
    Name,
    Industry,
    FoundedDate,
    Headquarters,
    Description,
    Website,
    Email,
  } = req.body;

  try {
    let parsedDate = new Date(FoundedDate);

    const updatedCompanyProfile = await profileModel.findByIdAndUpdate(
      id,
      {
        Name,
        Industry,
        FoundedDate: parsedDate,
        Headquarters,
        Description,
        Website,
        Email,
      },
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

  const advertiser = await advertiserModel.findOne(
    { UserId: req._id },
    "UserId"
  );

  const deletedCompanyProfile = await profileModel.findById(id);

  if (
    !deletedCompanyProfile ||
    deletedCompanyProfile.AdvertiserId.toString() !== advertiser._id.toString()
  )
    return res.status(400).json({ message: "Unauthorized Advertiser!" });

  try {
    const deletedCompanyProfile = await profileModel.findByIdAndDelete(id);

    if (!deletedCompanyProfile) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    res.status(200).json({ message: "Company profile deleted successfully" });
  } catch (error) {
    console.log("ERRRROR", error);
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
