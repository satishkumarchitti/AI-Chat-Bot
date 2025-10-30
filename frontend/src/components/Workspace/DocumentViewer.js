import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, ButtonGroup } from 'reactstrap';
import { FiZoomIn, FiZoomOut, FiRotateCw } from 'react-icons/fi';
import './DocumentViewer.css';

const DocumentViewer = ({ document }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const getDocumentUrl = () => {
    if (!document) return null;
    return `http://localhost:8000${document.file_path}`;
  };

  const isImage = document?.file_type === 'image';
  const isPDF = document?.file_type === 'pdf';

  return (
    <Card className="document-viewer-card h-100">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Document Viewer</h6>
        <ButtonGroup size="sm">
          <Button color="light" onClick={handleZoomOut} title="Zoom Out">
            <FiZoomOut />
          </Button>
          <Button color="light" disabled>
            {zoom}%
          </Button>
          <Button color="light" onClick={handleZoomIn} title="Zoom In">
            <FiZoomIn />
          </Button>
          <Button color="light" onClick={handleRotate} title="Rotate">
            <FiRotateCw />
          </Button>
        </ButtonGroup>
      </CardHeader>
      <CardBody className="document-viewer-body">
        {!document ? (
          <div className="text-center text-muted">
            <p>No document selected</p>
          </div>
        ) : (
          <div className="document-container">
            {isImage && (
              <img
                src={getDocumentUrl()}
                alt={document.filename}
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  maxWidth: '100%',
                  transition: 'transform 0.3s ease',
                }}
              />
            )}
            {isPDF && (
              <div className="pdf-viewer">
                <iframe
                  src={`${getDocumentUrl()}#toolbar=1&navpanes=1&scrollbar=1`}
                  title={document.filename}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left',
                  }}
                />
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default DocumentViewer;
