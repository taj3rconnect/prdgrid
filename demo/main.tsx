import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/tailwind.css';
import '../src/styles/datagrid.css';
import { AvatarMenu } from './AvatarMenu';
import { OverviewDemo } from './tabs/OverviewDemo';
import { AirtableDemo } from './tabs/AirtableDemo';
import { ChartsDemo } from './tabs/ChartsDemo';
import { HRDemo } from './tabs/HRDemo';
import { FinanceDemo } from './tabs/FinanceDemo';
import { PerformanceDemo } from './tabs/PerformanceDemo';
import { StaffingDemo } from './tabs/StaffingDemo';
import { DarkDemo } from './tabs/DarkDemo';
import { BrandDemo } from './tabs/BrandDemo';
import { StatesDemo } from './tabs/StatesDemo';
import { APIDemo } from './tabs/APIDemo';
import { SysinfoView } from './tabs/SysinfoView';

const navItems = [
  { id: 'overview', label: 'Overview', icon: '✨', component: null as any },
  { id: 'airtable', label: 'Airtable', icon: '🗂️', component: AirtableDemo },
  { id: 'charts', label: 'Charts', icon: '📊', component: ChartsDemo },
  { id: 'hr', label: 'HR', icon: '👥', component: HRDemo },
  { id: 'finance', label: 'Finance', icon: '📈', component: FinanceDemo },
  { id: 'performance', label: 'Performance', icon: '🏆', component: PerformanceDemo },
  { id: 'staffing', label: 'Staffing', icon: '🎯', component: StaffingDemo },
  { id: 'dark', label: 'Dark', icon: '🌙', component: DarkDemo },
  { id: 'brand', label: 'Brand', icon: '🎨', component: BrandDemo },
  { id: 'states', label: 'States', icon: '⏳', component: StatesDemo },
  { id: 'api', label: 'API', icon: '⚡', component: APIDemo },
];

function App() {
  const [activeTab, setActiveTab] = useState(() =>
    window.location.pathname === '/sysinfo' ? 'sysinfo' : 'overview'
  );
  const [responsive, setResponsive] = useState(() => localStorage.getItem('prd-demo-responsive') === '1');
  const setResponsivePersist = (v: boolean) => {
    setResponsive(v);
    localStorage.setItem('prd-demo-responsive', v ? '1' : '0');
  };
  const openTab = (id: string) => {
    setActiveTab(id);
    window.history.pushState(null, '', id === 'sysinfo' ? '/sysinfo' : '/');
  };
  useEffect(() => {
    const onPop = () => setActiveTab(window.location.pathname === '/sysinfo' ? 'sysinfo' : 'overview');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const container = responsive ? 'mx-auto w-full px-6' : 'mx-auto max-w-[1152px] px-6';
  const ActiveDemo = navItems.find(n => n.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <nav className="sticky top-0 z-50" style={{ backgroundColor: '#0e4491' }}>
        <div className={`${container} flex items-center h-14 gap-4`}>
          <button
            className="flex items-center gap-2.5 mr-2 bg-transparent"
            style={{ border: 'none', font: 'inherit', cursor: 'pointer', padding: 0 }}
            title="Back to overview"
            onClick={() => openTab('overview')}
          >
            <div className="h-7 w-7 rounded-md bg-white flex items-center justify-center font-bold text-[11px]" style={{ color: '#0e4491' }}>pg</div>
            <span className="font-semibold text-white text-[15px] tracking-[-0.01em]">prdgrid</span>
            <span className="rounded border border-white/25 px-1.5 py-px text-[10px] font-medium text-white/70" style={{ fontFamily: 'var(--mono)' }}>v0.1.0</span>
          </button>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {navItems.map(n => (
              <button key={n.id}
                onClick={() => openTab(n.id)}
                style={{ border: 'none', font: 'inherit', cursor: 'pointer' }}
                className={`whitespace-nowrap rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors ${
                  activeTab === n.id
                    ? 'bg-white/15 text-white'
                    : 'bg-transparent text-white/65 hover:bg-white/10 hover:text-white'
                }`}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <AvatarMenu responsive={responsive} onResponsiveChange={setResponsivePersist} onSysinfo={() => openTab('sysinfo')} />
          <a href="https://github.com/taj3rconnect/prdgrid" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </nav>

      {activeTab === 'overview' && (
      <header className="border-b border-[#eaecf0] bg-white">
        <div className={`${container} py-10`}>
          <h1 className="text-[32px] font-bold leading-tight tracking-[-0.02em] text-[#101828]">
            The enterprise React data grid.
            <br />
            <span style={{ color: '#0e4491' }}>Zero license fees.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#475467]">
            Sorting, filtering, row grouping, live updates, editing, charts, and exports — the
            feature set of a commercial grid, MIT-licensed and built on TanStack Table.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => openTab('airtable')}
              className="rounded-md px-4 py-2 text-[13.5px] font-semibold text-white transition-colors"
              style={{ backgroundColor: '#0e4491', border: 'none', font: 'inherit', fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00388f')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0e4491')}
            >
              Explore the demos
            </button>
            <a
              href="https://github.com/taj3rconnect/prdgrid" target="_blank" rel="noopener noreferrer"
              className="rounded-md border border-[#d0d5dd] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#344054] transition-colors hover:bg-[#f9fafb]"
            >
              View on GitHub
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {['Sorting', 'Filtering', 'Row Grouping', 'Cell Editing', 'Live Updates',
              'Dark Mode', 'Themes', 'Pagination', 'Custom Renderers', 'Charts'].map(f => (
              <span key={f} className="rounded-md border border-[#eaecf0] bg-[#f9fafb] px-2 py-0.5 text-[11px] font-medium text-[#475467]">{f}</span>
            ))}
          </div>
        </div>
      </header>
      )}

      <div className={`${container} py-10`}>
        {activeTab === 'sysinfo' ? <SysinfoView /> : ActiveDemo ? <ActiveDemo /> : <OverviewDemo onNavigate={openTab} />}
        <footer className="mt-16 border-t border-[#eaecf0] pt-6 pb-10 text-center">
          <p className="text-sm text-[#667085]">prdgrid v0.1.0 — Built by <a href="https://github.com/taj3rconnect" className="hover:underline" style={{ color: '#0e4491' }}>Taj Haslani</a></p>
          <p className="text-xs text-[#98a2b3] mt-1">TanStack Table v8 + Tailwind CSS — MIT Licensed</p>
          <p className="text-xs text-[#98a2b3] mt-1">Built with assistance from <a href="https://claude.ai" className="hover:underline" style={{ color: '#3d7acd' }}>Claude</a> by Anthropic</p>
        </footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
