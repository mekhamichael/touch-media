import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSiteData } from '../context/DataContext';
import { useSEO } from '../hooks/useSEO';
import { LogOut, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Home, Database } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SECTIONS = [
  { key: 'services', label: 'Services' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'clients', label: 'Clients' },
  { key: 'marqueeLogos', label: 'Marquee Logos' },
  { key: 'concepts', label: 'Concepts' },
  { key: 'coreValues', label: 'Core Values' },
  { key: 'capabilities', label: 'Capabilities' },
  { key: 'stats', label: 'Stats' },
  { key: 'contact', label: 'Contact Info' },
  { key: 'social', label: 'Social Links' }
];

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const { content, fromRemote, refresh } = useSiteData();
  const [activeTab, setActiveTab] = useState('services');
  const [notice, setNotice] = useState(null);

  useSEO({
    title: 'Content Dashboard | TouchMedia',
    description: 'TouchMedia content dashboard.',
    noindex: true
  });

  const showNotice = (msg, type = 'success') => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'services':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold">Services ({content.services?.length || 0})</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {content.services?.map((item) => (
                <div key={item.id} className="rounded-lg border border-navy-700 bg-navy-800 p-4">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.title} className="h-16 w-24 rounded object-cover" />
                    <div>
                      <h4 className="font-bold text-cream">{item.title}</h4>
                      <p className="text-xs text-cream/50">ID: {item.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold">Portfolio Projects ({content.portfolio?.length || 0})</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {content.portfolio?.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-navy-700 bg-navy-800 p-4">
                  <span className="inline-block text-[10px] uppercase font-bold text-gold/80 mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-cream text-base">{item.title}</h4>
                  <p className="mt-1 text-xs text-cream/60 line-clamp-2">{item.description}</p>
                  <p className="mt-2 text-[10px] text-cream/40 truncate">Video: {item.video}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'clients':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold">Clients ({content.clients?.length || 0})</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {content.clients?.map((client, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center rounded-lg border border-navy-700 bg-navy-800 p-4 text-center">
                  <div className="h-14 w-14 flex items-center justify-center bg-white rounded-full p-2 mb-2">
                    <img src={client.src} alt={client.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <span className="font-medium text-cream text-sm">{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'marqueeLogos':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold">Marquee Logos ({content.marqueeLogos?.length || 0})</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {content.marqueeLogos?.map((logo, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center rounded-lg border border-navy-700 bg-navy-800 p-3 text-center">
                  <div className="h-12 w-20 flex items-center justify-center bg-white rounded p-1 mb-2">
                    <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <span className="font-medium text-cream text-xs">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold">Stats Counter</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(content.stats || {}).map(([key, val]) => (
                <div key={key} className="rounded-lg border border-navy-700 bg-navy-800 p-4">
                  <span className="text-xs text-cream/50 uppercase">{content.stats_labels?.[key] || key}</span>
                  <p className="mt-1 font-serif text-3xl font-bold text-gold">{val}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-xl font-bold text-gold">Contact Information</h3>
            <div className="rounded-lg border border-navy-700 bg-navy-800 p-6 space-y-4">
              <div>
                <label className="text-xs text-cream/50 uppercase block mb-1">Phone</label>
                <p className="text-cream font-medium">{content.contact?.phone}</p>
              </div>
              <div>
                <label className="text-xs text-cream/50 uppercase block mb-1">Email</label>
                <p className="text-cream font-medium">{content.contact?.email}</p>
              </div>
              <div>
                <label className="text-xs text-cream/50 uppercase block mb-1">Address</label>
                <p className="text-cream font-medium">{content.contact?.address}</p>
              </div>
              <div>
                <label className="text-xs text-cream/50 uppercase block mb-1">Working Hours</label>
                <p className="text-cream font-medium">{content.contact?.working_hours}</p>
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-xl font-bold text-gold">Social Media Links</h3>
            <div className="rounded-lg border border-navy-700 bg-navy-800 p-6 space-y-4">
              <div>
                <label className="text-xs text-cream/50 uppercase block mb-1">Facebook</label>
                <p className="text-gold break-all text-sm">{content.social?.facebook}</p>
              </div>
              <div>
                <label className="text-xs text-cream/50 uppercase block mb-1">Instagram</label>
                <p className="text-gold break-all text-sm">{content.social?.instagram}</p>
              </div>
              <div>
                <label className="text-xs text-cream/50 uppercase block mb-1">LinkedIn</label>
                <p className="text-gold break-all text-sm">{content.social?.linkedin}</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
            <p className="text-cream/70">Select a section from the left navigation.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-cream">
      {/* Top Header */}
      <header className="border-b border-navy-700 bg-navy-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="font-serif text-xl font-bold">
              Touch<span className="text-gold">Media</span>
            </span>
          </a>
          <span className="rounded bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider">
            CMS Admin
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs text-cream/60">
            {user?.email}
          </span>
          <a
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-navy-700 px-3 py-1.5 text-xs text-cream/70 hover:text-gold hover:border-gold/50 transition-colors"
          >
            <Home size={14} /> View Site
          </a>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-lg bg-navy-800 border border-navy-700 px-3 py-1.5 text-xs text-cream/80 hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {notice && (
          <div
            className={`mb-6 flex items-center gap-2 rounded-lg p-4 text-sm ${
              notice.type === 'success'
                ? 'bg-green-900/30 text-green-300 border border-green-700/50'
                : 'bg-red-900/30 text-red-300 border border-red-700/50'
            }`}
          >
            {notice.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {notice.msg}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="space-y-1">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-cream/40">
              Content Sections
            </p>
            {SECTIONS.map((sec) => (
              <button
                key={sec.key}
                onClick={() => setActiveTab(sec.key)}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === sec.key
                    ? 'bg-gold text-navy-950 font-semibold'
                    : 'text-cream/70 hover:bg-navy-800 hover:text-cream'
                }`}
              >
                {sec.label}
              </button>
            ))}

            <div className="pt-6">
              <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
                <div className="flex items-center gap-2 text-xs text-cream/70 mb-2">
                  <Database size={14} className="text-gold" />
                  <span>Data Source</span>
                </div>
                <p className="text-[11px] text-cream/50">
                  {fromRemote ? 'Connected to Supabase Database' : 'Using Bundled Production Store'}
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-3">
            <div className="rounded-xl border border-navy-700 bg-navy-900 p-6 shadow-xl">
              {renderActiveSection()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
