import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon, BookOpenIcon, GraduationCapIcon, CodeIcon, LayersIcon, GemIcon } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
        <Link to="/">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <GemIcon size={20} />
          Informatica Podium
        </h1>
              </Link>
          
        </div>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/">
                <Button variant={isActive('/') ? 'default' : 'ghost'} className="flex items-center gap-2">
                  <HomeIcon size={16} />
                  <span>Home</span>
                </Button>
              </Link>
            </li>
         
            <li>
              <Link to="/learning-paths">
                <Button variant={isActive('/learning-paths') ? 'default' : 'ghost'} className="flex items-center gap-2">
                  <LayersIcon size={16} />
                  <span>Leerpaden</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/assignments">
                <Button variant={isActive('/assignments') ? 'default' : 'ghost'} className="flex items-center gap-2">
                  <BookOpenIcon size={16} />
                  <span>Opdrachten</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/projects">
                <Button variant={isActive('/projects') ? 'default' : 'ghost'} className="flex items-center gap-2">
                  <CodeIcon size={16} />
                  <span>Projecten</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/students">
                <Button variant={isActive('/students') ? 'default' : 'ghost'} className="flex items-center gap-2">
                  <GraduationCapIcon size={16} />
                  <span>Leerlingen</span>
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};