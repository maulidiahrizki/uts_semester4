const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Model_users = require('../model/model_users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.post('/saveusers', async (req, res) => {
  let { email, password, role, nama_lengkap, nomor_telepon, username } = req.body;
  let enkripsi = await bcrypt.hash(password, 10);
  let Data = {
      email,
      password: enkripsi,
      role,
      nama_lengkap,
      nomor_telepon,
      username
  };
  try {
      await Model_users.Store(Data); // Menyimpan data pengguna ke database
      req.flash('success', 'Registrasi berhasil');
      res.redirect('/login');
  } catch (error) {
      req.flash('error', 'Gagal menyimpan data pengguna');
      res.redirect('/register');
  }
});


router.post('/log', async (req, res) => {
    let { email, password } = req.body;
    try {
        let userData = await Model_users.Login(email); // Mencari data pengguna berdasarkan email
        if (userData.length > 0) {
            let encryptedPassword = userData[0].password;
            let passwordMatch = await bcrypt.compare(password, encryptedPassword);
            if (passwordMatch) {
                req.session.user_id = userData[0].user_id;
                req.flash('success', 'Login berhasil');
                
                // Penambahan logika pengalihan berdasarkan peran (role)
                if (userData[0].role === 'admin') {
                    res.redirect('/produk'); // Jika admin, arahkan ke /produk
                } else {
                    res.redirect('/produks'); // Jika pengguna biasa, arahkan ke /produks
                }
            } else {
                req.flash('error', 'Email atau password salah');
                res.redirect('/login');
            }
        } else {
            req.flash('error', 'Akun tidak ditemukan');
            res.redirect('/login');
        }
    } catch (err) {
        req.flash('error', 'Error pada fungsi');
        res.redirect('/login');
    }
});


router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
      if (err) {
          console.error(err);
      } else {
          res.redirect('/login');
      }
  });
});

module.exports = router;
