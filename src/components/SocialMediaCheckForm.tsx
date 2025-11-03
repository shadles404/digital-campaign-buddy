import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SocialMediaCheck } from "@/types/tasks";

interface SocialMediaCheckFormProps {
  onSubmit: (check: Omit<SocialMediaCheck, "id">) => void;
  initialData?: SocialMediaCheck;
}

export const SocialMediaCheckForm = ({ onSubmit, initialData }: SocialMediaCheckFormProps) => {
  const [platform, setPlatform] = useState(initialData?.platform || "");
  const [postDate, setPostDate] = useState<Date | undefined>(initialData?.postDate);
  const [designerName, setDesignerName] = useState(initialData?.designerName || "");
  const [status, setStatus] = useState<"posted" | "not-posted" | "pending">(initialData?.status || "not-posted");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (platform && postDate && designerName) {
      onSubmit({
        platform,
        postDate,
        designerName,
        status,
        notes,
      });
      if (!initialData) {
        setPlatform("");
        setPostDate(undefined);
        setDesignerName("");
        setStatus("not-posted");
        setNotes("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="platform">Platform</Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Facebook">Facebook</SelectItem>
            <SelectItem value="TikTok">TikTok</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Twitter">Twitter</SelectItem>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="YouTube">YouTube</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Post Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !postDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {postDate ? format(postDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={postDate}
              onSelect={setPostDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="designerName">Designer Name</Label>
        <Input
          id="designerName"
          value={designerName}
          onChange={(e) => setDesignerName(e.target.value)}
          placeholder="Enter designer name"
          required
        />
      </div>

      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as "posted" | "not-posted" | "pending")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="not-posted">Not Posted</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Check" : "Add Check"}
      </Button>
    </form>
  );
};
