import { useState, useEffect } from 'react';
import { type Task } from './TaskCard';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';

// Impor komponen dari MUI
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
}

// Style untuk box modal
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

// Helper untuk mendapatkan detail prioritas
const getPriorityProps = (priority: number) => {
  switch (priority) {
    case 2:
      return { label: 'High', color: 'error' } as const;
    case 1:
      return { label: 'Medium', color: 'warning' } as const;
    default:
      return { label: 'Low', color: 'success' } as const;
  }
};

function TaskDetailModal({ task, open, onClose, onTaskUpdated }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // State untuk menyimpan perubahan
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDueDate, setEditedDueDate] = useState<Date | null>(null);
  const [editedPriority, setEditedPriority] = useState(0);

  // Sinkronkan state edit saat task berubah (modal dibuka)
  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description);
      setEditedDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setEditedPriority(task.priority);
    }
  }, [task]);

  if (!task) return null;
  
  const handleSaveChanges = () => {
    // Buat DTO yang sesuai dengan yang diharapkan backend
    const updateDto = {
        title: editedTitle,
        description: editedDescription,
        status: task.status, // Kirim status yang ada
        dueDate: editedDueDate,
        priority: editedPriority
    }

    apiClient.put(`/api/tasks/${task.id}`, updateDto)
      .then(() => {
        toast.success('Task updated successfully!');
        onTaskUpdated(); // Refresh data di papan
        setIsEditing(false); // Keluar dari mode edit
        onClose(); // Tutup modal
      })
      .catch(() => toast.error('Failed to update task.'));
  };

  const priorityProps = getPriorityProps(task.priority);

  return (
    <Modal open={open} onClose={() => { onClose(); setIsEditing(false); }}>
      <Box sx={style}>
        {isEditing ? (
          <>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Edit Task</Typography>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <DatePicker
              label="Due Date"
              value={editedDueDate}
              onChange={(newValue) => setEditedDueDate(newValue)}
              sx={{ width: '100%', mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editedPriority}
                label="Priority"
                onChange={(e) => setEditedPriority(e.target.value as number)}
              >
                <MenuItem value={0}>Low</MenuItem>
                <MenuItem value={1}>Medium</MenuItem>
                <MenuItem value={2}>High</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button variant="text" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveChanges}>Save Changes</Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {task.title}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
              {task.description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </Typography>
              <Chip label={priorityProps.label} color={priorityProps.color} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default TaskDetailModal;