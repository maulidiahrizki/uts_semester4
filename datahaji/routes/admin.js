const express = require('express');
const router = express.Router();
const Model_produk = require('../model/model_produk');

// Route untuk halaman dashboard admin
router.get('/dashboard', async (req, res) => {
    try {
        const products = await Model_produk.getAll();
        res.render('admin/dashboard', { 
            user: req.user, // Data pengguna dari sesi atau autentikasi
            products: products // Data produk untuk ditampilkan di halaman dashboard
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
