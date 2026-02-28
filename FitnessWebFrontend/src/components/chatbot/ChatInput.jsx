const ChatInput = ({ input, setInput, handleSubmit, isStreaming, inputRef }) => {
  return (
    <div className="px-6 py-4 border-t border-zinc-800 bg-black">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-amber-500 transition-all">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-zinc-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="px-4 py-2 bg-amber-500 text-black rounded-lg text-sm font-semibold hover:bg-amber-400 transition-all disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;