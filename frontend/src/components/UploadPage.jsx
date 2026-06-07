import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

function UploadPage({ apiBaseUrl, getHeaders, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);

    try {
      const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
        headers: {
          ...getHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        onUploadSuccess();
      }
    } catch (err) {
      setError("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">📸 Share Something</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleUpload}>
        <Form.Group className="mb-3">
          <Form.Label>Choose media</Form.Label>
          <Form.Control
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Caption:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={uploading}>
          {uploading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Uploading...
            </>
          ) : 'Share'}
        </Button>
      </Form>
    </div>
  );
}

export default UploadPage;