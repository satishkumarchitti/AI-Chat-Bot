import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  Table,
  Badge,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { FiUpload, FiSearch, FiFile, FiTrash2, FiEye } from 'react-icons/fi';
import Navbar from '../Layout/Navbar';
import { documentAPI } from '../../services/api';
import {
  fetchDocumentsStart,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  uploadDocumentStart,
  uploadDocumentSuccess,
  uploadDocumentFailure,
  deleteDocumentSuccess,
  updateFilters,
} from '../../redux/slices/documentSlice';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { documents, loading, uploading, filters } = useSelector((state) => state.document);
  const { user } = useSelector((state) => state.auth);

  const [uploadModal, setUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    dispatch(fetchDocumentsStart());
    try {
      const response = await documentAPI.getAll();
      // Ensure response.data is an array
      const documents = Array.isArray(response.data) ? response.data : [];
      dispatch(fetchDocumentsSuccess(documents));
    } catch (error) {
      console.error('Error loading documents:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to load documents';
      dispatch(fetchDocumentsFailure(errorMessage));
      // Don't break the UI, just show empty state
      dispatch(fetchDocumentsSuccess([]));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image (JPEG, PNG) or PDF file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    dispatch(uploadDocumentStart());
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await documentAPI.upload(formData);
      dispatch(uploadDocumentSuccess(response.data));
      setUploadModal(false);
      setSelectedFile(null);
      navigate(`/workspace/${response.data.id}`);
    } catch (error) {
      dispatch(uploadDocumentFailure(error.response?.data?.detail || 'Upload failed'));
      alert('Failed to upload document. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;

    try {
      await documentAPI.delete(documentToDelete.id);
      dispatch(deleteDocumentSuccess(documentToDelete.id));
      setDeleteModal(false);
      setDocumentToDelete(null);
    } catch (error) {
      alert('Failed to delete document');
    }
  };

  const handleSearch = (e) => {
    dispatch(updateFilters({ search: e.target.value }));
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.filename?.toLowerCase().includes(filters.search.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Navbar />
      <Container fluid className="dashboard-container mt-4">
        <Row className="mb-4">
          <Col>
            <h2>Welcome, {user?.name}!</h2>
            <p className="text-muted">Manage your documents and extract structured data</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={8}>
            <InputGroup>
              <span className="input-group-text">
                <FiSearch />
              </span>
              <Input
                placeholder="Search documents..."
                value={filters.search}
                onChange={handleSearch}
              />
            </InputGroup>
          </Col>
          <Col md={4} className="text-end">
            <Button color="primary" onClick={() => setUploadModal(true)}>
              <FiUpload className="me-2" />
              Upload Document
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardBody>
                <h5 className="mb-3">Your Documents</h5>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                    <p className="mt-3">Loading documents...</p>
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-5">
                    <FiFile size={48} className="text-muted mb-3" />
                    <p className="text-muted">
                      {filters.search ? 'No documents found' : 'No documents uploaded yet'}
                    </p>
                    {!filters.search && (
                      <>
                        <Button color="primary" onClick={() => setUploadModal(true)} className="me-2">
                          Upload Your First Document
                        </Button>
                        <Button color="success" onClick={() => navigate('/demo')}>
                          View Demo Workspace
                        </Button>
                        <p className="text-muted mt-3">
                          <small>👆 Click "View Demo Workspace" to see what a processed document looks like!</small>
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Document Name</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Upload Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments.map((doc) => (
                          <tr key={doc.id}>
                            <td>
                              <FiFile className="me-2" />
                              {doc.filename}
                            </td>
                            <td>
                              <Badge color="info">{doc.file_type?.toUpperCase()}</Badge>
                            </td>
                            <td>
                              <Badge color={doc.status === 'processed' ? 'success' : 'warning'}>
                                {doc.status}
                              </Badge>
                            </td>
                            <td>{formatDate(doc.created_at)}</td>
                            <td>
                              <Button
                                size="sm"
                                color="primary"
                                className="me-2"
                                onClick={() => navigate(`/workspace/${doc.id}`)}
                              >
                                <FiEye />
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                onClick={() => {
                                  setDocumentToDelete(doc);
                                  setDeleteModal(true);
                                }}
                              >
                                <FiTrash2 />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Upload Modal */}
        <Modal isOpen={uploadModal} toggle={() => setUploadModal(false)}>
          <ModalHeader toggle={() => setUploadModal(false)}>Upload Document</ModalHeader>
          <ModalBody>
            <p>Select an image (JPEG, PNG) or PDF file to upload and extract data.</p>
            <Input type="file" onChange={handleFileSelect} accept="image/*,.pdf" />
            {selectedFile && (
              <div className="mt-3">
                <p className="mb-0">
                  <strong>Selected:</strong> {selectedFile.name}
                </p>
                <p className="text-muted mb-0">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setUploadModal(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
          <ModalHeader toggle={() => setDeleteModal(false)}>Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete "{documentToDelete?.filename}"? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

export default Dashboard;
