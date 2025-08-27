import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Import MUI components and icons
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: number;
  dueDate: string | null;
  priority: number;
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

// Helper function for priority details
const getPriorityProps = (priority: number) => {
  switch (priority) {
    case 2:
      return { label: 'High', color: 'error' as const };
    case 1:
      return { label: 'Medium', color: 'warning' as const };
    default:
      return { label: 'Low', color: 'success' as const };
  }
};

function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityProps = getPriorityProps(task.priority);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{ mb: 2, cursor: 'pointer' }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          {task.dueDate ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
          ) : (
            <div /> // Empty div to maintain space with justifyContent
          )}
          <Chip label={priorityProps.label} color={priorityProps.color} size="small" />
        </Box>
      </CardContent>
    </Card>
  );
}

export default TaskCard;