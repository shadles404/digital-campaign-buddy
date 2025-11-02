import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types/tasks";

interface TaskCardProps {
  title: string;
  count: number;
  status: TaskStatus;
  icon: React.ReactNode;
  onClick?: () => void;
}

const statusStyles = {
  pending: "bg-pending text-pending-foreground",
  "in-progress": "bg-in-progress text-in-progress-foreground",
  completed: "bg-completed text-completed-foreground",
};

export const TaskCard = ({ title, count, status, icon, onClick }: TaskCardProps) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
      style={{ borderLeftColor: `hsl(var(--${status}))` }}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge className={cn(statusStyles[status])}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-primary">{count}</p>
        <p className="text-sm text-muted-foreground">Total tasks</p>
      </CardContent>
    </Card>
  );
};
