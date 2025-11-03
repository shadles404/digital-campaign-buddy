import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskCard } from "@/components/TaskCard";
import { TaskList } from "@/components/TaskList";
import { VideoTaskForm } from "@/components/VideoTaskForm";
import { CelebrityScheduleForm } from "@/components/CelebrityScheduleForm";
import { ProductDeliveryForm } from "@/components/ProductDeliveryForm";
import { SocialMediaCheckForm } from "@/components/SocialMediaCheckForm";
import { Video, Star, Package, Share2, Plus, Search, LogOut } from "lucide-react";
import { VideoTask, CelebritySchedule, ProductDelivery, SocialMediaCheck, TaskStatus } from "@/types/tasks";
import { format } from "date-fns";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoTasks, setVideoTasks] = useState<VideoTask[]>([]);
  const [celebritySchedules, setCelebritySchedules] = useState<CelebritySchedule[]>([]);
  const [productDeliveries, setProductDeliveries] = useState<ProductDelivery[]>([]);
  const [socialMediaChecks, setSocialMediaChecks] = useState<SocialMediaCheck[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        setTimeout(() => {
          navigate("/auth");
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch all data when user is available
  useEffect(() => {
    if (!user) return;

    const fetchAllData = async () => {
      setDataLoading(true);
      try {
        // Fetch video tasks
        const { data: videoData, error: videoError } = await supabase
          .from('video_tasks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (videoError) throw videoError;
        setVideoTasks(videoData.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          dueDate: new Date(task.due_date),
          status: task.status as TaskStatus
        })));

        // Fetch celebrity schedules
        const { data: celebrityData, error: celebrityError } = await supabase
          .from('celebrity_schedules')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (celebrityError) throw celebrityError;
        setCelebritySchedules(celebrityData.map(schedule => ({
          id: schedule.id,
          name: schedule.name,
          videoCount: schedule.video_count,
          scheduledDate: new Date(schedule.scheduled_date),
          status: schedule.status as 'scheduled' | 'in-progress' | 'completed'
        })));

        // Fetch product deliveries
        const { data: deliveryData, error: deliveryError } = await supabase
          .from('product_deliveries')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (deliveryError) throw deliveryError;
        setProductDeliveries(deliveryData.map(delivery => ({
          id: delivery.id,
          productName: delivery.product_name,
          celebrityName: delivery.celebrity_name,
          deliveryDate: new Date(delivery.delivery_date),
          delivered: delivery.delivered,
          notes: delivery.notes || ''
        })));

        // Fetch social media checks
        const { data: socialData, error: socialError } = await supabase
          .from('social_media_checks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (socialError) throw socialError;
        setSocialMediaChecks(socialData.map(check => ({
          id: check.id,
          platform: check.platform,
          postDate: new Date(check.post_date),
          designerName: check.designer_name,
          status: check.status as 'posted' | 'not-posted' | 'pending',
          notes: check.notes || ''
        })));
      } catch (error: any) {
        toast.error("Error loading data: " + error.message);
      } finally {
        setDataLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Video Tasks
  const addVideoTask = async (task: Omit<VideoTask, "id">) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('video_tasks')
        .insert({
          user_id: user.id,
          title: task.title,
          description: task.description,
          due_date: task.dueDate.toISOString(),
          status: task.status
        })
        .select()
        .single();

      if (error) throw error;
      
      setVideoTasks([...videoTasks, {
        id: data.id,
        title: data.title,
        description: data.description || '',
        dueDate: new Date(data.due_date),
        status: data.status as TaskStatus
      }]);
      toast.success("Video task added successfully");
    } catch (error: any) {
      toast.error("Error adding task: " + error.message);
    }
  };

  const updateVideoTask = async (task: VideoTask) => {
    try {
      const { error } = await supabase
        .from('video_tasks')
        .update({
          title: task.title,
          description: task.description,
          due_date: task.dueDate.toISOString(),
          status: task.status
        })
        .eq('id', task.id);

      if (error) throw error;
      
      setVideoTasks(videoTasks.map((t) => (t.id === task.id ? task : t)));
      toast.success("Video task updated");
    } catch (error: any) {
      toast.error("Error updating task: " + error.message);
    }
  };

  const deleteVideoTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('video_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setVideoTasks(videoTasks.filter((t) => t.id !== id));
      toast.success("Video task deleted");
    } catch (error: any) {
      toast.error("Error deleting task: " + error.message);
    }
  };

  const toggleVideoTaskComplete = async (id: string) => {
    const task = videoTasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus = task.status === "completed" ? "pending" : "completed";
    
    try {
      const { error } = await supabase
        .from('video_tasks')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setVideoTasks(
        videoTasks.map((t) =>
          t.id === id ? { ...t, status: newStatus as TaskStatus } : t
        )
      );
    } catch (error: any) {
      toast.error("Error updating task: " + error.message);
    }
  };

  // Celebrity Schedules
  const addCelebritySchedule = async (schedule: Omit<CelebritySchedule, "id">) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('celebrity_schedules')
        .insert({
          user_id: user.id,
          name: schedule.name,
          video_count: schedule.videoCount,
          scheduled_date: schedule.scheduledDate.toISOString(),
          status: schedule.status
        })
        .select()
        .single();

      if (error) throw error;
      
      setCelebritySchedules([...celebritySchedules, {
        id: data.id,
        name: data.name,
        videoCount: data.video_count,
        scheduledDate: new Date(data.scheduled_date),
        status: data.status as 'scheduled' | 'in-progress' | 'completed'
      }]);
      toast.success("Celebrity schedule added");
    } catch (error: any) {
      toast.error("Error adding schedule: " + error.message);
    }
  };

  const updateCelebritySchedule = async (schedule: CelebritySchedule) => {
    try {
      const { error } = await supabase
        .from('celebrity_schedules')
        .update({
          name: schedule.name,
          video_count: schedule.videoCount,
          scheduled_date: schedule.scheduledDate.toISOString(),
          status: schedule.status
        })
        .eq('id', schedule.id);

      if (error) throw error;
      
      setCelebritySchedules(celebritySchedules.map((s) => (s.id === schedule.id ? schedule : s)));
      toast.success("Celebrity schedule updated");
    } catch (error: any) {
      toast.error("Error updating schedule: " + error.message);
    }
  };

  const deleteCelebritySchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('celebrity_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCelebritySchedules(celebritySchedules.filter((s) => s.id !== id));
      toast.success("Celebrity schedule deleted");
    } catch (error: any) {
      toast.error("Error deleting schedule: " + error.message);
    }
  };

  const toggleCelebrityComplete = async (id: string) => {
    const schedule = celebritySchedules.find(s => s.id === id);
    if (!schedule) return;
    
    const newStatus = schedule.status === "completed" ? "scheduled" : "completed";
    
    try {
      const { error } = await supabase
        .from('celebrity_schedules')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setCelebritySchedules(
        celebritySchedules.map((s) =>
          s.id === id ? { ...s, status: newStatus as 'scheduled' | 'in-progress' | 'completed' } : s
        )
      );
    } catch (error: any) {
      toast.error("Error updating schedule: " + error.message);
    }
  };

  // Product Deliveries
  const addProductDelivery = async (delivery: Omit<ProductDelivery, "id">) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('product_deliveries')
        .insert({
          user_id: user.id,
          product_name: delivery.productName,
          celebrity_name: delivery.celebrityName,
          delivery_date: delivery.deliveryDate.toISOString(),
          delivered: delivery.delivered,
          notes: delivery.notes
        })
        .select()
        .single();

      if (error) throw error;
      
      setProductDeliveries([...productDeliveries, {
        id: data.id,
        productName: data.product_name,
        celebrityName: data.celebrity_name,
        deliveryDate: new Date(data.delivery_date),
        delivered: data.delivered,
        notes: data.notes || ''
      }]);
      toast.success("Product delivery added");
    } catch (error: any) {
      toast.error("Error adding delivery: " + error.message);
    }
  };

  const updateProductDelivery = async (delivery: ProductDelivery) => {
    try {
      const { error } = await supabase
        .from('product_deliveries')
        .update({
          product_name: delivery.productName,
          celebrity_name: delivery.celebrityName,
          delivery_date: delivery.deliveryDate.toISOString(),
          delivered: delivery.delivered,
          notes: delivery.notes
        })
        .eq('id', delivery.id);

      if (error) throw error;
      
      setProductDeliveries(productDeliveries.map((d) => (d.id === delivery.id ? delivery : d)));
      toast.success("Product delivery updated");
    } catch (error: any) {
      toast.error("Error updating delivery: " + error.message);
    }
  };

  const deleteProductDelivery = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_deliveries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProductDeliveries(productDeliveries.filter((d) => d.id !== id));
      toast.success("Product delivery deleted");
    } catch (error: any) {
      toast.error("Error deleting delivery: " + error.message);
    }
  };

  const toggleDeliveryComplete = async (id: string) => {
    const delivery = productDeliveries.find(d => d.id === id);
    if (!delivery) return;
    
    try {
      const { error } = await supabase
        .from('product_deliveries')
        .update({ delivered: !delivery.delivered })
        .eq('id', id);

      if (error) throw error;
      
      setProductDeliveries(
        productDeliveries.map((d) =>
          d.id === id ? { ...d, delivered: !d.delivered } : d
        )
      );
    } catch (error: any) {
      toast.error("Error updating delivery: " + error.message);
    }
  };

  // Social Media Checks
  const addSocialMediaCheck = async (check: Omit<SocialMediaCheck, "id">) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('social_media_checks')
        .insert({
          user_id: user.id,
          platform: check.platform,
          post_date: check.postDate.toISOString(),
          designer_name: check.designerName,
          status: check.status,
          notes: check.notes
        })
        .select()
        .single();

      if (error) throw error;
      
      setSocialMediaChecks([...socialMediaChecks, {
        id: data.id,
        platform: data.platform,
        postDate: new Date(data.post_date),
        designerName: data.designer_name,
        status: data.status as 'posted' | 'not-posted' | 'pending',
        notes: data.notes || ''
      }]);
      toast.success("Social media check added");
    } catch (error: any) {
      toast.error("Error adding check: " + error.message);
    }
  };

  const updateSocialMediaCheck = async (check: SocialMediaCheck) => {
    try {
      const { error } = await supabase
        .from('social_media_checks')
        .update({
          platform: check.platform,
          post_date: check.postDate.toISOString(),
          designer_name: check.designerName,
          status: check.status,
          notes: check.notes
        })
        .eq('id', check.id);

      if (error) throw error;
      
      setSocialMediaChecks(socialMediaChecks.map((c) => (c.id === check.id ? check : c)));
      toast.success("Social media check updated");
    } catch (error: any) {
      toast.error("Error updating check: " + error.message);
    }
  };

  const deleteSocialMediaCheck = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_media_checks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSocialMediaChecks(socialMediaChecks.filter((c) => c.id !== id));
      toast.success("Social media check deleted");
    } catch (error: any) {
      toast.error("Error deleting check: " + error.message);
    }
  };

  const toggleSocialMediaComplete = async (id: string) => {
    const check = socialMediaChecks.find(c => c.id === id);
    if (!check) return;
    
    const newStatus = check.status === "posted" ? "not-posted" : "posted";
    
    try {
      const { error } = await supabase
        .from('social_media_checks')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setSocialMediaChecks(
        socialMediaChecks.map((c) =>
          c.id === id ? { ...c, status: newStatus as 'posted' | 'not-posted' | 'pending' } : c
        )
      );
    } catch (error: any) {
      toast.error("Error updating check: " + error.message);
    }
  };

  // Filter logic
  const filterTasks = <T extends { status?: TaskStatus | string; [key: string]: any }>(
    tasks: T[]
  ): T[] => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter ||
        (statusFilter === "delivered" && "delivered" in task && task.delivered) ||
        (statusFilter === "not-delivered" && "delivered" in task && !task.delivered);

      const matchesSearch =
        searchQuery === "" ||
        Object.values(task).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesStatus && matchesSearch;
    });
  };

  const filteredVideoTasks = filterTasks(videoTasks);
  const filteredCelebritySchedules = filterTasks(celebritySchedules);
  const filteredProductDeliveries = filterTasks(productDeliveries);
  const filteredSocialMediaChecks = filterTasks(socialMediaChecks);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-primary">Task Management Dashboard</h1>
              <p className="text-muted-foreground">Manage your digital marketing tasks efficiently</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TaskCard
            title="Video Tasks"
            count={videoTasks.length}
            status="in-progress"
            icon={<Video className="h-5 w-5 text-primary" />}
          />
          <TaskCard
            title="Celebrity Schedules"
            count={celebritySchedules.length}
            status="pending"
            icon={<Star className="h-5 w-5 text-primary" />}
          />
          <TaskCard
            title="Product Deliveries"
            count={productDeliveries.length}
            status="completed"
            icon={<Package className="h-5 w-5 text-primary" />}
          />
          <TaskCard
            title="Social Media"
            count={socialMediaChecks.length}
            status="in-progress"
            icon={<Share2 className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks, celebrities, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="not-posted">Not Posted</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="not-delivered">Not Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Task Categories Tabs */}
        <Tabs defaultValue="video" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="video">Video Tasks</TabsTrigger>
            <TabsTrigger value="celebrity">Celebrity Schedule</TabsTrigger>
            <TabsTrigger value="delivery">Product Delivery</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Video Recording Tasks</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Video Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Video Task</DialogTitle>
                  </DialogHeader>
                  <VideoTaskForm onSubmit={addVideoTask} />
                </DialogContent>
              </Dialog>
            </div>
            <TaskList
              tasks={filteredVideoTasks}
              onToggleComplete={toggleVideoTaskComplete}
              onEdit={updateVideoTask}
              onDelete={deleteVideoTask}
              FormComponent={VideoTaskForm}
              renderFields={(task) => (
                <>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Due: {format(task.dueDate, "PPP")}
                  </p>
                </>
              )}
            />
          </TabsContent>

          <TabsContent value="celebrity" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Celebrity Recording Schedule</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Celebrity Schedule</DialogTitle>
                  </DialogHeader>
                  <CelebrityScheduleForm onSubmit={addCelebritySchedule} />
                </DialogContent>
              </Dialog>
            </div>
            <TaskList
              tasks={filteredCelebritySchedules}
              onToggleComplete={toggleCelebrityComplete}
              onEdit={updateCelebritySchedule}
              onDelete={deleteCelebritySchedule}
              FormComponent={CelebrityScheduleForm}
              renderFields={(schedule) => (
                <>
                  <h3 className="font-semibold">{schedule.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Videos: {schedule.videoCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scheduled: {format(schedule.scheduledDate, "PPP")}
                  </p>
                </>
              )}
            />
          </TabsContent>

          <TabsContent value="delivery" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Product Delivery Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Delivery
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Product Delivery</DialogTitle>
                  </DialogHeader>
                  <ProductDeliveryForm onSubmit={addProductDelivery} />
                </DialogContent>
              </Dialog>
            </div>
            <TaskList
              tasks={filteredProductDeliveries}
              onToggleComplete={toggleDeliveryComplete}
              onEdit={updateProductDelivery}
              onDelete={deleteProductDelivery}
              FormComponent={ProductDeliveryForm}
              renderFields={(delivery) => (
                <>
                  <h3 className="font-semibold">{delivery.productName}</h3>
                  <p className="text-sm text-muted-foreground">
                    To: {delivery.celebrityName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Delivery: {format(delivery.deliveryDate, "PPP")}
                  </p>
                  {delivery.notes && (
                    <p className="text-xs text-muted-foreground">Notes: {delivery.notes}</p>
                  )}
                </>
              )}
            />
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Social Media Check</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Check
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Social Media Check</DialogTitle>
                  </DialogHeader>
                  <SocialMediaCheckForm onSubmit={addSocialMediaCheck} />
                </DialogContent>
              </Dialog>
            </div>
            <TaskList
              tasks={filteredSocialMediaChecks}
              onToggleComplete={toggleSocialMediaComplete}
              onEdit={updateSocialMediaCheck}
              onDelete={deleteSocialMediaCheck}
              FormComponent={SocialMediaCheckForm}
              renderFields={(check) => (
                <>
                  <h3 className="font-semibold">{check.platform}</h3>
                  <p className="text-sm text-muted-foreground">
                    Designer: {check.designerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Date: {format(check.postDate, "PPP")}
                  </p>
                  {check.notes && (
                    <p className="text-xs text-muted-foreground">Notes: {check.notes}</p>
                  )}
                </>
              )}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
