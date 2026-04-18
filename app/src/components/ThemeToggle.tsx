import { Moon, Sun } from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useApp();

  const toggleTheme = () => {
    if (theme.theme === 'light') {
      setTheme('dark');
    } else if (theme.theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme.theme === 'light') return <Sun className="h-4 w-4" />;
    if (theme.theme === 'dark') return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />; // system defaults to light
  };

  const getLabel = () => {
    if (theme.theme === 'light') return 'Switch to dark mode';
    if (theme.theme === 'dark') return 'Switch to system mode';
    return 'Switch to light mode';
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-10 h-10"
      aria-label={getLabel()}
    >
      {getIcon()}
    </Button>
  );
}