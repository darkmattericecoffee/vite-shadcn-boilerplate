// src/components/layout/Footer.tsx
export const Footer = () => {
    return (
      <footer className="border-t mt-auto">
        <div className="container mx-auto py-6">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} Student Project Showcase - Created for IT students
          </p>
        </div>
      </footer>
    );
  };