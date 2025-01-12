import React, { useEffect } from 'react';

const AdSenseAd = ({ client, slot }) => {
  useEffect(() => {
    const adElement = document.querySelector(`.adsbygoogle[data-ad-slot="${slot}"]`);

    const initializeAd = () => {
      // Only initialize the ad once
      if (adElement && !adElement.hasAttribute('data-ad-initialized')) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adElement.setAttribute('data-ad-initialized', 'true');
        } catch (error) {
          console.error("Ad initialization failed:", error);
        }
      }
    };

    // Delay the ad initialization to ensure the DOM is updated properly
    const timeoutId = setTimeout(initializeAd, 1000); // Delay initialization by 1 second

    // Cleanup: Clear timeout if the component is unmounted
    return () => {
      clearTimeout(timeoutId);
      if (adElement) {
        adElement.removeAttribute('data-ad-initialized');
      }
    };
  }, [client, slot]);

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', maxWidth: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto" // Responsive ad
      ></ins>
    </div>
  );
};

export default AdSenseAd;
