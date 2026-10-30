import React, { useState } from 'react';
import { Menu, X, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { SiteSettings } from '../types';

interface Props {
  currentPath: string;
  onNavigate: (path: string) => void;
  settings: SiteSettings;
}

export const Navbar: React.FC<Props> = ({ currentPath, onNavigate, settings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Mission', path: '/mission' },
    { label: 'Events & News', path: '/events' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath === '';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#008037] rounded-lg p-1"
            aria-label="Mimikay Political Movement Home"
          >
            <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border border-[#008037]/20 shadow-xs bg-white flex items-center justify-center p-0.5">
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhivdhR9gjy9BVc6y-NrHzQB-XuqVn1dqv7sghel61dDno5v4YxEwmggJhMIG1Hz-K2q9OulfsEhMqhBFkaAvVQWJbIl8586nJylYuITE9Pbxtcmyd8biJpZIx_3XBwhmxJ5qBDjl71_zXMTLlhrGmzq6PZdfv5hxpyhujtREGkncOdOh2blBgAh1YgtG4/s1080/White%20And%20Green%20Merry%20Christmas%20Instagram%20Post.png"
                alt="MPM Logo"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight group-hover:text-[#008037] transition-colors">
                MIMIKAY POLITICAL MOVEMENT
              </div>
              <div className="text-xs text-gray-500 font-medium tracking-wide hidden sm:block">
                Voice for Delta Grassroot Development Initiative
              </div>
            </div>
          </button>

          {/* Desktop Navigation with Framer glide indicator */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#008037] ${
                    active
                      ? 'text-[#008037]'
                      : 'text-gray-700 hover:text-[#008037] hover:bg-gray-50/80'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="activeNavBackground"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-[#e8f5e9]/80 rounded-lg -z-0"
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#008037] rounded-full z-10"
                    />
                  )}
                </button>
              );
            })}

            <div className="h-6 w-px bg-gray-200 mx-2" aria-hidden="true" />

            {/* WhatsApp Community Join Button */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={settings.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#008037] hover:bg-[#0a5d2c] rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008037]"
            >
              <Users className="w-4 h-4" />
              <span>Join MPM</span>
            </motion.a>
          </nav>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={settings.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#008037] rounded-md shadow-xs"
            >
              Join Us
            </a>

            <a
              href={settings.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#008037] rounded-md"
            >
              Join Us
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-[#008037] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#008037]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`block w-full text-left px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                    active
                      ? 'text-[#008037] bg-[#e8f5e9]'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
              <a
                href={settings.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 text-center font-semibold text-white bg-[#008037] hover:bg-[#0a5d2c] rounded-lg shadow-sm"
              >
                <Users className="w-5 h-5" />
                <span>Join MPM WhatsApp Community</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
