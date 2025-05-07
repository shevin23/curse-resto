import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderItem } from "@/App";
import { format } from "date-fns";

interface HistoryOrderItem extends OrderItem {
  // Additional fields may be added by the backend
}

interface HistoryOrder {
  id: string;
  date: string;
  items: HistoryOrderItem[];
  customerDetails: {
    name: string;
    email: string;
    specialRequests?: string;
  };
  identity: string;
}

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load order history from localStorage
    const loadOrders = () => {
      setIsLoading(true);
      try {
        const orderHistory = JSON.parse(
          localStorage.getItem("orderHistory") || "[]"
        );
        setOrders(orderHistory);
      } catch (error) {
        console.error("Error loading order history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Calculate total price for an order
  const calculateTotal = (items: HistoryOrderItem[]) => {
    return items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate("/order")}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back to Orders</span>
        </Button>

        <motion.h1
          className="text-3xl font-bold text-undead-bone"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Your Past Rituals
        </motion.h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl text-undead-bone">
            Summoning past rituals from the netherworld...
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center p-8 parchment">
          <h3 className="text-2xl text-undead-charcoal">No Past Orders</h3>
          <p className="text-undead-charcoal mt-2">
            You have not completed any rituals yet. Return to the menu to begin.
          </p>
          <Button className="mt-4" onClick={() => navigate("/menu")}>
            Browse Menu
          </Button>
        </div>
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {orders.map((order, index) => (
            <motion.div
              key={`${order.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="parchment overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-undead-charcoal">
                        Order #{order.id}
                      </CardTitle>
                      <CardDescription className="flex items-center text-undead-charcoal mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(
                          new Date(order.date),
                          "MMMM dd, yyyy 'at' h:mm a"
                        )}
                      </CardDescription>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-undead-charcoal bg-opacity-10 text-sm">
                      {order.identity === "zombie" ? "🧟‍♂️ Zombie" : "🧟‍♀️ Mummy"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-sm text-undead-charcoal flex items-center mb-1">
                      <User className="h-4 w-4 mr-1" />
                      {order.customerDetails.name}
                    </div>
                    <div className="text-sm text-undead-charcoal flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {order.customerDetails.email}
                    </div>
                  </div>

                  <div className="border-t border-undead-charcoal border-opacity-20 pt-4">
                    <h4 className="font-medium text-undead-charcoal mb-2">
                      Ordered Items
                    </h4>
                    <ul className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <li
                          key={`${item.id}-${itemIndex}`}
                          className="flex justify-between text-undead-charcoal"
                        >
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-undead-charcoal border-opacity-20 flex justify-between">
                  <span className="text-undead-charcoal">Total</span>
                  <span className="font-bold text-undead-charcoal">
                    ${calculateTotal(order.items)}
                  </span>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default OrderHistory;
