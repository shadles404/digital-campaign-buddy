import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ProductDelivery } from "@/types/tasks";

interface ProductDeliveryFormProps {
  onSubmit: (delivery: Omit<ProductDelivery, "id">) => void;
  initialData?: ProductDelivery;
}

export const ProductDeliveryForm = ({ onSubmit, initialData }: ProductDeliveryFormProps) => {
  const [productName, setProductName] = useState(initialData?.productName || "");
  const [celebrityName, setCelebrityName] = useState(initialData?.celebrityName || "");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(initialData?.deliveryDate);
  const [delivered, setDelivered] = useState(initialData?.delivered || false);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName && celebrityName && deliveryDate) {
      onSubmit({
        productName,
        celebrityName,
        deliveryDate,
        delivered,
        notes,
      });
      if (!initialData) {
        setProductName("");
        setCelebrityName("");
        setDeliveryDate(undefined);
        setDelivered(false);
        setNotes("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="productName">Product Name</Label>
        <Input
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>

      <div>
        <Label htmlFor="celebrityName">Celebrity Name</Label>
        <Input
          id="celebrityName"
          value={celebrityName}
          onChange={(e) => setCelebrityName(e.target.value)}
          placeholder="Enter celebrity name"
          required
        />
      </div>

      <div>
        <Label>Delivery Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !deliveryDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deliveryDate ? format(deliveryDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deliveryDate}
              onSelect={setDeliveryDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="delivered" checked={delivered} onCheckedChange={setDelivered} />
        <Label htmlFor="delivered">Delivered</Label>
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
        {initialData ? "Update Delivery" : "Add Delivery"}
      </Button>
    </form>
  );
};
