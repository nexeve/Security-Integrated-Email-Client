import React, { useState } from 'react';
import { useSendEmail } from '@/lib/api/emails';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComposeModalProps {
  onClose: () => void;
}

export function ComposeModal({ onClose }: ComposeModalProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  
  const { mutate: sendEmail, isPending, error } = useSendEmail();

  const handleSend = () => {
    if (!to || !subject || !body) return;
    sendEmail(
      { to, subject, text: body },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div
        className="relative w-full max-w-lg rounded-2xl flex flex-col overflow-hidden"
        style={{
          background: 'oklch(0.12 0.025 258 / 95%)',
          border: '1px solid oklch(1 0 0 / 15%)',
          boxShadow: '0 20px 40px oklch(0 0 0 / 60%), inset 0 1px 0 oklch(1 0 0 / 20%)',
          backdropFilter: 'blur(20px)'
        }}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">New Message</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-3">
          {error && (
            <div className="text-xs text-danger bg-danger/10 p-2 rounded-md">
              {error.message}
            </div>
          )}
          
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-accent-cyan/50 focus:bg-black/30 transition-all"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-accent-cyan/50 focus:bg-black/30 transition-all"
          />
          <textarea
            placeholder="Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-40 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-accent-cyan/50 focus:bg-black/30 transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-end px-4 py-3 border-t border-white/5 bg-black/10">
          <button
            onClick={handleSend}
            disabled={isPending || !to || !subject || !body}
            className="btn-tactile px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            style={{
              background: 'linear-gradient(145deg, oklch(0.58 0.17 200), oklch(0.45 0.14 235))',
              color: 'white',
              boxShadow: 'inset 0 1px 0 oklch(1 0 0 / 25%)'
            }}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}
