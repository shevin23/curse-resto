
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";

type OrderStage = 'preparing' | 'summoning' | 'delivering' | 'completed';

interface OrderStatusProps {
  orderId?: string;
  initialStage?: OrderStage;
}

export const OrderStatus = ({ orderId = "R1TU4L-666", initialStage = 'preparing' }: OrderStatusProps) => {
  const [currentStage, setCurrentStage] = useState<OrderStage>(initialStage);
  
  // Simulate progress through stages
  useEffect(() => {
    if (currentStage === 'completed') return;
    
    const stageMap: Record<OrderStage, OrderStage> = {
      'preparing': 'summoning',
      'summoning': 'delivering',
      'delivering': 'completed',
      'completed': 'completed'
    };
    
    const timer = setTimeout(() => {
      setCurrentStage(stageMap[currentStage]);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentStage]);

  const stages: { name: string; stage: OrderStage }[] = [
    { name: "Preparing Ritual", stage: 'preparing' },
    { name: "Summoning Feast", stage: 'summoning' },
    { name: "Delivering to Crypt", stage: 'delivering' },
    { name: "Ready to Consume", stage: 'completed' }
  ];
  
  const currentIndex = stages.findIndex(s => s.stage === currentStage);
  
  return (
    <div className="parchment p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-undead-charcoal">Ritual Status</h3>
        <div className="text-undead-charcoal">
          <span className="font-medium">Order #:</span> {orderId}
        </div>
      </div>
      
      <div className="relative mb-8 mt-8">
        {/* Progress bar */}
        <div className="absolute top-4 left-0 w-full h-1 bg-undead-charcoal bg-opacity-20"></div>
        <div 
          className="absolute top-4 left-0 h-1 bg-undead-blood transition-all duration-700"
          style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
        ></div>
        
        {/* Stages */}
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const isComplete = index <= currentIndex;
            const isActive = index === currentIndex;
            
            return (
              <motion.div 
                key={stage.stage}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 mb-2 ${
                    isComplete 
                      ? 'bg-undead-blood text-white' 
                      : 'bg-undead-charcoal bg-opacity-20 text-undead-charcoal'
                  } ${isActive ? 'ring-2 ring-undead-blood ring-opacity-50' : ''}`}
                >
                  {isComplete ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div className="text-xs text-center max-w-[80px]">
                  {stage.name}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <div className="text-center text-undead-charcoal mt-4 italic">
        {currentStage === 'completed' 
          ? "Your unholy feast awaits... Bon Appétit!" 
          : "The ancient ones are working on your order..."}
      </div>
    </div>
  );
};

export default OrderStatus;
