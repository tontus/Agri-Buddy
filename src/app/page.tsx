import Chat from "./Chat";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">AI Chat</h1>
      <Chat />
    </div>
  );
}
