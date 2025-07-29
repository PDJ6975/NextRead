'use client';

import { useState } from 'react';
import { Menu, X, Home, User, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            {/* El header se integra en DashboardHeader, no aquí */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
} 