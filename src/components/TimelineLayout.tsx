// src/components/layout/TimelineLayout.tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.js';
import { Footer } from './Footer.js';
import { UpcomingHolidaysSidebar } from './timeline/upcomingHolidaysSidebar.js';

const TimelineLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <main className="flex-1">
            <Outlet />
          </main>
          <aside className="w-full md:w-72 shrink-0 md:sticky md:top-8 md:self-start">
            <UpcomingHolidaysSidebar />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export { TimelineLayout };