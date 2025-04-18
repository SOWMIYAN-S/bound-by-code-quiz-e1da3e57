
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('quizUser');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      localStorage.removeItem('quizUser');
    }
  }, []);

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const { data, error } = await supabase
          .from('quiz_results')
          .select('*')
          .throwOnError(); // Add this to throw errors
        
        if (data) {
          setAllUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Data Fetch Error',
          description: 'Unable to load user data. Please check your connection.',
          variant: 'destructive'
        });
      }
    }
    
    fetchAllUsers();
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

  const addUser = async (newUser: User) => {
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('email', newUser.email)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
      }
      
      if (existingUser) {
        const { error: updateError } = await supabase
          .from('quiz_results')
          .update({
            name: newUser.name,
            phone: newUser.phone,
          })
          .eq('email', newUser.email);
        
        if (updateError) {
          console.error('Error updating user in Supabase:', updateError);
        }
        
        setAllUsers(prev => 
          prev.map(u => u.email === newUser.email 
            ? { ...u, name: newUser.name, phone: newUser.phone } 
            : u
          )
        );
      } else {
        const { error: insertError } = await supabase
          .from('quiz_results')
          .insert({
            id: newUser.id,
            user_id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            score: newUser.score || null,
            completed: newUser.completed || false
          });
        
        if (insertError) {
          console.error('Error adding user to Supabase:', insertError);
          toast({
            title: "Error saving user data",
            description: "There was an issue saving your information. Please try again.",
            variant: "destructive",
          });
        } else {
          setAllUsers(prev => [...prev, newUser]);
        }
      }
    } catch (error) {
      console.error('Error in addUser:', error);
    }
  };

  const updateUserScore = async (userId: string, score: number, completed = false) => {
    try {
      const { error } = await supabase
        .from('quiz_results')
        .update({ score, completed })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error updating user score in Supabase:', error);
        toast({
          title: "Error saving score",
          description: "There was an issue saving your quiz score. Please try again.",
          variant: "destructive",
        });
      } else {
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
      }
    } catch (error) {
      console.error('Error in updateUserScore:', error);
    }
  };

  const deleteUserResponse = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('quiz_results')
        .update({ score: null, completed: false })
        .eq('id', userId);
      
      if (error) {
        console.error('Error resetting user response in Supabase:', error);
        toast({
          title: "Error resetting quiz",
          description: "There was an issue resetting the quiz response. Please try again.",
          variant: "destructive",
        });
      } else {
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
      }
    } catch (error) {
      console.error('Error in deleteUserResponse:', error);
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
