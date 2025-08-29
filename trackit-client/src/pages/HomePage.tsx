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
import Skeleton from '@mui/material/Skeleton';
import InboxIcon from '@mui/icons-material/Inbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
  
  // State untuk modal edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editedProjectName, setEditedProjectName] = useState('');

  // State untuk dialog konfirmasi hapus
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

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

  // Handler untuk membuka modal edit
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setEditedProjectName(project.name);
    setIsEditModalOpen(true);
  };

  // Handler untuk menyimpan perubahan
  const handleSaveChanges = () => {
    if (!editingProject || !editedProjectName.trim()) {
      toast.error("Project name cannot be empty.");
      return;
    }
    
    apiClient.put(`/api/projects/${editingProject.id}`, { name: editedProjectName })
      .then(() => {
        toast.success("Project updated successfully!");
        fetchProjects();
        setIsEditModalOpen(false);
      })
      .catch(() => toast.error("Failed to update project."));
  };

  // Handler untuk membuka dialog konfirmasi hapus
  const handleDeleteClick = (project: Project) => {
    setDeletingProject(project);
    setIsDeleteConfirmOpen(true);
  };

  // Handler untuk mengkonfirmasi penghapusan
  const handleConfirmDelete = () => {
    if (!deletingProject) return;
    apiClient.delete(`/api/projects/${deletingProject.id}`)
      .then(() => {
        toast.success("Project deleted successfully!");
        fetchProjects();
        setIsDeleteConfirmOpen(false);
      })
      .catch(() => toast.error("Failed to delete project."));
  };

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
              <ListItem 
                key={project.id} 
                disablePadding
                secondaryAction={
                  <Box>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(project)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(project)} sx={{ ml: 1 }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
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

      {/* Modal untuk Edit Proyek */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <DialogTitle>Edit Project Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            variant="standard"
            value={editedProjectName}
            onChange={(e) => setEditedProjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog untuk Konfirmasi Hapus */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the project "{deletingProject?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default HomePage;