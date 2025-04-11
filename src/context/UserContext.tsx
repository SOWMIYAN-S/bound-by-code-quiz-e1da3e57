
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  score?: number;
  completed?: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  allUsers: User[];
  addUser: (user: User) => void;
  updateUserScore: (userId: string, score: number, completed?: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('quizUser');
    const storedUsers = localStorage.getItem('quizAllUsers');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedUsers) {
      setAllUsers(JSON.parse(storedUsers));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('quizUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('quizUser');
    }
  }, [user]);

  useEffect(() => {
    if (allUsers.length) {
      localStorage.setItem('quizAllUsers', JSON.stringify(allUsers));
    }
  }, [allUsers]);

  const addUser = (newUser: User) => {
    setAllUsers(prev => {
      const exists = prev.find(u => u.email === newUser.email);
      if (exists) {
        return prev;
      }
      return [...prev, newUser];
    });
  };

  const updateUserScore = (userId: string, score: number, completed = false) => {
    setAllUsers(prev => 
      prev.map(u => 
        u.id === userId 
          ? { ...u, score, completed } 
          : u
      )
    );
    
    if (user && user.id === userId) {
      setUser({ ...user, score, completed });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      logout,
      allUsers,
      addUser,
      updateUserScore
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
