export type TaskStatus = "pending" | "in-progress" | "completed";

export interface VideoTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
}

export interface CelebritySchedule {
  id: string;
  name: string;
  videoCount: number;
  scheduledDate: Date;
  status: "scheduled" | "in-progress" | "completed";
}

export interface ProductDelivery {
  id: string;
  productName: string;
  celebrityName: string;
  deliveryDate: Date;
  delivered: boolean;
  notes: string;
}

export interface SocialMediaCheck {
  id: string;
  platform: string;
  postDate: Date;
  designerName: string;
  status: "posted" | "not-posted" | "pending";
  notes: string;
}
