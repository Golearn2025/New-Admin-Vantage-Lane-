/**
 * BookingCustomerSelect Component
 * Searchable customer dropdown with real-time search
 */

import { useMemo } from 'react';
import { useCustomerSearch } from '../hooks/useCustomerSearch';
import type { Customer } from '../types';
import styles from './BookingCustomerSelect.module.css';

export interface BookingCustomerSelectProps {
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
}

export function BookingCustomerSelect({
  selectedCustomer,
  onSelectCustomer,
}: BookingCustomerSelectProps) {
  const { customers, loading, searchQuery, setSearchQuery } = useCustomerSearch();

  // Memoize customer results to prevent re-creation on every render
  const customerResults = useMemo(() => 
    customers.map(customer => (
      <button
        key={customer.id}
        type="button"
        className={styles.resultItem}
        onClick={() => {
          onSelectCustomer(customer);
          setSearchQuery('');
        }}
      >
        <div className={styles.resultName}>
          {customer.first_name} {customer.last_name}
        </div>
        <div className={styles.resultEmail}>{customer.email}</div>
      </button>
    )), 
    [customers, onSelectCustomer, setSearchQuery]
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Customer</h3>
      
      {selectedCustomer ? (
        <div className={styles.selectedCustomer}>
          <div className={styles.customerInfo}>
            <div className={styles.customerName}>
              {selectedCustomer.first_name} {selectedCustomer.last_name}
            </div>
            <div className={styles.customerEmail}>{selectedCustomer.email}</div>
            {selectedCustomer.phone && (
              <div className={styles.customerPhone}>{selectedCustomer.phone}</div>
            )}
          </div>
          <button
            type="button"
            className={styles.changeButton}
            onClick={() => onSelectCustomer(null as any)}
          >
            Change
          </button>
        </div>
      ) : (
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="🔍 Search customer by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {loading && <div className={styles.loading}>Searching...</div>}
          
          {customers.length > 0 && (
            <div className={styles.results}>
              {customerResults}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
