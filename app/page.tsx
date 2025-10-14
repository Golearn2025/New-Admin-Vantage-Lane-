// Admin home page - redirects to dashboard
import { redirect } from 'next/navigation';

export default function AdminHomePage() {
  // In M0.1, we simply redirect to dashboard
  // In later phases, this might show a landing page or login
  redirect('/dashboard');
}
