/**
 * BookStore - Logika Halaman Login
 * Tugas UTS Pemrograman Web 1
 */

document.addEventListener("DOMContentLoaded", function () {
    // Referensi Elemen DOM
    const formLogin = document.getElementById("formLogin");
    const inputEmail = document.getElementById("email");
    const inputPassword = document.getElementById("password");

    // Modal Lupa Password
    const modalLupaPassword = document.getElementById("modalLupaPassword");
    const btnBukaLupaPassword = document.getElementById("btnBukaLupaPassword");
    const btnTutupLupaPassword = document.getElementById("btnTutupLupaPassword");
    const formLupaPassword = document.getElementById("formLupaPassword");
    const inputLupaEmail = document.getElementById("lupaEmail");

    // Modal Daftar Akun
    const modalDaftar = document.getElementById("modalDaftar");
    const btnBukaDaftar = document.getElementById("btnBukaDaftar");
    const btnTutupDaftar = document.getElementById("btnTutupDaftar");
    const formDaftar = document.getElementById("formDaftar");
    const inputDaftarNama = document.getElementById("daftarNama");
    const inputDaftarEmail = document.getElementById("daftarEmail");
    const inputDaftarPassword = document.getElementById("daftarPassword");
    const inputDaftarKonfirmasi = document.getElementById("daftarKonfirmasi");

    // Jika sudah login, tawarkan langsung lanjut ke dashboard
    const userAktif = getPenggunaAktif();
    if (userAktif) {
        // Otomatis isi email untuk kenyamanan
        inputEmail.value = userAktif.email;
    }

    // ==========================================
    // 1. PROSES LOGIN
    // ==========================================
    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = inputEmail.value.trim().toLowerCase();
        const password = inputPassword.value;

        if (!email || !password) {
            alert("Harap masukkan email dan password!");
            return;
        }

        // Ambil data pengguna terdaftar dari data.js / localStorage
        const daftarPengguna = getDaftarPengguna();

        // Validasi kredensial pengguna
        const userDitemukan = daftarPengguna.find(
            (u) => u.email.toLowerCase() === email && u.password === password
        );

        if (userDitemukan) {
            // Simpan sesi user aktif
            setPenggunaAktif(userDitemukan);
            alert("Login berhasil! Selamat datang, " + userDitemukan.nama + ".");
            window.location.href = "dashboard.html";
        } else {
            // Sesuai instruksi soal:
            alert("Email/password yang anda masukkan salah");
        }
    });

    // ==========================================
    // 2. MODAL LUPA PASSWORD
    // ==========================================
    btnBukaLupaPassword.addEventListener("click", function () {
        modalLupaPassword.classList.add("active");
        inputLupaEmail.value = inputEmail.value || "";
        inputLupaEmail.focus();
    });

    btnTutupLupaPassword.addEventListener("click", function () {
        modalLupaPassword.classList.remove("active");
    });

    formLupaPassword.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = inputLupaEmail.value.trim().toLowerCase();
        const daftarPengguna = getDaftarPengguna();

        const user = daftarPengguna.find((u) => u.email.toLowerCase() === email);
        if (user) {
            alert(
                "Instruksi reset password telah dikirim ke email " +
                email +
                "\n\n[Simulasi Pengujian]: Password akun Anda adalah '" +
                user.password +
                "'"
            );
            modalLupaPassword.classList.remove("active");
        } else {
            alert("Email tersebut tidak terdaftar dalam sistem BookStore!");
        }
    });

    // ==========================================
    // 3. MODAL DAFTAR AKUN BARU
    // ==========================================
    btnBukaDaftar.addEventListener("click", function () {
        modalDaftar.classList.add("active");
        inputDaftarNama.focus();
    });

    btnTutupDaftar.addEventListener("click", function () {
        modalDaftar.classList.remove("active");
    });

    formDaftar.addEventListener("submit", function (e) {
        e.preventDefault();

        const nama = inputDaftarNama.value.trim();
        const email = inputDaftarEmail.value.trim().toLowerCase();
        const password = inputDaftarPassword.value;
        const konfirmasi = inputDaftarKonfirmasi.value;

        if (!nama || !email || !password || !konfirmasi) {
            alert("Harap lengkapi semua data pendaftaran!");
            return;
        }

        if (password !== konfirmasi) {
            alert("Konfirmasi password tidak cocok dengan password!");
            return;
        }

        if (password.length < 4) {
            alert("Password minimal harus 4 karakter!");
            return;
        }

        const daftarPengguna = getDaftarPengguna();
        const emailSudahAda = daftarPengguna.some((u) => u.email.toLowerCase() === email);

        if (emailSudahAda) {
            alert("Alamat email ini sudah terdaftar. Silakan gunakan email lain atau login.");
            return;
        }

        // Simpan akun baru
        const userBaru = {
            nama: nama,
            email: email,
            password: password
        };

        simpanPenggunaBaru(userBaru);
        alert("Pendaftaran berhasil! Silakan login dengan akun baru Anda.");

        // Tutup modal dan isi form login
        modalDaftar.classList.remove("active");
        formDaftar.reset();
        inputEmail.value = email;
        inputPassword.value = "";
        inputPassword.focus();
    });

    // Tutup modal jika user klik di luar kotak modal
    window.addEventListener("click", function (e) {
        if (e.target === modalLupaPassword) {
            modalLupaPassword.classList.remove("active");
        }
        if (e.target === modalDaftar) {
            modalDaftar.classList.remove("active");
        }
    });
});

