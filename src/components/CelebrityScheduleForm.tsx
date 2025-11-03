import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CelebritySchedule } from "@/types/tasks";

interface CelebrityScheduleFormProps {
  onSubmit: (schedule: Omit<CelebritySchedule, "id">) => void;
  initialData?: CelebritySchedule;
}

export const CelebrityScheduleForm = ({ onSubmit, initialData }: CelebrityScheduleFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [videoCount, setVideoCount] = useState(initialData?.videoCount?.toString() || "");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(initialData?.scheduledDate);
  const [status, setStatus] = useState<"scheduled" | "in-progress" | "completed">(initialData?.status || "scheduled");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && videoCount && scheduledDate) {
      onSubmit({
        name,
        videoCount: parseInt(videoCount),
        scheduledDate,
        status,
      });
      if (!initialData) {
        setName("");
        setVideoCount("");
        setScheduledDate(undefined);
        setStatus("scheduled");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Celebrity Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter celebrity name"
          required
        />
      </div>

      <div>
        <Label htmlFor="videoCount">Number of Videos</Label>
        <Input
          id="videoCount"
          type="number"
          min="1"
          value={videoCount}
          onChange={(e) => setVideoCount(e.target.value)}
          placeholder="Enter number of videos"
          required
        />
      </div>

      <div>
        <Label>Scheduled Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !scheduledDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={scheduledDate}
              onSelect={setScheduledDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as "scheduled" | "in-progress" | "completed")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Schedule" : "Add Schedule"}
      </Button>
    </form>
  );
};
