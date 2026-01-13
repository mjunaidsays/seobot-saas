import { redirect } from 'next/navigation';

// Redirect to home page - auth is handled via modal
export default function SignIn() {
  return redirect('/');
}
