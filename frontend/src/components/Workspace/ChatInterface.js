import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
  Button,
  Spinner,
} from 'reactstrap';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { chatAPI } from '../../services/api';
import {
  loadChatHistoryStart,
  loadChatHistorySuccess,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  clearConversation,
} from '../../redux/slices/chatSlice';
import './ChatInterface.css';

const ChatInterface = ({ documentId }) => {
  const dispatch = useDispatch();
  const { currentConversation, loading } = useSelector((state) => state.chat);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    dispatch(loadChatHistoryStart());
    try {
      const response = await chatAPI.getChatHistory(documentId);
      dispatch(loadChatHistorySuccess({ documentId, messages: response.data }));
    } catch (error) {
      // No chat history yet, that's okay
      dispatch(loadChatHistorySuccess({ documentId, messages: [] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');

    dispatch(sendMessageStart({ text: userMessage }));

    try {
      const response = await chatAPI.sendMessage(documentId, userMessage);
      dispatch(sendMessageSuccess({ documentId, message: response.data.response }));
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to send message';
      dispatch(sendMessageFailure(errorMessage));
      alert(errorMessage);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear the chat history?')) return;

    try {
      await chatAPI.clearHistory(documentId);
      dispatch(clearConversation(documentId));
    } catch (error) {
      alert('Failed to clear chat history');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="chat-interface-card h-100">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">AI Assistant</h6>
        <Button
          color="light"
          size="sm"
          onClick={handleClearChat}
          title="Clear Chat"
          disabled={currentConversation.length === 0}
        >
          <FiTrash2 />
        </Button>
      </CardHeader>
      <CardBody className="chat-body">
        <div className="messages-container">
          {currentConversation.length === 0 ? (
            <div className="empty-chat">
              <p className="text-muted">
                Start a conversation! Ask questions about the extracted data.
              </p>
              <div className="suggested-questions">
                <small className="text-muted d-block mb-2">Suggested questions:</small>
                <Button
                  color="light"
                  size="sm"
                  onClick={() => setMessage('What is the total amount?')}
                  className="mb-2 me-2"
                >
                  What is the total amount?
                </Button>
                <Button
                  color="light"
                  size="sm"
                  onClick={() => setMessage('Who is the vendor?')}
                  className="mb-2 me-2"
                >
                  Who is the vendor?
                </Button>
                <Button
                  color="light"
                  size="sm"
                  onClick={() => setMessage('What is the date on this document?')}
                  className="mb-2"
                >
                  What is the date?
                </Button>
              </div>
            </div>
          ) : (
            currentConversation.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  <p className="mb-1">{msg.text}</p>
                  <small className="text-muted">{formatTimestamp(msg.timestamp)}</small>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message ai-message">
              <div className="message-content">
                <Spinner size="sm" color="primary" />
                <span className="ms-2">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <Form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-group">
            <Input
              type="text"
              placeholder="Ask a question about the document..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="chat-input"
            />
            <Button color="primary" type="submit" disabled={!message.trim() || loading}>
              <FiSend />
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ChatInterface;
