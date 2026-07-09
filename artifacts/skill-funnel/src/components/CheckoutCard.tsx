import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface CheckoutCardProps {
  productName: string;
  price: number;
}

export default function CheckoutCard({ productName, price }: CheckoutCardProps) {
  return (
    <div className="w-full bg-[#f8fbff] border border-[#d7e6f4] rounded-[16px] p-5 sm:p-6 flex flex-col gap-6">
      <div className="flex justify-between items-start pb-6 border-b border-[#d7e6f4]">
        <div>
          <h3 className="font-black text-[#07192f]">{productName}</h3>
          <p className="text-sm text-[#425d78] font-semibold mt-1">One-time payment</p>
        </div>
        <div className="font-black text-xl text-[#0f7ee8]">${price}</div>
      </div>

      <div className="flex flex-col gap-3">
        <button disabled className="w-full bg-white text-black font-black rounded-[4px] py-3 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
          Pay with Apple Pay
        </button>
        <button disabled className="w-full bg-[#d9ecf6] border border-[#d7e6f4] text-[#07192f] font-black rounded-[4px] py-3 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
          Pay with Google Pay
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-[#425d78] uppercase font-black tracking-wider before:h-px before:flex-1 before:bg-[#82bdd6]/25 after:h-px after:flex-1 after:bg-[#82bdd6]/25">
        Or
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-[#425d78] font-bold ml-2">Card Information</label>
          <div className="flex flex-col rounded-[10px] border border-[#d7e6f4] bg-[#f8fbfd] overflow-hidden">
            <input 
              type="text" 
              placeholder="Card number" 
              className="bg-transparent border-none p-4 text-[#07192f] placeholder:text-[#07192f]/30 focus:outline-none focus:ring-1 focus:ring-[#0f7ee8] w-full"
            />
            <div className="flex border-t border-[#d7e6f4]">
              <input 
                type="text" 
                placeholder="MM / YY" 
                className="bg-transparent border-none border-r border-[#d7e6f4] p-4 text-[#07192f] placeholder:text-[#07192f]/30 focus:outline-none focus:ring-1 focus:ring-[#0f7ee8] w-1/2"
              />
              <input 
                type="text" 
                placeholder="CVC" 
                className="bg-transparent border-none p-4 text-[#07192f] placeholder:text-[#07192f]/30 focus:outline-none focus:ring-1 focus:ring-[#0f7ee8] w-1/2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-[#425d78] font-semibold mt-2">
        <Lock size={14} className="text-[#0f7ee8]" />
        <span>256-bit SSL Encrypted Checkout</span>
      </div>
    </div>
  );
}
