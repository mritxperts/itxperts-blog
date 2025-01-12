/* global dataLayer */
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogPost from './components/BlogPost';
import BlogList from './components/BlogList';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import CategoryPage from './pages/CategoryPage';

function App() {
  useEffect(() => {
   // Google Analytics Script
   const scriptGA = document.createElement('script');
   scriptGA.async = true;
   scriptGA.src = 'https://www.googletagmanager.com/gtag/js?id=G-VNJ4B0GX3D'; // Removed extra space
   document.head.appendChild(scriptGA);

   scriptGA.onload = () => {
     window.dataLayer = window.dataLayer || [];
     function gtag() {
       dataLayer.push(arguments);
     }
     gtag('js', new Date());
     gtag('config', 'G-VNJ4B0GX3D');
   };

   // Google Adsense Script
   const scriptAds = document.createElement('script');
   scriptAds.async = true;
   scriptAds.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
   document.head.appendChild(scriptAds);
 }, []);
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/post/:slug" element={<BlogPost />} />
            <Route path="*" element={<p>Page not found!</p>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
