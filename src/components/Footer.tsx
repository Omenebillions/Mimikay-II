import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';
import { SiteSettings } from '../types';

interface Props {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<Props> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-[#0a5d2c] text-white border-t border-[#00682b] mt-20">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Organization */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhivdhR9gjy9BVc6y-NrHzQB-XuqVn1dqv7sghel61dDno5v4YxEwmggJhMIG1Hz-K2q9OulfsEhMqhBFkaAvVQWJbIl8586nJylYuITE9Pbxtcmyd8biJpZIx_3XBwhmxJ5qBDjl71_zXMTLlhrGmzq6PZdfv5hxpyhujtREGkncOdOh2blBgAh1YgtG4/s1080/White%20And%20Green%20Merry%20Christmas%20Instagram%20Post.png"
                alt="MPM Logo"
                className="w-10 h-10 rounded-full bg-white p-0.5 object-contain"
              />
              <span className="font-bold text-lg tracking-tight text-white">
                MIMIKAY POLITICAL MOVEMENT
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Powered by the <strong className="text-white">Voice for Delta Grassroot Development Initiative</strong>.
              A coalition committed to transforming local communities through active civic participation,
              inclusive leadership, and people-centered development.
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-green-200/70 font-semibold block mb-1">
                Convener
              </span>
              <p className="text-sm font-medium text-white">{settings.convenerName}</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-white tracking-wide mb-4 border-b border-white/10 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  About Us &amp; Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/mission')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Mission Statement &amp; Values
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/events')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Events &amp; Latest Updates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Contact &amp; Ward Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="text-amber-300 hover:text-white font-semibold transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Admin Portal (Firebase Auth)</span>
                </button>
              </li>
              <li>
                <a
                  href={settings.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors"
                >
                  <span>kangaroo.ng (Blog)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="text-base font-semibold text-white tracking-wide mb-4 border-b border-white/10 pb-2">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-white/85">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hover:text-white hover:underline break-all"
                >
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a href={`tel:${settings.phone1.replace(/\s+/g, '')}`} className="block hover:underline">
                    {settings.phone1}
                  </a>
                  <a href={`tel:${settings.phone2.replace(/\s+/g, '')}`} className="block hover:underline">
                    {settings.phone2}
                  </a>
                  <a href={`tel:${settings.phone3.replace(/\s+/g, '')}`} className="block hover:underline">
                    {settings.phone3}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                <span>Delta State &amp; National Grassroots Network, Nigeria</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & WhatsApp */}
          <div>
            <h4 className="text-base font-semibold text-white tracking-wide mb-4 border-b border-white/10 pb-2">
              Community Action
            </h4>
            <p className="text-sm text-white/80 mb-4 leading-relaxed">
              Connect directly with ward organizers and community champions. Join our verified WhatsApp coalition for live briefings.
            </p>
            <a
              href={settings.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md shadow-sm transition-colors text-sm"
            >
              <span>Join WhatsApp Group</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Tintville Credit & Admin Access */}
      <div className="border-t border-white/10 bg-[#06441f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/75">
          <p>© 2026 Mimikay Political Movement. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/admin')}
              className="text-white/80 hover:text-white underline hover:no-underline font-semibold"
            >
              Admin Portal
            </button>
            <span aria-hidden="true">·</span>
            <span>Crafted with commitment</span>
            <span aria-hidden="true">·</span>
            <a
              href={settings.tintvilleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-white font-medium hover:underline inline-flex items-center gap-1"
            >
              A <strong>Tintville</strong> Design
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
