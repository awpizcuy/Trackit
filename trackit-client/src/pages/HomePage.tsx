import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';

// Impor komponen dari MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import Skeleton from '@mui/material/Skeleton'; // <-- Impor Skeleton
import InboxIcon from '@mui/icons-material/Inbox';

interface Project {
  id: number;
  name: string;
}

interface PreservedResponse<T> {
  $id: string;
  $values: T[];
}

function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(() => {
    // Tidak set loading di sini agar skeleton tidak berkedip saat refresh
    apiClient.get<PreservedResponse<Project> | Project[]>('/api/projects')
      .then(response => {
        const data = response.data;
        if (data && '$values' in data) {
          setProjects((data as PreservedResponse<Project>).$values);
        } else {
          setProjects(data as Project[]);
        }
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        toast.error('Could not fetch projects.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // --- PERUBAHAN 1: Ganti loading state menjadi Skeleton ---
  if (loading) {
    return (
      <Container maxWidth="md">
        <Skeleton variant="text" sx={{ fontSize: '3rem', width: '40%', my: 4 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 4, borderRadius: 2 }} />
        <Paper elevation={3} sx={{ mt: 4, borderRadius: 2 }}>
          <List>
            <ListItem><Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} /></ListItem>
            <ListItem><Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} /></ListItem>
            <ListItem><Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} /></ListItem>
          </List>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" sx={{ my: 4, fontWeight: 'bold' }}>
        Your Projects
      </Typography>
      
      <ProjectForm onProjectAdded={fetchProjects} />

      <Paper elevation={3} sx={{ mt: 4, borderRadius: 2 }}>
        {/* --- PERUBAHAN 2: Ganti empty state --- */}
        {projects.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <InboxIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No Projects Found
            </Typography>
            <Typography color="text.secondary">
              Add a new project above to get started!
            </Typography>
          </Box>
        ) : (
          <List>
            {projects.map(project => (
              <ListItem key={project.id} disablePadding>
                <ListItemButton component={RouterLink} to={`/project/${project.id}`}>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={project.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default HomePage;