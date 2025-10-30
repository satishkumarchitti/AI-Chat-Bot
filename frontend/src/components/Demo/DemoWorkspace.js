import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Input, Form, FormGroup, Label } from 'reactstrap';
import { FiDownload, FiEdit2, FiSave } from 'react-icons/fi';
import Navbar from '../Layout/Navbar';
import './DemoWorkspace.css';

const DemoWorkspace = () => {
  // Mock extracted data
  const [extractedData, setExtractedData] = useState({
    vendor: {
      name: "ABC Supermarket",
      address: "123 Main Street, City, State 12345",
      phone: "(555) 123-4567"
    },
    document: {
      number: "INV-2024-001",
      date: "2024-10-30",
      type: "Receipt"
    },
    financial: {
      subtotal: "$45.50",
      tax: "$3.64",
      total: "$49.14"
    },
    items: [
      { name: "Fresh Milk", quantity: "2", price: "$5.99" },
      { name: "Bread", quantity: "1", price: "$3.49" },
      { name: "Eggs (dozen)", quantity: "2", price: "$7.98" },
      { name: "Chicken Breast", quantity: "1 lb", price: "$12.99" },
      { name: "Apples", quantity: "3 lbs", price: "$8.97" },
      { name: "Orange Juice", quantity: "1", price: "$6.08" }
    ]
  });

  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      message: 'Hello! I\'ve analyzed your receipt. You can ask me questions about it!'
    },
    {
      type: 'user',
      message: 'What is the total amount?'
    },
    {
      type: 'ai',
      message: 'The total amount on this receipt is $49.14, which includes $45.50 subtotal and $3.64 in tax.'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    setChatMessages([...chatMessages, { type: 'user', message: newMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'ai',
        message: 'This is a demo response. In the real application, the AI would analyze your question and provide a detailed answer based on the extracted data.'
      }]);
    }, 1000);

    setNewMessage('');
  };

  const handleExport = (format) => {
    alert(`Exporting data as ${format.toUpperCase()}... (Demo mode)`);
  };

  return (
    <>
      <Navbar />
      <div className="demo-workspace">
        <Container fluid className="p-3">
          <Row className="mb-3">
            <Col>
              <h4>Document Workspace - DEMO MODE</h4>
              <p className="text-muted">This shows what the workspace looks like with a processed document</p>
            </Col>
            <Col className="text-end">
              <Button color="success" className="me-2" onClick={() => handleExport('json')}>
                <FiDownload className="me-2" />
                Export JSON
              </Button>
              <Button color="info" onClick={() => handleExport('csv')}>
                <FiDownload className="me-2" />
                Export CSV
              </Button>
            </Col>
          </Row>

          <Row style={{ height: 'calc(100vh - 150px)' }}>
            {/* Left Panel - Document Viewer */}
            <Col md={4} className="h-100">
              <Card className="h-100">
                <CardBody>
                  <h5 className="mb-3">Document Preview</h5>
                  <div className="demo-document-preview">
                    <div className="receipt-preview">
                      <div className="receipt-header">
                        <h3>ABC Supermarket</h3>
                        <p>123 Main Street, City, State 12345</p>
                        <p>(555) 123-4567</p>
                      </div>
                      <hr />
                      <div className="receipt-info">
                        <p><strong>Receipt #:</strong> INV-2024-001</p>
                        <p><strong>Date:</strong> Oct 30, 2024</p>
                      </div>
                      <hr />
                      <div className="receipt-items">
                        {extractedData.items.map((item, idx) => (
                          <div key={idx} className="receipt-item">
                            <span>{item.name} x{item.quantity}</span>
                            <span>{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <hr />
                      <div className="receipt-totals">
                        <div className="receipt-item">
                          <span>Subtotal:</span>
                          <span>{extractedData.financial.subtotal}</span>
                        </div>
                        <div className="receipt-item">
                          <span>Tax:</span>
                          <span>{extractedData.financial.tax}</span>
                        </div>
                        <div className="receipt-item total">
                          <strong>Total:</strong>
                          <strong>{extractedData.financial.total}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Middle Panel - Extracted Data */}
            <Col md={4} className="h-100">
              <Card className="h-100" style={{ overflow: 'auto' }}>
                <CardBody>
                  <h5 className="mb-3">Extracted Data</h5>
                  
                  <div className="mb-4">
                    <h6>Vendor Information</h6>
                    <FormGroup>
                      <Label>Name</Label>
                      <Input value={extractedData.vendor.name} readOnly />
                    </FormGroup>
                    <FormGroup>
                      <Label>Address</Label>
                      <Input value={extractedData.vendor.address} readOnly />
                    </FormGroup>
                    <FormGroup>
                      <Label>Phone</Label>
                      <Input value={extractedData.vendor.phone} readOnly />
                    </FormGroup>
                  </div>

                  <div className="mb-4">
                    <h6>Document Details</h6>
                    <FormGroup>
                      <Label>Number</Label>
                      <Input value={extractedData.document.number} readOnly />
                    </FormGroup>
                    <FormGroup>
                      <Label>Date</Label>
                      <Input type="date" value={extractedData.document.date} readOnly />
                    </FormGroup>
                    <FormGroup>
                      <Label>Type</Label>
                      <Input value={extractedData.document.type} readOnly />
                    </FormGroup>
                  </div>

                  <div className="mb-4">
                    <h6>Financial Summary</h6>
                    <FormGroup>
                      <Label>Subtotal</Label>
                      <Input value={extractedData.financial.subtotal} readOnly />
                    </FormGroup>
                    <FormGroup>
                      <Label>Tax</Label>
                      <Input value={extractedData.financial.tax} readOnly />
                    </FormGroup>
                    <FormGroup>
                      <Label>Total</Label>
                      <Input value={extractedData.financial.total} readOnly />
                    </FormGroup>
                  </div>

                  <div>
                    <h6>Line Items ({extractedData.items.length})</h6>
                    {extractedData.items.map((item, idx) => (
                      <Card key={idx} className="mb-2">
                        <CardBody className="p-2">
                          <small>
                            <strong>{item.name}</strong><br />
                            Qty: {item.quantity} - {item.price}
                          </small>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Right Panel - Chat */}
            <Col md={4} className="h-100">
              <Card className="h-100 d-flex flex-column">
                <CardBody className="flex-grow-1 d-flex flex-column">
                  <h5 className="mb-3">AI Assistant</h5>
                  
                  <div className="chat-messages flex-grow-1" style={{ overflow: 'auto', marginBottom: '1rem' }}>
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`chat-message ${msg.type}`}>
                        <div className={`message-bubble ${msg.type}`}>
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Form onSubmit={handleSendMessage}>
                    <FormGroup className="mb-0">
                      <Input
                        type="text"
                        placeholder="Ask a question about this document..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                    </FormGroup>
                    <Button color="primary" type="submit" className="w-100 mt-2">
                      Send Message
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default DemoWorkspace;
