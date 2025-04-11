
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';

const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 
            className="text-xl md:text-2xl font-bold text-violet-700 cursor-pointer"
            onClick={() => navigate('/')}
          >
            Code Quest <span className="text-violet-900">Season 2</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://www.instagram.com/bound_by_code" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-violet-700 hover:text-violet-900 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          
          {user && (
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="hidden sm:flex"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
