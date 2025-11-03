import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Download, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

interface TeamMember {
  id: string;
  description: string;
  phone: string;
  salary: number;
  target_videos: number;
}

export default function TeamTracking() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMember = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("team_members").insert({
        user_id: user.id,
        description: "New Member",
        phone: "",
        salary: 0,
        target_videos: 0,
      });

      if (error) throw error;
      await fetchTeamMembers();
      toast({ title: "Member added successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateMember = async (id: string, field: keyof TeamMember, value: string | number) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
      await fetchTeamMembers();
      toast({ title: "Member deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      teamMembers.map((member, index) => ({
        Nom: index + 1,
        Description: member.description,
        Tell: member.phone,
        Salary: `$${member.salary.toFixed(2)}`,
        "Target Videos": member.target_videos,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Team");
    XLSX.writeFile(workbook, "team_tracking.xlsx");
    toast({ title: "Excel file downloaded successfully" });
  };

  const totalSalary = teamMembers.reduce((sum, m) => sum + Number(m.salary), 0);
  const avgSalary = teamMembers.length > 0 ? totalSalary / teamMembers.length : 0;
  const totalTargetVideos = teamMembers.reduce((sum, m) => sum + Number(m.target_videos), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="team">Team Tracker</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Dashboard content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teamMembers.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Average Salary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${avgSalary.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Target Videos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalTargetVideos}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Table Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Team Members</CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={addMember} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                      <Button onClick={exportToExcel} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export to Excel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-center py-8 text-muted-foreground">Loading...</p>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px]">Nom</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Tell</TableHead>
                            <TableHead>Salary</TableHead>
                            <TableHead>Target Videos</TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teamMembers.map((member, index) => (
                            <TableRow
                              key={member.id}
                              className={
                                member.target_videos < 3
                                  ? "bg-destructive/10 hover:bg-destructive/20"
                                  : ""
                              }
                            >
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell>
                                <Input
                                  value={member.description}
                                  onChange={(e) =>
                                    updateMember(member.id, "description", e.target.value)
                                  }
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={member.phone}
                                  onChange={(e) =>
                                    updateMember(member.id, "phone", e.target.value)
                                  }
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">$</span>
                                  <Input
                                    type="number"
                                    value={member.salary}
                                    onChange={(e) =>
                                      updateMember(
                                        member.id,
                                        "salary",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="h-8"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    value={member.target_videos}
                                    onChange={(e) =>
                                      updateMember(
                                        member.id,
                                        "target_videos",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="h-8"
                                  />
                                  {member.target_videos < 3 && (
                                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => deleteMember(member.id)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Total Salary */}
                  <div className="mt-4 flex justify-end">
                    <Card className="w-64">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Total Salary:</span>
                          <span className="text-xl font-bold text-primary">
                            ${totalSalary.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reports content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
