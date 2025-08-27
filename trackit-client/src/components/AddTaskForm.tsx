import { useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../services/apiClient';

// Impor komponen dari MUI
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// Impor komponen Date Picker
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface AddTaskFormProps {
  projectId: number;
  onTaskAdded: () => void;
}

function AddTaskForm({ projectId, onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<number>(0); // Default: Low
  const [isLoading, setIsLoading] = useState(false);

  const handlePriorityChange = (event: SelectChangeEvent<number>) => {
    setPriority(event.target.value as number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }
    setIsLoading(true);
    const newTask = { 
      title, 
      description, 
      projectId,
      dueDate,
      priority 
    };
    try {
      await apiClient.post('/api/tasks', newTask);
      toast.success('Task added successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate(null);
      setPriority(0);
      onTaskAdded();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ my: 4, p: 2, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Add New Task</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Task Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
        />
        <TextField
          label="Task Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          multiline
          rows={2}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select
              labelId="priority-select-label"
              id="priority-select"
              value={priority}
              label="Priority"
              onChange={handlePriorityChange}
            >
              <MenuItem value={0}>Low</MenuItem>
              <MenuItem value={1}>Medium</MenuItem>
              <MenuItem value={2}>High</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ alignSelf: 'flex-start' }}
        >
          {isLoading ? 'Adding...' : 'Add Task'}
        </Button>
      </Box>
    </Paper>
  );
}

export default AddTaskForm;