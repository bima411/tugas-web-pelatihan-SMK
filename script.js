
/* ==========================================
   LR APPAREL - JAVASCRIPT PEMESANAN JERSI
   Fitur:
   1. Katalog dan pilihan desain
   2. Kalkulator harga dan DP
   3. Validasi formulir
   4. Integrasi WhatsApp
========================================== */


/* ==========================================
   1. KONFIGURASI WEBSITE
========================================== */

// GANTI dengan nomor WhatsApp admin yang benar.
// Format: kode negara 62, tanpa tanda +, spasi, atau tanda hubung.
const NOMOR_ADMIN = "6281234567890";

// Harga berikut hanya contoh.
// Sesuaikan dengan harga resmi LR APPAREL.
const DAFTAR_DESAIN = [
  {
    kode: "LR-001",
    nama: "Velocity",
    kategori: "Futsal",
    harga: 100000,
    gambar:
      "https://placehold.co/600x420/17263b/a3ff12?text=LR-001+VELOCITY"
  },
  {
    kode: "LR-002",
    nama: "Phantom",
    kategori: "Sepak Bola",
    harga: 110000,
    gambar:
      "https://placehold.co/600x420/202b42/ffffff?text=LR-002+PHANTOM"
  },
  {
    kode: "LR-003",
    nama: "Striker",
    kategori: "Komunitas",
    harga: 120000,
    gambar:
      "https://placehold.co/600x420/293b32/a3ff12?text=LR-003+STRIKER"
  }
];


/* ==========================================
   2. MENGAMBIL ELEMEN HTML
========================================== */

const form = document.getElementById("orderForm");

const katalog = document.getElementById("catalogGrid");
const inputDesain = document.getElementById("desain");
const inputJumlah = document.getElementById("jumlah");
const inputDP = document.getElementById("dp");
const inputBahan = document.getElementById("bahan");

const inputNama = document.getElementById("nama");
const inputWhatsApp = document.getElementById("wa");
const inputTim = document.getElementById("tim");
const inputTarget = document.getElementById("target");
const inputPemain = document.getElementById("pemain");
const inputCatatan = document.getElementById("catatan");


/* ==========================================
   3. FUNGSI FORMAT RUPIAH
========================================== */

function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}


/* ==========================================
   4. MENCARI DESAIN YANG DIPILIH
========================================== */

function cariDesain(kode) {
  return DAFTAR_DESAIN.find(
    desain => desain.kode === kode
  );
}


/* ==========================================
   5. MEMBUAT KATALOG OTOMATIS
========================================== */

function buatKatalog() {
  if (!katalog || !inputDesain) return;

  katalog.replaceChildren();

  // Kosongkan pilihan sebelumnya.
  inputDesain.replaceChildren();

  const opsiAwal = document.createElement("option");
  opsiAwal.value = "";
  opsiAwal.textContent = "Pilih desain jersi";
  inputDesain.appendChild(opsiAwal);

  DAFTAR_DESAIN.forEach(desain => {
    // Membuat kartu produk.
    const kartu = document.createElement("article");
    kartu.className = "product-card";

    const gambar = document.createElement("img");
    gambar.src = desain.gambar;
    gambar.alt = "Desain jersi " + desain.nama;
    gambar.loading = "lazy";

    const informasi = document.createElement("div");
    informasi.className = "product-info";

    const judul = document.createElement("h3");
    judul.textContent = desain.nama;

    const kategori = document.createElement("p");
    kategori.textContent =
      desain.kode + " • " + desain.kategori;

    const bagianBawah = document.createElement("div");
    bagianBawah.className = "product-bottom";

    const harga = document.createElement("span");
    harga.className = "product-price";
    harga.textContent = formatRupiah(desain.harga);

    const tombol = document.createElement("button");
    tombol.type = "button";
    tombol.className = "btn btn-primary";
    tombol.textContent = "Pilih Desain";

    tombol.addEventListener("click", () => {
      inputDesain.value = desain.kode;

      hitungBiaya();

      document.getElementById("pesan").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    bagianBawah.append(harga, tombol);
    informasi.append(judul, kategori, bagianBawah);
    kartu.append(gambar, informasi);

    katalog.appendChild(kartu);

    // Menambahkan desain ke formulir.
    const opsi = document.createElement("option");
    opsi.value = desain.kode;
    opsi.textContent =
      desain.kode + " - " + desain.nama;

    inputDesain.appendChild(opsi);
  });
}


/* ==========================================
   6. MENGHITUNG TOTAL HARGA DAN DP
========================================== */

function hitungBiaya() {
  if (
    !inputDesain ||
    !inputJumlah ||
    !inputDP
  ) {
    return;
  }

  const desain = cariDesain(inputDesain.value);
  const jumlah = Number(inputJumlah.value);
  const persentaseDP = Number(inputDP.value);

  // Jangan menggunakan jumlah negatif atau pecahan.
  const jumlahValid =
    Number.isInteger(jumlah) &&
    jumlah >= 1 &&
    jumlah <= 500;

  const hargaSatuan = desain ? desain.harga : 0;
  const total = jumlahValid
    ? hargaSatuan * jumlah
    : 0;

  const dp = Math.round(
    total * persentaseDP / 100
  );

  const sisa = total - dp;

  // Memperbarui tampilan ringkasan.
  const elemenDesain =
    document.getElementById("ringkasanDesain");

  const elemenJumlah =
    document.getElementById("ringkasanJumlah");

  const elemenHarga =
    document.getElementById("hargaSatuan");

  const elemenBahan =
    document.getElementById("ringkasanBahan");

  const elemenTotal =
    document.getElementById("total");

  const elemenDP =
    document.getElementById("nilaiDP");

  const elemenSisa =
    document.getElementById("sisa");

  if (elemenDesain) {
    elemenDesain.textContent = desain
      ? desain.kode + " - " + desain.nama
      : "Belum dipilih";
  }

  if (elemenJumlah) {
    elemenJumlah.textContent =
      (jumlahValid ? jumlah : 0) + " pcs";
  }

  if (elemenHarga) {
    elemenHarga.textContent =
      formatRupiah(hargaSatuan);
  }

  if (elemenBahan && inputBahan) {
    elemenBahan.textContent = inputBahan.value;
  }

  if (elemenTotal) {
    elemenTotal.textContent = formatRupiah(total);
  }

  if (elemenDP) {
    elemenDP.textContent = formatRupiah(dp);
  }

  if (elemenSisa) {
    elemenSisa.textContent = formatRupiah(sisa);
  }

  return {
    desain,
    jumlah,
    jumlahValid,
    hargaSatuan,
    total,
    dp,
    sisa,
    persentaseDP
  };
}


/* ==========================================
   7. VALIDASI FORMULIR
========================================== */

function validasiPesanan() {
  // Memastikan kolom wajib sudah diisi.
  if (!form.reportValidity()) {
    return false;
  }

  // Pastikan desain benar-benar tersedia.
  const desain = cariDesain(inputDesain.value);

  if (!desain) {
    alert("Silakan pilih desain jersi terlebih dahulu.");
    inputDesain.focus();
    return false;
  }

  // Memeriksa jumlah pesanan.
  const jumlah = Number(inputJumlah.value);

  if (
    !Number.isInteger(jumlah) ||
    jumlah < 1 ||
    jumlah > 500
  ) {
    alert(
      "Jumlah pesanan harus berupa bilangan bulat antara 1 dan 500."
    );

    inputJumlah.focus();
    return false;
  }

  // Memeriksa nomor WhatsApp pelanggan.
  // Contoh yang diterima: 081234567890 atau 6281234567890.
  const nomorPelanggan = inputWhatsApp.value.trim();

  const nomorBersih = nomorPelanggan.replace(
    /[\s()+.-]/g,
    ""
  );

  if (!/^(?:62|0)\d{8,15}$/.test(nomorBersih)) {
    alert(
      "Nomor WhatsApp tidak valid. Gunakan nomor aktif, misalnya 081234567890."
    );

    inputWhatsApp.focus();
    return false;
  }

  // Memastikan nama dan nama tim tidak kosong.
  if (
    !inputNama.value.trim() ||
    !inputTim.value.trim()
  ) {
    alert("Nama pemesan dan nama tim wajib diisi.");
    return false;
  }

  // Memeriksa tanggal target jika diisi.
  if (inputTarget.value) {
    const tanggalTarget = new Date(
      inputTarget.value + "T00:00:00"
    );

    const sekarang = new Date();
    sekarang.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(tanggalTarget.getTime()) ||
      tanggalTarget < sekarang
    ) {
      alert(
        "Tanggal target selesai tidak boleh berada di masa lalu."
      );

      inputTarget.focus();
      return false;
    }
  }

  return true;
}


/* ==========================================
   8. MEMBUAT PESAN WHATSAPP
========================================== */

function buatPesanWhatsApp() {
  const hasil = hitungBiaya();

  if (!hasil || !hasil.desain) {
    return "";
  }

  const nama = inputNama.value.trim();
  const nomorPelanggan = inputWhatsApp.value.trim();
  const namaTim = inputTim.value.trim();

  const target = inputTarget.value || "Belum ditentukan";
  const bahan = inputBahan.value;

  const pemain =
    inputPemain.value.trim() || "Belum diisi";

  const catatan =
    inputCatatan.value.trim() || "-";

  const pesan = [
    "*PEMESANAN JERSI LR APPAREL*",
    "================================",
    "",
    "*DATA PEMESAN*",
    "Nama: " + nama,
    "WhatsApp pelanggan: " + nomorPelanggan,
    "Nama tim: " + namaTim,
    "",
    "*DETAIL JERSI*",
    "Kode desain: " + hasil.desain.kode,
    "Nama desain: " + hasil.desain.nama,
    "Kategori: " + hasil.desain.kategori,
    "Jumlah: " + hasil.jumlah + " pcs",
    "Bahan: " + bahan,
    "Target selesai: " + target,
    "",
    "*RINCIAN ESTIMASI BIAYA*",
    "Harga satuan: " +
      formatRupiah(hasil.hargaSatuan),
    "Total estimasi: " +
      formatRupiah(hasil.total),
    "DP simulasi (" + hasil.persentaseDP + "%): " +
      formatRupiah(hasil.dp),
    "Sisa estimasi: " +
      formatRupiah(hasil.sisa),
    "",
    "*DAFTAR PEMAIN*",
    pemain,
    "",
    "*CATATAN TAMBAHAN*",
    catatan,
    "",
    "Mohon konfirmasi harga final, ketersediaan bahan,",
    "jadwal produksi, dan instruksi pembayaran.",
    "",
    "Nominal di atas merupakan estimasi, bukan tagihan final."
  ].join("\n");

  return pesan;
}


/* ==========================================
   9. MENGIRIM PESAN KE WHATSAPP
========================================== */

function kirimWhatsApp(pesan) {
  // Nomor admin harus memakai kode negara 62.
  if (!/^62\d{8,15}$/.test(NOMOR_ADMIN)) {
    alert(
      "Nomor WhatsApp admin belum benar. Periksa variabel NOMOR_ADMIN."
    );
    return;
  }

  if (!pesan) {
    alert("Pesan pesanan belum dapat dibuat.");
    return;
  }

  const url =
    "https://wa.me/" +
    NOMOR_ADMIN +
    "?text=" +
    encodeURIComponent(pesan);

  // Membuka WhatsApp dengan ringkasan pesanan.
  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}


/* ==========================================
   10. EVENT FORMULIR DAN INPUT
========================================== */

// Perbarui kalkulator saat input berubah.
[
  inputDesain,
  inputJumlah,
  inputDP,
  inputBahan
].forEach(elemen => {
  if (!elemen) return;

  elemen.addEventListener("input", hitungBiaya);
  elemen.addEventListener("change", hitungBiaya);
});

// Kirim ringkasan ketika formulir disubmit.
if (form) {
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!validasiPesanan()) {
      return;
    }

    const pesan = buatPesanWhatsApp();

    kirimWhatsApp(pesan);
  });
}


/* ==========================================
   11. TOMBOL HUBUNGI ADMIN
========================================== */

const tombolKontak =
  document.getElementById("contactButton");

if (tombolKontak) {
  tombolKontak.href =
    "https://wa.me/" +
    NOMOR_ADMIN +
    "?text=" +
    encodeURIComponent(
      "Halo LR APPAREL, saya ingin konsultasi pemesanan jersi."
    );

  tombolKontak.target = "_blank";
  tombolKontak.rel = "noopener noreferrer";
}


/* ==========================================
   12. TAHUN OTOMATIS DI FOOTER
========================================== */

const elemenTahun = document.getElementById("tahun");

if (elemenTahun) {
  elemenTahun.textContent = new Date().getFullYear();
}


/* ==========================================
   13. JALANKAN WEBSITE
========================================== */

buatKatalog();
hitungBiaya();
