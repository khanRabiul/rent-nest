'use client';
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter} from "next/navigation";
import { useState } from "react";



const SignInForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { login } = useAuth();

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both email and password.");
      setFormLoading(false);
      return;
    }
    
    try {
      await login(trimmedEmail, trimmedPassword);
      router.push('/properties')
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Login failed. Email or password does not match');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="bg-[--card-bg] p-8 rounded-lg shadow-xl border border-[--border] w-full max-w-md">
      <h1 className="text-4xl text-center font-bold mb-6 text-[--primary]">RentNest</h1>
      <h2 className="text-3xl font-semibold text-center mb-6 text-[--primary]">Sign In</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[--foreground-muted] mb-1" >Email</label>
          <input type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-[--border] rounded-md bg-[--bg-light] text-[--foreground] focus:ring-[--primary] focus:border-[--primary]"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[--foreground-muted] mb-1" >Password</label>
          <input type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[--border] rounded-md bg-[--bg-light] text-[--foreground] focus:ring-[--primary] focus:border-[--primary]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-md bg-[var(--button-primary-color)] text-white font-semibold hover:opacity-90 transition-opacity"
          disabled={formLoading}
        >
          {formLoading ? 'Login...' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-[--foreground-muted]">
        Do not have accoutn? {' '}
        <Link href='/signup' className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignInForm;