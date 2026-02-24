// Admin home page - redirects to login (middleware handles auth → dashboard)
import { redirect } from 'next/navigation';

export default function AdminHomePage() {
  redirect('/login');
}
