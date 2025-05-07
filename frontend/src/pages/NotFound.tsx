
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Skull } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Skull className="w-20 h-20 mx-auto mb-6 text-undead-bone opacity-60" />
        <h1 className="text-5xl font-bold mb-4 text-undead-bone">404</h1>
        <h2 className="text-2xl mb-6 text-undead-purple">This Soul Has Passed On</h2>
        <p className="text-lg text-undead-bone text-opacity-70 max-w-md mx-auto mb-8">
          The page you're looking for seems to have been buried or never existed in our realm.
        </p>
        <Link to="/">
          <Button className="ritual-button">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Return to the Crypt Entrance
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
