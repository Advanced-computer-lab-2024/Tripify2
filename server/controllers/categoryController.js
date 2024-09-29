const Category = require('../models/Category')

async function getCategories(req, res) {
    try 
    {
        const categories = await Category.find()
        return res.json(categories)
    } 
    catch (e) 
    {
        return res.status(500).json({ message: 'Error fetching categorys', error: e.message })
    }
}

async function getCategoryById(req, res) {
    try 
    {
        const { id } = req.params
        const category = await Category.findById(id)
        return res.json(category)
    } 
    catch (e) 
    {
        return res.status(500).json({ message: 'Error fetching category', error: e.message })
    }
}

async function createCategory(req, res) {
    try 
    {
        const { Category } = req.body

        const category = new Category({ 
            Category
        })

        await category.save()

        return res.status(201).json({ message: 'Category created successfully', category })
    } 
    catch (e) 
    {
        return res.status(500).json({ message: 'Error creating category', error: e.message })
    }
}

async function updateCategory(req, res) {
    try 
    {
        const { id } = req.params

        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { 
            new: true, 
            runValidators: true 
        })

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' })
        }

        return res.json(updatedCategory)
    } 
    catch (e) 
    {
        return res.status(500).json({ message: 'Error updating category', error: e.message })
    }
}

async function deleteCategory(req, res) {
    try 
    {
        const { id } = req.params
        const category = await Category.findByIdAndDelete(id)

        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }

        return res.json({ message: 'Category deleted successfully' })
    } 
    catch (e) 
    {
        return res.status(500).json({ message: 'Error deleting category', error: e.message })
    }
}

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory }