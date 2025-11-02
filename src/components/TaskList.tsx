import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types/tasks";

interface Task {
  id: string;
  status?: TaskStatus | string;
  [key: string]: any;
}

interface TaskListProps<T extends Task> {
  tasks: T[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: T) => void;
  onDelete: (id: string) => void;
  renderFields: (task: T) => React.ReactNode;
  FormComponent: React.ComponentType<any>;
}

const statusStyles = {
  pending: "bg-pending text-pending-foreground",
  "in-progress": "bg-in-progress text-in-progress-foreground",
  completed: "bg-completed text-completed-foreground",
  scheduled: "bg-in-progress text-in-progress-foreground",
  posted: "bg-completed text-completed-foreground",
  "not-posted": "bg-pending text-pending-foreground",
};

export function TaskList<T extends Task>({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  renderFields,
  FormComponent,
}: TaskListProps<T>) {
  const [editingTask, setEditingTask] = useState<T | null>(null);

  const handleEdit = (task: T) => {
    setEditingTask(task);
  };

  const handleUpdate = (updatedTask: Omit<T, "id">) => {
    if (editingTask) {
      onEdit({ ...updatedTask, id: editingTask.id } as T);
      setEditingTask(null);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-muted text-muted-foreground";
    return statusStyles[status as keyof typeof statusStyles] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleComplete(task.id)}
                    className="h-6 w-6"
                  >
                    {task.status === "completed" || task.status === "posted" ? (
                      <CheckCircle2 className="h-5 w-5 text-completed" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </Button>
                  {task.status && (
                    <Badge className={cn(getStatusColor(task.status), "text-xs")}>
                      {task.status}
                    </Badge>
                  )}
                </div>
                {renderFields(task)}
              </div>

              <div className="flex gap-2">
                <Dialog open={editingTask?.id === task.id} onOpenChange={(open) => !open && setEditingTask(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(task)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    <FormComponent onSubmit={handleUpdate} initialData={editingTask} />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(task.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
