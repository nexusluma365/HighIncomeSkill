import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useFunnel } from './useFunnel';
import { buildFunnelTrackingPayload, loadGoogleAnalytics, logFunnelEvent } from '@/utils/funnelTracking';

function getSectionLabel(section: Element, index: number) {
  const configuredLabel = section.getAttribute('data-funnel-section');
  if (configuredLabel) return configuredLabel;

  const heading = section.querySelector('h1, h2, h3, [data-section-title]');
  const headingText = heading?.textContent?.replace(/\s+/g, ' ').trim();
  return headingText || `section_${index + 1}`;
}

function getSectionId(section: Element, index: number) {
  return section.id || section.getAttribute('data-funnel-section') || `section_${index + 1}`;
}

export function useFunnelPageTracking() {
  const [location] = useLocation();
  const funnel = useFunnel();

  useEffect(() => {
    loadGoogleAnalytics();

    logFunnelEvent(
      'page_view',
      buildFunnelTrackingPayload(funnel, {
        page: location,
        status: 'viewed',
        metadata: { route: location },
      }),
    );

    const sections = Array.from(document.querySelectorAll('main section, [data-funnel-section]'));
    const viewedSections = new Set<Element>();

    if (sections.length === 0 || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.45 || viewedSections.has(entry.target)) {
            return;
          }

          viewedSections.add(entry.target);
          const sectionIndex = sections.indexOf(entry.target);
          const sectionId = getSectionId(entry.target, sectionIndex);
          const sectionLabel = getSectionLabel(entry.target, sectionIndex);

          logFunnelEvent(
            'section_view',
            buildFunnelTrackingPayload(funnel, {
              page: location,
              status: 'viewed',
              metadata: {
                route: location,
                sectionId,
                sectionIndex,
                sectionLabel,
              },
            }),
          );
        });
      },
      {
        threshold: [0.45, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [location]);
}
