import { useState } from 'react';

const API_URL = import.meta.env.PUBLIC_API_URL ?? 'https://api.a1qualityparalegal.com';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(`${API_URL}/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      setFields({ name: '', email: '', phone: '', service: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {status === 'success' && (
        <div className="alert alert--success" role="alert">
          Thanks for reaching out! We will get back to you shortly.
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert--error" role="alert">
          Something went wrong. Please try again or call us at 541-474-2260.
        </div>
      )}

      <label>
        Name*
        <input
          type="text"
          name="name"
          value={fields.name}
          onChange={handleChange}
          required
          disabled={status === 'submitting'}
        />
      </label>

      <label>
        Email*
        <input
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          required
          disabled={status === 'submitting'}
        />
      </label>

      <label>
        Phone
        <input
          type="tel"
          name="phone"
          value={fields.phone}
          onChange={handleChange}
          disabled={status === 'submitting'}
        />
      </label>

      <label>
        Service Needed
        <select
          name="service"
          value={fields.service}
          onChange={handleChange}
          disabled={status === 'submitting'}
        >
          <option value="">— Select a service —</option>
          <option value="estate-planning">Estate Planning</option>
          <option value="power-of-attorney">Power of Attorney</option>
          <option value="wills-trusts">Wills &amp; Trusts</option>
          <option value="deeds-transfers">Deeds &amp; Property Transfers</option>
          <option value="other">Other / Not Sure</option>
        </select>
      </label>

      <label>
        Message*
        <textarea
          name="message"
          value={fields.message}
          onChange={handleChange}
          rows={5}
          required
          disabled={status === 'submitting'}
        />
      </label>

      <button className="btn btn--primary" type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
