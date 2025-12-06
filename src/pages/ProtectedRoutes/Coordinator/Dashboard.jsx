import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Trophy,
  TrendingUp,
  Target,
  BarChart3,
  Award,
  Star,
  Clock,
  LoaderPinwheel,
  Crown,
  CheckCircle,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Mock data for coordinator dashboard
const mockCoordinatorData = {
  myTeam: {
    totalMembers: 15,
    activeMembers: 12,
    newMembers: 2,
    engagementRate: '85%'
  },
  myEvents: {
    totalEvents: 8,
    upcomingEvents: 2,
    completedEvents: 6,
    attendanceRate: '78%'
  },
  teamPerformance: {
    totalPoints: 1240,
    averagePoints: 82.7,
    rank: 2,
    topPerformer: { name: 'Sarah Williams', points: 145 }
  },
  upcomingEvents: [
    { name: 'Web Development Workshop', date: '2024-01-15', attendees: 23, status: 'confirmed' },
    { name: 'Team Building Session', date: '2024-01-22', attendees: 18, status: 'pending' }
  ],
  recentActivity: [
    { action: 'Event Created', details: 'AI Workshop', timestamp: '2 hours ago' },
    { action: 'Member Added', details: 'John Doe joined team', timestamp: '1 day ago' },
    { action: 'Points Updated', details: 'Team points distributed', timestamp: '2 days ago' }
  ]
};

function CoordinatorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockCoordinatorData);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4">
        <div className="text-center">
          <LoaderPinwheel className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800">Loading Coordinator Dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-400 mb-2">Coordinator Dashboard</h1>
          <p className="text-gray-400">Manage your team and events effectively</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Team Members"
            value={stats.myTeam.totalMembers}
            icon={<Users className="w-6 h-6" />}
            color="blue"
            change={`${stats.myTeam.activeMembers} active`}
          />
          <StatCard
            title="Total Events"
            value={stats.myEvents.totalEvents}
            icon={<Calendar className="w-6 h-6" />}
            color="green"
            change={`${stats.myEvents.upcomingEvents} upcoming`}
          />
          <StatCard
            title="Team Points"
            value={stats.teamPerformance.totalPoints}
            icon={<Trophy className="w-6 h-6" />}
            color="amber"
            change={`Rank #${stats.teamPerformance.rank}`}
          />
          <StatCard
            title="Engagement Rate"
            value={stats.myTeam.engagementRate}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            change="+8% this month"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Team Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Team Overview</h2>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Active Members</span>
                  <span className="text-lg font-bold text-blue-600">{stats.myTeam.activeMembers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">New Members</span>
                  <span className="text-lg font-bold text-green-600">+{stats.myTeam.newMembers}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Avg Points/Member</span>
                  <span className="text-lg font-bold text-amber-600">{stats.teamPerformance.averagePoints}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                  <span className="text-lg font-bold text-purple-600">{stats.myEvents.attendanceRate}</span>
                </div>
              </div>
            </div>

            {/* Top Performer */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Top Performer</h4>
                  <p className="text-sm text-gray-600">{stats.teamPerformance.topPerformer.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-600 flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400" />
                    {stats.teamPerformance.topPerformer.points}
                  </div>
                  <p className="text-sm text-gray-500">points</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-4">
              {stats.upcomingEvents.map((event, index) => (
                <EventCard
                  key={index}
                  name={event.name}
                  date={event.date}
                  attendees={event.attendees}
                  status={event.status}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <ActivityItem
                  key={index}
                  action={activity.action}
                  details={activity.details}
                  timestamp={activity.timestamp}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <NavLink
                to="/captain/events/new"
                className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    {/* <Event className="w-5 h-5 text-blue-600" /> */}
                  </div>
                  <span className="text-gray-900 font-medium">Create New Event</span>
                </div>
                <Calendar className="w-5 h-5 text-blue-400" />
              </NavLink>

              <NavLink
                to="/captain/myteams"
                className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-900 font-medium">Manage Team</span>
                </div>
                <Users className="w-5 h-5 text-green-400" />
              </NavLink>

              <NavLink
                to="/captain/events"
                className="flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-gray-900 font-medium">View Events</span>
                </div>
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </NavLink>

              <NavLink
                to="/scoreboard"
                className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-gray-900 font-medium">Leaderboard</span>
                </div>
                <Award className="w-5 h-5 text-purple-400" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ title, value, icon, color, change }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 mb-2">{title}</p>
      <p className="text-sm text-gray-500">{change}</p>
    </div>
  );
};

// Event Card Component
const EventCard = ({ name, date, attendees, status }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{name}</h4>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-sm text-gray-500">{formattedDate}</span>
          <span className="text-sm text-gray-500">{attendees} attendees</span>
        </div>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'confirmed'
        ? 'bg-green-100 text-green-800'
        : 'bg-yellow-100 text-yellow-800'
        }`}>
        {status}
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ action, details, timestamp }) => {
  return (
    <div className="flex items-start gap-3 p-2">
      <div className="p-2 bg-blue-100 rounded-full mt-1">
        <CheckCircle className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{action}</p>
        <p className="text-sm text-gray-600">{details}</p>
        <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;