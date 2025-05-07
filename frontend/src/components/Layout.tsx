
import { useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { IdentityContext, OrderContext, OrderStatusContext } from "@/App";
import { ShoppingCart, Skull, Menu as MenuIcon, List, VolumeX, Volume } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Layout = () => {
  const { identity } = useContext(IdentityContext);
  const { orderItems } = useContext(OrderContext);
  const { activeOrder } = useContext(OrderStatusContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Determined theme based on identity
  const themeClass = identity === "zombie" ? "zombie-theme" : identity === "mummy" ? "mummy-theme" : "";

  return (
    <div className={`min-h-screen flex flex-col ${themeClass}`}>
      {/* Header */}
      <header className="bg-undead-dark bg-opacity-90 shadow-lg border-b border-undead-purple sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Skull className="h-8 w-8 text-undead-bone" />
            <span className="text-2xl font-bold text-undead-bone">The Undead Buffet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/identity" className="text-undead-bone hover:text-undead-purple transition-colors">
              Choose Identity
            </Link>
            <Link to="/menu" className="text-undead-bone hover:text-undead-purple transition-colors">
              Cursed Rooms
            </Link>
            {activeOrder ? (
              <Button 
                variant="outline" 
                className="relative text-undead-bone border-undead-purple hover:bg-undead-purple/20"
                onClick={() => navigate("/order")}
              >
                <List className="h-5 w-5 mr-2" />
                View Order Status
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="relative"
                onClick={() => navigate("/order")}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-undead-blood text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-undead-dark border-undead-purple">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link 
                  to="/identity" 
                  className="text-lg text-undead-bone hover:text-undead-purple transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Choose Identity
                </Link>
                <Link 
                  to="/menu" 
                  className="text-lg text-undead-bone hover:text-undead-purple transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cursed Rooms
                </Link>
                {activeOrder ? (
                  <Button 
                    variant="outline" 
                    className="relative text-undead-bone border-undead-purple hover:bg-undead-purple/20"
                    onClick={() => {
                      navigate("/order");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <List className="h-5 w-5 mr-2" />
                    View Order Status
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="relative"
                    onClick={() => {
                      navigate("/order");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Order Cart
                    {totalItems > 0 && (
                      <span className="ml-2 bg-undead-blood text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-undead-dark bg-opacity-90 border-t border-undead-purple text-undead-bone py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 The Undead Buffet – Fine Dining for Zombies & Mummies</p>
          <p className="mt-2 text-sm text-undead-bone text-opacity-70">
            We don't serve the living. Unless they're on the menu.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
