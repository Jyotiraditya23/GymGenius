import BotAvatar from "./BotAvatar";
import TypingIndicator from "./TypingIndicator";

const ChatMessage = ({ msg }) => {
  if (msg.isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-amber-500 text-black px-4 py-3 rounded-xl rounded-tr-sm max-w-xl text-sm font-medium">
          {msg.content}
        </div>
      </div>
    );
  }

  if (msg.isSystem) {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1">
          {msg.content}
        </span>
      </div>
    );
  }

  if (msg.isSources) {
    return (
      <div className="flex items-start gap-3">
        <BotAvatar />
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 max-w-xl">
          <p className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider">
            Sources
          </p>
          {msg.content.split("\n").map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block text-xs text-amber-400 hover:text-amber-300 underline truncate"
            >
              {url}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <BotAvatar />
      <div className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-3 rounded-xl max-w-xl text-sm leading-relaxed">
        {msg.isLoading ? <TypingIndicator /> : msg.content}
      </div>
    </div>
  );
};

export default ChatMessage;