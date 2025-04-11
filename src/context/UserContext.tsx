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
  deleteUserResponse: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('quizUser');
      const storedUsers = localStorage.getItem('quizAllUsers');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      if (storedUsers) {
        setAllUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      localStorage.removeItem('quizUser');
      localStorage.removeItem('quizAllUsers');
    }
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('quizUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('quizUser');
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (allUsers.length) {
        localStorage.setItem('quizAllUsers', JSON.stringify(allUsers));
      }
    } catch (error) {
      console.error('Error saving all users to localStorage:', error);
    }
  }, [allUsers]);

  const addUser = (newUser: User) => {
    setAllUsers(prev => {
      const exists = prev.find(u => u.email === newUser.email);
      if (exists) {
        return prev.map(u => u.email === newUser.email ? { ...newUser, score: u.score, completed: u.completed } : u);
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

  const deleteUserResponse = (userId: string) => {
    setAllUsers(prev => 
      prev.map(u => 
        u.id === userId 
          ? { ...u, score: undefined, completed: false } 
          : u
      )
    );
    
    if (user && user.id === userId) {
      setUser({ ...user, score: undefined, completed: false });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quizUser');
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      logout,
      allUsers,
      addUser,
      updateUserScore,
      deleteUserResponse
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
