const express = require("express");
const { body } = require("express-validator");

const { authenticateToken } = require("../middleware/authenticateToken");

// Simpan refresh token dalam database sementara (bisa diganti dengan DB asli)
let refreshTokens = [];

// ROUTER
const router = express.Router();

// Endpoint login untuk mendapatkan akses token dan refresh token
router.post('/auth/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username diperlukan' });

  const user = { username };
  const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: '15m' });
  const refreshToken = jwt.sign(user, REFRESH_SECRET_KEY, { expiresIn: '7d' });
  refreshTokens.push(refreshToken);

  res.json({ access_token: accessToken, refresh_token: refreshToken });
});

// Endpoint untuk refresh token
router.post('/auth/refresh', (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token || !refreshTokens.includes(refresh_token)) {
    return res.sendStatus(403);
  }

  jwt.verify(refresh_token, REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '15m' });
    res.json({ access_token: accessToken });
  });
});

// Logout (hapus refresh token)
router.post('/auth/logout', (req, res) => {
  const { refresh_token } = req.body;
  refreshTokens = refreshTokens.filter(token => token !== refresh_token);
  res.sendStatus(204);
});

router.get("/Menu", authenticateToken, (req, res) => {
    res.status(200).json([{
      name: 'MENU',
      menuItems: [
        {
          icon: ['fas', 'house'],
          label: 'Beranda',
          route: '/beranda',
        },
        {
          icon: ['fas', 'fa-exchange'],
          label: 'Transaksi',
          route: '#',
          children: [
            { label: 'Transaksi Tiket', route: '/pages/settings' },
            { label: 'Transaksi Paket', route: '/pages/settings' },
            { label: 'Transaksi Umum', route: '/pages/settings' },
            { label: 'Transaksi Rekapitulasi', route: '/pages/settings' },
          ],
        },
        {
          icon: ['fas', 'fa-box-open'],
          label: 'Paket & Paket LA',
          route: '#',
          children: [
            { label: 'Daftar Paket', route: '/pages/settings' },
            { label: 'Daftar Paket LA', route: '/pages/settings' },
          ],
        },
        {
          icon: ['fas', 'fa-users'],
          label: 'Keagenan & Jamaah',
          route: '#',
          children: [
            { label: 'Daftar Member', route: '/pages/settings' },
            { label: 'Deposit & Tabungan', route: '/pages/settings' },
            { label: 'Daftar Jamaah', route: '/pages/settings' },
          ],
        },
        {
          icon: ['fas', 'house-crack'],
          label: 'Publish',
          route: '#',
          children: [
            { label: 'Pengaturan', route: '/pages/settings' },
            { label: 'Cabang', route: '/pages/settings' },
            { label: 'Pengguna', route: '/pages/settings' },
            { label: 'Grup Pengguna', route: '/pages/settings' },
          ],
        },
        {
          icon: ['fas', 'house-crack'],
          label: 'Master Data',
          route: '#',
          children: [
            { label: 'Pengaturan', route: '/pages/settings' },
            { label: 'Cabang', route: '/pages/settings' },
            { label: 'Pengguna', route: '/pages/settings' },
            { label: 'Grup Pengguna', route: '/pages/settings' },
          ],
        },
        {
          icon: ['fas', 'house-crack'],
          label: 'Laporan',
          route: '#',
          children: [
            { label: 'Pengaturan', route: '/pages/settings' },
            { label: 'Cabang', route: '/pages/settings' },
            { label: 'Pengguna', route: '/pages/settings' },
            { label: 'Grup Pengguna', route: '/pages/settings' },
          ],
        },
        {
          icon: ['fas', 'house-crack'],
          label: 'Pengaturan Umum',
          route: '#',
          children: [
            { label: 'Pengaturan', route: '/pages/settings' },
            { label: 'Cabang', route: '/pages/settings' },
            { label: 'Pengguna', route: '/pages/settings' },
            { label: 'Grup Pengguna', route: '/pages/settings' },
          ],
        },
      ],
    }]);
    }
  );


module.exports = router;