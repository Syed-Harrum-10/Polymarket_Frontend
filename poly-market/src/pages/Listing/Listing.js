"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/listing.module.css";
import { useRouter } from "next/navigation";
import { Link, Menu, X } from "lucide-react";
import Image from "next/image";

const BACKEND_URL = "http://localhost:5000";

export default function ListingPage() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      console.log("Fetching listings from:", `${BACKEND_URL}/listing/all`);

      const res = await fetch(`${BACKEND_URL}/listing/all`, {
        credentials: "include",
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok && data.success) {
        setListings(data.data || []);
        setError("");
      } else {
        setError(data.message || "Failed to load listings");
        setListings([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Error: ${err.message}`);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => router.push("/Listing/CreateListing");
  const handleViewListing = (id) => router.push(`/Listing/${id}`);

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <button
            className={styles.menuButton}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className={styles.logo}>PlyMarket</h1>
        </div>
        <button className={styles.createButton} onClick={handleCreate}>
          + Create New Listing
        </button>
      </nav>

      <div className={styles.contentWrapper}>
        {sidebarOpen && (
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Navigation</h2>
            <ul className={styles.sidebarLinks}>
              <li>
                <Link href="/Listing/Listing">Dashboard</Link>
              </li>
              <li>
                <Link href="/Listing/Listing" className={styles.active}>
                  Listings
                </Link>
              </li>
              <li>
                <Link href="/Orders/OrderListing">Orders</Link>
              </li>
              <li>
                <Link href="/Listing/settings">Settings</Link>
              </li>
            </ul>
          </aside>
        )}

        <main className={styles.gridSection}>
          {loading ? (
            <div className={styles.noListing}>
              <p>Loading listings...</p>
            </div>
          ) : error ? (
            <div className={styles.noListing}>
              <p>{error}</p>
              <button className={styles.createButton} onClick={fetchListings}>
                Retry
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className={styles.noListing}>
              <p>No listings found. Create your first listing!</p>
              <button className={styles.createButton} onClick={handleCreate}>
                + Create Listing
              </button>
            </div>
          ) : (
            <div className={styles.cardsWrapper}>
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className={styles.card}
                  onClick={() => handleViewListing(listing.id)}
                >
                  <div className={styles.cardImage}>
                    {listing.asset?.url ? (
                      <Image
                        src={`${BACKEND_URL}${listing.asset.url}`}
                        alt={`Listing ${listing.id}`}
                      />
                    ) : (
                      <div className={styles.placeholderImage}>No Image</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      {listing.title || `Listing #${listing.id}`}
                    </h3>
                    <p className={styles.cardDescription}>
                      {listing.description
                        ? listing.description
                        : "No description available"}
                    </p>
                    <p className={styles.cardPrice}>
                      {listing.price} {listing.currency}
                    </p>
                    <span
                      className={`${styles.cardStatus} ${
                        styles[listing.status?.toLowerCase() || "crypto"]
                      }`}
                    >
                      {listing.status}
                    </span>
                    {listing.seller && (
                      <p className={styles.cardSeller}>
                        Seller: {listing.seller.username}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
