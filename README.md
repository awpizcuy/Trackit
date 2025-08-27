# TrackIt - Aplikasi Papan Kanban Kolaboratif  Kanban 🚀

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

## 🛠️ Tumpukan Teknologi

<details>
<summary><strong>Klik untuk melihat detail teknologi</strong></summary>

### **Backend**
- **Framework**: **.NET 8 LTS** (ASP.NET Core Web API)
- **Database**: **SQLite** dengan **Entity Framework Core 8**
- **Otentikasi**: **ASP.NET Core Identity** dengan **JWT Bearer Tokens**
- **Real-time**: **SignalR**
- **Pola Desain**: **DTOs (Data Transfer Objects)** untuk API yang aman dan efisien.

### **Frontend**
- **Framework**: **React 18** dengan **TypeScript**
- **Build Tool**: **Vite**
- **UI Library**: **Material-UI (MUI)** untuk komponen yang indah dan konsisten.
- **Routing**: **React Router Dom**
- **Manajemen State**: **React Context API** untuk manajemen sesi pengguna.
- **Komunikasi API**: **Axios** dengan *interceptors* untuk penanganan token otomatis.
- **Drag-and-Drop**: **@dnd-kit**
- **Real-time**: **@microsoft/signalr** Client
- **Notifikasi**: **react-hot-toast**

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
