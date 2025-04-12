
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

const Header = () => {
  const { user, logout } = useUser();
  const { theme } = useTheme();
  
  return (
    <header className={`border-b p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          <span className={`text-violet-600 ${theme === 'dark' ? 'text-violet-400' : ''}`}>Bound By</span> Code
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <nav>
            <ul className="flex gap-6">
              {user ? (
                <>
                  <li>
                    <Link 
                      to="/quiz"
                      className={`hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                    >
                      Quiz
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/results"
                      className={`hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                    >
                      Results
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/leaderboard"
                      className={`hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                    >
                      Leaderboard
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={logout}
                      className={`hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/register"
                      className={`hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/leaderboard"
                      className={`hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                    >
                      Leaderboard
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
