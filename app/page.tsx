"use client";
import { useEffect, useState } from "react";
import ChatForm from "./components/ChatForm";
import { socket } from "@/lib/socketClient";
import ChatMessage from "./components/ChatMessage";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [username, setUserName] = useState("");
  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("user_joined", (message) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });
    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);
  const handleJoinRoom = () => {
    if (username.trim() && room.trim()) {
      socket.emit("join-room", { room, username: username });
      setJoined(true);
    } else {
      alert("Please enter both username and room name.");
    }
  };

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: username };
    // setMessages((prev) => [...prev, { sender: username, message }]);
    socket.emit("message", data);
    console.log(message);
  };

  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <div className="flex w-full max-w-3xl mx-auto flex-col items-center">
          <h1 className="mb-4 text-2xl font-bold">Join a Room</h1>

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
          />

          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
          />

          <button
            onClick={handleJoinRoom}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto  p-4 rounded-lg">
          <h1 className="mb-4 text-2xl font-bold">Room: {room}</h1>

          <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
                isOwnMessage={msg.sender === username}
              />
            ))}
          </div>

          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
