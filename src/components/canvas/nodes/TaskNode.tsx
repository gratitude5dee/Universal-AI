import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckSquare, Edit3, Check, X, Plus } from 'lucide-react';

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

const TaskNode: React.FC<NodeProps> = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(String(data?.title || 'Task List'));
  const [tasks, setTasks] = useState<TaskItem[]>(Array.isArray(data?.tasks) ? data.tasks : []);
  const [newTaskText, setNewTaskText] = useState('');

  const handleSave = useCallback(() => {
    // Update node data
    setIsEditing(false);
  }, []);

  const handleCancel = useCallback(() => {
    setTitle(data?.title || 'Task List');
    setTasks(data?.tasks || []);
    setIsEditing(false);
  }, [data?.title, data?.tasks]);

  const addTask = useCallback(() => {
    if (newTaskText.trim()) {
      const newTask: TaskItem = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  }, [newTaskText, tasks]);

  const toggleTask = useCallback((taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }, [tasks]);

  const removeTask = useCallback((taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  }, [tasks]);

  return (
    <Card className="min-w-[280px] max-w-[400px] bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-studio-accent" />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-studio-accent" />
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm font-medium border-studio-sand/30"
              />
            ) : (
              <span className="text-sm font-medium text-studio-clay">{title}</span>
            )}
          </div>
          
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 p-0"
            >
              <Edit3 className="w-3 h-3" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-6 w-6 p-0 text-green-600"
              >
                <Check className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-6 w-6 p-0 text-red-600"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 p-2 rounded border border-studio-sand/20">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <span 
                className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-studio-clay'}`}
              >
                {task.text}
              </span>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTask(task.id)}
                  className="h-6 w-6 p-0 text-red-600"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Add new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="border-studio-sand/30"
            />
            <Button
              onClick={addTask}
              size="sm"
              className="bg-studio-accent hover:bg-studio-accent/90"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-studio-accent" />
    </Card>
  );
};

export default TaskNode;