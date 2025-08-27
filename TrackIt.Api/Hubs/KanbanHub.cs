using Microsoft.AspNetCore.SignalR;

namespace TrackIt.Api.Hubs
{
    public class KanbanHub : Hub
    {
        // Method ini bisa dipanggil oleh client untuk memberitahu server
        // agar mengirim update ke semua client lain.
        public async Task UpdateBoard(string projectId)
        {
            // Mengirim pesan "BoardUpdated" ke semua client yang terhubung.
            // Nantinya ini bisa dibuat lebih spesifik hanya untuk client di proyek yang sama.
            await Clients.All.SendAsync("BoardUpdated", projectId);
        }
    }
}