const express = require('express');
const router = express.Router();
const ModelProduk = require('../model/model_produk');

// Route untuk menampilkan semua produk
router.get('/', async (req, res) => {
    try {
        const products = await ModelProduk.getAll();
        res.render('produk/index', { products });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk menampilkan form pembuatan produk
router.get('/create', (req, res) => {
    res.render('produk/create');
});

// Route untuk menangani pengiriman formulir pembuatan produk
router.post('/create', async (req, res) => {
    const data = req.body;
    try {
        await ModelProduk.create(data);
        res.redirect('/produk');
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk menampilkan halaman edit produk berdasarkan ID
router.get('/:id/edit', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ModelProduk.getById(id);
        if (!product) {
            res.status(404).json({ message: 'Produk tidak ditemukan' });
        } else {
            res.render('produk/edit', { product });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk menangani permintaan edit produk
router.post('/:id/edit', async (req, res) => {
    const { id } = req.params;
    const newData = {
        nama_produk: req.body.nama_produk,
        deskripsi: req.body.deskripsi,
        harga: req.body.harga,
        kuota: req.body.kuota,
        tanggal_keberangkatan: req.body.tanggal_keberangkatan,
        tanggal_kembali: req.body.tanggal_kembali
    };
    
    try {
        await ModelProduk.update(id, newData);
        res.redirect('/produk');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk menampilkan detail produk berdasarkan ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ModelProduk.getById(id);
        if (!product) {
            res.status(404).json({ message: 'Produk tidak ditemukan' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route untuk menghapus produk berdasarkan ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await ModelProduk.delete(id);
        res.json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
