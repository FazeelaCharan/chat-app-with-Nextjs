"use client";
import React, { useState } from "react";

const ChatForm = ({onSendMessage}:{onSendMessage: (message:string)=>void}) => {
  const [message, setMessage] = useState("");
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
        onSendMessage(message);
      setMessage("");
    }
    console.log("form submitted");
  };
  return (
    <div>
      <form onSubmit={submitHandler} className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-400 text-gray-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
