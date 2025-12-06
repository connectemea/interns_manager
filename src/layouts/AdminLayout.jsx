import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AuthRoleRequire from '../components/router/AuthRole';
import Header from '../components/layout/Admin/Header';
import Sidebar from '../components/layout/Admin/Sidebar';

const AdminLayout = () => {
    const [isCollapsed, setCollapsed] = useState(true);

    const handleCollapse = () => {
        setCollapsed(!isCollapsed);
    };

    return (
        <AuthRoleRequire role="admin">
            <div className='max-h-screen max-w-full h-full bg-gray-800'>
                <Header />
                <div className="flex flex-grow">
                    <Sidebar isCollapsed={isCollapsed} onCollapse={handleCollapse} />
                    <main className={`flex-grow min-h-[100vh] mt-20 overflow-auto bg-gradient-to-br from-gray-900 to-gray-950 p-4 transition-all duration-300 relative z-10 rounded-tl ${!isCollapsed ? 'ml-64' : 'ml-20'}`}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </AuthRoleRequire>
    );
};

export default AdminLayout;
