const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const ModelProduk = require("../model/model_produk");
const Model_users = require("../model/model_users");

router.use(async function (req, res, next) {
  try {
    if (req.session.userId) {
      // Pastikan sesi userId ada sebelum mencoba mendapatkan data pengguna
      let userData = await Model_users.getId(req.session.userId);
      if (userData.length > 0 && userData[0].role === "admin") {
        let userEmail = userData[0].email; // Perbaikan: Ambil email dari userData[0].email
        req.userEmail = userEmail;
        return next(); // Panggil next() untuk melanjutkan penanganan permintaan
      } else {
        return res.redirect("/logout");
      }
    } else {
      return res.redirect("/logout");
    }
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    return res.redirect("/logout");
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/upload");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route untuk menampilkan semua produk
router.get("/", async (req, res) => {
  try {
    let userEmail = req.userEmail; // Ambil email dari sesi
    const rows = await ModelProduk.getAll();
    res.render("produk/index", { data: rows, userEmail: userEmail });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route untuk menampilkan form pembuatan produk
router.get("/create", (req, res) => {
  res.render("produk/create");
});

// Route untuk menangani pengiriman formulir pembuatan produk
router.post("/create", upload.single("gambar"), async (req, res) => {
  let {
    nama_produk,
    deskripsi,
    harga,
    kuota,
    tanggal_keberangkatan,
    tanggal_kembali,
  } = req.body;

  let data = {
    nama_produk: nama_produk,
    deskripsi: deskripsi,
    harga: harga,
    kuota: kuota,
    tanggal_keberangkatan: tanggal_keberangkatan,
    tanggal_kembali: tanggal_kembali,
    gambar: req.file.filename,
  };
  try {
    await ModelProduk.create(data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/produk");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await ModelProduk.getById(id);
    res.render("produk/edit", {
      id: rows.produk_id,
      nama_produk: rows.nama_produk,
      deskripsi: rows.deskripsi,
      harga: rows.harga,
      kuota: rows.kuota,
      tanggal_keberangkatan: rows.tanggal_keberangkatan,
      tanggal_kembali: rows.tanggal_kembali,
      gambar: rows.gambar,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan pada server");
  }
});

// Route untuk menangani permintaan edit produk
router.post("/edit/:id", upload.single("gambar"), async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await ModelProduk.getById(id);
    const filebaru = req.file ? req.file.filename : null;
    const namaFileLama = rows.gambar;
    if (filebaru && namaFileLama) {
      const pathFileLama = path.join(
        __dirname,
        "../public/images/upload",
        namaFileLama
      );
      fs.unlinkSync(pathFileLama);
    }
    let {
      nama_produk,
      deskripsi,
      harga,
      kuota,
      tanggal_keberangkatan,
      tanggal_kembali,
    } = req.body;
    let gambar = filebaru || namaFileLama;
    let data = {
      nama_produk: nama_produk,
      deskripsi: deskripsi,
      harga: harga,
      kuota: kuota,
      tanggal_keberangkatan: tanggal_keberangkatan,
      tanggal_kembali: tanggal_kembali,
      gambar: gambar,
    };
    await ModelProduk.update(id, data);
    res.redirect("/produk");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route untuk menampilkan detail produk berdasarkan ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ModelProduk.getById(id);
    if (!product) {
      res.status(404).json({ message: "Produk tidak ditemukan" });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route untuk menghapus produk berdasarkan ID
router.get("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    await ModelProduk.delete(id);
    req.flash("success", "Berhasil menghapus data");
    res.redirect("/produk");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
