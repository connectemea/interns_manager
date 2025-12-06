import React, { useState, useEffect } from 'react';
import {
    Users,
    Mail,
    Phone,
    Crown,
    Award,
    TrendingUp,
    Filter,
    Search,
    Plus,
    MessageCircle,
    Calendar,
    Target,
    BarChart3,
    UserPlus,
    Shield,
    Star,
    CheckCircle,
    Clock,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for team members
const mockTeamData = {
    teamName: "Team Alpha",
    teamCode: "ALPHA-2024",
    totalMembers: 15,
    activeMembers: 12,
    totalPoints: 1240,
    teamRank: 2,
    performance: "Excellent",
    captain: {
        name: "Alex Johnson",
        email: "alex.johnson@iedc.com",
        phone: "+91 9876543210"
    },
    members: [
        {
            id: 1,
            name: "Sarah Williams",
            email: "sarah.williams@iedc.com",
            phone: "+91 9876543211",
            position: "Content Writer",
            points: 145,
            eventsAttended: 8,
            eventsCoordinated: 3,
            status: "active",
            joinDate: "2024-01-15",
            performance: "Excellent",
            avatar: "SW"
        },
        {
            id: 2,
            name: "Mike Chen",
            email: "mike.chen@iedc.com",
            phone: "+91 9876543212",
            position: "Graphic Designer",
            points: 128,
            eventsAttended: 6,
            eventsCoordinated: 2,
            status: "active",
            joinDate: "2024-01-20",
            performance: "Good",
            avatar: "MC"
        },
        {
            id: 3,
            name: "Emily Davis",
            email: "emily.davis@iedc.com",
            phone: "+91 9876543213",
            position: "Developer",
            points: 98,
            eventsAttended: 5,
            eventsCoordinated: 1,
            status: "active",
            joinDate: "2024-02-05",
            performance: "Good",
            avatar: "ED"
        },
        {
            id: 4,
            name: "David Kim",
            email: "david.kim@iedc.com",
            phone: "+91 9876543214",
            position: "Marketing",
            points: 76,
            eventsAttended: 4,
            eventsCoordinated: 0,
            status: "active",
            joinDate: "2024-02-15",
            performance: "Average",
            avatar: "DK"
        },
        {
            id: 5,
            name: "Lisa Patel",
            email: "lisa.patel@iedc.com",
            phone: "+91 9876543215",
            position: "Video Editor",
            points: 112,
            eventsAttended: 7,
            eventsCoordinated: 2,
            status: "inactive",
            joinDate: "2024-01-10",
            performance: "Good",
            avatar: "LP"
        }
    ],
    recentActivity: [
        { action: "Points Added", member: "Sarah Williams", points: 15, timestamp: "2 hours ago" },
        { action: "Event Completed", member: "Mike Chen", event: "Web Workshop", timestamp: "1 day ago" },
        { action: "New Member", member: "John Doe", timestamp: "2 days ago" },
        { action: "Achievement", member: "Emily Davis", achievement: "Top Performer", timestamp: "3 days ago" }
    ],
    upcomingEvents: [
        { name: "Team Meeting", date: "2024-03-15", time: "3:00 PM", attendees: 12 },
        { name: "Design Workshop", date: "2024-03-20", time: "2:00 PM", attendees: 8 }
    ]
};

function MyTeam() {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("members");
    const [filteredMembers, setFilteredMembers] = useState(mockTeamData.members);

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = mockTeamData.members.filter(member =>
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMembers(filtered);
        } else {
            setFilteredMembers(mockTeamData.members);
        }
    }, [searchQuery]);

    const getPerformanceColor = (performance) => {
        switch (performance) {
            case "Excellent": return "bg-green-100 text-green-800";
            case "Good": return "bg-blue-100 text-blue-800";
            case "Average": return "bg-amber-100 text-amber-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status) => {
        return status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <Skeleton className="h-10 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3, 4].map((item) => (
                            <Card key={item}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-32 mb-2" />
                                    <Skeleton className="h-4 w-48" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-8 w-full mb-2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
                                <Shield className="w-8 h-8 text-blue-600" />
                                My Team: {mockTeamData.teamName}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Team Code: <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                                    {mockTeamData.teamCode}
                                </Badge>
                            </p>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Invite Member
                        </Button>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-white border-blue-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Members</p>
                                        <p className="text-2xl font-bold text-gray-900">{mockTeamData.totalMembers}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <Badge className="mt-2 bg-green-100 text-green-800">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {mockTeamData.activeMembers} Active
                                </Badge>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-amber-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Points</p>
                                        <p className="text-2xl font-bold text-gray-900">{mockTeamData.totalPoints}</p>
                                    </div>
                                    <div className="p-3 bg-amber-100 rounded-full">
                                        <Award className="w-6 h-6 text-amber-600" />
                                    </div>
                                </div>
                                <Badge className="mt-2 bg-blue-100 text-blue-800">
                                    Rank #{mockTeamData.teamRank}
                                </Badge>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-green-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Performance</p>
                                        <p className="text-2xl font-bold text-gray-900">{mockTeamData.performance}</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <BarChart3 className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <Badge className="mt-2 bg-green-100 text-green-800">
                                    <Target className="w-3 h-3 mr-1" />
                                    On Track
                                </Badge>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-purple-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Team Captain</p>
                                        <p className="text-lg font-bold text-gray-900">{mockTeamData.captain.name}</p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <Crown className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs Navigation */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                        <TabsList className="grid grid-cols-3 w-full max-w-md">
                            <TabsTrigger value="members" className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Members
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Activity
                            </TabsTrigger>
                            <TabsTrigger value="events" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Events
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Search Bar */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search team members..."
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

                    {/* Members Tab */}
                    {activeTab === "members" && (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredMembers.map((member) => (
                                <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="font-bold text-blue-600">{member.avatar}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                                    <p className="text-sm text-gray-600">{member.position}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <Badge className={getStatusColor(member.status)}>
                                                            {member.status}
                                                        </Badge>
                                                        <Badge className={getPerformanceColor(member.performance)}>
                                                            {member.performance}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-amber-600 flex items-center gap-1">
                                                    <Star className="w-5 h-5 fill-amber-400" />
                                                    {member.points}
                                                </div>
                                                <p className="text-sm text-gray-500">points</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                                            <div>
                                                <p className="text-sm text-gray-600">Contact</p>
                                                <p className="text-sm font-medium">{member.email}</p>
                                                <p className="text-sm text-gray-500">{member.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Participation</p>
                                                <p className="text-sm">{member.eventsAttended} events • {member.eventsCoordinated} led</p>
                                                <p className="text-sm text-gray-500">Joined: {new Date(member.joinDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4 pt-4 border-t">
                                            <Button variant="outline" className="flex-1 border-gray-300">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Message
                                            </Button>
                                            <Button variant="outline" className="flex-1 border-gray-300">
                                                <Award className="w-4 h-4 mr-2" />
                                                Add Points
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === "activity" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Team actions and achievements</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockTeamData.recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="p-2 bg-blue-100 rounded-full">
                                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">
                                                    {activity.action}: {activity.member}
                                                    {activity.points && ` (+${activity.points} points)`}
                                                    {activity.event && ` - ${activity.event}`}
                                                    {activity.achievement && ` - ${activity.achievement}`}
                                                </p>
                                                <p className="text-sm text-gray-500">{activity.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Events Tab */}
                    {activeTab === "events" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upcoming Events</CardTitle>
                                    <CardDescription>Scheduled team activities</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockTeamData.upcomingEvents.map((event, index) => (
                                            <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <h4 className="font-semibold text-gray-900">{event.name}</h4>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(event.date).toLocaleDateString()} • {event.time}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{event.attendees} attending</p>
                                                    </div>
                                                    <Button variant="ghost" size="sm">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Statistics</CardTitle>
                                    <CardDescription>Team participation metrics</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700">Total Events</span>
                                            <Badge variant="outline">24</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                            <span className="text-gray-700">Completed</span>
                                            <Badge className="bg-green-100 text-green-800">18</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                            <span className="text-gray-700">Upcoming</span>
                                            <Badge className="bg-blue-100 text-blue-800">6</Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                                            <span className="text-gray-700">Attendance Rate</span>
                                            <Badge className="bg-amber-100 text-amber-800">78%</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === "members" && filteredMembers.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
                            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
                            <p className="text-gray-600">
                                {searchQuery ? "Try adjusting your search query" : "No members in your team yet"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyTeam;