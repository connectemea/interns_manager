import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Trophy,
  TrendingUp,
  Target,
  BarChart3,
  PieChart,
  Award,
  Star,
  Clock,
  LoaderPinwheel,
  Crown
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Mock data for demonstration - replace with your actual data
const mockData = {
  totalMembers: 87,
  totalEvents: 24,
  upcomingEvents: 3,
  totalPoints: 1580,
  teams: [
    { name: 'Team A', members: 28, events: 9, points: 560 },
    { name: 'Team B', members: 31, events: 8, points: 720 },
    { name: 'Team C', members: 28, events: 7, points: 300 }
  ],
  topPerformers: [
    { name: 'Alex Johnson', points: 320, role: 'Coordinator' },
    { name: 'Sarah Williams', points: 295, role: 'Volunteer' },
    { name: 'Mike Chen', points: 280, role: 'Member' }
  ],
  eventStats: {
    coordinated: 12,
    volunteered: 18,
    attended: 24
  }
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockData);

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
          <LoaderPinwheel className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-white">Loading Dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your teams.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            icon={<Users className="w-6 h-6" />}
            color="blue"
            change="+5% from last month"
          />
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={<Calendar className="w-6 h-6" />}
            color="green"
            change="3 upcoming events"
          />
          <StatCard
            title="Total Points"
            value={stats.totalPoints}
            icon={<Trophy className="w-6 h-6" />}
            color="amber"
            change="+12% from last month"
          />
          <StatCard
            title="Active Participants"
            value={63}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            change="72% engagement rate"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Teams Overview */}
          <div className="lg:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Teams Performance</h2>
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-4">
              {stats.teams.map((team, index) => (
                <TeamProgress
                  key={index}
                  name={team.name}
                  members={team.members}
                  events={team.events}
                  points={team.points}
                  maxPoints={Math.max(...stats.teams.map(t => t.points))}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Top Performers</h2>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-4">
              {stats.topPerformers.map((performer, index) => (
                <TopPerformer
                  key={index}
                  rank={index + 1}
                  name={performer.name}
                  points={performer.points}
                  role={performer.role}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Statistics */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Event Statistics</h2>
              <BarChart3 className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-4">
              <StatBar
                label="Events Coordinated"
                value={stats.eventStats.coordinated}
                max={stats.totalEvents}
                color="blue"
              />
              <StatBar
                label="Events Volunteered"
                value={stats.eventStats.volunteered}
                max={stats.totalEvents}
                color="orange"
              />
              <StatBar
                label="Events Attended"
                value={stats.eventStats.attended}
                max={stats.totalEvents}
                color="green"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <NavLink
                to="/admin/events"
                className="flex items-center justify-between p-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg border border-blue-500/30 transition-colors"
              >
                <span className="text-white">Manage Events</span>
                <Calendar className="w-5 h-5 text-blue-400" />
              </NavLink>
              <NavLink
                to="/admin/members"
                className="flex items-center justify-between p-4 bg-green-600/20 hover:bg-green-600/30 rounded-lg border border-green-500/30 transition-colors"
              >
                <span className="text-white">View Members</span>
                <Users className="w-5 h-5 text-green-400" />
              </NavLink>
              <NavLink
                to="/admin/teams"
                className="flex items-center justify-between p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/30 transition-colors"
              >
                <span className="text-white">Team Management</span>
                <Users className="w-5 h-5 text-purple-400" />
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
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/20 border-green-500/30 text-green-400',
    amber: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400'
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 mb-2">{title}</p>
      <p className="text-sm text-gray-500">{change}</p>
    </div>
  );
};

// Team Progress Component
const TeamProgress = ({ name, members, events, points, maxPoints, rank }) => {
  const percentage = (points / maxPoints) * 100;

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-400';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
      <div className="flex items-center">
        <span className={`text-lg font-bold mr-4 ${getRankColor(rank)}`}>#{rank}</span>
        <div>
          <h4 className="text-white font-medium">{name}</h4>
          <p className="text-sm text-gray-400">{members} members • {events} events</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-white font-bold">{points} pts</div>
        <div className="w-20 h-2 bg-gray-600 rounded-full mt-1">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Top Performer Component
const TopPerformer = ({ rank, name, points, role }) => {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 fill-yellow-400 text-yellow-400" />;
    if (rank === 2) return <Award className="w-5 h-5 fill-gray-300 text-gray-300" />;
    if (rank === 3) return <Award className="w-5 h-5 fill-amber-600 text-amber-600" />;
    return <span className="text-lg font-bold">{rank}</span>;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
      <div className="flex items-center">
        <div className="mr-3">
          {getRankIcon(rank)}
        </div>
        <div>
          <h4 className="text-white font-medium">{name}</h4>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
      <div className="text-amber-400 font-bold flex items-center">
        <Star className="w-4 h-4 fill-amber-400 mr-1" />
        {points}
      </div>
    </div>
  );
};

// Stat Bar Component
const StatBar = ({ label, value, max, color }) => {
  const percentage = (value / max) * 100;
  const colorClasses = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500'
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
      <div className="w-full h-3 bg-gray-700 rounded-full">
        <div
          className={`h-3 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Dashboard;