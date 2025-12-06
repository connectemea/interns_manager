import React, { useState, useEffect } from 'react';
import {
    Users,
    Mail,
    Phone,
    Crown,
    Shield,
    Plus,
    Search,
    Filter,
    Edit,
    MoreVertical,
    MailIcon,
    PhoneCall,
    UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for teams and captains
const mockTeamsData = [
    {
        id: 1,
        name: "Team A",
        members: 28,
        totalPoints: 1560,
        rank: 1,
        captains: [
            {
                id: 1,
                name: "Alex Johnson",
                email: "alex.johnson@iedc.com",
                phone: "+91 9876543210",
                position: "Lead Captain",
                avatar: "AJ"
            },
            {
                id: 2,
                name: "Sarah Williams",
                email: "sarah.williams@iedc.com",
                phone: "+91 9876543211",
                position: "Co-Captain",
                avatar: "SW"
            }
        ],
        performance: "Excellent",
        joinCode: "TEAM-A-2024"
    },
    {
        id: 2,
        name: "Team B",
        members: 31,
        totalPoints: 1720,
        rank: 2,
        captains: [
            {
                id: 3,
                name: "Mike Chen",
                email: "mike.chen@iedc.com",
                phone: "+91 9876543212",
                position: "Lead Captain",
                avatar: "MC"
            },
            {
                id: 4,
                name: "Emily Davis",
                email: "emily.davis@iedc.com",
                phone: "+91 9876543213",
                position: "Co-Captain",
                avatar: "ED"
            }
        ],
        performance: "Good",
        joinCode: "TEAM-B-2024"
    },
    {
        id: 3,
        name: "Team C",
        members: 28,
        totalPoints: 1300,
        rank: 3,
        captains: [
            {
                id: 5,
                name: "David Kim",
                email: "david.kim@iedc.com",
                phone: "+91 9876543214",
                position: "Lead Captain",
                avatar: "DK"
            },
            {
                id: 6,
                name: "Lisa Patel",
                email: "lisa.patel@iedc.com",
                phone: "+91 9876543215",
                position: "Co-Captain",
                avatar: "LP"
            }
        ],
        performance: "Improving",
        joinCode: "TEAM-C-2024"
    }
];

function Teams() {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTeams, setFilteredTeams] = useState(mockTeamsData);

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = mockTeamsData.filter(team =>
                team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                team.captains.some(captain =>
                    captain.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            setFilteredTeams(filtered);
        } else {
            setFilteredTeams(mockTeamsData);
        }
    }, [searchQuery]);

    const getPerformanceColor = (performance) => {
        switch (performance) {
            case "Excellent": return "bg-green-100 text-green-800";
            case "Good": return "bg-blue-100 text-blue-800";
            case "Improving": return "bg-amber-100 text-amber-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1: return "bg-yellow-100 text-yellow-800";
            case 2: return "bg-gray-100 text-gray-800";
            case 3: return "bg-amber-100 text-amber-800";
            default: return "bg-blue-100 text-blue-800";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <Skeleton className="h-10 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <Card key={item} className="overflow-hidden">
                                <CardHeader>
                                    <Skeleton className="h-6 w-32 mb-2" />
                                    <Skeleton className="h-4 w-48" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-20 w-full mb-4" />
                                    <Skeleton className="h-10 w-full" />
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
                                Teams & Captains
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Manage teams and their leadership structure
                            </p>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2 cursor-not-allowed" disabled>
                            <Plus className="w-5 h-5" />
                            Add New Team
                        </Button>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-gray-100 rounded-lg p-4 shadow-sm border">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search teams or captains..."
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

                {/* Teams Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {filteredTeams.map((team) => (
                        <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <CardTitle className="text-2xl text-gray-900">{team.name}</CardTitle>
                                    <Badge className={getRankBadge(team.rank)}>
                                        #{team.rank}
                                    </Badge>
                                </div>
                                <CardDescription className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {team.members} members
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Crown className="w-4 h-4" />
                                        {team.totalPoints} points
                                    </span>
                                </CardDescription>
                                <div className="flex items-center gap-2 mt-3">
                                    <Badge variant="outline" className={getPerformanceColor(team.performance)}>
                                        {team.performance}
                                    </Badge>
                                    <Badge variant="outline" className="bg-gray-100 text-gray-700">
                                        Code: {team.joinCode}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6">
                                {/* Captains Section */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <UserCheck className="w-5 h-5 text-blue-600" />
                                        Team Captains
                                    </h3>

                                    <div className="space-y-4">
                                        {team.captains.map((captain) => (
                                            <div key={captain.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="font-semibold text-blue-600">{captain.avatar}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{captain.name}</h4>
                                                        <p className="text-sm text-gray-500">{captain.position}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                                                        <MailIcon className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-green-600">
                                                        <PhoneCall className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>

                                    {team.captains.map((captain) => (
                                        <div key={captain.id} className="text-sm text-gray-600 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span>{captain.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span>{captain.phone}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-6 pt-4 border-t">
                                    <Button variant="outline" className="flex-1 border-gray-300 text-gray-700">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Team
                                    </Button>
                                    <Button variant="ghost" size="icon" className="border-gray-300">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredTeams.length === 0 && (
                    <div className="text-center py-12 bg-gray-100 rounded-xl shadow-sm border">
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams found</h3>
                        <p className="text-gray-600">
                            {searchQuery ? "Try adjusting your search query" : "No teams have been created yet"}
                        </p>
                    </div>
                )}

                {/* Stats Footer */}
                <div className="mt-8 bg-gray-100 rounded-xl shadow-sm border p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{mockTeamsData.length}</div>
                            <div className="text-sm text-gray-600">Total Teams</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {mockTeamsData.reduce((sum, team) => sum + team.members, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Members</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">
                                {mockTeamsData.reduce((sum, team) => sum + team.totalPoints, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Points</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {mockTeamsData.reduce((sum, team) => sum + team.captains.length, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Team Captains</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Teams;