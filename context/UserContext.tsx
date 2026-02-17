import React, { createContext, useContext, useState } from 'react';
import { Customer } from '../types';

interface UserContextType {
    user: Customer | null;
    login: (email: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Customer | null>(null);

    const login = (email: string) => {
        // Mock login with safe defaults
        setUser({ id: '1', name: 'Guest User', email });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
}