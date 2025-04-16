
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6">
        <h1 className="text-8xl font-bold text-brand-purple mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-6">Oops! This page doesn't exist</p>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
