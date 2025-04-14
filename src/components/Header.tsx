
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { Menu, X, FileCheck } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useUser();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className={`border-b p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl sm:text-2xl font-bold font-heading">
          <span className={`text-violet-600 ${theme === 'dark' ? 'text-violet-400' : ''}`}>Bound By</span> Code
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
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
                    <Link 
                      to="/certificate"
                      className={`hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                    >
                      Certificate
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
                  <li>
                    <Link 
                      to="/verify-certificate"
                      className={`hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                    >
                      Verify Certificate
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          
          <button 
            onClick={toggleMobileMenu}
            className="ml-4 text-gray-600 dark:text-gray-200"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`md:hidden py-4 px-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <nav>
            <ul className="flex flex-col gap-4">
              {user ? (
                <>
                  <li>
                    <Link 
                      to="/quiz"
                      className={`block py-2 hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                      onClick={toggleMobileMenu}
                    >
                      Quiz
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/results"
                      className={`block py-2 hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                      onClick={toggleMobileMenu}
                    >
                      Results
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/leaderboard"
                      className={`block py-2 hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                      onClick={toggleMobileMenu}
                    >
                      Leaderboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/certificate"
                      className={`block py-2 hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                      onClick={toggleMobileMenu}
                    >
                      Certificate
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        logout();
                        toggleMobileMenu();
                      }}
                      className={`block py-2 w-full text-left hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
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
                      className={`block py-2 hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                      onClick={toggleMobileMenu}
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/leaderboard"
                      className={`block py-2 hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                      onClick={toggleMobileMenu}
                    >
                      Leaderboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/verify-certificate"
                      className={`block py-2 hover:text-violet-600 ${theme === 'dark' ? 'hover:text-violet-400' : ''}`}
                      onClick={toggleMobileMenu}
                    >
                      Verify Certificate
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
