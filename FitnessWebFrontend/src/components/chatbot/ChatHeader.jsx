import BotAvatar from "./BotAvatar";

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black">
      <div className="flex items-center gap-3">
        <BotAvatar />
        <div>
          <h1 className="text-sm font-semibold tracking-wider text-white uppercase">
            AI Assistant
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Online
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;