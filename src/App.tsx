import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { LabTestsSection } from './components/LabTestsSection.js';
import { LabInfoSection } from './components/LabInfoSection.js';
import { FeeNoticeSection } from './components/FeeNoticeSection.js';
import { Footer } from './components/Footer.js';
import { ChatWidget } from './components/ChatWidget.js';
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { CustomerChatsPage } from './components/admin/CustomerChatsPage.js';
import { McpTestPage } from './components/mcp/McpTestPage.js';
import { LabConfig, AdminUser } from './types/index.js';

type ViewMode = 'landing' | 'admin-login' | 'admin-dashboard' | 'admin-chats' | 'mcp-test';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/mcp-test') {
      return 'mcp-test';
    }
    return 'landing';
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [presetQuery, setPresetQuery] = useState<string>('');
  
  const [config, setConfig] = useState<LabConfig>({
    lab_name: 'Jeevan Pathology Lab',
    lab_city: 'Pune',
    lab_address: 'Shop 12-14, Ground Floor, Fortune Business Centre, Near Goodluck Chowk, FC Road, Shivaji Nagar, Pune, Maharashtra 411005',
    lab_phone: '+91 98220 12345',
    lab_phone_raw: '+919822012345',
    lab_whatsapp: '+919822012345',
    lab_email: 'contact@jeevanpathologylab.com',
    lab_timings: 'Mon - Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 2:00 PM',
    fee_notice: 'The fees are Rs 1,500, Rs 2,500, and Rs 3,000 per month, depending on the course.'
  });

  // Fetch lab config on mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error('Failed to load lab config:', err));
  }, []);

  // Check admin session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setAuthToken(storedToken);
      fetch('/api/admin/session', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.authenticated && data.user) {
            setAdminUser(data.user);
          } else {
            localStorage.removeItem('admin_token');
            setAuthToken('');
          }
        })
        .catch(() => {
          localStorage.removeItem('admin_token');
          setAuthToken('');
        });
    }
  }, []);

  const handleLoginSuccess = (user: AdminUser, token: string) => {
    setAdminUser(user);
    setAuthToken(token);
    setCurrentView('admin-dashboard');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch {}
    localStorage.removeItem('admin_token');
    setAdminUser(null);
    setAuthToken('');
    setCurrentView('landing');
  };

  const handleOpenChatWithQuery = (query?: string) => {
    if (query) {
      setPresetQuery(query);
    }
    setIsChatOpen(true);
  };

  // Handle browser back/forward and URL sync
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname === '/mcp-test') {
        setCurrentView('mcp-test');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateToMcpTest = () => {
    if (window.location.pathname !== '/mcp-test') {
      window.history.pushState({}, '', '/mcp-test');
    }
    setCurrentView('mcp-test');
  };

  const navigateToLanding = () => {
    if (window.location.pathname === '/mcp-test') {
      window.history.pushState({}, '', '/');
    }
    setCurrentView('landing');
  };

  // 1. Dedicated MCP Test Page View (/mcp-test)
  if (currentView === 'mcp-test') {
    return <McpTestPage onBackToSite={navigateToLanding} />;
  }

  // 2. Dedicated Customer Chats View
  if (currentView === 'admin-chats') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={navigateToLanding}
        />
      );
    }
    return (
      <CustomerChatsPage
        authToken={authToken}
        onBackToDashboard={() => setCurrentView('admin-dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  // 3. Admin Dashboard View
  if (currentView === 'admin-dashboard') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={navigateToLanding}
        />
      );
    }
    return (
      <AdminDashboard
        adminUser={adminUser}
        authToken={authToken}
        config={config}
        onConfigUpdated={(newCfg) => setConfig(newCfg)}
        onNavigateToCustomerChats={() => setCurrentView('admin-chats')}
        onNavigateToPublicSite={navigateToLanding}
        onLogout={handleLogout}
      />
    );
  }

  // 4. Admin Login View
  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={navigateToLanding}
      />
    );
  }

  // 4. Public Landing Page
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Bar Navigation */}
      <Navbar
        onOpenChat={() => setIsChatOpen(true)}
        onNavigateToAdmin={() => {
          if (adminUser) {
            setCurrentView('admin-dashboard');
          } else {
            setCurrentView('admin-login');
          }
        }}
        isAdminLoggedIn={Boolean(adminUser)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Marquee Lab Interior Image */}
        <Hero
          config={config}
          onOpenChat={handleOpenChatWithQuery}
        />

        {/* Lab Tests Section: Blood tests, Urine tests, X-Ray, Related tests */}
        <LabTestsSection
          onSelectTest={(testName) => handleOpenChatWithQuery(`I am interested in ${testName}`)}
        />

        {/* Timings, Pune Address, and Lab Photo Slots */}
        <LabInfoSection config={config} />

        {/* Transparent Course Fees Section (Rs 1500, 2500, 3000) */}
        <FeeNoticeSection onOpenChat={handleOpenChatWithQuery} />
      </main>

      {/* Quiet Footer */}
      <Footer
        config={config}
        onNavigateToAdmin={() => {
          if (adminUser) {
            setCurrentView('admin-dashboard');
          } else {
            setCurrentView('admin-login');
          }
        }}
        onNavigateToMcp={navigateToMcpTest}
      />

      {/* Embedded Floating Chat Assistant: "Jeevan" */}
      <ChatWidget
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
        presetQuery={presetQuery}
        onClearPresetQuery={() => setPresetQuery('')}
      />

    </div>
  );
}
