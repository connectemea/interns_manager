import { useState, useEffect, useRef } from "react";
import { fetchRecords, fetchSingleRecord } from "@/utils/airtableService";
import { Pencil, Trash2, Plus, Calendar, MapPin, Users, Clock, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useAuth } from '@/context/AuthContext';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTrigger,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTrigger,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const SkeletonLoader = ({ count }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                    <Skeleton className="h-48 w-full bg-gray-200" />
                    <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2 bg-gray-200" />
                        <Skeleton className="h-4 w-1/2 mb-4 bg-gray-200" />
                        <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
                        <Skeleton className="h-4 w-2/3 bg-gray-200" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

function EventManage() {
    const [eventList, setEventList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [membersList, setMembersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expanded, setExpanded] = useState({ coordinators: {}, volunteers: {}, attendees: {} });
    const authContext = useAuth();
    const { user, role: userRole } = authContext || {};
    const navigate = useNavigate();
    const { toast } = useToast()
    const [parent] = useAutoAnimate()

    const fetchEvents = async () => {
        try {
            let filterParams = "";
            if (userRole !== 'admin') {
                filterParams = `{Created_by}="${user?.displayName}"`;
            }
            const Records = await fetchRecords("Events", filterParams, "auto", "desc");
            setEventList(Records);
            setFilteredList(Records);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const records = await fetchRecords("members", "", "auto", "desc");
            const memberDetails = records.map(record => ({
                id: record.id,
                name: record.fields.name,
                department: record.fields.department,
                batch: record.fields.Batch
            }));
            setMembersList(memberDetails);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchMembers();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = eventList.filter(event =>
                event.fields.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.fields.Type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.fields.Venue?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredList(filtered);
        } else {
            setFilteredList(eventList);
        }
    }, [searchQuery, eventList]);

    const getMemberDetailsById = (id) => {
        const member = membersList.find((record) => record.id === id);
        return member ? { name: member.name, department: member.department, batch: member.batch } : { name: "Unknown Member", department: "Unknown Department", batch: "Unknown Batch" };
    };

    const handleViewToggle = (type, index) => {
        setExpanded(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [index]: !prev[type][index]
            }
        }));
    };

    const handleNavigate = (id) => {
        const basePath = userRole === 'captain' ? '/captain/events' : '/admin/events';
        navigate(id === 'new' ? `${basePath}/new` : `${basePath}/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await fetchSingleRecord('Events', id, 'DELETE');
            toast({
                title: "Event Deleted",
                description: "Event has been successfully deleted.",
                variant: "success",
            });
            fetchEvents();
        } catch (error) {
            console.error('Error Deleting:', error);
            toast({
                title: "Error",
                description: "Failed to delete event. Please try again.",
                variant: "destructive",
            });
        }
    };

    const getModeBadge = (mode) => {
        const modeColors = {
            'Online': 'bg-blue-100 text-blue-800',
            'Offline': 'bg-green-100 text-green-800',
            'Both': 'bg-purple-100 text-purple-800'
        };
        return modeColors[mode] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-blue-600" />
                                Events Management
                            </h1>
                            <p className="text-gray-400 mt-2">
                                {userRole === 'admin' ? 'All events across the organization' : 'Events created by you'}
                            </p>
                        </div>
                        <Button
                            onClick={() => handleNavigate('new')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Event
                        </Button>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-gray-100 rounded-lg p-4 shadow-sm border">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search events by name, type, or venue..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border-gray-300"
                                />
                            </div>
                            <Button variant="outline" className="border-gray-300 text-gray-700">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                <div ref={parent}>
                    {loading ? (
                        <SkeletonLoader count={6} />
                    ) : filteredList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredList.map((record) => {
                                const coordinators = record.fields.Coordinators || [];
                                const volunteers = record.fields.Volunteers || [];
                                const attendees = record.fields.Attendees || [];

                                return (
                                    <Card key={record.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
                                        {/* Event Image */}
                                        {record.fields.Image?.[0]?.url && (
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={record.fields.Image[0].url}
                                                    alt={record.fields.Name}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        )}

                                        <CardHeader className="p-6 pb-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <Badge className={getModeBadge(record.fields.Mode)}>
                                                    {record.fields.Mode}
                                                </Badge>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleNavigate(record.id)}
                                                        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    {userRole === 'admin' && (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete "{record.fields.Name}"? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(record.id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Delete Event
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {record.fields.Name}
                                            </h3>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{record.fields.Venue}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDate(record.fields.Date)}</span>
                                            </div>

                                            <Badge variant="outline" className="bg-gray-100 text-gray-700">
                                                {record.fields.Type}
                                            </Badge>
                                        </CardHeader>

                                        <CardContent className="p-6 pt-0">
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                                {record.fields.Description}
                                            </p>

                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {coordinators.length} Coordinators
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {volunteers.length} Volunteers
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {attendees.length} Attendees
                                                </span>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="p-6 pt-0">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button variant="outline" className="w-full">
                                                        View Details
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                                                    <SheetHeader className="mb-6">
                                                        <SheetTitle>{record.fields.Name}</SheetTitle>
                                                        <SheetDescription>
                                                            Event details and participant information
                                                        </SheetDescription>
                                                    </SheetHeader>

                                                    <div className="space-y-6">
                                                        {/* Event Details */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className={getModeBadge(record.fields.Mode)}>
                                                                    {record.fields.Mode}
                                                                </Badge>
                                                                <Badge variant="outline">
                                                                    {record.fields.Type}
                                                                </Badge>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                                    <span>{record.fields.Venue}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                                    <span>{formatDate(record.fields.Date)}</span>
                                                                </div>
                                                            </div>

                                                            <p className="text-gray-700">{record.fields.Description}</p>

                                                            {record.fields.Created_by && (
                                                                <p className="text-sm text-gray-500">
                                                                    Created by: {record.fields.Created_by}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Participants */}
                                                        <div className="space-y-4">
                                                            <ParticipantSection
                                                                title="Coordinators"
                                                                participants={coordinators}
                                                                expanded={expanded.coordinators[record.id]}
                                                                onToggle={() => handleViewToggle('coordinators', record.id)}
                                                                getMemberDetails={getMemberDetailsById}
                                                            />

                                                            <ParticipantSection
                                                                title="Volunteers"
                                                                participants={volunteers}
                                                                expanded={expanded.volunteers[record.id]}
                                                                onToggle={() => handleViewToggle('volunteers', record.id)}
                                                                getMemberDetails={getMemberDetailsById}
                                                            />

                                                            <ParticipantSection
                                                                title="Attendees"
                                                                participants={attendees}
                                                                expanded={expanded.attendees[record.id]}
                                                                onToggle={() => handleViewToggle('attendees', record.id)}
                                                                getMemberDetails={getMemberDetailsById}
                                                            />
                                                        </div>
                                                    </div>

                                                    <SheetFooter className="mt-6">
                                                        <SheetClose asChild>
                                                            <Button>Close</Button>
                                                        </SheetClose>
                                                    </SheetFooter>
                                                </SheetContent>
                                            </Sheet>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-100 rounded-xl shadow-sm border">
                            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchQuery ? "No events found" : "No events yet"}
                            </h3>
                            <p className="text-gray-600">
                                {searchQuery ? "Try adjusting your search query" : "Get started by creating your first event"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Participant Section Component
const ParticipantSection = ({ title, participants, expanded, onToggle, getMemberDetails }) => (
    <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <span className="text-sm text-gray-500">{participants.length} members</span>
        </div>

        <div className="space-y-2">
            {participants.slice(0, expanded ? participants.length : 3).map((id, index) => {
                const { name, department, batch } = getMemberDetails(id);
                return (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                            <p className="text-xs text-gray-500">{department} • {batch}</p>
                        </div>
                    </div>
                );
            })}
        </div>

        {participants.length > 3 && (
            <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-blue-600 hover:text-blue-700 mt-2"
            >
                {expanded ? "Show less" : `View all ${participants.length} ${title.toLowerCase()}`}
            </Button>
        )}

        {participants.length === 0 && (
            <p className="text-gray-500 text-sm">No {title.toLowerCase()}</p>
        )}
    </div>
);

export default EventManage;