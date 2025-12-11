import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, ListCollapse, Grid, Users, Calendar, Settings, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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
} from "@/components/ui/alert-dialog";

const Sidebar = ({ isCollapsed, onCollapse }) => {
    const { user, handleSignOut } = useAuth() || {};

    const handleLogout = async () => {
        await handleSignOut();
    };
    const userRole = 'admin';

    const navLinks = [
        { label: 'Dashboard', href: userRole === 'captain' ? '/captain/dashboard' : '/admin/dashboard', roles: ['admin', 'captain'], icon: <Grid /> },
        { label: 'My Team', href: '/captain/myteams', roles: ['captain'], icon: <Users /> },
        { label: 'Members', href: '/admin/members', roles: ['admin'], icon: <Users /> },
        { label: 'Events', href: userRole === 'captain' ? '/captain/events' : '/admin/events', roles: ['admin', 'captain'], icon: <Calendar /> },
        { label: 'Teams', href: userRole === 'captain' ? '/captain/myteams' : '/admin/teams', roles: ['admin'], icon: <Users /> },
    ];

    const filteredLinks = navLinks.filter(link => link.roles.includes(userRole));

    return (
        <aside className={`bg-gray-800 text-white fixed left-0 h-full top-20 z-20 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <nav className="flex flex-col justify-between h-full p-4">
                <button onClick={onCollapse} className={`mb-4 text-gray-500 hover:text-white flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
                    {isCollapsed ? <ListCollapse /> : <X />}
                </button>
                <ul className="flex-grow">
                    {filteredLinks.map(link => (
                        <li key={link.label} className="mb-2">
                            <NavLink
                                to={link.href}
                                className={({ isActive }) =>
                                    isActive ? "flex items-center p-2 bg-gray-700 rounded-md" : "flex items-center p-2"
                                }
                            >
                                {link.icon}
                                {!isCollapsed && <span className="ml-3">{link.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div className={`flex items-center justify-between mb-20  ${isCollapsed ? 'flex-col gap-3' : 'flex-row'}`}>
                    <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "flex items-center p-2 bg-gray-700 rounded-md" : "flex items-center p-2"}>
                        <Settings />
                        {!isCollapsed && <span className="ml-3">Settings</span>}
                    </NavLink>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <div className='cursor-pointer text-gray-500 hover:text-red-400 transition-all ease-in-out'>
                                <LogOut />
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                                <AlertDialogDescription>This action will sign you out of the application</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
