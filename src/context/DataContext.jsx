import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { siteData } from '../data/siteData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [content, setContent] = useState(siteData);
  const [fromRemote, setFromRemote] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      const fetchTable = (table) => supabase.from(table).select('*').order('sort_order');
      
      const results = await Promise.all([
        supabase.from('site_config').select('*').limit(1),
        fetchTable('stats'),
        fetchTable('clients'),
        fetchTable('services'),
        fetchTable('portfolio'),
        fetchTable('marquee_logos'),
        fetchTable('concepts'),
        fetchTable('core_values'),
        fetchTable('capabilities'),
        supabase.from('service_details').select('*'),
        supabase.from('contact_info').select('*').limit(1),
        supabase.from('social_links').select('*').limit(1),
        supabase.from('legal_pages').select('*').order('id'),
        supabase.from('legal_page_sections').select('*').order('sort_order')
      ]);

      const error = results.find(r => r.error);
      if (error) {
        console.warn('Supabase fetch failed, using bundled site data:', error.error);
        setLoading(false);
        return;
      }

      const [
        configRes, statsRes, clientsRes, servicesRes, portfolioRes,
        marqueeRes, conceptsRes, coreValuesRes, capabilitiesRes,
        serviceDetailsRes, contactRes, socialRes, legalPagesRes, legalSectionsRes
      ] = results;

      const config = configRes.data?.[0];
      const contact = contactRes.data?.[0];
      const social = socialRes.data?.[0];

      setContent(prev => ({
        ...prev,
        description: config?.description || prev.description,
        marqueeLabel: config?.marquee_label || prev.marqueeLabel,
        stats: statsRes.data?.length ? Object.fromEntries(statsRes.data.map(s => [s.key, s.value])) : prev.stats,
        stats_labels: statsRes.data?.length ? Object.fromEntries(statsRes.data.map(s => [s.key, s.label])) : prev.stats_labels,
        clients: clientsRes.data?.length ? clientsRes.data.map(c => ({ name: c.name, src: c.image_url, since: c.since })) : prev.clients,
        marqueeLogos: marqueeRes.data?.length ? marqueeRes.data.map(m => ({ name: m.name, src: m.image_url })) : prev.marqueeLogos,
        concepts: conceptsRes.data?.length ? conceptsRes.data.map(c => ({ number: c.number, tag: c.tag, title: c.title, description: c.description })) : prev.concepts,
        coreValues: coreValuesRes.data?.length ? coreValuesRes.data.map(cv => ({ icon: cv.icon, label: cv.label })) : prev.coreValues,
        capabilities: capabilitiesRes.data?.length ? capabilitiesRes.data.map(cb => ({ icon: cb.icon, title: cb.title, description: cb.description })) : prev.capabilities,
        services: servicesRes.data?.length ? servicesRes.data.map(s => {
          const det = (serviceDetailsRes.data || []).find(d => d.service_id === s.id);
          return {
            id: s.id,
            title: s.title,
            image: s.image_url,
            details: det ? {
              manifesto: det.manifesto,
              gallery: det.gallery || [],
              capabilities: det.capabilities || []
            } : prev.services.find(ps => ps.id === s.id)?.details || null
          };
        }) : prev.services,
        portfolio: portfolioRes.data?.length ? portfolioRes.data.map(p => ({
          title: p.title,
          description: p.description,
          category: p.category,
          video: p.video_url
        })) : prev.portfolio,
        contact: {
          phone: contact?.phone || prev.contact.phone,
          email: contact?.email || prev.contact.email,
          address: contact?.address || prev.contact.address,
          working_hours: contact?.working_hours || prev.contact.working_hours,
          coordinates: prev.contact.coordinates
        },
        social: {
          facebook: social?.facebook || prev.social.facebook,
          instagram: social?.instagram || prev.social.instagram,
          linkedin: social?.linkedin || prev.social.linkedin,
          whatsapp: prev.social.whatsapp
        }
      }));

      setFromRemote(true);
      setLoading(false);
    } catch (err) {
      console.warn('Error loading dynamic data:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <DataContext.Provider value={{ content, fromRemote, loading, refresh }}>
      {children}
    </DataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(DataContext);
  if (!context) {
    return { content: siteData, fromRemote: false, loading: false, refresh: async () => {} };
  }
  return context;
}
