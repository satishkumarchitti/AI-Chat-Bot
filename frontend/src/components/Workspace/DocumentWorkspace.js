import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner, Alert, Button } from 'reactstrap';
import { FiArrowLeft } from 'react-icons/fi';
import Navbar from '../Layout/Navbar';
import DocumentViewer from './DocumentViewer';
import DataViewer from './DataViewer';
import ChatInterface from './ChatInterface';
import { documentAPI } from '../../services/api';
import { selectDocument, setExtractedData } from '../../redux/slices/documentSlice';
import { setCurrentConversation } from '../../redux/slices/chatSlice';
import './DocumentWorkspace.css';

const DocumentWorkspace = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentDocument, extractedData } = useSelector((state) => state.document);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch document details
      const docResponse = await documentAPI.getById(documentId);
      dispatch(selectDocument(docResponse.data));

      // Fetch extracted data
      try {
        const dataResponse = await documentAPI.getExtractedData(documentId);
        dispatch(setExtractedData(dataResponse.data));
      } catch (err) {
        // Extracted data might not be available yet
        console.log('Extracted data not available yet');
      }

      // Set current conversation for chat
      dispatch(setCurrentConversation(documentId));

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load document');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container fluid className="text-center mt-5">
          <Spinner color="primary" size="lg" />
          <p className="mt-3">Loading document...</p>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container fluid className="mt-5">
          <Alert color="danger">
            {error}
            <Button color="primary" onClick={() => navigate('/dashboard')} className="ms-3">
              Back to Dashboard
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="workspace-header px-4 py-3">
        <Button color="link" onClick={() => navigate('/dashboard')} className="back-btn">
          <FiArrowLeft className="me-2" />
          Back to Dashboard
        </Button>
        <h5 className="mb-0 ms-3">{currentDocument?.filename}</h5>
      </div>
      <Container fluid className="workspace-container">
        <Row className="g-3 h-100">
          {/* Panel 1: Document Viewer (Left - 35%) */}
          <Col lg={4} md={12} className="workspace-panel">
            <DocumentViewer document={currentDocument} />
          </Col>

          {/* Panel 2: Extracted Data Viewer (Middle - 30%) */}
          <Col lg={3} md={12} className="workspace-panel">
            <DataViewer documentId={documentId} data={extractedData} />
          </Col>

          {/* Panel 3: Chat Interface (Right - 35%) */}
          <Col lg={5} md={12} className="workspace-panel">
            <ChatInterface documentId={documentId} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DocumentWorkspace;
