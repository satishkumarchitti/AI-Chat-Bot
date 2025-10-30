import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Badge,
  Spinner,
  ButtonGroup,
} from 'reactstrap';
import { FiSave, FiDownload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { documentAPI } from '../../services/api';
import { updateExtractedField } from '../../redux/slices/documentSlice';
import './DataViewer.css';

const DataViewer = ({ documentId, data }) => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFieldChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (Object.keys(editedData).length === 0) return;

    setSaving(true);
    try {
      await documentAPI.updateExtractedData(documentId, editedData);
      
      // Update Redux store
      Object.entries(editedData).forEach(([field, value]) => {
        dispatch(updateExtractedField({ field, value }));
      });

      setEditedData({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await documentAPI.exportData(documentId, format);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `extracted_data.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Failed to export data');
    }
  };

  const renderField = (key, value) => {
    const currentValue = editedData[key] !== undefined ? editedData[key] : value;
    const isEdited = editedData[key] !== undefined;

    return (
      <FormGroup key={key}>
        <Label className="d-flex justify-content-between align-items-center">
          <span className="text-capitalize">{key.replace(/_/g, ' ')}</span>
          {isEdited && <Badge color="warning" pill>Modified</Badge>}
        </Label>
        <Input
          type={typeof value === 'number' ? 'number' : 'text'}
          value={currentValue || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="data-input"
        />
      </FormGroup>
    );
  };

  return (
    <Card className="data-viewer-card h-100">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Extracted Data</h6>
        <ButtonGroup size="sm">
          <Button
            color="light"
            onClick={() => handleExport('json')}
            title="Export as JSON"
            disabled={!data}
          >
            <FiDownload /> JSON
          </Button>
          <Button
            color="light"
            onClick={() => handleExport('csv')}
            title="Export as CSV"
            disabled={!data}
          >
            <FiDownload /> CSV
          </Button>
        </ButtonGroup>
      </CardHeader>
      <CardBody className="data-viewer-body">
        {!data ? (
          <div className="text-center text-muted py-5">
            <Spinner color="primary" className="mb-3" />
            <p>Extracting data from document...</p>
            <small>This may take a few moments</small>
          </div>
        ) : (
          <Form>
            {Object.entries(data).map(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                return (
                  <div key={key} className="mb-3">
                    <h6 className="text-capitalize border-bottom pb-2">
                      {key.replace(/_/g, ' ')}
                    </h6>
                    {Object.entries(value).map(([subKey, subValue]) =>
                      renderField(`${key}.${subKey}`, subValue)
                    )}
                  </div>
                );
              }
              return renderField(key, value);
            })}

            {Object.keys(editedData).length > 0 && (
              <div className="d-flex gap-2 mt-4">
                <Button
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-grow-1"
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="me-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                {saveSuccess && (
                  <Button color="success" disabled>
                    <FiCheckCircle />
                  </Button>
                )}
              </div>
            )}
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default DataViewer;
