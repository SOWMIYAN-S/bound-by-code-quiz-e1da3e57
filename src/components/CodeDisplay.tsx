
import { useTheme } from '@/context/ThemeContext';

interface CodeDisplayProps {
  code: string;
  language?: string;
}

const CodeDisplay = ({ code, language = 'python' }: CodeDisplayProps) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className={`code-container p-4 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {code}
    </div>
  );
};

export default CodeDisplay;
