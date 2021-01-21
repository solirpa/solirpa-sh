import Router from 'next/router'
import { NextWebVitalsMetric } from 'next/app'
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

// Otherwise, you'll get "gtag is not defined errors" during dev and build (not an issue in production because the analytics script is loaded)
declare global {
  interface Window {
    gtag: any
  }
}

type Event = { action: string; category: string; label: string; value: string }

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageView = (url: string) => {
  if (process.env.NODE_ENV === 'production')
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: Event) => {
  if (process.env.NODE_ENV === 'production')
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
}

export const trackPageChanges = () => {
  if (process.env.NODE_ENV === 'production') {
    const handleRouteChange = (url: string) => {
      pageView(url)
    }
    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }
  return
}

export const webVitals = (metric: NextWebVitalsMetric) => {
  if (process.env.NODE_ENV === 'production')
    window.gtag('send', 'event', {
      eventCategory:
        metric.label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
      eventAction: name,
      eventValue: Math.round(
        name === 'CLS' ? metric.value * 1000 : metric.value
      ), // values must be integers
      eventLabel: metric.id, // id unique to current page load
      nonInteraction: true, // avoids affecting bounce rate.
    })
}

export const trackingCode = (
  <>
    {process.env.NODE_ENV === 'production' && (
      <>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          defer
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
          }}
        />
      </>
    )}
  </>
)
