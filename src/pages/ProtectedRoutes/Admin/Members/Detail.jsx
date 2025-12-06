import { useState, useEffect } from "react";
import { fetchRecords, fetchSingleRecord } from "@/utils/airtableService";
import { Pencil, Trash2, Plus, Users, Search, Filter, UserCheck, Phone, Building, Calendar, Award, Star } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function MembersManage() {
  const [resultList, setResultList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      const tableName = "members";
      const filterBy = "";
      const sortField = "auto";
      const sortDirection = "desc";
      const Records = await fetchRecords(
        tableName,
        filterBy,
        sortField,
        sortDirection,
      );
      setResultList(Records);
      setFilteredList(Records);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = resultList.filter(record =>
        record.fields.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.fields.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.fields.Position?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(resultList);
    }
  }, [searchQuery, resultList]);

  const handleClick = () => {
    navigate('/admin/members/new');
  };

  const handleDelete = async (id) => {
    try {
      await fetchSingleRecord('members', id, 'DELETE');
      toast({
        title: "Member Deleted",
        description: "Member has been successfully deleted.",
        variant: "success",
      });
      fetchMembers();
    } catch (error) {
      console.error('Error Deleting:', error);
      toast({
        title: "Error",
        description: "Failed to delete member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/members/${id}`);
  };

  const getPositionColor = (position) => {
    const positionColors = {
      'Lead': 'bg-purple-100 text-purple-800',
      'Program Organizer': 'bg-blue-100 text-blue-800',
      'Content writer': 'bg-green-100 text-green-800',
      'Working member': 'bg-gray-100 text-gray-800',
      'Media': 'bg-pink-100 text-pink-800',
      'Marketing': 'bg-orange-100 text-orange-800',
      'Graphic designer': 'bg-yellow-100 text-yellow-800',
      'Video editor/photographer': 'bg-red-100 text-red-800',
      'Community Manager': 'bg-indigo-100 text-indigo-800',
      'Technical Team': 'bg-teal-100 text-teal-800'
    };
    return positionColors[position] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (active) => {
    return active ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
    ) : (
      <Badge variant="outline" className="text-gray-500">Inactive</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Team Members
              </h1>
              <p className="text-gray-400 mt-2">Manage your organization's members and their details</p>
            </div>
            <Button
              onClick={handleClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search members by name, department, or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border-gray-300"
                />
              </div>
              {/* <Button variant="outline" className="border-gray-300 text-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button> */}
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-8 w-32 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          ) : filteredList.length > 0 ? (
            filteredList.map((record) => (
              <div key={record.id} className="bg-gray-200 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200 p-6 relative group">
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(record.id)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Edit member"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {record.fields.name}? This action cannot be undone and will permanently remove this member from the system.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(record.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Member
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Member Status */}
                <div className="mb-4">
                  {getStatusBadge(record.fields.Active)}
                </div>

                {/* Member Name and Position */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {record.fields.name}
                  </h3>
                  <Badge className={getPositionColor(record.fields.Position)}>
                    {record.fields.Position}
                  </Badge>
                </div>

                {/* Member Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span>{record.fields.department}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{record.fields.phone_number}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Joined: {record.fields.Year_Joined}</span>
                    <span>• Batch: {record.fields.Batch}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    <span>Coordinated: {record.fields.Events_Coordinated || 0} events</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Attended: {record.fields.Events_Attended || 0} events</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Points: {record.fields.Points || 0}</span>
                  </div>
                </div>

                {record.fields.Check_Conflict && (
                  <div className="mt-4 pt-3 border-t">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      ⚠️ Conflict: {record.fields.Check_Conflict}
                    </Badge>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-600">
                {searchQuery ? "Try adjusting your search query" : "Get started by adding your first member"}
              </p>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {!loading && filteredList.length > 0 && (
          <div className="mt-8 bg-gray-200 rounded-xl shadow-sm border p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredList.length}</div>
                <div className="text-sm text-gray-600">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredList.filter(m => m.fields.Active).length}
                </div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredList.reduce((sum, m) => sum + (m.fields.Points || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(filteredList.map(m => m.fields.department)).size}
                </div>
                <div className="text-sm text-gray-600">Departments</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Button component for consistency
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default MembersManage;