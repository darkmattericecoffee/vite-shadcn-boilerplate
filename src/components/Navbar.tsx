import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  BookOpenIcon, 
  GraduationCapIcon, 
  CodeIcon, 
  LayersIcon, 
  GemIcon, 
  MenuIcon, 
  X, 
  MessageCircleCodeIcon,
  BrainIcon,
  CalendarIcon
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <h1 className="text-xl font-bold flex items-center gap-1">
            <BrainIcon size={20} /><MessageCircleCodeIcon size={20} /> <GemIcon size={20} />
              Code Podium
            </h1>
          </Link>
        </div>

        {/* Hamburger Menu Button (Mobile Only) */}
        {isMobile && (
          <button 
            className="p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
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
                <Link to="/timeline">
                  <Button variant={isActive('/timeline') ? 'default' : 'ghost'} className="flex items-center gap-2">
                    <CalendarIcon size={16} />
                    <span>Deadlines</span>
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
        )}
      </div>

      {/* Mobile Menu (Overlay) */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 pt-20">
          <nav className="container mx-auto px-4">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link to="/" onClick={handleLinkClick}>
                  <Button variant={isActive('/') ? 'default' : 'ghost'} className="w-full justify-start items-center gap-2">
                    <HomeIcon size={16} />
                    <span>Home</span>
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" onClick={handleLinkClick}>
                  <Button variant={isActive('/learning-paths') ? 'default' : 'ghost'} className="w-full justify-start items-center gap-2">
                    <LayersIcon size={16} />
                    <span>Leerpaden</span>
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/assignments" onClick={handleLinkClick}>
                  <Button variant={isActive('/assignments') ? 'default' : 'ghost'} className="w-full justify-start items-center gap-2">
                    <BookOpenIcon size={16} />
                    <span>Opdrachten</span>
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/timeline" onClick={handleLinkClick}>
                  <Button variant={isActive('/timeline') ? 'default' : 'ghost'} className="w-full justify-start items-center gap-2">
                    <CalendarIcon size={16} />
                    <span>Deadlines</span>
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/projects" onClick={handleLinkClick}>
                  <Button variant={isActive('/projects') ? 'default' : 'ghost'} className="w-full justify-start items-center gap-2">
                    <CodeIcon size={16} />
                    <span>Projecten</span>
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/students" onClick={handleLinkClick}>
                  <Button variant={isActive('/students') ? 'default' : 'ghost'} className="w-full justify-start items-center gap-2">
                    <GraduationCapIcon size={16} />
                    <span>Leerlingen</span>
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};