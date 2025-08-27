import { useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../services/apiClient';

// Impor komponen dari MUI
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface ProjectFormProps {
  onProjectAdded: () => void;
}

function ProjectForm({ onProjectAdded }: ProjectFormProps) {
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Project name cannot be empty.");
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post('/api/projects', { name: projectName });
      toast.success('Project added successfully!');
      setProjectName('');
      onProjectAdded();
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error('Failed to add project.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 4 }}>
      <TextField
        label="New Project Name"
        variant="outlined"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        disabled={isLoading}
        sx={{ flexGrow: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Project'}
      </Button>
    </Box>
  );
}

export default ProjectForm;