/**
 * BookStore - Data Dummy & Helper Utility
 * Tugas UTS Pemrograman Web 1
 */

// 1. Konstanta Katalog Buku Awal dengan Properti Cover
const dataKatalogBuku = [
    {
        id: "BK001",
        judul: "Pengantar Komunikasi",
        penulis: "Prof. Deddy Mulyana, Ph.D.",
        harga: 85000,
        stok: 15,
        cover: "assets/pengantar_komunikasi.jpg"
    },
    {
        id: "BK002",
        judul: "Kepemimpinan",
        penulis: "Prof. Dr. Wahyudi, M.Pd.",
        harga: 75000,
        stok: 20,
        cover: "assets/kepemimpinan.jpg"
    },
    {
        id: "BK003",
        judul: "Manajemen Keuangan",
        penulis: "Dr. Suad Husnan, M.B.A.",
        harga: 95000,
        stok: 12,
        cover: "assets/manajemen_keuangan.jpg"
    },
    {
        id: "BK004",
        judul: "Mikrobiologi",
        penulis: "Dra. Pratiwi, M.Si.",
        harga: 98000,
        stok: 25,
        cover: "assets/mikrobiologi.jpg"
    },
    {
        id: "BK005",
        judul: "PAUD Perkembangan",
        penulis: "Prof. Anita Yus, M.Pd.",
        harga: 78000,
        stok: 18,
        cover: "assets/paud_perkembangan.jpg"
    },
    {
        id: "BK006",
        judul: "Pemrograman Web Dasar (HTML, CSS, JavaScript)",
        penulis: "Budi Raharjo",
        harga: 85000,
        stok: 15,
        cover: ""
    },
    {
        id: "BK007",
        judul: "Laskar Pelangi",
        penulis: "Andrea Hirata",
        harga: 75000,
        stok: 20,
        cover: ""
    },
    {
        id: "BK008",
        judul: "Algoritma dan Struktur Data dengan C++",
        penulis: "Rosa A. S.",
        harga: 95000,
        stok: 12,
        cover: ""
    },
    {
        id: "BK009",
        judul: "Filosofi Teras",
        penulis: "Henry Manampiring",
        harga: 98000,
        stok: 25,
        cover: ""
    },
    {
        id: "BK010",
        judul: "Sistem Basis Data Relasional",
        penulis: "Fathansyah",
        harga: 110000,
        stok: 10,
        cover: ""
    },
    {
        id: "BK011",
        judul: "Bumi Manusia",
        penulis: "Pramoedya Ananta Toer",
        harga: 125000,
        stok: 8,
        cover: ""
    },
    {
        id: "BK012",
        judul: "Dasar Logika Pemrograman Komputer",
        penulis: "Abdul Kadir",
        harga: 80000,
        stok: 18,
        cover: ""
    },
    {
        id: "BK013",
        judul: "Negeri 5 Menara",
        penulis: "A. Fuadi",
        harga: 70000,
        stok: 14,
        cover: ""
    }
];

// 2. Data Dummy Pengguna (Akun Login)
const dataPengguna = [
    {
        nama: "Administrator",
        email: "admin@bookstore.com",
        password: "admin123"
    },
    {
        nama: "Mahasiswa Web 1",
        email: "mahasiswa@bookstore.com",
        password: "uts123"
    },
    {
        nama: "Budi Santoso",
        email: "budi@gmail.com",
        password: "budi123"
    }
];

// 3. Data Dummy Pesanan & Tracking (Initial DO)
const dataPesananAwal = [
    {
        noDO: "DO-20261101-001",
        namaPemesan: "Ahmad Fauzi",
        email: "ahmad@gmail.com",
        telepon: "081234567890",
        idBuku: "BK001",
        judulBuku: "Pengantar Komunikasi",
        jumlah: 2,
        totalHarga: 170000,
        alamat: "Jl. Merdeka No. 45, Gambir, Jakarta Pusat",
        metodePembayaran: "Transfer Bank BCA",
        ekspedisi: "JNE Express",
        jenisPaket: "Reguler (2-3 Hari)",
        tanggal: "2026-11-01",
        status: "Dalam Pengiriman"
    },
    {
        noDO: "DO-20261101-002",
        namaPemesan: "Siti Rahmawati",
        email: "siti@gmail.com",
        telepon: "085712345678",
        idBuku: "BK004",
        judulBuku: "Mikrobiologi",
        jumlah: 1,
        totalHarga: 98000,
        alamat: "Jl. Gejayan Gg. Flamboyan No. 12, Sleman, DI Yogyakarta",
        metodePembayaran: "QRIS / E-Wallet",
        ekspedisi: "SiCepat Express",
        jenisPaket: "Best (1 Hari Sampai)",
        tanggal: "2026-11-01",
        status: "Terkirim"
    },
    {
        noDO: "DO-20261102-003",
        namaPemesan: "Rian Pratama",
        email: "rian@gmail.com",
        telepon: "081987654321",
        idBuku: "BK002",
        judulBuku: "Kepemimpinan",
        jumlah: 1,
        totalHarga: 75000,
        alamat: "Jl. Diponegoro No. 8, Citarum, Bandung",
        metodePembayaran: "COD (Bayar di Tempat)",
        ekspedisi: "J&T Express",
        jenisPaket: "Reguler",
        tanggal: "2026-11-02",
        status: "Dikemas"
    }
];

// ==========================================
// FUNGSI HELPER LOCALSTORAGE & UTILITAS
// ==========================================

// Inisialisasi & Sinkronisasi Katalog Buku di LocalStorage
function getKatalogBuku() {
    const stored = localStorage.getItem("bookstore_katalog");
    if (!stored) {
        localStorage.setItem("bookstore_katalog", JSON.stringify(dataKatalogBuku));
        return dataKatalogBuku;
    }
    try {
        let parsed = JSON.parse(stored);
        let updated = false;

        // 1. Sesuaikan path properti cover dari "img/" menjadi "assets/"
        parsed.forEach((item) => {
            if (item.cover && item.cover.startsWith("img/")) {
                item.cover = item.cover.replace(/^img\//, "assets/");
                updated = true;
            }
        });

        // 2. Sinkronisasikan jika ada buku awal yang belum tersimpan atau belum ada properti cover
        dataKatalogBuku.forEach((bukuAwal) => {
            const index = parsed.findIndex(
                (p) => p.id === bukuAwal.id || p.judul.toLowerCase() === bukuAwal.judul.toLowerCase()
            );
            if (index === -1) {
                parsed.push(bukuAwal);
                updated = true;
            } else if (!parsed[index].cover && bukuAwal.cover) {
                parsed[index].cover = bukuAwal.cover;
                updated = true;
            }
        });

        if (updated) {
            localStorage.setItem("bookstore_katalog", JSON.stringify(parsed));
        }
        return parsed;
    } catch (e) {
        return dataKatalogBuku;
    }
}

function simpanKatalogBuku(katalogArray) {
    localStorage.setItem("bookstore_katalog", JSON.stringify(katalogArray));
}

// Inisialisasi Daftar Pengguna di LocalStorage
function getDaftarPengguna() {
    const stored = localStorage.getItem("bookstore_users");
    if (!stored) {
        localStorage.setItem("bookstore_users", JSON.stringify(dataPengguna));
        return dataPengguna;
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        return dataPengguna;
    }
}

function simpanPenggunaBaru(user) {
    const users = getDaftarPengguna();
    users.push(user);
    localStorage.setItem("bookstore_users", JSON.stringify(users));
}

// Inisialisasi Daftar Pesanan di LocalStorage
function getDaftarPesanan() {
    const stored = localStorage.getItem("bookstore_pesanan");
    if (!stored) {
        localStorage.setItem("bookstore_pesanan", JSON.stringify(dataPesananAwal));
        return dataPesananAwal;
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        return dataPesananAwal;
    }
}

function simpanPesananBaru(pesanan) {
    const daftarPesanan = getDaftarPesanan();
    daftarPesanan.unshift(pesanan); // Tambah di urutan teratas
    localStorage.setItem("bookstore_pesanan", JSON.stringify(daftarPesanan));
}

// Format Angka ke Rupiah
function formatRupiah(angka) {
    const number = Number(angka) || 0;
    return "Rp " + number.toLocaleString("id-ID");
}

// Manajemen Sesi Pengguna
function getPenggunaAktif() {
    const user = localStorage.getItem("bookstore_currentUser");
    if (user) {
        try {
            return JSON.parse(user);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function setPenggunaAktif(user) {
    localStorage.setItem("bookstore_currentUser", JSON.stringify(user));
}

function cekLogin(harusLogin = true) {
    const user = getPenggunaAktif();
    if (harusLogin && !user) {
        alert("Silakan login terlebih dahulu untuk mengakses halaman ini.");
        window.location.href = "login.html";
    }
}

function logout() {
    if (confirm("Apakah Anda yakin ingin logout?")) {
        localStorage.removeItem("bookstore_currentUser");
        window.location.href = "login.html";
    }
}

// Inisialisasi data awal ke localStorage saat script data.js dimuat
(function initStorage() {
    // Jalankan getKatalogBuku untuk memastikan sinkronisasi path cover img/ -> assets/
    getKatalogBuku();
    if (!localStorage.getItem("bookstore_users")) {
        localStorage.setItem("bookstore_users", JSON.stringify(dataPengguna));
    }
    if (!localStorage.getItem("bookstore_pesanan")) {
        localStorage.setItem("bookstore_pesanan", JSON.stringify(dataPesananAwal));
    }
})();
