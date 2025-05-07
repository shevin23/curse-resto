
import { useContext } from "react";
import { OrderContext } from "@/App";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const OrderList = () => {
  const { orderItems, updateQuantity, removeFromOrder } = useContext(OrderContext);
  
  if (orderItems.length === 0) {
    return (
      <div className="text-center p-8 parchment">
        <h3 className="text-2xl text-undead-charcoal">Your Ritual is Empty</h3>
        <p className="text-undead-charcoal mt-2">
          You have not summoned any dishes for your unholy feast.
        </p>
      </div>
    );
  }

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="parchment overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-undead-charcoal">Item</TableHead>
            <TableHead className="text-undead-charcoal text-right">Price</TableHead>
            <TableHead className="text-undead-charcoal text-center">Quantity</TableHead>
            <TableHead className="text-undead-charcoal text-right">Total</TableHead>
            <TableHead className="text-undead-charcoal w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderItems.map((item) => (
            <TableRow key={item.id} className="border-undead-charcoal border-opacity-20">
              <TableCell className="text-undead-charcoal font-medium">{item.name}</TableCell>
              <TableCell className="text-undead-charcoal text-right">${item.price.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-undead-charcoal">
                    {item.quantity}
                  </span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-undead-charcoal text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-undead-blood"
                  onClick={() => removeFromOrder(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-undead-charcoal font-bold">Total</TableCell>
            <TableCell className="text-undead-charcoal text-right font-bold">
              ${totalPrice.toFixed(2)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </motion.div>
  );
};

export default OrderList;
