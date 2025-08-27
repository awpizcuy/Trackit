import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';
import { type Task } from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';
import apiClient from '../services/apiClient';
import * as signalR from "@microsoft/signalr";
import TaskDetailModal from '../components/TaskDetailModal';

// Impor komponen dari MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useAuth } from '../context/AuthContext'; // <-- 1. Impor useAuth

interface Project {
  id: number;
  name: string;
  taskItems: Task[] | { $values: Task[] };
}

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); // <-- 2. Dapatkan token dari context

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const fetchProjectDetails = useCallback(() => {
    if (id) {
      apiClient.get<Project>(`/api/projects/${id}`)
        .then(response => {
          const projectData = response.data;
          if (projectData.taskItems && '$values' in projectData.taskItems) {
              projectData.taskItems = projectData.taskItems.$values;
          }
          setProject(projectData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching project details:', error);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  // --- PERBAIKAN DI SINI ---
  useEffect(() => {
    // Jangan coba konek jika tidak ada ID atau token
    if (!id || !token) return;

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5091/kanbanHub", {
            // Kirim token untuk autentikasi koneksi
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build();

    connection.on("BoardUpdated", (updatedProjectId: string) => {
        if (updatedProjectId === id) {
            fetchProjectDetails();
        }
    });

    connection.start()
        .then(() => console.log("SignalR Connected."))
        .catch(err => console.error("SignalR Connection Error:", err.toString()));

    return () => {
        connection.stop();
    };
  }, [id, fetchProjectDetails, token]); // <-- 3. Tambahkan token ke dependensi

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return <Typography variant="h5" align="center" sx={{ mt: 8 }}>Project not found.</Typography>;
  }

  const tasks = Array.isArray(project.taskItems) ? project.taskItems : project.taskItems.$values;

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: 4, my: 4, borderRadius: 3 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          {project.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your tasks using the board below.
        </Typography>
        <Divider sx={{ my: 3 }} />
        <AddTaskForm projectId={project.id} onTaskAdded={fetchProjectDetails} />
      </Paper>
      
      <KanbanBoard
        tasks={tasks}
        onTaskUpdated={fetchProjectDetails}
        onCardClick={handleOpenModal}
      />

      <TaskDetailModal
        task={selectedTask}
        open={isModalOpen}
        onClose={handleCloseModal}
        onTaskUpdated={fetchProjectDetails}
      />
    </Container>
  );
}

export default ProjectDetailPage;