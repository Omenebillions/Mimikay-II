import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, ExternalLink, MapPin } from 'lucide-react';

interface Props {
  settings: SiteSettings;
}

export const ContactPage: React.FC<Props> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    lgaWard: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setSubmitted(true);
  };

  const phoneContacts = [
    { number: settings.phone1, waNumber: '2349134830720', label: 'Primary Secretariat Line' },
    { number: settings.phone2, waNumber: '2347035553463', label: 'Ward Coordination Desk' },
    { number: settings.phone3, waNumber: '2347060503302', label: 'Youth & Civic Outreach' },
  ];

  return (
    <div className="bg-[#f9fafb] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8 space-y-2">
          <div className="text-xs uppercase tracking-widest text-[#008037] font-bold">
            Direct Communication
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Contact Mimikay Political Movement
          </h1>
          <p className="text-gray-600 text-base max-w-2xl">
            Reach our leadership executive, contact ward liaisons, or join our active community coordination forums.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Official Email */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#008037] flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Email Inquiries</h2>
              <p className="text-xs text-gray-500">
                Official press communiqués, memos, and formal petitions.
              </p>
            </div>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="font-semibold text-sm text-[#008037] hover:underline break-all pt-2 block"
            >
              {settings.contactEmail}
            </a>
          </div>

          {/* Card 2: Community WhatsApp Channel */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#008037] flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Community Group</h2>
              <p className="text-xs text-gray-500">
                Join our central grassroots community group on WhatsApp.
              </p>
            </div>
            <a
              href={settings.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#008037] hover:underline pt-2"
            >
              <span>Join WhatsApp Group</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Secretariat Headquarters */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#008037] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Location &amp; Reach</h2>
              <p className="text-xs text-gray-500">
                Ughelli, Delta Central &amp; Ward Chapters across Delta State, Nigeria.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-600 pt-2 block">
              Powered by Voice for Delta Grassroot Development Initiative
            </span>
          </div>
        </div>

        {/* Telephone & WhatsApp Numbers Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Direct Phone &amp; WhatsApp Lines
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select any line to call directly or initiate a direct chat with our representative on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phoneContacts.map((contact, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-5 rounded-2xl border border-gray-200/70 space-y-3 hover:border-emerald-300 transition-colors"
              >
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {contact.label}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  <a href={`tel:${contact.number.replace(/\s+/g, '')}`} className="hover:text-[#008037]">
                    {contact.number}
                  </a>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`tel:${contact.number.replace(/\s+/g, '')}`}
                    className="flex-1 text-center py-2 px-3 text-xs font-semibold bg-white text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg shadow-2xs"
                  >
                    Direct Call
                  </a>
                  <a
                    href={`https://wa.me/${contact.waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg shadow-2xs"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                      alt="WhatsApp"
                      className="w-3.5 h-3.5 invert"
                    />
                    <span>Chat</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xs">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Send an Official Message</h2>
              <p className="text-sm text-gray-600">
                Have a proposal, ward inquiry, or grassroots concern? Leave a message and our secretariat will respond promptly.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-[#008037] mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">Thank You For Reaching Out</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your message has been logged with the Mimikay Political Movement secretariat. A representative will contact you via your phone or email.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', lgaWard: '', message: '' });
                  }}
                  className="mt-4 px-5 py-2 bg-[#008037] text-white text-xs font-semibold rounded-lg"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Comrade Akpevwe"
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008037]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234..."
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008037]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008037]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      LGA / Ward (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.lgaWard}
                      onChange={(e) => setFormData({ ...formData, lgaWard: e.target.value })}
                      placeholder="e.g. Ughelli North, Ward 3"
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008037]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, ward proposal, or question..."
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008037]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#008037] hover:bg-[#0a5d2c] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
