import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      // ボットの応答をシミュレート
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: 'こんにちは！どのようなご用件でしょうか？',
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-2xl font-bold flex items-center">
          <MessageCircle className="mr-2" />
          チャットアプリ
        </h1>
      </header>
      
      <ScrollArea className="flex-grow p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </ScrollArea>
      
      <div className="p-4 bg-background">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="メッセージを入力..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;