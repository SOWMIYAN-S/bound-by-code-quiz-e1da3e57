
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-white border-t border-violet-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Bound by Code. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/bound_by_code" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-700 hover:text-violet-900 transition-colors flex items-center gap-2"
              aria-label="Instagram"
            >
              <Instagram size={20} />
              <span className="text-sm">@bound_by_code</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
