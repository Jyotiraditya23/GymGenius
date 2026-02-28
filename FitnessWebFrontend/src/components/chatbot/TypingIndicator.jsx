const TypingIndicator = () => (
  <div className="flex items-center gap-1 py-1">
    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:150ms]" />
    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:300ms]" />
  </div>
);

export default TypingIndicator;