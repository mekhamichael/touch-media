import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { z } from 'zod';

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const WEB3FORMS_KEY = '1ac901ac-8c74-428a-be64-0664d4ef5f87';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  message: z.string().trim().min(1, 'Message is required')
});

const inputClass =
  'peer w-full border-b border-cream/20 bg-transparent pb-3 pt-6 text-sm text-cream outline-none transition-colors focus:border-gold';
const labelClass =
  'absolute left-0 top-3 text-sm text-cream/60 transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-gold pointer-events-none';

export function ContactForm({ compact = false }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const errMap = {};
      result.error.issues.forEach((issue) => {
        errMap[issue.path[0]] = issue.message;
      });
      setErrors(errMap);
      return;
    }

    if (e.target.elements.botcheck?.checked) {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      return;
    }

    setErrors({});
    setStatus('loading');

    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'New message from TouchMedia website',
          from_name: 'TouchMedia Website',
          ...formData
        })
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        console.error('Submission failed:', data);
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bot detection honey pot */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      {/* Name Input */}
      <div className="group relative">
        <input
          type="text"
          name="name"
          id={compact ? 'sd-name' : 'name'}
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          aria-label="Name"
          className={inputClass}
          style={{ borderColor: errors.name ? '#f87171' : undefined }}
          placeholder=" "
        />
        <label htmlFor={compact ? 'sd-name' : 'name'} className={labelClass}>
          Name
        </label>
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      {/* Email Input */}
      <div className="group relative">
        <input
          type="email"
          name="email"
          id={compact ? 'sd-email' : 'email'}
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          aria-label="Email"
          className={inputClass}
          style={{ borderColor: errors.email ? '#f87171' : undefined }}
          placeholder=" "
        />
        <label htmlFor={compact ? 'sd-email' : 'email'} className={labelClass}>
          Email
        </label>
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>

      {/* Message Textarea */}
      <div className="group relative">
        <textarea
          name="message"
          id={compact ? 'sd-message' : 'message'}
          autoComplete="off"
          value={formData.message}
          onChange={handleChange}
          rows={compact ? 3 : 4}
          aria-label="Message"
          className={`${inputClass} resize-none`}
          style={{ borderColor: errors.message ? '#f87171' : undefined }}
          placeholder=" "
        />
        <label htmlFor={compact ? 'sd-message' : 'message'} className={labelClass}>
          Message
        </label>
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="group inline-flex items-center gap-3 rounded-2xl border border-gold/60 px-8 py-3.5 text-sm font-semibold tracking-[0.15em] uppercase text-gold transition-all duration-300 hover:bg-gold hover:text-navy-900 disabled:opacity-50 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
      >
        {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
        <Send size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>

      {status === 'success' && (
        <p className="text-sm text-green-400">Thank you! We'll be in touch soon.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-400">
          Something went wrong. Please try again or email us directly at info@touchmediaint.net.
        </p>
      )}
    </form>
  );
}
