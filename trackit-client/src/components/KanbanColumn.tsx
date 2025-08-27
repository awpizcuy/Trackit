import { SortableContext, useSortable } from '@dnd-kit/sortable';
import TaskCard, { type Task } from './TaskCard';

// Impor komponen dari MUI
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onCardClick: (task: Task) => void;
}

function KanbanColumn({ id, title, tasks, onCardClick }: KanbanColumnProps) {
  const { setNodeRef } = useSortable({ id });

  return (
    <Paper
      ref={setNodeRef}
      elevation={2}
      sx={{
        flex: 1,
        mx: 1,
        p: 2,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        {title}
      </Typography>
      
      {/* --- PERBAIKAN DI SINI: Tambahkan empty state --- */}
      {tasks.length === 0 ? (
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          border: '2px dashed #ddd', 
          borderRadius: 1,
        }}>
          <Typography variant="caption" color="text.secondary">
            Drop tasks here
          </Typography>
        </Box>
      ) : (
        <SortableContext id={id} items={tasks}>
          <Box>
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} onClick={() => onCardClick(task)} />
              ))}
          </Box>
        </SortableContext>
      )}
    </Paper>
  );
}

export default KanbanColumn;