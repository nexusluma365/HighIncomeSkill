import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import Accordion from '@/components/Accordion';
import { faqs } from '@/data/faqs';
import { motion } from 'framer-motion';

export default function FAQ() {
  return (
    <div className="flex flex-col pb-6 pt-8">
      <div className="border border-[#d7e6f4] bg-white shadow-[0_18px_44px_rgba(6,19,34,0.18)] p-6 sm:p-8">
        <SectionTitle
          headline="Questions before you go live?"
          subheadline="Here is the short version so you can decide with confidence."
        />
      
        <div className="flex flex-col gap-3 mt-8 mb-10">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Accordion question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </div>
      </div>
      
      <Button href="/offer" sticky>
        I'm Ready — Show Me The Offer
      </Button>
    </div>
  );
}
