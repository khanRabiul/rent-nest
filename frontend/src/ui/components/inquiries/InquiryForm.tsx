"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import inquiryService from '@/services/inquiryService';
import Link from 'next/link';

interface InquiryFormProps {
  landlordId: string;
  propertyId: string;
}

export default function InquiryForm({ landlordId, propertyId }: InquiryFormProps) {
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth();

  if (!isLoggedIn || authLoading) {
    return (
      <p className="mt-6 text-[--foreground-muted] text-sm">
        Log in to message the landlord <Link href="/signin" className="text-[--primary] hover:underline">Log In</Link>.
      </p>
    );
  }

  if (!user) {
    return (
      <p className="mt-6 text-red-500 text-sm">Error: User data is not available. Please try logging in again.</p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!user.id || !user.email) {
      setError('User ID or email not found. Please log in again.');
      setLoading(false);
      return;
    }

    if (!messageText.trim()) {
      setError('Message cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        setLoading(false);
        alert('Your session has expired. Please log in again.');
        return;
      }

      const inquiryData = {
        recipient: landlordId,
        property: propertyId,
        messageText: messageText.trim(),
      };

      const response = await inquiryService.sendInquiry(inquiryData, token);

      setSuccess(response.message || 'Message sent successfully!');
      setMessageText('');
    } catch (err: any) {
      console.error('Failed to send message:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to send message!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      {success && <p className="text-green-500 mb-2">{success}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <p className="text-sm text-[--foreground-muted]">
        From: <span className="font-semibold">{user.fullName || user.username} ({user.email})</span>
      </p>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[--foreground-muted] mb-1">Your Message</label>
        <textarea
          id="message"
          rows={5}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="w-full px-4 py-2 border border-[--border] rounded-md bg-[--bg-light] text-[--foreground] focus:ring-[--primary] focus:border-[--primary]"
          required
          disabled={loading}
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 rounded-md bg-[--primary] text-white font-semibold hover:opacity-90 transition-opacity"
        disabled={loading}
      >
        {loading ? 'Sending Message...' : 'Send Message'}
      </button>
    </form>
  )
}