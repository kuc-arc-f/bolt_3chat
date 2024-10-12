import { useState } from 'react';
import { MessageCircle, Send, Reply } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  parentId?: number;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        parentId: replyingTo,
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      setReplyingTo(null);
      
      // ボットの応答をシミュレート
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: 'こんにちは！どのようなご用件でしょうか？',
          sender: 'bot',
          parentId: newMessage.id,
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

  const handleReply = (messageId: number) => {
    setReplyingTo(messageId);
  };

  const renderMessage = (message: Message) => (
    <Card key={message.id} className={`mb-4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[80%]`}>
      <div className={`p-3 rounded-lg ${
        message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
      }`}>
        {message.text}
      </div>
      <Button variant="ghost" size="sm" className="mt-1" onClick={() => handleReply(message.id)}>
        <Reply className="h-4 w-4 mr-1" /> 返信
      </Button>
    </Card>
  );

  const renderThread = (parentMessage: Message) => {
    const replies = messages.filter(m => m.parentId === parentMessage.id);
    return (
      <div key={parentMessage.id} className="mb-6">
        {renderMessage(parentMessage)}
        {replies.length > 0 && (
          <div className="ml-8 border-l-2 border-gray-200 pl-4">
            {replies.map(renderMessage)}
          </div>
        )}
      </div>
    );
  };

  const topLevelMessages = messages.filter(m => !m.parentId);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-2xl font-bold flex items-center">
          <MessageCircle className="mr-2" />
          チャットアプリ
        </h1>
      </header>
      
      <ScrollArea className="flex-grow p-4">
        {topLevelMessages.map(renderThread)}
      </ScrollArea>
      
      <div className="p-4 bg-background">
        {replyingTo && (
          <div className="text-sm text-muted-foreground mb-2">
            返信中: {messages.find(m => m.id === replyingTo)?.text}
            <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>キャンセル</Button>
          </div>
        )}
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