import { useState } from "react";
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
import { Video, Star, Package, Share2, Plus, Search } from "lucide-react";
import { VideoTask, CelebritySchedule, ProductDelivery, SocialMediaCheck, TaskStatus } from "@/types/tasks";
import { format } from "date-fns";
import { toast } from "sonner";

const Index = () => {
  const [videoTasks, setVideoTasks] = useState<VideoTask[]>([]);
  const [celebritySchedules, setCelebritySchedules] = useState<CelebritySchedule[]>([]);
  const [productDeliveries, setProductDeliveries] = useState<ProductDelivery[]>([]);
  const [socialMediaChecks, setSocialMediaChecks] = useState<SocialMediaCheck[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Video Tasks
  const addVideoTask = (task: Omit<VideoTask, "id">) => {
    const newTask = { ...task, id: Date.now().toString() };
    setVideoTasks([...videoTasks, newTask]);
    toast.success("Video task added successfully");
  };

  const updateVideoTask = (task: VideoTask) => {
    setVideoTasks(videoTasks.map((t) => (t.id === task.id ? task : t)));
    toast.success("Video task updated");
  };

  const deleteVideoTask = (id: string) => {
    setVideoTasks(videoTasks.filter((t) => t.id !== id));
    toast.success("Video task deleted");
  };

  const toggleVideoTaskComplete = (id: string) => {
    setVideoTasks(
      videoTasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
          : t
      )
    );
  };

  // Celebrity Schedules
  const addCelebritySchedule = (schedule: Omit<CelebritySchedule, "id">) => {
    const newSchedule = { ...schedule, id: Date.now().toString() };
    setCelebritySchedules([...celebritySchedules, newSchedule]);
    toast.success("Celebrity schedule added");
  };

  const updateCelebritySchedule = (schedule: CelebritySchedule) => {
    setCelebritySchedules(celebritySchedules.map((s) => (s.id === schedule.id ? schedule : s)));
    toast.success("Celebrity schedule updated");
  };

  const deleteCelebritySchedule = (id: string) => {
    setCelebritySchedules(celebritySchedules.filter((s) => s.id !== id));
    toast.success("Celebrity schedule deleted");
  };

  const toggleCelebrityComplete = (id: string) => {
    setCelebritySchedules(
      celebritySchedules.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "completed" ? "scheduled" : "completed" }
          : s
      )
    );
  };

  // Product Deliveries
  const addProductDelivery = (delivery: Omit<ProductDelivery, "id">) => {
    const newDelivery = { ...delivery, id: Date.now().toString() };
    setProductDeliveries([...productDeliveries, newDelivery]);
    toast.success("Product delivery added");
  };

  const updateProductDelivery = (delivery: ProductDelivery) => {
    setProductDeliveries(productDeliveries.map((d) => (d.id === delivery.id ? delivery : d)));
    toast.success("Product delivery updated");
  };

  const deleteProductDelivery = (id: string) => {
    setProductDeliveries(productDeliveries.filter((d) => d.id !== id));
    toast.success("Product delivery deleted");
  };

  const toggleDeliveryComplete = (id: string) => {
    setProductDeliveries(
      productDeliveries.map((d) =>
        d.id === id ? { ...d, delivered: !d.delivered } : d
      )
    );
  };

  // Social Media Checks
  const addSocialMediaCheck = (check: Omit<SocialMediaCheck, "id">) => {
    const newCheck = { ...check, id: Date.now().toString() };
    setSocialMediaChecks([...socialMediaChecks, newCheck]);
    toast.success("Social media check added");
  };

  const updateSocialMediaCheck = (check: SocialMediaCheck) => {
    setSocialMediaChecks(socialMediaChecks.map((c) => (c.id === check.id ? check : c)));
    toast.success("Social media check updated");
  };

  const deleteSocialMediaCheck = (id: string) => {
    setSocialMediaChecks(socialMediaChecks.filter((c) => c.id !== id));
    toast.success("Social media check deleted");
  };

  const toggleSocialMediaComplete = (id: string) => {
    setSocialMediaChecks(
      socialMediaChecks.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "posted" ? "not-posted" : "posted" }
          : c
      )
    );
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
          <h1 className="text-4xl font-bold text-primary">Task Management Dashboard</h1>
          <p className="text-muted-foreground">Manage your digital marketing tasks efficiently</p>
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
