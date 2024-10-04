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
    const { Tag } = req.body;

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

    const updatedTag = await TagModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res.json(updatedTag);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error updating tag", error: e.message });
  }
}

async function deleteTag(req, res) {
  try {
    const { id } = req.params;
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
