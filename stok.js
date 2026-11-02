/**
 * BookStore - Logika Halaman Stok & Katalog Buku
 * Tugas UTS Pemrograman Web 1
 * Fitur: Tampilan Sampul Buku (80px x 110px), Pembacaan Properti Cover, Tambah Buku, Pencarian
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Cek Sesi Login
    cekLogin(true);

    // 2. Daftar File Gambar Sampul Buku yang Tersedia di Folder assets/
    const daftarGambarAssets = [
        "kepemimpinan.jpg",
        "manajemen_keuangan.jpg",
        "mikrobiologi.jpg",
        "paud_perkembangan.jpg",
        "pengantar_komunikasi.jpg"
    ];

    // 3. Referensi Elemen DOM
    const tabelKatalogBody = document.getElementById("tabelKatalogBody");
    const labelTotalBuku = document.getElementById("labelTotalBuku");
    const formTambahBuku = document.getElementById("formTambahBuku");
    const inputKode = document.getElementById("inputKode");
    const inputJudul = document.getElementById("inputJudul");
    const inputPenulis = document.getElementById("inputPenulis");
    const inputHarga = document.getElementById("inputHarga");
    const inputStok = document.getElementById("inputStok");

    const inputCari = document.getElementById("inputCari");
    const btnCari = document.getElementById("btnCari");
    const btnResetCari = document.getElementById("btnResetCari");

    // Elemen Panel Pemetaan Gambar
    const badgeStatusSummary = document.getElementById("badgeStatusSummary");
    const countBukuBelumCocok = document.getElementById("countBukuBelumCocok");
    const listBukuBelumCocok = document.getElementById("listBukuBelumCocok");
    const countGambarBelumCocok = document.getElementById("countGambarBelumCocok");
    const listGambarBelumCocok = document.getElementById("listGambarBelumCocok");
    const btnSyncBukuDosen = document.getElementById("btnSyncBukuDosen");

    // Ambil data buku dari data.js (dataKatalogBuku / localStorage)
    let katalogList = getKatalogBuku();

    // ==========================================
    // 4. PEMBACAAN PROPERTI COVER & PENCOCOKAN GAMBAR
    // ==========================================

    // Fungsi normalisasi string: huruf kecil, hapus ekstensi, ganti tanda baca/garis bawah dengan spasi
    function bersihkanString(str) {
        if (!str) return "";
        return str
            .toLowerCase()
            .replace(/\.(jpg|jpeg|png|webp)$/i, "")
            .replace(/[_\-()[\]{},.:;!?'"]/g, " ")
            .replace(/[^a-z0-9\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    // Fungsi mencocokkan judul buku dengan daftar nama file gambar di assets (fallback)
    function cariGambarBuku(judulBuku) {
        if (!judulBuku) return null;

        const normJudul = bersihkanString(judulBuku);
        const kataJudul = normJudul.split(" ").filter(Boolean);

        for (const file of daftarGambarAssets) {
            const normBase = bersihkanString(file);

            // a. Kecocokan persis (exact match)
            if (normJudul === normBase) {
                return formatPathGambar(file);
            }

            // b. Substring match (satu bagian mengandung bagian lain)
            if (normJudul.includes(normBase) || normBase.includes(normJudul)) {
                return formatPathGambar(file);
            }

            // c. Kecocokan seluruh kata kunci nama gambar terdapat dalam judul buku
            const kataBase = normBase.split(" ").filter(Boolean);
            if (kataBase.length > 0 && kataBase.every((k) => kataJudul.includes(k))) {
                return formatPathGambar(file);
            }

            // d. Kecocokan seluruh kata judul terdapat dalam nama file gambar
            if (kataJudul.length > 0 && kataJudul.every((k) => kataBase.includes(k))) {
                return formatPathGambar(file);
            }
        }

        return null;
    }

    // Format URL path yang aman untuk karakter khusus/spasi
    function formatPathGambar(namaFile) {
        if (!namaFile) return "";
        // Jika sudah memiliki prefix "assets/", pertahankan
        if (namaFile.startsWith("assets/")) {
            return namaFile;
        }
        // Jika masih menggunakan folder "img/", arahkan ke "assets/" sesuai instruksi soal
        if (namaFile.startsWith("img/")) {
            return namaFile.replace(/^img\//, "assets/");
        }
        return "assets/" + encodeURIComponent(namaFile).replace(/%20/g, "%20");
    }

    // Fungsi menentukan path gambar dari objek buku (Membaca properti cover terlebih dahulu)
    function dapatkanPathCoverBuku(buku) {
        if (!buku) return "";

        // 1. Prioritas Utama: Baca properti `cover` dari objek buku di data.js
        if (buku.cover && typeof buku.cover === "string" && buku.cover.trim() !== "") {
            let pathCover = buku.cover.trim();
            // Sesuaikan jika properti cover masih mengarah ke folder "img/"
            if (pathCover.startsWith("img/")) {
                pathCover = pathCover.replace(/^img\//, "assets/");
            }
            return pathCover;
        }

        // 2. Fallback: Cari kecocokan otomatis berdasarkan judul buku pada folder assets/
        if (buku.judul) {
            const fallbackPath = cariGambarBuku(buku.judul);
            if (fallbackPath) return fallbackPath;
        }

        return "";
    }

    // Fungsi membuat elemen DOM untuk gambar sampul atau placeholder ukuran 80px x 110px
    function buatElemenSampul(buku) {
        const pathGambar = dapatkanPathCoverBuku(buku);
        const judul = buku && buku.judul ? buku.judul : "Buku";

        if (pathGambar) {
            const img = document.createElement("img");
            img.src = pathGambar;
            img.alt = judul;
            img.className = "book-cover";
            img.width = 80;
            img.height = 110;

            // Fallback jika terjadi kegagalan load gambar di browser
            img.onerror = function () {
                const placeholder = buatElemenPlaceholder(judul);
                this.replaceWith(placeholder);
            };

            return img;
        } else {
            return buatElemenPlaceholder(judul);
        }
    }

    // Membuat placeholder sampul seragam 80px x 110px
    function buatElemenPlaceholder(judulBuku) {
        const div = document.createElement("div");
        div.className = "book-cover-placeholder";
        div.innerHTML = `
            <div style="font-size: 24px; line-height: 1;">📖</div>
            <span>Tanpa Sampul</span>
        `;
        div.title = judulBuku;
        return div;
    }

    // ==========================================
    // 5. EVALUASI & TAMPILAN STATUS PEMETAAN
    // ==========================================
    function perbaruiStatusPemetaan(katalog) {
        const bukuCocok = [];
        const bukuBelumCocok = [];
        const gambarTerpakai = new Set();

        katalog.forEach((buku) => {
            const path = dapatkanPathCoverBuku(buku);
            if (path) {
                const filename = decodeURIComponent(path.replace("assets/", "").replace("img/", ""));
                bukuCocok.push({ judul: buku.judul, file: filename });
                gambarTerpakai.add(filename);
            } else {
                bukuBelumCocok.push(buku.judul);
            }
        });

        const gambarBelumCocok = daftarGambarAssets.filter((f) => !gambarTerpakai.has(f));

        // Update badge ringkasan
        if (badgeStatusSummary) {
            badgeStatusSummary.innerHTML = `
                <span class="badge badge-success">✓ ${bukuCocok.length} Berhasil Tampil</span>
                <span class="badge ${bukuBelumCocok.length > 0 ? "badge-warning" : "badge-info"}">⚠️ ${bukuBelumCocok.length} Tanpa Sampul</span>
                <span class="badge badge-info">📁 ${daftarGambarAssets.length} Gambar di Assets</span>
            `;
        }

        // Update list buku yang belum memiliki gambar
        if (countBukuBelumCocok && listBukuBelumCocok) {
            countBukuBelumCocok.textContent = bukuBelumCocok.length;
            listBukuBelumCocok.innerHTML = "";
            if (bukuBelumCocok.length === 0) {
                listBukuBelumCocok.innerHTML = `<li style="color: #16a34a;">Semua judul buku telah memiliki gambar sampul yang sesuai.</li>`;
            } else {
                bukuBelumCocok.forEach((judul) => {
                    const li = document.createElement("li");
                    li.textContent = `• ${judul}`;
                    listBukuBelumCocok.appendChild(li);
                });
            }
        }

        // Update list gambar yang belum terpasang
        if (countGambarBelumCocok && listGambarBelumCocok) {
            countGambarBelumCocok.textContent = gambarBelumCocok.length;
            listGambarBelumCocok.innerHTML = "";
            if (gambarBelumCocok.length === 0) {
                listGambarBelumCocok.innerHTML = `<li style="color: #16a34a;">Seluruh file gambar di assets telah terhubung dengan properti cover.</li>`;
            } else {
                gambarBelumCocok.forEach((file) => {
                    const li = document.createElement("li");
                    li.innerHTML = `• <strong>${file}</strong> (Path: <em>assets/${file}</em>)`;
                    listGambarBelumCocok.appendChild(li);
                });
            }
        }
    }

    // ==========================================
    // 6. RENDER TABEL KATALOG VIA DOM
    // ==========================================
    function renderTabelBuku(dataBuku) {
        tabelKatalogBody.innerHTML = "";

        if (!dataBuku || dataBuku.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="6" style="text-align: center; color: #64748b; padding: 25px;">Tidak ada data buku yang ditemukan.</td>`;
            tabelKatalogBody.appendChild(tr);
            if (labelTotalBuku) labelTotalBuku.textContent = "0 Buku";
            return;
        }

        dataBuku.forEach((buku) => {
            const baris = buatBarisBuku(buku);
            tabelKatalogBody.appendChild(baris);
        });

        if (labelTotalBuku) {
            labelTotalBuku.textContent = `${dataBuku.length} Buku Ditampilkan`;
        }

        perbaruiStatusPemetaan(dataBuku);
    }

    // Fungsi membuat elemen DOM <tr> untuk baris buku
    function buatBarisBuku(buku) {
        const tr = document.createElement("tr");

        // Kolom 1: Sampul Buku (Ukuran seragam 80px x 110px dari properti cover)
        const tdSampul = document.createElement("td");
        tdSampul.style.textAlign = "center";
        tdSampul.style.verticalAlign = "middle";
        const elemenSampul = buatElemenSampul(buku);
        tdSampul.appendChild(elemenSampul);

        // Kolom 2: ID Buku
        const tdId = document.createElement("td");
        tdId.innerHTML = `<strong>${buku.id}</strong>`;
        tdId.style.verticalAlign = "middle";

        // Kolom 3: Judul Buku
        const tdJudul = document.createElement("td");
        tdJudul.style.verticalAlign = "middle";
        const pathCover = dapatkanPathCoverBuku(buku);
        if (pathCover) {
            tdJudul.innerHTML = `<strong>${buku.judul}</strong> <span class="badge badge-success" style="font-size: 10px; margin-left: 4px;">Ada Sampul</span>`;
        } else {
            tdJudul.innerHTML = `<strong>${buku.judul}</strong>`;
        }

        // Kolom 4: Penulis
        const tdPenulis = document.createElement("td");
        tdPenulis.textContent = buku.penulis;
        tdPenulis.style.verticalAlign = "middle";

        // Kolom 5: Harga Satuan
        const tdHarga = document.createElement("td");
        tdHarga.textContent = formatRupiah(buku.harga);
        tdHarga.style.verticalAlign = "middle";

        // Kolom 6: Stok
        const tdStok = document.createElement("td");
        tdStok.style.verticalAlign = "middle";
        const badgeClass = buku.stok > 10 ? "badge-success" : buku.stok > 0 ? "badge-warning" : "badge-danger";
        tdStok.innerHTML = `<span class="badge ${badgeClass}">${buku.stok} unit</span>`;

        // Masukkan semua kolom ke baris
        tr.appendChild(tdSampul);
        tr.appendChild(tdId);
        tr.appendChild(tdJudul);
        tr.appendChild(tdPenulis);
        tr.appendChild(tdHarga);
        tr.appendChild(tdStok);

        return tr;
    }

    // Sugesti ID Buku otomatis berikutnya
    function sugestikanKodeBukuBerikutnya() {
        const nextNumber = katalogList.length + 1;
        inputKode.value = "BK" + String(nextNumber).padStart(3, "0");
    }

    // ==========================================
    // 7. TAMBAH BUKU BARU KE TABEL (DOM + VALIDASI)
    // ==========================================
    formTambahBuku.addEventListener("submit", function (e) {
        e.preventDefault();

        const idBuku = inputKode.value.trim().toUpperCase();
        const judul = inputJudul.value.trim();
        const penulis = inputPenulis.value.trim();
        const harga = Number(inputHarga.value);
        const stok = Number(inputStok.value);

        // Validasi input tidak boleh kosong
        if (!idBuku || !judul || !penulis || isNaN(harga) || isNaN(stok)) {
            alert("Semua data buku harus diisi dengan benar!");
            return;
        }

        if (harga <= 0) {
            alert("Harga buku harus lebih besar dari 0!");
            inputHarga.focus();
            return;
        }

        if (stok < 0) {
            alert("Stok tidak boleh bernilai negatif!");
            inputStok.focus();
            return;
        }

        // Validasi ID Buku unik
        const idSudahAda = katalogList.some((b) => b.id.toUpperCase() === idBuku);
        if (idSudahAda) {
            alert("ID Buku " + idBuku + " sudah digunakan! Silakan gunakan ID buku yang berbeda.");
            inputKode.focus();
            return;
        }

        // Tentukan properti cover (jika ada file di assets yang cocok dengan judul)
        const coverCocok = cariGambarBuku(judul) || "";

        // Buat objek buku baru
        const bukuBaru = {
            id: idBuku,
            judul: judul,
            penulis: penulis,
            harga: harga,
            stok: stok,
            cover: coverCocok
        };

        // 1. Tambahkan ke array katalog dan simpan ke localStorage
        katalogList.push(bukuBaru);
        simpanKatalogBuku(katalogList);

        // 2. Gunakan DOM secara langsung untuk menambahkan baris baru ke tabel
        const barisBaru = buatBarisBuku(bukuBaru);
        if (tabelKatalogBody.querySelector("td[colspan]")) {
            tabelKatalogBody.innerHTML = "";
        }
        tabelKatalogBody.appendChild(barisBaru);

        // Update label jumlah & status pemetaan
        if (labelTotalBuku) {
            labelTotalBuku.textContent = `${katalogList.length} Buku Ditampilkan`;
        }
        perbaruiStatusPemetaan(katalogList);

        if (coverCocok) {
            alert("Buku berhasil ditambahkan ke katalog!\nGambar sampul berhasil dimuat: " + coverCocok);
        } else {
            alert("Buku berhasil ditambahkan ke katalog!");
        }

        // Reset form dan siapkan ID baru
        formTambahBuku.reset();
        sugestikanKodeBukuBerikutnya();
    });

    // ==========================================
    // 8. FITUR BANTUAN UJI COBA BUKU DOSEN
    // ==========================================
    if (btnSyncBukuDosen) {
        btnSyncBukuDosen.addEventListener("click", function () {
            const bukuDosenContoh = [
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
                }
            ];

            let ditambahkan = 0;
            bukuDosenContoh.forEach((item) => {
                const index = katalogList.findIndex(
                    (b) => b.id === item.id || b.judul.toLowerCase() === item.judul.toLowerCase()
                );
                if (index === -1) {
                    katalogList.unshift(item);
                    ditambahkan++;
                } else {
                    // Update cover path ke assets/ jika belum ada
                    katalogList[index].cover = item.cover;
                }
            });

            simpanKatalogBuku(katalogList);
            renderTabelBuku(katalogList);
            sugestikanKodeBukuBerikutnya();
            alert("Seluruh 5 buku gambar dosen telah disinkronisasikan dengan path folder assets/ dan berhasil ditampilkan pada tabel katalog!");
        });
    }

    // ==========================================
    // 9. FITUR PENCARIAN BUKU SEDERHANA
    // ==========================================
    function lakukanPencarian() {
        const keyword = inputCari.value.trim().toLowerCase();

        if (!keyword) {
            renderTabelBuku(katalogList);
            return;
        }

        const hasilFilter = katalogList.filter((buku) => {
            const judulCocok = buku.judul.toLowerCase().includes(keyword);
            const penulisCocok = buku.penulis.toLowerCase().includes(keyword);
            const idCocok = buku.id.toLowerCase().includes(keyword);
            return judulCocok || penulisCocok || idCocok;
        });

        renderTabelBuku(hasilFilter);
    }

    btnCari.addEventListener("click", lakukanPencarian);

    inputCari.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            lakukanPencarian();
        } else {
            lakukanPencarian();
        }
    });

    btnResetCari.addEventListener("click", function () {
        inputCari.value = "";
        renderTabelBuku(katalogList);
    });

    // Inisialisasi tampilan pertama kali
    renderTabelBuku(katalogList);
    sugestikanKodeBukuBerikutnya();

    // Logout
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", logout);
    }
});
