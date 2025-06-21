'use client';

import { useEffect } from 'react';
import '@/styles/chatbot.css'; 

const Chatbot = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&display=swap';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = '/chatbot/main.js';
    script.type = 'module';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <>
      <section className="chat-window">
        <button className="close">x close</button>
        <div className="chat">
          <div className="model">
            <p>Hi, my name is Kavach, how can I help you?</p>
          </div>
        </div>
        <div className="input-area">
          <input placeholder="Ask me anything..." type="text" />
          <button>
            <img src="/chatbot/Icons/send-icon.png" alt="send" />
          </button>
        </div>
      </section>

      <div className="chat-button">
        <img src="/chatbot/Icons/chat-icon.png" alt="chat" />
      </div>
    </>
  );
};

export default Chatbot;
