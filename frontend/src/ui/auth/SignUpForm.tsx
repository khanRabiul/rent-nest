'use client';

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUpForm = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);

    try {
      const userData = {
        username,
        email,
        password,
        role: role as 'user' | 'landlord' | 'admin',
        fullName: fullName || undefined,
      };

      await register(userData);
      alert('Register Successfull! Please login.');
      router.push('/signin');

    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Registration failed!');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="bg-[--card-bg] p-8 rounded-lg shadow-xl border border-[--border] w-full max-w-md">
      <h1 className="text-4xl text-center font-bold mb-6 text-[--primary]">RentNest</h1>
      <h2 className="text-3xl font-semibold text-center mb-6 text-[--primary]">Sign Up</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-[--foreground-muted] mb-1">User Name</label>
          <input type="text"
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-[--border] rounded-md bg-[--bg-light] text-[--foreground] focus:ring-[--primary] focus:border-[--primary]"
            required
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[--foreground-muted] mb-1">Full Name</label>
          <input type="text"
            id='fullName'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-[--border] rounded-md bg-[--bg-light] text-[--foreground] focus:ring-[--primary] focus:border-[--primary]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[--foreground-muted] mb-1">Email</label>
          <input type="text"
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-[--border] rounded-md bg-[--bg-light] text-[--foreground] focus:ring-[--primary] focus:border-[--primary]"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[--foreground-muted] mb-1">Password</label>
          <input type="text"
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[--border] rounded-md bg-[--bg-light] text-[--foreground] focus:ring-[--primary] focus:border-[--primary]"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-[--foreground-muted] mb-1">Role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-[--border] rounded-md bg-[--bg-light] text-[--foreground] focus:ring-[--primary] focus:border-[--primary]"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="landlord">Landlord</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-md bg-[var(--button-primary-color)]  text-white font-semibold hover:opacity-90 transition-opacity"
          disabled={formLoading}
        >
          {formLoading ? 'Registration on processing..' : 'Sign up'}
        </button>

      </form>

      <p className="mt-6 inline-flex gap-8">
        <span>Already registerd</span>
        <Link href='/signin' className="text-blue-600 hover:underline">Log In</Link>
      </p>
    </div>
  );
};

export default SignUpForm;