'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/CreateListing.module.css';

const BACKEND_URL = 'http://localhost:5000';

export default function CreateListingPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('Crypto');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMsg('❌ Please select a file');
      return;
    }
    if (!title.trim()) {
      setMsg('❌ Please enter a title');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setMsg('❌ Please enter a valid price');
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const formData = new FormData();
      formData.append('asset', selectedFile);
      formData.append('price', price);
      formData.append('currency', currency);
      formData.append('status', status);
      formData.append('title', title);
      formData.append('description', description || '');

      const res = await fetch(`${BACKEND_URL}/listing/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create listing');
      }

      setMsg('✅ Listing created successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setSelectedFile(null);
      setCurrency('USD');
      setStatus('Crypto');

      setTimeout(() => router.push('/Listing/Listing'), 1500);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMsg('❌ Please select a valid image file');
        setSelectedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMsg('❌ Image size must be less than 5MB');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setMsg('');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Create Market</h1>
        <p className={styles.subtitle}>
          Add a new prediction market.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Market Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Will Bitcoin reach $100K by 2026?"
              className={styles.input}
              required
              maxLength={200}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your market prediction..."
              className={styles.textarea}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Market Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.input}
              required
            />
            {selectedFile && (
              <p className={styles.fileInfo}>Selected: {selectedFile.name}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Initial Price</label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="10.00"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={styles.select}
            >
              <option value="USD">USD</option>
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={styles.select}
            >
              <option value="Crypto">Crypto</option>
              <option value="Sports">Sports</option>
              <option value="Politics">Politics</option>
            </select>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Creating Market...' : 'Create Market'}
          </button>

          {msg && (
            <p
              className={`${styles.msg} ${
                msg.startsWith('✅')
                  ? styles.success
                  : msg.startsWith('🚫')
                  ? styles.danger
                  : styles.warning
              }`}
            >
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
