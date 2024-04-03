const express = require('express');
const router = express.Router();
const Model_users = require('../model/model_users');

// Middleware untuk memeriksa apakah pengguna sudah login
const checkAuth = (req, res, next) => {
    if (!req.session.user_id) {
        req.flash('error', 'Anda harus login terlebih dahulu');
        res.redirect('/login');
    } else {
        next();
    }
};

// Rute untuk halaman profil pengguna
router.get('/profile', checkAuth, async (req, res) => {
    try {
        // Ambil data pengguna dari database berdasarkan ID pengguna yang tersimpan di sesi
        let userData = await Model_users.getById(req.session.user_id);
        if (userData.length > 0) {
            res.render('profile', { userData: userData[0] });
        } else {
            req.flash('error', 'Data pengguna tidak ditemukan');
            res.redirect('/login');
        }
    } catch (err) {
        req.flash('error', 'Error pada fungsi');
        res.redirect('/login');
    }
});

// Rute untuk melakukan tindakan tertentu yang memerlukan autentikasi pengguna
router.post('/action', checkAuth, async (req, res) => {
    // Proses tindakan tertentu yang memerlukan autentikasi pengguna
    res.send('Tindakan berhasil dilakukan');
});

module.exports = router;
