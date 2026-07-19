const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product')

const router = express.Router();

// need login to access
router.use(authMiddleware);

// transaction logic
router.post("/", async (req, res) => {
    try {
        const { user, products } = req.body;

        // check from front end
        if (!user || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: 'Products ir required'
            });
        };

        let totalPrice = 0;
        const processedProducts = [];

        // looping for products transaction
        for (const item of products) {
            const dbProduct = await Product.findById(item.product);
            
            // check product
            if (!dbProduct) {
                return res.status(404).json({
                    message: "Product with id ${item.product} not found"
                });
            }
            
            // check stock
            if (dbProduct.stock !== -1 && dbProduct.stock < item.quantity) {
                return res.status(400).json({
                    message: "Stock product ${dbProduct.name} not enough"
                });
            }

            const qty = item.quantity || 1

            // math operation
            const itemSubTotal = dbProduct.price * qty;
            totalPrice += itemSubTotal;

            // cut product stock
            if (dbProduct.stock !== -1) {
                dbProduct.stock -= item.quantity;
                await dbProduct.save();
            }

            processedProducts.push({
                product: dbProduct._id,
                productName: dbProduct.productName,
                quantity: item.quantity,
                price: dbProduct.price 
            });
        }

        const newTransaction = new Transaction({
            user,
            products: processedProducts,
            totalPrice
        });

        // save
        await newTransaction.save()

        res.status(201).json({
            message: "Transaction successfully",
            data: newTransaction
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

// gett all transactions
router.get("/getall", async (req, res) => {
    try {
        const transaction = await Transaction.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        return res.json({
            data: transaction,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
})

module.exports = router;