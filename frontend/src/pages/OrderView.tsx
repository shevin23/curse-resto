
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderContext, OrderStatusContext } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import OrderList from "@/components/OrderList";
import OrderStatus from "@/components/OrderStatus";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { submitOrder } from "@/services/apiAdapter";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  specialRequests: z.string().optional(),
});

type OrderFormValues = z.infer<typeof formSchema>;

const OrderView = () => {
  const { orderItems, clearOrder } = useContext(OrderContext);
  const { activeOrder, setActiveOrder } = useContext(OrderStatusContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      specialRequests: "",
    },
  });
  
  const placeOrder = async (formData: OrderFormValues) => {
    if (orderItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Your ritual cannot be completed without any items.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get customer details from the form
      const customerDetails = {
        name: formData.name,
        email: formData.email,
        specialRequests: formData.specialRequests
      };
      
      // Get the identity from localStorage or context
      const identity = localStorage.getItem('identity') || 'zombie';
      
      const result = await submitOrder({
        identity,
        items: orderItems.map(item => ({ id: item.id, quantity: item.quantity })),
        customerDetails
      });
      
      if (result.success) {
        setActiveOrder({
          id: result.orderId,
          status: 'preparing',
          items: [...orderItems]
        });
        
        // Play sound effect
        const { playSound } = window as any;
        if (playSound) {
          playSound('click');
        }
        
        // Clear the cart
        clearOrder();
        
        toast({
          title: "Order Placed",
          description: `Order #${result.orderId} has been submitted successfully.`,
        });
        
        // Store the order in local storage for history
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        orderHistory.push({
          id: result.orderId,
          date: new Date().toISOString(),
          items: [...orderItems],
          customerDetails,
          identity
        });
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      } else {
        throw new Error("Order submission failed");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Order Failed",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate('/menu')}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back to Menu</span>
        </Button>
        
        <motion.h1 
          className="text-3xl font-bold text-undead-bone"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Your Unholy Feast
        </motion.h1>
        
        <div className="ml-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/order-history')}
          >
            View Past Orders
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {activeOrder ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OrderStatus orderId={activeOrder.id} initialStage={activeOrder.status} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OrderList />
            
            {orderItems.length > 0 && (
              <div className="mt-6">
                <div className="parchment p-6 mb-6">
                  <h3 className="text-xl font-bold text-undead-charcoal mb-4">Customer Details</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(placeOrder)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-undead-charcoal">Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Undead Customer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-undead-charcoal">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="undead@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-undead-charcoal">Special Requests</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Extra brains, please!" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          className="ritual-button"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin h-5 w-5 mr-2 border-2 border-b-transparent rounded-full" />
                              Summoning...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="mr-2 h-5 w-5" />
                              Complete Ritual (Place Order)
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderView;
