/**
 * BookStore - Logika Halaman Tracking Pengiriman
 * Tugas UTS Pemrograman Web 1
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Cek Sesi Login
    cekLogin(true);

    // 2. Referensi Elemen DOM
    const formTracking = document.getElementById("formTracking");
    const inputNoDO = document.getElementById("inputNoDO");
    const hasilTracking = document.getElementById("hasilTracking");
    const listContohDO = document.getElementById("listContohDO");

    // Elemen Tampilan Detail Tracking
    const trackDO = document.getElementById("trackDO");
    const trackNama = document.getElementById("trackNama");
    const trackEkspedisi = document.getElementById("trackEkspedisi");
    const trackTanggal = document.getElementById("trackTanggal");
    const trackJenisPaket = document.getElementById("trackJenisPaket");
    const trackBuku = document.getElementById("trackBuku");
    const trackAlamat = document.getElementById("trackAlamat");
    const trackTotal = document.getElementById("trackTotal");
    const trackStatus = document.getElementById("trackStatus");
    const badgeStatusTrack = document.getElementById("badgeStatusTrack");

    // Stepper Elements
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const step4 = document.getElementById("step4");

    // 3. Tampilkan Daftar Contoh DO untuk Pengujian
    muatDaftarContohDO();

    function muatDaftarContohDO() {
        const daftarPesanan = getDaftarPesanan();
        if (!listContohDO) return;

        if (daftarPesanan.length === 0) {
            listContohDO.innerHTML = "<em>Belum ada nomor DO yang dibuat. Buat pesanan di menu Pemesanan Buku.</em>";
            return;
        }

        // Tampilkan hingga 4 nomor DO terbaru yang bisa diklik
        const doChips = daftarPesanan.slice(0, 4).map((p) => {
            return `<a href="javascript:void(0)" class="btn-do-sample" data-do="${p.noDO}" style="color: #1a56db; text-decoration: underline; margin-right: 12px; font-weight: bold;">${p.noDO} (${p.status})</a>`;
        });

        listContohDO.innerHTML = doChips.join(" | ");

        // Tambahkan event click ke setiap nomor DO contoh
        document.querySelectorAll(".btn-do-sample").forEach((link) => {
            link.addEventListener("click", function () {
                const doVal = this.getAttribute("data-do");
                inputNoDO.value = doVal;
                lacakNomorDO(doVal);
            });
        });
    }

    // 4. Periksa Apakah Ada Parameter ?do= pada URL
    const urlParams = new URLSearchParams(window.location.search);
    const doDariURL = urlParams.get("do");
    if (doDariURL) {
        inputNoDO.value = doDariURL;
        lacakNomorDO(doDariURL);
    }

    // ==========================================
    // 5. EVENT FORM TRACKING (SUBMIT)
    // ==========================================
    formTracking.addEventListener("submit", function (e) {
        e.preventDefault();
        const noDOCari = inputNoDO.value.trim();
        if (!noDOCari) {
            alert("Harap masukkan nomor Delivery Order (DO)!");
            return;
        }
        lacakNomorDO(noDOCari);
    });

    // ==========================================
    // 6. FUNGSI PELACAKAN NOMOR DO
    // ==========================================
    function lacakNomorDO(nomorDO) {
        const daftarPesanan = getDaftarPesanan();

        // Cari pesanan berdasarkan noDO (case-insensitive)
        const pesananDitemukan = daftarPesanan.find(
            (p) => p.noDO.trim().toUpperCase() === nomorDO.trim().toUpperCase()
        );

        if (!pesananDitemukan) {
            // Sesuai instruksi soal: Jika nomor DO tidak ditemukan, tampilkan alert yang sesuai
            alert("Nomor Delivery Order (DO) '" + nomorDO + "' tidak ditemukan dalam sistem!");
            hasilTracking.style.display = "none";
            return;
        }

        // Tampilkan hasil tracking
        trackDO.textContent = pesananDitemukan.noDO;
        trackNama.textContent = pesananDitemukan.namaPemesan;
        trackEkspedisi.textContent = pesananDitemukan.ekspedisi || "JNE Express";
        trackTanggal.textContent = pesananDitemukan.tanggal || "-";
        trackJenisPaket.textContent = pesananDitemukan.jenisPaket || "Reguler (2-3 Hari)";
        trackBuku.textContent = `${pesananDitemukan.judulBuku} (${pesananDitemukan.jumlah} eksemplar)`;
        trackAlamat.textContent = pesananDitemukan.alamat || "-";
        trackTotal.textContent = formatRupiah(pesananDitemukan.totalHarga);
        trackStatus.textContent = pesananDitemukan.status;
        badgeStatusTrack.textContent = pesananDitemukan.status;

        // Atur Progress Bar Sederhana
        updateProgressBar(pesananDitemukan.status);

        // Tampilkan kotak hasil
        hasilTracking.style.display = "block";
        hasilTracking.scrollIntoView({ behavior: "smooth" });
    }

    // ==========================================
    // 7. PROGRESS BAR STATUS PENGIRIMAN
    // ==========================================
    function updateProgressBar(status) {
        const s = (status || "").toLowerCase();

        // Reset semua step
        [step1, step2, step3, step4].forEach((step) => {
            step.classList.remove("active", "completed");
        });

        // 4 Tahap Pengiriman:
        // 1. Pesanan Diterima
        // 2. Sedang Dikemas
        // 3. Dalam Pengiriman
        // 4. Pesanan Terkirim
        if (s.includes("terima") || s === "pesanan diterima") {
            step1.classList.add("active");
        } else if (s.includes("kemas") || s === "dikemas") {
            step1.classList.add("completed");
            step2.classList.add("active");
        } else if (s.includes("kirim") && !s.includes("terkirim")) {
            step1.classList.add("completed");
            step2.classList.add("completed");
            step3.classList.add("active");
        } else if (s.includes("terkirim") || s.includes("selesai")) {
            step1.classList.add("completed");
            step2.classList.add("completed");
            step3.classList.add("completed");
            step4.classList.add("completed");
        } else {
            // Default jika status custom
            step1.classList.add("active");
        }
    }

    // Logout
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", logout);
    }
});

