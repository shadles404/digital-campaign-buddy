-- Create video_tasks table
CREATE TABLE public.video_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.video_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own video tasks"
  ON public.video_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video tasks"
  ON public.video_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video tasks"
  ON public.video_tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video tasks"
  ON public.video_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Create celebrity_schedules table
CREATE TABLE public.celebrity_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  video_count INTEGER NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.celebrity_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own celebrity schedules"
  ON public.celebrity_schedules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own celebrity schedules"
  ON public.celebrity_schedules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own celebrity schedules"
  ON public.celebrity_schedules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own celebrity schedules"
  ON public.celebrity_schedules FOR DELETE
  USING (auth.uid() = user_id);

-- Create product_deliveries table
CREATE TABLE public.product_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  celebrity_name TEXT NOT NULL,
  delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
  delivered BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own product deliveries"
  ON public.product_deliveries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own product deliveries"
  ON public.product_deliveries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own product deliveries"
  ON public.product_deliveries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own product deliveries"
  ON public.product_deliveries FOR DELETE
  USING (auth.uid() = user_id);

-- Create social_media_checks table
CREATE TABLE public.social_media_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  post_date TIMESTAMP WITH TIME ZONE NOT NULL,
  designer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not-posted',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.social_media_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own social media checks"
  ON public.social_media_checks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social media checks"
  ON public.social_media_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social media checks"
  ON public.social_media_checks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social media checks"
  ON public.social_media_checks FOR DELETE
  USING (auth.uid() = user_id);

-- Add update triggers for all tables
CREATE TRIGGER update_video_tasks_updated_at
  BEFORE UPDATE ON public.video_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_celebrity_schedules_updated_at
  BEFORE UPDATE ON public.celebrity_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_deliveries_updated_at
  BEFORE UPDATE ON public.product_deliveries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_media_checks_updated_at
  BEFORE UPDATE ON public.social_media_checks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();