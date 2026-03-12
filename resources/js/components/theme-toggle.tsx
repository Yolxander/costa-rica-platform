import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        const newTheme = appearance === 'dark' ? 'light' : 'dark';
        updateAppearance(newTheme);
    };

    const isDark = appearance === 'dark';

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={toggleTheme}
        >
            {isDark ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
