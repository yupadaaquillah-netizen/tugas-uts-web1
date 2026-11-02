# Project UTS Pemrograman Web 1 - BookStore

Website toko buku online sederhana yang dibangun menggunakan **HTML, CSS, dan JavaScript Murni (Vanilla JS)** tanpa framework eksternal, library, database server, maupun backend.

---

## 📁 Struktur File Project

```text
BookStore/
├── index.html          # Redirect otomatis ke halaman login
├── login.html          # Halaman autentikasi login, modal lupa password & daftar
├── dashboard.html      # Halaman utama dengan greeting waktu lokal, ringkasan statistik, laporan & history
├── stok.html           # Informasi stok & katalog buku, tambah buku baru via DOM, pencarian
├── checkout.html       # Form pemesanan buku, hitung total harga otomatis, nota & DO
├── tracking.html       # Pelacakan pengiriman berdasarkan nomor DO dengan progress bar visual
├── css/
│   └── style.css       # Styling tema (biru, putih, abu-abu muda, responsif)
├── js/
│   ├── data.js         # Data dummy (dataKatalogBuku, dataPengguna, dataPesanan) & helper localStorage
│   ├── login.js        # Validasi login, modal lupa password & registrasi akun
│   ├── dashboard.js    # Perhitungan greeting lokal, statistik, laporan pemesanan & tabel transaksi
│   ├── stok.js         # Manipulasi DOM tabel stok, form tambah buku, pencarian realtime
│   ├── checkout.js     # Form order, dropdown katalog, kalkulasi total otomatis, pembuatan nomor DO
│   └── tracking.js     # Pelacakan pengiriman berdasar nomor DO, update 4 tahap progress bar
└── assets/             # Folder aset pendukung
```

---

## 🚀 Cara Menjalankan Website

1. Buka folder project `c:\tugas-uts-web1` (atau folder `BookStore`).
2. Klik ganda file **`login.html`** (atau `index.html`) untuk membukanya langsung di browser (Google Chrome, Microsoft Edge, Mozilla Firefox, dll.).
3. Anda juga dapat menggunakan ekstensi **Live Server** di VS Code / editor jika diinginkan.

---

## 🔑 Akun Login Dummy untuk Pengujian

| Nama Pengguna | Alamat Email | Password | Role |
|---|---|---|---|
| **Administrator** | `admin@bookstore.com` | `admin123` | Admin Toko |
| **Mahasiswa Web 1** | `mahasiswa@bookstore.com` | `uts123` | Pengguna / Mahasiswa |
| **Budi Santoso** | `budi@gmail.com` | `budi123` | Pelanggan |

> **Catatan:** Anda juga dapat mendaftarkan akun baru melalui tombol **"Daftar Akun Baru"** pada halaman login. Data akun baru akan otomatis tersimpan di `localStorage` dan dapat langsung digunakan untuk login.

---

## 📦 Nomor Delivery Order (DO) Dummy untuk Pengujian Tracking

Anda dapat langsung menguji fitur tracking dengan nomor DO dummy berikut:

1. **`DO-20261101-001`** (Status: *Dalam Pengiriman* - Progress step 3)
2. **`DO-20261101-002`** (Status: *Terkirim* - Progress step 4)
3. **`DO-20261102-003`** (Status: *Sedang Dikemas* - Progress step 2)
4. Nomor DO baru yang dibuat saat melakukan transaksi di halaman **Pemesanan Buku (Checkout)** (Status: *Pesanan Diterima* - Progress step 1).

---

## ✨ Fitur-Fitur yang Tersedia & Teruji

1. **Desain Sederhana & Responsif**
   - Menggunakan palet warna biru (#1a56db), putih (#ffffff), dan abu-abu muda (#f4f6f9).
   - Tipografi menggunakan font Arial / sans-serif yang bersih dan rapi.
   - Tombol dengan sudut sedikit membulat (border-radius 4px).
   - Tampilan responsif untuk layar laptop maupun perangkat smartphone/HP.

2. **Halaman Login (`login.html`)**
   - Validasi input email dan password.
   - Pengecekan data pengguna dummy.
   - Alert `"Email/password yang anda masukkan salah"` jika kredensial tidak sesuai.
   - Modal popup sederhana untuk **Lupa Password** dan **Pendaftaran Akun Baru**.
   - Pengalihan ke `dashboard.html` saat login sukses.

3. **Halaman Dashboard (`dashboard.html`)**
   - Greeting otomatis berdasarkan waktu lokal (Pagi, Siang, Sore, Malam) dengan nama pengguna.
   - Kartu statistik ringkasan: Total Judul Buku, Total Unit Stok, Total Pesanan, dan Total Transaksi.
   - Menu navigasi menuju 5 modul: Stok/Katalog, Pemesanan, Tracking, Laporan Pemesanan, dan History Transaksi.
   - Rekapitulasi status pesanan (Laporan Pemesanan).
   - Tabel riwayat transaksi lengkap dengan tautan lacak nomor DO langsung.
   - Tombol logout dengan konfirmasi.

4. **Halaman Stok / Katalog (`stok.html`)**
   - Memuat data dari konstanta `dataKatalogBuku` di `data.js`.
   - Menampilkan tabel katalog berisi kolom **Sampul Buku**, ID, Judul Buku, Penulis, Harga (format Rupiah), dan Stok.
   - Ukuran gambar sampul seragam **80px × 110px** dengan `object-fit: cover`.
   - Pencocokan nama file gambar pada folder `assets/` dengan judul buku secara otomatis (toleransi spasi, huruf besar/kecil, tanda baca, dan ekstensi file).
   - Tampilan placeholder sampul untuk buku yang belum memiliki file gambar.
   - Panel status pemetaan gambar menampilkan daftar buku dan gambar yang belum dicocokkan.
   - Formulir penambahan buku baru dengan validasi tidak boleh kosong dan ID unik.
   - Penambahan baris tabel baru menggunakan manipulasi DOM (`createElement`, `appendChild`).
   - Notifikasi `alert("Buku berhasil ditambahkan ke katalog!")`.
   - Fitur pencarian buku sederhana (filter judul, penulis, dan ID secara realtime).

5. **Halaman Checkout / Pemesanan (`checkout.html`)**
   - Form data pemesan: nama, email, nomor telepon, alamat, jasa ekspedisi, dan metode pembayaran.
   - Dropdown pilihan buku yang terisi otomatis dari katalog buku.
   - Kalkulasi otomatis total harga (Harga Satuan x Jumlah).
   - Pengurangan stok buku secara otomatis ketika pesanan dibuat.
   - Pembuatan nomor Delivery Order (DO) unik.
   - Penyimpanan data pesanan ke `localStorage`.
   - Tampilan nota/bukti pesanan lengkap dengan tombol cetak dan tombol lacak pesanan.

6. **Halaman Tracking Pengiriman (`tracking.html`)**
   - Input nomor Delivery Order (DO) dan tombol lacak.
   - Menampilkan rincian: nama pemesan, nomor DO, ekspedisi, tanggal pengiriman, jenis paket, rincian buku, alamat, total bayar, dan status pengiriman.
   - Progress bar visual 4 tahap: Pesanan Diterima → Sedang Dikemas → Dalam Pengiriman → Pesanan Terkirim.
   - Notifikasi alert jika nomor DO tidak ditemukan dalam sistem.
   - Mendukung pencarian langsung via parameter URL (`?do=...`) dari halaman checkout maupun dashboard.

