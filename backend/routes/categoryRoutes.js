const express = require('express');

const Category = require('../models/Category');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// need login to access
router.use(authMiddleware);

// get all category
router.get('/', async (req, res) => {
    try {
        const category = await Category.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        return res.json({
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

// create category
router.post('/', async (req, res) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(400).json({
                message: 'Name is required'
            });
        }

        const category = await Category.create({ 
            name, 
            user: req.user._id 
        });

        return res.status(201).json({
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

// update category
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        category.name = name || category.name;

        await category.save()

        return res.json({
            message: 'Category updated successfully',
            date: category
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

// delete category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            })
        }

        await category.deleteOne();

        return res.json({
            message: 'Category deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;