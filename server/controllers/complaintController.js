const Complaint = require("../models/Complaint");

async function getComplaints(req, res) {
    try 
    {
        const complaints = await Complaint.find()
                                    .populate({
                                        path: "UserId",
                                    })
                                    .populate({
                                        path: "Replies",
                                        populate: {
                                            path: "UserId",
                                        }
                                    });

        return res.status(200).json(complaints);
    } 
    catch (error) 
    {
        return res.status(500).json({ message: "Error retrieving complaints" });
    }
}

async function createComplaint(req, res) {
    const { Title, Body } = req.body;

    // await new Promise(resolve => setTimeout(resolve, 3000));

    if (!Title || !Body) return res.status(400).json({ message: "Title and Body are required" });

    try 
    {
        const complaint = await Complaint.create({ Title, Body, Status: "Pending", Replies: [], UserId: req._id });
        return res.status(201).json(complaint);
    } 
    catch (error) 
    {
        return res.status(500).json({ message: "Error creating complaint" });
    }
}

async function createReply(req, res) {
    const { id } = req.params;
    const { Reply } = req.body;

    if (!Reply) return res.status(400).json({ message: "Reply is required" });

    try 
    {
        const complaint = await Complaint.findById(id);
        if (!complaint) return res.status(404).json({ message: "Complaint not found" });
        
        const reply = await Complaint.findOneAndUpdate(
            { _id: id },
            { $push: { Replies: { UserId: req._id, Reply } } },
            { new: true }
        );
        return res.status(201).json(reply);
    } 
    catch (error) 
    {
        return res.status(500).json({ message: "Error creating reply" });
    }
}

async function updateStatus(req, res) {
    const { id } = req.params;
    const { Status } = req.body;

    // await new Promise(resolve => setTimeout(resolve, 3000));

    if (!Status) return res.status(400).json({ message: "Status is required" });

    try 
    {
        const complaint = await Complaint.findById(id);
        if (!complaint) return res.status(404).json({ message: "Complaint not found" });
        
        const updatedComplaint = await Complaint.findOneAndUpdate(
            { _id: id },
            { $set: { Status } },
            { new: true }
        );
        return res.status(200).json(updatedComplaint);
    } 
    catch (error) 
    {
        return res.status(500).json({ message: "Error updating status" });
    }
}

module.exports = {
    getComplaints,
    createComplaint,
    createReply,
    updateStatus,    
}