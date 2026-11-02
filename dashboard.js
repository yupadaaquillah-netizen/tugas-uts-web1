/**
 * BookStore - Logika Halaman Dashboard
 * Tugas UTS Pemrograman Web 1
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Cek Autentikasi Pengguna
    cekLogin(true);

    const userAktif = getPenggunaAktif();

    // 2. Tampilkan Greeting Berdasarkan Waktu Lokal
    tampilkanGreeting(userAktif);

    // 3. Tampilkan Data Statistik Ringkasan
    muatDataStatistik();

    // 4. Muat Laporan Pemesanan & History Transaksi
    muatLaporanDanHistory();

    // 5. Event Listener Logout
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", function () {
            logout();
        });
    }
});

// Fungsi Menghitung Greeting Waktu Lokal
function tampilkanGreeting(user) {
    const greetingText = document.getElementById("greetingText");
    const greetingSubText = document.getElementById("greetingSubText");
    if (!greetingText) return;

    const sekarang = new Date();
    const jam = sekarang.getHours();
    let ucapan = "Selamat Datang";

    if (jam >= 4 && jam < 11) {
        ucapan = "Selamat Pagi";
    } else if (jam >= 11 && jam < 15) {
        ucapan = "Selamat Siang";
    } else if (jam >= 15 && jam < 18) {
        ucapan = "Selamat Sore";
    } else {
        ucapan = "Selamat Malam";
    }

    const namaUser = user ? user.nama : "Pengguna";
    greetingText.textContent = `${ucapan}, ${namaUser}!`;
    greetingSubText.textContent = `Senang melihat Anda kembali di sistem BookStore. Waktu saat ini: ${sekarang.toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
}

// Fungsi Menghitung Ringkasan Data Statistik
function muatDataStatistik() {
    const katalog = getKatalogBuku();
    const daftarPesanan = getDaftarPesanan();

    const totalJudul = katalog.length;
    const totalStok = katalog.reduce((acc, curr) => acc + (Number(curr.stok) || 0), 0);
    const totalPesanan = daftarPesanan.length;
    const totalPendapatan = daftarPesanan.reduce((acc, curr) => acc + (Number(curr.totalHarga) || 0), 0);

    const elTotalJudul = document.getElementById("statTotalJudul");
    const elTotalStok = document.getElementById("statTotalStok");
    const elTotalPesanan = document.getElementById("statTotalPesanan");
    const elTotalPendapatan = document.getElementById("statTotalPendapatan");

    if (elTotalJudul) elTotalJudul.textContent = totalJudul + " Judul";
    if (elTotalStok) elTotalStok.textContent = totalStok.toLocaleString("id-ID") + " Eks";
    if (elTotalPesanan) elTotalPesanan.textContent = totalPesanan + " Pesanan";
    if (elTotalPendapatan) elTotalPendapatan.textContent = formatRupiah(totalPendapatan);
}

// Fungsi Menampilkan Laporan Pemesanan & History Transaksi
function muatLaporanDanHistory() {
    const daftarPesanan = getDaftarPesanan();

    // Hitung status pesanan
    let jmlDiterima = 0;
    let jmlDikemas = 0;
    let jmlPengiriman = 0;
    let jmlTerkirim = 0;

    daftarPesanan.forEach((p) => {
        const s = (p.status || "").toLowerCase();
        if (s.includes("terima") || s === "pesanan diterima") {
            jmlDiterima++;
        } else if (s.includes("kemas") || s === "dikemas") {
            jmlDikemas++;
        } else if (s.includes("kirim") && !s.includes("terkirim")) {
            jmlPengiriman++;
        } else if (s.includes("terkirim") || s.includes("selesai")) {
            jmlTerkirim++;
        } else {
            jmlDiterima++;
        }
    });

    const elDiterima = document.getElementById("statusDiterima");
    const elDikemas = document.getElementById("statusDikemas");
    const elPengiriman = document.getElementById("statusPengiriman");
    const elTerkirim = document.getElementById("statusTerkirim");

    if (elDiterima) elDiterima.textContent = jmlDiterima;
    if (elDikemas) elDikemas.textContent = jmlDikemas;
    if (elPengiriman) elPengiriman.textContent = jmlPengiriman;
    if (elTerkirim) elTerkirim.textContent = jmlTerkirim;

    // Render Tabel History Transaksi
    const tabelBody = document.getElementById("tabelHistoryBody");
    if (!tabelBody) return;

    tabelBody.innerHTML = "";

    if (daftarPesanan.length === 0) {
        tabelBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #64748b;">Belum ada data transaksi yang tercatat.</td></tr>`;
        return;
    }

    daftarPesanan.forEach((order, index) => {
        const tr = document.createElement("tr");

        let badgeClass = "badge-info";
        if (order.status === "Terkirim") badgeClass = "badge-success";
        else if (order.status === "Dikemas") badgeClass = "badge-warning";
        else if (order.status === "Dalam Pengiriman") badgeClass = "badge-primary";

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong><a href="tracking.html?do=${encodeURIComponent(order.noDO)}" title="Lacak DO Ini" style="color: #1a56db; text-decoration: underline;">${order.noDO}</a></strong></td>
            <td>${order.tanggal || "-"}</td>
            <td>${order.namaPemesan}</td>
            <td>${order.judulBuku}</td>
            <td>${order.jumlah}</td>
            <td>${formatRupiah(order.totalHarga)}</td>
            <td>${order.ekspedisi || "-"}</td>
            <td><span class="badge ${badgeClass}">${order.status}</span></td>
        `;
        tabelBody.appendChild(tr);
    });
}

