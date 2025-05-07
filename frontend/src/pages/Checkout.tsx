
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IdentityContext, OrderContext } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trash2, Plus, Minus, Check, Skull } from "lucide-react";
import { motion } from "framer-motion";
import { submitOrder } from "@/services/api";

const Checkout = () => {
  const { identity } = useContext(IdentityContext);
  const { orderItems, updateQuantity, removeFromOrder, clearOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  // Calculate total price
  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Incomplete Ritual",
        description: "Your name and email are required to complete the summoning.",
        variant: "destructive"
      });
      return;
    }
    
    if (orderItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Your ritual requires at least one item from our menu.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await submitOrder({
        identity: identity || "unknown",
        items: orderItems.map(item => ({ id: item.id, quantity: item.quantity })),
        customerDetails: {
          name,
          email,
          specialRequests
        }
      });
      
      setOrderComplete(true);
      setOrderId(response.orderId);
      clearOrder();
      
      toast({
        title: "Ritual Complete!",
        description: `Your order #${response.orderId} has been successfully summoned.`
      });
    } catch (error) {
      toast({
        title: "Ritual Failed",
        description: "There was an error processing your order. The spirits are not cooperating.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12
      }
    }
  };
  
  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          className="py-16 px-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-6 text-undead-bone">Ritual Complete!</h1>
          <p className="text-xl mb-8 text-undead-bone text-opacity-80">
            Your order #{orderId} has been successfully summoned from beyond.
          </p>
          <p className="mb-10 text-undead-bone text-opacity-70">
            The undead staff will begin preparing your feast shortly. You will receive a
            spirit message at {email} when your offerings are ready.
          </p>
          <Button
            className="ritual-button"
            onClick={() => navigate("/")}
          >
            Return to Crypt Entrance
          </Button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold text-undead-bone">Ritual Checkout</h1>
      </div>
      
      {orderItems.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-undead-purple rounded-lg">
          <Skull className="h-16 w-16 mx-auto mb-4 text-undead-bone text-opacity-50" />
          <h2 className="text-2xl font-bold mb-4 text-undead-bone">Your Ritual Cart is Empty</h2>
          <p className="text-undead-bone text-opacity-70 mb-8">
            You haven't selected any offerings for your undead feast.
          </p>
          <Button
            onClick={() => navigate("/menu")}
            className="bg-undead-purple hover:bg-undead-lightPurple text-undead-bone"
          >
            Explore Cursed Rooms
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-8">
          {/* Order Items Column */}
          <div className="md:col-span-3">
            <div className="bg-undead-dark bg-opacity-80 rounded-xl p-6 mb-6 border border-undead-purple">
              <h2 className="text-xl font-bold mb-4 text-undead-bone">Selected Offerings</h2>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {orderItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="flex justify-between items-center border-b border-undead-purple border-opacity-30 pb-4 last:border-0"
                  >
                    <div>
                      <h3 className="font-medium text-undead-bone">{item.name}</h3>
                      <p className="text-sm text-undead-bone text-opacity-70">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="w-6 text-center text-undead-bone">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-undead-blood hover:text-red-500 hover:bg-transparent"
                        onClick={() => removeFromOrder(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="mt-6 pt-4 border-t border-undead-purple border-opacity-30">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-undead-bone">Total</span>
                  <span className="text-undead-bone">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Form Column */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-undead-dark bg-opacity-80 rounded-xl p-6 border border-undead-purple">
              <h2 className="text-xl font-bold mb-4 text-undead-bone">Complete Your Ritual</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-undead-bone">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-undead-dark border-undead-purple text-undead-bone"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-undead-bone">
                    Email for Spirit Communication
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-undead-dark border-undead-purple text-undead-bone"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium mb-1 text-undead-bone">
                    Special Requests (Optional)
                  </label>
                  <Textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special preparation instructions for the undead chef..."
                    className="bg-undead-dark border-undead-purple text-undead-bone min-h-[100px]"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  type="submit"
                  className="ritual-button w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Summoning..." : "Complete Ritual"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
