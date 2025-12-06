import { useState, useEffect, useRef } from "react";
import { fetchRecords } from "@/utils/airtableService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import autoAnimate from "@formkit/auto-animate";
import { NavLink } from "react-router-dom";
import {
    Search,
    Award,
    Crown,
    Users,
    Star,
    Calendar,
    ArrowLeft,
    Zap,
    UserCheck,
    Clock
} from "lucide-react";

function ScoreList() {
    const [memberList, setMemberList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tableName = "members";
                const filterBy = "";
                const sortField = "auto";
                const sortDirection = "desc";
                const Records = await fetchRecords(
                    tableName,
                    filterBy,
                    sortField,
                    sortDirection
                );
                const sortedRecords = Records.sort((a, b) => b.fields.Points - a.fields.Points);
                const rankedRecords = sortedRecords.map((record, index) => ({
                    ...record,
                    rank: index + 1,
                }));
                setMemberList(rankedRecords);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredList = memberList.filter((record) =>
        record.fields.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Medal colors for top 3 ranks
    const getRankColor = (rank) => {
        if (rank === 1) return "text-yellow-400";
        if (rank === 2) return "text-gray-300";
        if (rank === 3) return "text-amber-600";
        return "text-gray-400";
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Crown className="w-5 h-5 fill-yellow-400 text-yellow-400" />;
        if (rank === 2) return <Award className="w-5 h-5 fill-gray-300 text-gray-300" />;
        if (rank === 3) return <Award className="w-5 h-5 fill-amber-600 text-amber-600" />;
        return <span className="text-lg font-bold flex gap-2 ml-2 md:block md:ml-0"><span className="md:hidden">Rank </span>{rank}</span>;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col">
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="flex items-center gap-4 flex-col md:flex-row">
                            <NavLink
                                to="/"
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Back to Events
                            </NavLink>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Leaderboard 2024-25
                            </h1>
                        </div>
                        <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700 px-3 py-1">
                            <Calendar size={16} className="mr-1" />
                            Season Points
                        </Badge>
                    </header>

                    {/* Points Legend */}
                    <div className="mt-8 bg-gray-800/30 rounded-lg p-4 border border-gray-700 max-w-2xl mx-auto mb-4">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Star size={20} className="text-yellow-400" />
                            Points System
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                <span className="text-gray-300">Coordinating: </span>
                                <span className="text-blue-400 font-medium">2 points</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                <span className="text-gray-300">Volunteering: </span>
                                <span className="text-orange-400 font-medium">1 point</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <span className="text-gray-300">Attending: </span>
                                <span className="text-green-400 font-medium">1 point</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-700"></div>
                                <span className="text-gray-300">Bonus point: </span>
                                <span className="text-emerald-400 font-medium">special </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative mb-8 max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search members by name..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Table Header - Horizontal on desktop, hidden on mobile */}
                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-700 font-semibold text-gray-400 bg-gray-800/30">
                        <div className="col-span-1 text-center flex items-center justify-center gap-1">
                            <Award size={16} />
                            <span>Rank</span>
                        </div>
                        <div className="col-span-3 flex items-center gap-1">
                            <UserCheck size={16} />
                            <span>Member</span>
                        </div>
                        <div className="col-span-2 text-center flex items-center justify-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                            </span>
                            <span>Coordinated</span>
                        </div>
                        <div className="col-span-2 text-center flex items-center justify-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
                            </span>
                            <span>Volunteered</span>
                        </div>
                        <div className="col-span-2 text-center flex items-center justify-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                            </span>
                            <span>Attended</span>
                        </div>
                        <div className="col-span-2 text-center flex items-center justify-center gap-1">
                            <Zap size={16} className="text-yellow-400" />
                            <span>Points</span>
                        </div>
                    </div>

                    <ul ref={parent} className="md:divide-y divide-gray-700/50">
                        {loading ? (
                            // Skeleton Loaders for mobile and desktop
                            Array.from({ length: 10 }).map((_, index) => (
                                <li key={index} className="p-2">
                                    {/* Mobile View Skeleton */}
                                    <div className="md:hidden border rounded border-gray-800 shadow  p-2">
                                        <div className="flex justify-between items-center mb-3">
                                            <Skeleton className="h-6 w-20 bg-gray-700" />
                                            <Skeleton className="h-6 w-10 bg-gray-700 rounded-full" />
                                        </div>
                                        <Skeleton className="h-5 w-3/4 mb-2 bg-gray-700" />
                                        <Skeleton className="h-4 w-1/2 mb-3 bg-gray-700" />
                                        <div className="flex justify-between">
                                            <div className="text-center">
                                                <Skeleton className="h-4 w-16 mb-1 bg-gray-700 mx-auto" />
                                                <Skeleton className="h-6 w-6 bg-gray-700 mx-auto" />
                                            </div>
                                            <div className="text-center">
                                                <Skeleton className="h-4 w-16 mb-1 bg-gray-700 mx-auto" />
                                                <Skeleton className="h-6 w-6 bg-gray-700 mx-auto" />
                                            </div>
                                            <div className="text-center">
                                                <Skeleton className="h-4 w-16 mb-1 bg-gray-700 mx-auto" />
                                                <Skeleton className="h-6 w-6 bg-gray-700 mx-auto" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop View Skeleton */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-1 flex justify-center">
                                            <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                                        </div>
                                        <div className="col-span-3">
                                            <Skeleton className="h-5 w-3/4 mb-2 bg-gray-700" />
                                            <Skeleton className="h-4 w-1/2 bg-gray-700" />
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <Skeleton className="h-6 w-6 bg-gray-700" />
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <Skeleton className="h-6 w-6 bg-gray-700" />
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <Skeleton className="h-6 w-6 bg-gray-700" />
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <Skeleton className="h-6 w-10 bg-gray-700" />
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : filteredList.length > 0 ? (
                            filteredList.map((record, index) => (
                                <li
                                    key={record.id}
                                    className="p-4 hover:bg-gray-700/30 transition-colors duration-200 border rounded border-gray-800 shadow mb-1 md:mb-0 md:border-0 md:shadow-none "
                                >
                                    {/* Mobile View */}
                                    <div className="md:hidden ">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${record.rank <= 3 ? 'bg-gray-700' : ''}`}>
                                                <span className={getRankColor(record.rank)}>
                                                    {getRankIcon(record.rank)}
                                                </span>
                                            </div>
                                            <div className="text-xl font-bold text-purple-400">
                                                {record.fields.Points || 0} pt
                                            </div>
                                        </div>

                                        <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-1">
                                            {record.fields.name}
                                            {record.fields.Active && (
                                                <Badge className="bg-green-500/20 text-green-300 text-xs border-green-500/30">
                                                    Active
                                                </Badge>
                                            )}
                                        </h2>
                                        <p className="text-sm text-gray-400 mb-4">
                                            {record.fields.Position} • {record.fields.department} • {record.fields.Batch}
                                        </p>

                                        <div className="flex justify-between">
                                            <div className="text-center">
                                                <div className="text-xs text-gray-400 mb-1">Coordinated</div>
                                                <div className="text-lg font-bold text-blue-400">
                                                    {record.fields.Events_Coordinated || 0}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs text-gray-400 mb-1">Volunteered</div>
                                                <div className="text-lg font-bold text-orange-400">
                                                    {record.fields.Events_Volunteer || 0}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs text-gray-400 mb-1">Attended</div>
                                                <div className="text-lg font-bold text-green-400">
                                                    {record.fields.Events_Attended || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop View */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-1 flex justify-center">
                                            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${record.rank <= 3 ? 'bg-gray-700' : ''}`}>
                                                <span className={getRankColor(record.rank)}>
                                                    {getRankIcon(record.rank)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="col-span-3">
                                            <h2 className="text-lg font-medium text-white flex items-center gap-2">
                                                {record.fields.name}
                                                {record.fields.Active && (
                                                    <Badge className="bg-green-500/20 text-green-300 text-xs border-green-500/30">
                                                        Active
                                                    </Badge>
                                                )}
                                            </h2>
                                            <p className="text-sm text-gray-400">
                                                {record.fields.Position} • {record.fields.department} • {record.fields.Batch}
                                            </p>
                                        </div>

                                        <div className="col-span-2 text-center">
                                            <p className="text-xl font-bold text-blue-400">
                                                {record.fields.Events_Coordinated || 0}
                                            </p>
                                        </div>

                                        <div className="col-span-2 text-center">
                                            <p className="text-xl font-bold text-orange-400">
                                                {record.fields.Events_Volunteer || 0}
                                            </p>
                                        </div>

                                        <div className="col-span-2 text-center">
                                            <p className="text-xl font-bold text-green-400">
                                                {record.fields.Events_Attended || 0}
                                            </p>
                                        </div>

                                        <div className="col-span-2 text-center">
                                            <p className="text-xl font-bold text-purple-400">
                                                {record.fields.Points || 0}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="text-center py-12">
                                <Users size={48} className="mx-auto text-gray-500 mb-4" />
                                <h3 className="text-xl font-medium text-gray-300 mb-2">No members found</h3>
                                <p className="text-gray-500">Try adjusting your search query</p>
                            </li>
                        )}
                    </ul>
                </div>


                {/* </div> */}
            </main>

            <footer className="py-3 text-center text-gray-500 text-sm border-t border-gray-800/50 bg-gray-900/50">
                <p className="flex items-center justify-center gap-1">
                    Maintained with <Clock size={16} className="text-blue-400" /> by the maintainer.
                </p>
            </footer>
        </div>
    );
}

export default ScoreList;