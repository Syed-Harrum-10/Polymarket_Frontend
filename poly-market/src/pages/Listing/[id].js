'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from '../../styles/ListingDetail.module.css';
import Image from 'next/image';

export default function ListingDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`https://poly-market-backend.vercel.app/listing/${id}`);
        if (!res.ok) throw new Error('Failed to fetch listing');
        const json = await res.json();
        setListing(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading)
    return (
      <div className={styles.centered}>
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.centered}>
        <p>{error}</p>
      </div>
    );
    console.log(listing)
  if (!listing)
    return (
      <div className={styles.centered}>
        <p>Not found</p>
      </div>
    );

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <button
            className={styles.backButton}
            onClick={() => router.push('/Listing/Listing')}
          >
            <ArrowLeft size={18} />
            Back to Markets
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>{listing.title}</h1>
            <p className={styles.category}>{listing.status}</p>
          </div>

          {listing.asset?.url ? (
  <Image
    src={
      listing.asset.url.startsWith('/uploads/')
        ? `http://localhost:5000${listing.asset.url}`
        : listing.asset.url
    }
    alt={listing.title}
    className={styles.image}
  />
) : (
  <div className={styles.imagePlaceholder}>No Image</div>
)}


          <p className={styles.description}>{listing.description}</p>

          <div className={styles.statsBox}>
            <div>
              <span>Current Price</span>
              <strong>
                {listing.price} {listing.currency}
              </strong>
            </div>
            <div>
              <span>Status</span>
              <strong className={styles.status}>{listing.status}</strong>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button className={`${styles.button} ${styles.yes}`}>Yes</button>
            <button className={`${styles.button} ${styles.no}`}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}
