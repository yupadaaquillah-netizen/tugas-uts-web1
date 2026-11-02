/**
 * BookStore - Logika Halaman Pemesanan (Checkout)
 * Tugas UTS Pemrograman Web 1
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Cek Sesi Login
    cekLogin(true);

    const userAktif = getPenggunaAktif();

    // 2. Referensi Elemen DOM
    const formCheckout = document.getElementById("formCheckout");
    const inputNama = document.getElementById("namaPemesan");
    const inputEmail = document.getElementById("emailPemesan");
    const inputTelepon = document.getElementById("teleponPemesan");
    const selectBuku = document.getElementById("pilihBuku");
    const inputHargaSatuan = document.getElementById("hargaSatuan");
    const inputJumlah = document.getElementById("jumlahBuku");
    const inputAlamat = document.getElementById("alamatPengiriman");
    const selectEkspedisi = document.getElementById("pilihEkspedisi");
    const selectMetode = document.getElementById("metodePembayaran");
    const displayTotal = document.getElementById("displayTotalHarga");

    // Seksi Nota Pesanan
    const seksiNota = document.getElementById("seksiNotaPesanan");
    const notaDO = document.getElementById("notaDO");
    const notaTanggal = document.getElementById("notaTanggal");
    const notaNama = document.getElementById("notaNama");
    const notaKontak = document.getElementById("notaKontak");
    const notaBuku = document.getElementById("notaBuku");
    const notaJumlah = document.getElementById("notaJumlah");
    const notaEkspedisi = document.getElementById("notaEkspedisi");
    const notaMetode = document.getElementById("notaMetode");
    const notaAlamat = document.getElementById("notaAlamat");
    const notaTotal = document.getElementById("notaTotal");
    const linkLacakNota = document.getElementById("linkLacakNota");

    // Pre-fill data pemesan jika user sedang login
    if (userAktif) {
        if (!inputNama.value) inputNama.value = userAktif.nama || "";
        if (!inputEmail.value) inputEmail.value = userAktif.email || "";
    }

    // 3. Muat Pilihan Buku dari Data Katalog
    let katalogList = getKatalogBuku();
    muatOpsiBuku();

    function muatOpsiBuku() {
        selectBuku.innerHTML = '<option value="">-- Pilih Judul Buku --</option>';
        katalogList.forEach((buku) => {
            const opt = document.createElement("option");
            opt.value = buku.id;
            opt.textContent = `${buku.judul} (${formatRupiah(buku.harga)} - Sisa Stok: ${buku.stok})`;
            if (buku.stok <= 0) {
                opt.disabled = true;
                opt.textContent += " [STOK HABIS]";
            }
            selectBuku.appendChild(opt);
        });
    }

    // ==========================================
    // 4. HITUNG TOTAL HARGA OTOMATIS
    // ==========================================
    function hitungTotal() {
        const idBuku = selectBuku.value;
        const bukuDipilih = katalogList.find((b) => b.id === idBuku);

        if (!bukuDipilih) {
            inputHargaSatuan.value = "Rp 0";
            displayTotal.textContent = "Rp 0";
            return 0;
        }

        const harga = Number(bukuDipilih.harga) || 0;
        inputHargaSatuan.value = formatRupiah(harga);

        let jumlah = parseInt(inputJumlah.value, 10);
        if (isNaN(jumlah) || jumlah < 1) {
            jumlah = 1;
            inputJumlah.value = 1;
        }

        // Peringatan jika melebihi stok yang ada
        if (jumlah > bukuDipilih.stok) {
            alert(`Peringatan: Stok buku "${bukuDipilih.judul}" hanya tersisa ${bukuDipilih.stok} unit.`);
            jumlah = bukuDipilih.stok;
            inputJumlah.value = jumlah;
        }

        const grandTotal = harga * jumlah;
        displayTotal.textContent = formatRupiah(grandTotal);
        return grandTotal;
    }

    // Event listener perubahan buku atau jumlah
    selectBuku.addEventListener("change", hitungTotal);
    inputJumlah.addEventListener("input", hitungTotal);
    inputJumlah.addEventListener("change", hitungTotal);

    // ==========================================
    // 5. SUBMIT PEMESANAN & VALIDASI
    // ==========================================
    formCheckout.addEventListener("submit", function (e) {
        e.preventDefault();

        const nama = inputNama.value.trim();
        const email = inputEmail.value.trim();
        const telepon = inputTelepon.value.trim();
        const idBuku = selectBuku.value;
        const jumlah = parseInt(inputJumlah.value, 10);
        const alamat = inputAlamat.value.trim();
        const ekspedisi = selectEkspedisi.value;
        const metode = selectMetode.value;

        // Validasi kelengkapan data
        if (!nama || !email || !telepon || !idBuku || !jumlah || !alamat || !ekspedisi || !metode) {
            alert("Harap lengkapi seluruh kolom formulir pemesanan!");
            return;
        }

        if (jumlah <= 0) {
            alert("Jumlah buku minimal adalah 1!");
            return;
        }

        const bukuDipilih = katalogList.find((b) => b.id === idBuku);
        if (!bukuDipilih) {
            alert("Silakan pilih buku yang valid dari katalog!");
            return;
        }

        if (bukuDipilih.stok < jumlah) {
            alert(`Maaf, stok tidak mencukupi! Sisa stok buku ini hanya ${bukuDipilih.stok} unit.`);
            return;
        }

        const totalHarga = bukuDipilih.harga * jumlah;

        // Buat Nomor Delivery Order (DO) unik
        // Format: DO-YYYYMMDD-XXX
        const sekarang = new Date();
        const yyyy = sekarang.getFullYear();
        const mm = String(sekarang.getMonth() + 1).padStart(2, "0");
        const dd = String(sekarang.getDate()).padStart(2, "0");
        const randomDigits = Math.floor(100 + Math.random() * 900); // 3 digit acak
        const noDO = `DO-${yyyy}${mm}${dd}-${randomDigits}`;

        const tanggalStr = sekarang.toISOString().split("T")[0];

        // Buat objek pesanan
        const pesananBaru = {
            noDO: noDO,
            namaPemesan: nama,
            email: email,
            telepon: telepon,
            idBuku: bukuDipilih.id,
            judulBuku: bukuDipilih.judul,
            jumlah: jumlah,
            totalHarga: totalHarga,
            alamat: alamat,
            metodePembayaran: metode,
            ekspedisi: ekspedisi,
            jenisPaket: "Reguler",
            tanggal: tanggalStr,
            status: "Pesanan Diterima" // Status default awal
        };

        // 1. Simpan pesanan ke localStorage
        simpanPesananBaru(pesananBaru);

        // 2. Kurangi stok buku di katalog dan simpan pembaruan ke localStorage
        bukuDipilih.stok -= jumlah;
        simpanKatalogBuku(katalogList);
        muatOpsiBuku(); // Refresh tampilan dropdown

        // 3. Tampilkan alert konfirmasi
        alert(`Pesanan berhasil dibuat!\nNomor Delivery Order (DO) Anda: ${noDO}\nSimpan nomor DO ini untuk melacak status pesanan Anda.`);

        // 4. Tampilkan informasi pesanan (nota/struk) pada halaman
        notaDO.textContent = noDO;
        notaTanggal.textContent = sekarang.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
        notaNama.textContent = nama;
        notaKontak.textContent = `${email} / ${telepon}`;
        notaBuku.textContent = `${bukuDipilih.judul} (${formatRupiah(bukuDipilih.harga)})`;
        notaJumlah.textContent = `${jumlah} Eksemplar`;
        notaEkspedisi.textContent = ekspedisi;
        notaMetode.textContent = metode;
        notaAlamat.textContent = alamat;
        notaTotal.textContent = formatRupiah(totalHarga);

        // Hubungkan tombol lacak ke halaman tracking dengan parameter DO
        linkLacakNota.href = `tracking.html?do=${encodeURIComponent(noDO)}`;

        seksiNota.style.display = "block";
        seksiNota.scrollIntoView({ behavior: "smooth" });

        // Reset form pemesanan
        formCheckout.reset();
        if (userAktif) {
            inputNama.value = userAktif.nama || "";
            inputEmail.value = userAktif.email || "";
        }
        inputHargaSatuan.value = "Rp 0";
        displayTotal.textContent = "Rp 0";
    });

    // Reset tombol
    const btnResetOrder = document.getElementById("btnResetOrder");
    if (btnResetOrder) {
        btnResetOrder.addEventListener("click", function () {
            inputHargaSatuan.value = "Rp 0";
            displayTotal.textContent = "Rp 0";
        });
    }

    // Logout
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", logout);
    }
});

