import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Icon } from '../../components/ui/Icon';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import type { ChatMessage } from '../../types';


const suggestions = [
  { icon: 'FileText', label: 'Rédiger un SOP de gestion des retours' },
  { icon: 'Scale', label: 'Citer les exigences réglementaires GDP' }
];

const initialMessages: ChatMessage[] = [
  {
    id: 'm1', role: 'assistant',
    content: "Bonjour Hana 👋 Je suis l'assistant qualité QualiChain AI. Je peux générer des CAPA, des checklists d'audit, des SOP et répondre à vos questions de conformité GDP/BPD avec citations réglementaires. Comment puis-je vous aider aujourd'hui ?",
    timestamp: '09:14',
  },
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: 'now' };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsTyping(true);

    (async () => {
      try {
        const res = await fetch('http://localhost:8000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: text })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.answer || 'Désolé, pas de réponse disponible.',
          timestamp: 'now'
        };
        setMessages((m) => [...m, assistantMsg]);
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Erreur lors de la requête au serveur. Veuillez réessayer.',
          timestamp: 'now'
        };
        setMessages((m) => [...m, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    })();
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] gap-4">
      <aside className="hidden w-72 shrink-0 flex-col rounded-2xl border border-surface-border bg-surface-card p-3 dark:border-dark-border dark:bg-dark-card lg:flex">
        <Button variant="primary" className="w-full justify-start" onClick={() => setMessages(initialMessages)}>
          <Icon name="Plus" size={16} /> Nouvelle conversation
        </Button>
      </aside>

      <div className="flex flex-1 flex-col rounded-2xl border border-surface-border bg-surface-card dark:border-dark-border dark:bg-dark-card">
        <div className="flex items-center gap-3 border-b border-surface-border px-5 py-4 dark:border-dark-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
            <Icon name="Sparkles" size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-primary dark:text-dark-text">Assistant Qualité IA</p>
            <p className="text-xs text-ink-secondary dark:text-dark-subtext">Conforme GDP/BPD · Sources réglementaires vérifiées</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto"><Icon name="Paperclip" size={16} /></Button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                msg.role === 'assistant' ? 'bg-gradient-to-br from-primary to-secondary text-white' : 'bg-slate-200 text-ink-primary dark:bg-white/10 dark:text-dark-text')}>
                <Icon name={msg.role === 'assistant' ? 'Sparkles' : 'User'} size={15} />
              </div>
              <div className={cn('max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'assistant'
                  ? 'bg-slate-50 text-ink-primary dark:bg-white/5 dark:text-dark-text'
                  : 'bg-primary text-white')}>
                <div className="break-words whitespace-pre-wrap">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.citations && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {msg.citations.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-primary shadow-soft dark:bg-dark-card">
                        <Icon name="BookOpen" size={11} /> {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          <AnimatePresence>
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                  <Icon name="Sparkles" size={15} />
                </div>
                <div className="flex gap-1 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-secondary/50" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {messages.length <= 1 && (
          <div className="grid grid-cols-1 gap-2 px-5 pb-3 sm:grid-cols-2">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => send(s.label)}
                className="flex items-center gap-2.5 rounded-xl border border-surface-border px-3 py-2.5 text-left text-xs font-medium text-ink-secondary transition-colors hover:border-primary hover:text-primary dark:border-dark-border dark:text-dark-subtext"
              >
                <Icon name={s.icon} size={15} className="shrink-0" /> {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-surface-border p-4 dark:border-dark-border">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-end gap-2 rounded-2xl border border-surface-border bg-surface-bg px-3 py-2 focus-within:border-primary dark:border-dark-border dark:bg-dark-bg"
          >
            <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-secondary hover:bg-slate-100 dark:text-dark-subtext dark:hover:bg-white/5">
              <Icon name="Paperclip" size={17} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              rows={1}
              placeholder="Posez une question, générez une CAPA, un SOP ou une checklist…"
              className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-sm text-ink-primary placeholder:text-ink-secondary/70 focus:outline-none dark:text-dark-text"
            />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Icon name="ArrowUp" size={16} />
            </Button>
          </form>
          <p className="mt-2 text-center text-[11px] text-ink-secondary/70 dark:text-dark-subtext/70">
            L'assistant peut faire des erreurs. Vérifiez les informations critiques de conformité.
          </p>
        </div>
      </div>
    </div>
  );
}
