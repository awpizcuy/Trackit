import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import { type Task } from './TaskCard';
import apiClient from '../services/apiClient';
import Box from '@mui/material/Box';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdated: () => void;
  onCardClick: (task: Task) => void; // <-- Tambahkan prop ini
}

function KanbanBoard({ tasks, onTaskUpdated, onCardClick }: KanbanBoardProps) {
  const toDoTasks = tasks.filter(task => task.status === 0);
  const inProgressTasks = tasks.filter(task => task.status === 1);
  const doneTasks = tasks.filter(task => task.status === 2);

  const handleDragEnd = (event: DragEndEvent) => {
    // Logika handleDragEnd Anda tetap sama
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const movedTask = tasks.find(task => task.id === active.id);
    if (!movedTask) return;
    let newStatus: number;
    switch (over.id) {
      case 'inProgress': newStatus = 1; break;
      case 'done': newStatus = 2; break;
      default: newStatus = 0; break;
    }
    if (movedTask.status === newStatus) return;
    apiClient.put(`/api/tasks/${movedTask.id}/status`, { status: newStatus })
      .then(() => onTaskUpdated())
      .catch(error => console.error('Error updating task status:', error));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        {/* Teruskan onCardClick ke setiap kolom */}
        <KanbanColumn id="toDo" title="To Do" tasks={toDoTasks} onCardClick={onCardClick} />
        <KanbanColumn id="inProgress" title="In Progress" tasks={inProgressTasks} onCardClick={onCardClick} />
        <KanbanColumn id="done" title="Done" tasks={doneTasks} onCardClick={onCardClick} />
      </Box>
    </DndContext>
  );
}

export default KanbanBoard;