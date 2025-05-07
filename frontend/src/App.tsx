import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Room from "./pages/Room";
import NotFound from "./pages/NotFound";
import Identity from "./pages/Identity";
import Checkout from "./pages/Checkout";
import OrderView from "./pages/OrderView";
import OrderHistory from "./pages/OrderHistory";
import Layout from "./components/Layout";
import { GhostChatbot } from "./components/GhostChatbot";
import SoundManager from "./components/SoundManager";
import SpinningWheelPage from "./pages/SpinningWheel";

const queryClient = new QueryClient();

// Create context for user identity (zombie or mummy)
export type UserIdentity = "zombie" | "mummy" | null;
export const IdentityContext = createContext<{
  identity: UserIdentity;
  setIdentity: React.Dispatch<React.SetStateAction<UserIdentity>>;
}>({
  identity: null,
  setIdentity: () => {},
});

// Create context for order items
export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export const OrderContext = createContext<{
  orderItems: OrderItem[];
  addToOrder: (item: Omit<OrderItem, "quantity">) => void;
  removeFromOrder: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearOrder: () => void;
}>({
  orderItems: [],
  addToOrder: () => {},
  removeFromOrder: () => {},
  updateQuantity: () => {},
  clearOrder: () => {},
});

// Create context for the active order status
export interface Order {
  id: string;
  status: "preparing" | "summoning" | "delivering" | "completed";
  items: OrderItem[];
}

export const OrderStatusContext = createContext<{
  activeOrder: Order | null;
  setActiveOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}>({
  activeOrder: null,
  setActiveOrder: () => {},
});

const App = () => {
  const [identity, setIdentity] = useState<UserIdentity>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const addToOrder = (item: Omit<OrderItem, "quantity">) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromOrder = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(id);
      return;
    }
    setOrderItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  // Play page sound effect when changing routes
  useEffect(() => {
    const playPageSound = () => {
      const { playSound } = window as any;
      if (playSound && identity) {
        playSound(identity);
      }
    };

    window.addEventListener("popstate", playPageSound);

    return () => {
      window.removeEventListener("popstate", playPageSound);
    };
  }, [identity]);

  return (
    <QueryClientProvider client={queryClient}>
      <IdentityContext.Provider value={{ identity, setIdentity }}>
        <OrderContext.Provider
          value={{
            orderItems,
            addToOrder,
            removeFromOrder,
            updateQuantity,
            clearOrder,
          }}
        >
          <OrderStatusContext.Provider value={{ activeOrder, setActiveOrder }}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <div className="fog-overlay"></div>
              <BrowserRouter>
                <SoundManager />
                <GhostChatbot />
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="identity" element={<Identity />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="room/:roomId" element={<Room />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="order" element={<OrderView />} />
                    <Route path="order-history" element={<OrderHistory />} />
                    <Route
                      path="spinning-wheel"
                      element={<SpinningWheelPage />}
                    />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </OrderStatusContext.Provider>
        </OrderContext.Provider>
      </IdentityContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
