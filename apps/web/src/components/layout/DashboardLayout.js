'use client';

import { useState } from 'react';
import { Menu, X, Home, User, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout({ children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentSection, setCurrentSection] = useState('home');
    const { user, logout } = useAuth();

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const navigationItems = [
        { id: 'home', label: 'Dashboard', icon: Home, href: '/home' },
        { id: 'profile', label: 'Perfil', icon: User, href: '/profile' },
        { id: 'settings', label: 'Configuración', icon: Settings, href: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
            {/* Sidebar Desktop */}
            <div className={`hidden lg:flex transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg flex-col`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    {!sidebarCollapsed && (
                        <h1 className="text-xl font-bold text-indigo-600">NextRead</h1>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className="p-2"
                    >
                        <Menu className="w-4 h-4" />
                    </Button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 p-4">
                    <div className="space-y-2">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentSection(item.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentSection === item.id
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200">
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className={`w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 ${sidebarCollapsed ? 'justify-center' : 'justify-start'
                            }`}
                    >
                        <LogOut className="w-5 h-5" />
                        {!sidebarCollapsed && <span className="ml-3">Cerrar Sesión</span>}
                    </Button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <div className={`lg:hidden fixed inset-0 z-50 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleSidebar}></div>
                <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
                    {/* Mobile Sidebar Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-indigo-600">NextRead</h1>
                        <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-4">
                        <div className="space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setCurrentSection(item.id);
                                            setSidebarCollapsed(true);
                                        }}
                                        className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentSection === item.id
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Mobile Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 justify-start"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            <span>Cerrar Sesión</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                        <Menu className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-semibold text-gray-900">NextRead</h1>
                    <div className="w-8"></div> {/* Spacer */}
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
} 