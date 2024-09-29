const advertiserModel = require('../models/Advertiser.js'); 

const createAdvertiser = async (req, res) => {
    const { UserId, Website, Hotline, Profile, Accepted } = req.body;

    try {
        const newAdvertiser = await new advertiserModel({ UserId, Website, Hotline, Profile, Accepted });
        await newAdvertiser.save();
        res.status(201).json({ message: 'Advertiser created successfully', advertiser: newAdvertiser });
    } catch (error) {
        res.status(400).json({ message: 'Error creating advertiser', error });
    }
}

const getAdvertisers = async (req, res) => {
    try {
        const advertisers = await advertiserModel.find(); 
        res.status(200).json(advertisers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving advertisers', error });
    }
}

const getAdvertiserById = async (req, res) => {
    const {id} = req.params;
    //const { Username, Email, Password, Website, Hotline, Profile, Accepted } = req.body;

    try {
        const findAdvertiser = await advertiserModel.findById(id);
        
        if (!findAdvertiser) {
            return res.json({ message: 'Advertiser not found' });
        }

        res.status(200).json({ message: 'Advertiser found', advertiser: findAdvertiser });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving advertiser', error });
    }
}

const updateAdvertiser = async (req, res) => {
    const { id } = req.body;
    const { Username, Email, Password, Website, Hotline, Profile, Accepted } = req.body;

    try {
        const updatedAdvertiser = await advertiserModel.findByIdAndUpdate(id, { Username, Email, Password, Website, Hotline, Profile, Accepted }, { new: true });
        
        if (!updatedAdvertiser) {
            return res.json({ message: 'Advertiser not found' });
        }
        
        res.status(200).json({ message: 'Advertiser updated successfully', advertiser: updatedAdvertiser });
    } catch (error) {
        res.status(400).json({ message: 'Error updating advertiser', error });
    }
}

const deleteAdvertiser = async (req, res) => {
    const { id } = req.body;

    try {
        const deletedAdvertiser = await advertiserModel.findByIdAndDelete(id);
        
        if (!deletedAdvertiser) {
            return res.json({ message: 'Advertiser not found' });
        }
        
        res.status(200).json({ message: 'Advertiser deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting advertiser', error });
    }
}

module.exports = { createAdvertiser, getAdvertisers, getAdvertiserById, updateAdvertiser, deleteAdvertiser };
