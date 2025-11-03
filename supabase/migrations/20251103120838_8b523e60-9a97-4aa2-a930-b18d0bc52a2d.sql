-- Create team_members table
CREATE TABLE public.team_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  description text NOT NULL,
  phone text NOT NULL,
  salary numeric(10, 2) NOT NULL DEFAULT 0,
  target_videos integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own team members"
ON public.team_members
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own team members"
ON public.team_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own team members"
ON public.team_members
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own team members"
ON public.team_members
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();