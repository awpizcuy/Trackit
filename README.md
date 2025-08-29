# TrackIt - Aplikasi Papan Kanban Kolaboratif 🚀

**TrackIt** adalah aplikasi web *full-stack* modern yang dirancang untuk manajemen proyek dan tugas. Aplikasi ini menyediakan papan Kanban interaktif di mana pengguna dapat mengelola alur kerja mereka secara visual, memindahkan tugas antar status, dan melihat pembaruan dari kolaborator lain secara *real-time*.

Proyek ini dibangun menggunakan tumpukan teknologi modern dengan **.NET 8** sebagai backend, **React** dengan **TypeScript** dan **Material-UI** sebagai frontend.



---

## ✨ Fitur Utama

<details>
<summary><strong>Klik untuk melihat daftar fitur</strong></summary>

- **Otentikasi Pengguna**: Sistem registrasi dan login yang aman menggunakan **username/password** dengan otentikasi berbasis **JWT**.
- **Manajemen Proyek**: Pengguna dapat membuat, melihat, mengubah, dan menghapus proyek mereka sendiri.
- **Papan Kanban Interaktif**: Tiga kolom status ("To Do", "In Progress", "Done") untuk visualisasi alur kerja.
- **Drag-and-Drop**: Pindahkan kartu tugas dengan mudah antar kolom untuk memperbarui statusnya.
- **Kolaborasi Real-Time**: Perubahan yang dibuat oleh satu pengguna (seperti memindahkan atau membuat tugas) akan langsung terlihat oleh pengguna lain yang melihat proyek yang sama, tanpa perlu me-refresh halaman, berkat **SignalR**.
- **Detail Tugas Lanjutan**: Setiap tugas dapat memiliki detail seperti **tanggal jatuh tempo (due date)** dan **tingkat prioritas** (Low, Medium, High).
- **Modal Edit Interaktif**: Klik pada kartu tugas untuk membuka modal di mana Anda dapat melihat dan mengedit semua detailnya.
- **UI Modern & Responsif**: Antarmuka pengguna yang bersih dan profesional dibangun dengan **Material-UI (MUI)**.

</details>

---

## 🛠️ Tumpukan Teknologi & Library

<details>
<summary><strong>Klik untuk melihat detail teknologi dan library yang diinstal</strong></summary>

### **Backend (.NET 8 / NuGet Packages)**
- **`Microsoft.EntityFrameworkCore.Sqlite`**: *Database provider* yang memungkinkan Entity Framework Core untuk berkomunikasi dengan database **SQLite**.
- **`Microsoft.EntityFrameworkCore.Design`**: Menyediakan perintah *command-line* untuk EF Core (seperti `dotnet ef migrations add`).
- **`Microsoft.AspNetCore.Identity.EntityFrameworkCore`**: Mengintegrasikan sistem **ASP.NET Core Identity** (untuk manajemen pengguna) dengan EF Core.
- **`Microsoft.AspNetCore.Authentication.JwtBearer`**: *Middleware* untuk menerima dan memvalidasi **JSON Web Tokens (JWT)**.
- **`Microsoft.AspNetCore.SignalR`**: *Framework* untuk menambahkan fungsionalitas **real-time** ke aplikasi.

### **Frontend (React / npm Packages)**
- **`axios`**: *Library* untuk membuat permintaan **HTTP** ke backend API.
- **`react-router-dom`**: Mengelola **navigasi dan routing** di dalam aplikasi.
- **`react-hot-toast`**: Untuk menampilkan **notifikasi** *pop-up* yang bersih.
- **`jwt-decode`**: Alat bantu untuk **mendekode** token JWT di sisi frontend.
- **`@dnd-kit/core`** & **`@dnd-kit/sortable`**: *Library* untuk fungsionalitas **drag-and-drop**.
- **`@microsoft/signalr`**: *Client library* untuk terhubung dengan **SignalR Hub** di backend.
- **`@mui/material`**, **`@emotion/react`**, **`@emotion/styled`**: Paket inti dari **Material-UI (MUI)**, menyediakan koleksi komponen UI siap pakai.
- **`@mui/icons-material`**: Paket terpisah yang berisi koleksi **ikon** dari Material Design.
- **`@mui/x-date-pickers`** & **`date-fns`**: Paket untuk menambahkan komponen **Date Picker** dari MUI.

</details>

---

## 🚀 Cara Menjalankan Proyek

<details>
<summary><strong>Klik untuk melihat instruksi instalasi</strong></summary>

### **Prasyarat**
- .NET 8 SDK
- Node.js & npm

### **1. Konfigurasi Backend**
```bash
# Clone repository
git clone [https://github.com/your-username/trackit.git](https://github.com/your-username/trackit.git)
cd trackit/TrackIt.Api

# Terapkan semua migrasi untuk membuat database SQLite
dotnet ef database update

# Jalankan server backend
dotnet run
