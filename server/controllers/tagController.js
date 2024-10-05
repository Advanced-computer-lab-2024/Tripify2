const TagModel = require("../models/Tag");

async function getTags(req, res) {
  try {
    const tags = await TagModel.find();
    return res.json(tags);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error fetching tags", error: e.message });
  }
}

async function getTagById(req, res) {
  try {
    const { id } = req.params;
    const tag = await TagModel.findById(id);
    return res.json(tag);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error fetching tag", error: e.message });
  }
}

async function createTag(req, res) {
  try {
    const { Tag, UserId } = req.body;

    const user = await User.findById(UserId, "_id")
    if(!user || (user._id.toString() !== req._id)) return res.status(400).json({'message': 'Unauthorized User!'})

    const tag = new TagModel({
      Tag,
    });

    await tag.save();

    return res.status(201).json({ message: "Tag created successfully", tag });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error creating tag", error: e.message });
  }
}

async function updateTag(req, res) {
  try {
    const { id } = req.params;

    const updatedTag = await TagModel.findById(id)

    if(!updatedTag || (updatedTag.UserId.toString() !== req._id.toString())) return res.status(400).json({'message': 'Unauthorized Seller!'})

    const updateTag = await TagModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res.json(updateTag);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error updating tag", error: e.message });
  }
}

async function deleteTag(req, res) {
  try {
    const { id } = req.params;

    const deletedTag = await TagModel.findById(id)

    if(!deletedTag || (deletedTag.UserId.toString() !== req._id.toString())) return res.status(400).json({'message': 'Unauthorized Seller!'})

    const tag = await TagModel.findByIdAndDelete(id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res.json({ message: "Tag deleted successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error deleting tag", error: e.message });
  }
}

module.exports = { getTags, getTagById, createTag, updateTag, deleteTag };
