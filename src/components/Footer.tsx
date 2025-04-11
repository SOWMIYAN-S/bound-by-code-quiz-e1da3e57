
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`p-4 border-t ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
    }`}>
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Python Quiz App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
