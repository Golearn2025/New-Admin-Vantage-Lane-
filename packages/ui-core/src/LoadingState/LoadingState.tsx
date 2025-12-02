/**
 * LoadingState Component
 * 
 * Reutilizabil loading state cu spinner și mesaj
 * 100% design tokens, <30 linii
 */

import { Loader2 } from 'lucide-react';
import styles from './LoadingState.module.css';

export interface LoadingStateProps {
  /**
   * Loading message to display
   * @default "Loading..."
   */
  message?: string;
  
  /**
   * Size of loading spinner
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
}

export function LoadingState({ 
  message = "Loading...",
  size = "medium"
}: LoadingStateProps): JSX.Element {
  return (
    <div className={styles.container}>
      <Loader2 className={`${styles.spinner} ${styles[size]}`} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
