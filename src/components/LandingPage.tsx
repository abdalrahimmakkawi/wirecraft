import { useEffect } from 'react';
import { ArrowRight, Plus, Cpu, ClipboardList, GitFork, Layers, Box, CheckSquare, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Lucide icons
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lucide@latest';
    script.async = true;
    document.body.appendChild(script);

    // Suppress Tailwind warnings
    const originalWarn = console.warn;
    console.warn = (msg: any) => {
      if (msg && typeof msg === 'string' && msg.includes('tailwind')) return;
      originalWarn(msg);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  const handleStartBuilding = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#09090b', color: '#fafafa', fontFamily: 'Inter, sans-serif' }}>
      {/* Nav Header */}
      <header className="h-16 border-b sticky top-0 backdrop-blur-md z-50 px-6 lg:px-12 flex items-center justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(9, 9, 11, 0.9)' }}>
        <div className="flex items-center space-x-8">
          <a href="#" className="flex items-center space-x-2.5 group">
            <svg className="w-6 h-6 transition-transform duration-150 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h6m-3 0v-2" />
              <path d="M6 19l4-6" />
              <circle cx="6" cy="19" r="1" fill="#0ea5e9" />
              <path d="M10 13l6-1" />
              <circle cx="10" cy="13" r="1.5" fill="#09090b" stroke="#0ea5e9" strokeWidth="2" />
              <path d="M16 12l2-4" />
              <circle cx="16" cy="12" r="1.5" fill="#09090b" stroke="#0ea5e9" strokeWidth="2" />
              <path d="M18 8h3M19 6l-1 2 1 2" />
            </svg>
            <span className="font-semibold text-base tracking-tight">Wirecraft</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <a href="#features" className="hover:text-white transition-colors duration-150" style={{ color: '#71717a' }}>Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-150" style={{ color: '#71717a' }}>How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-150" style={{ color: '#71717a' }}>Pricing</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#pricing" className="hidden sm:inline-block text-xs font-semibold hover:text-white transition-colors duration-150" style={{ color: '#71717a' }}>Pricing</a>
          <button onClick={handleStartBuilding} className="hover:bg-[#0284c7] transition-all duration-150 rounded-md text-xs font-semibold px-4 py-2 flex items-center gap-1.5 shadow-sm" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
            <span>Start Building</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 lg:px-12 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs mb-6 font-mono" style={{ backgroundColor: '#111113', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#71717a' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0ea5e9' }}></span>
          <span>Generative spatial synthesis core v2.4</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight max-w-3xl leading-[1.1] mb-6">
          Complete hardware designs from simple descriptions.
        </h1>

        <p className="text-base md:text-lg max-w-2xl leading-relaxed mb-8" style={{ color: '#71717a' }}>
          Describe your hardware targets in plain speech. Wirecraft dynamically drafts your component bill of materials, maps wiring pathways, compiles PCB routes, and creates standard step guides.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          <button onClick={handleStartBuilding} className="hover:bg-[#0284c7] transition-all duration-150 rounded-md font-semibold text-sm px-6 py-3 flex items-center justify-center gap-2 shadow-sm" style={{ backgroundColor: '#0ea5e9', color: 'white' }}>
            <span>Start Building</span>
            <Plus className="w-4 h-4" />
          </button>
          <a href="#features" className="border hover:bg-white/5 transition-all duration-150 rounded-md font-semibold text-sm px-6 py-3 inline-flex items-center justify-center" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <span>Explore Features</span>
          </a>
        </div>

        {/* Static Workspace Mockup */}
        <div className="w-full max-w-5xl rounded-lg border shadow-2xl p-2.5 overflow-hidden text-left relative" style={{ backgroundColor: '#111113', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="h-8 border-b flex items-center justify-between px-3 text-[11px] font-mono" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', color: '#71717a' }}>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-white/5"></span>
                <span className="w-2 h-2 rounded-full bg-white/5"></span>
                <span className="w-2 h-2 rounded-full bg-white/5"></span>
              </div>
              <span style={{ color: 'rgba(255, 255, 255, 0.08)' }}>|</span>
              <div className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" style={{ color: '#0ea5e9' }} />
                <span className="font-medium">CANUSB_Interface.json</span>
              </div>
            </div>
            <div className="flex items-center space-x-2.5 text-[10px]">
              <span className="px-1.5 py-0.5 rounded border" style={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>revision_3</span>
              <span className="flex items-center gap-1" style={{ color: '#22c55e' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>drc cleared</span>
              </span>
            </div>
          </div>

          <div className="h-[400px] grid grid-cols-12 gap-3 mt-3 select-none overflow-hidden">
            <div className="col-span-3 border-r pr-2 hidden md:flex flex-col text-left space-y-4" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div>
                <div className="text-[10px] font-semibold tracking-wider mb-2 uppercase font-mono" style={{ color: '#71717a' }}>Elements</div>
                <div className="space-y-1">
                  <div className="px-2 py-1.5 rounded border text-xs flex items-center justify-between" style={{ backgroundColor: '#18181b', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                    <span className="truncate">Microcontroller</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0ea5e9' }}></span>
                  </div>
                  <div className="px-2 py-1.5 rounded hover:bg-white/5 text-xs truncate" style={{ color: '#71717a' }}>CAN transceiver</div>
                  <div className="px-2 py-1.5 rounded hover:bg-white/5 text-xs truncate" style={{ color: '#71717a' }}>TVS diode array</div>
                  <div className="px-2 py-1.5 rounded hover:bg-white/5 text-xs truncate" style={{ color: '#71717a' }}>USB micro connector</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold tracking-wider mb-2 uppercase font-mono" style={{ color: '#71717a' }}>Properties</div>
                <div className="space-y-1.5 font-mono text-[10px] pl-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <div>package: LQFP-48</div>
                  <div>impedance: 90 ohm differential</div>
                  <div>board layers: 4 layer stack</div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 flex flex-col space-y-3 h-full">
              <div className="relative bg-black rounded border flex-1 overflow-hidden flex flex-col justify-between p-3" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="absolute inset-0 opacity-35" style={{
                  backgroundSize: '16px 16px',
                  backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)'
                }}></div>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <svg className="h-44 w-auto" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgba(113, 113, 122, 0.8)' }}>
                    <path d="M200 40 L350 120 L200 200 L50 120 Z" fill="rgba(14, 165, 233, 0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                    <path d="M200 50 L340 125 L200 190 L60 125 Z" fill="rgba(15, 42, 26, 0.45)" stroke="#16a34a" strokeWidth="1.5" />
                    <path d="M120 100 L160 120 L180 110" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M230 110 L280 140" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                    <g transform="translate(160, 85)">
                      <path d="M40 0 L80 20 L40 40 L0 20 Z" fill="#18181b" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                      <path d="M0 20 L0 30 L40 50 L40 40 Z" fill="#111113" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                      <path d="M40 40 L40 50 L80 30 L80 20 Z" fill="#09090b" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                      <text x="25" y="26" fill="#fafafa" fontSize="7" fontFamily="monospace" letterSpacing="-0.5px">STM32</text>
                    </g>
                    <circle cx="160" cy="120" r="3" fill="#0ea5e9" />
                    <line x1="160" y1="120" x2="110" y2="160" stroke="#0ea5e9" strokeWidth="1" />
                    <text x="65" y="172" fill="#0ea5e9" fontSize="8" fontFamily="monospace">node_1 status: secure</text>
                  </svg>
                </div>
                <div className="relative z-10 flex items-center justify-between font-mono text-[9px] p-1.5 rounded border" style={{ color: '#71717a', backgroundColor: 'rgba(9, 9, 11, 0.95)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <span>view: active 4-layer routing schematic</span>
                  <span style={{ color: '#0ea5e9' }}>drc checker online</span>
                </div>
              </div>

              <div className="rounded border h-[120px] p-2.5 overflow-hidden text-left font-mono text-[10px]" style={{ backgroundColor: '#18181b', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#71717a' }}>Primary Components</div>
                <div className="space-y-1.5">
                  <div className="grid grid-cols-12 text-zinc-500 border-b pb-1" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                    <span className="col-span-1">#</span>
                    <span className="col-span-5">Component</span>
                    <span className="col-span-4">Supplier ref</span>
                    <span className="col-span-2 text-right">Cost</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-1" style={{ color: '#71717a' }}>01</span>
                    <span className="col-span-5">STM32 microprocessor controller</span>
                    <span className="col-span-4" style={{ color: '#71717a' }}>STM32G030F6P6TR</span>
                    <span className="col-span-2 text-right" style={{ color: '#22c55e' }}>$1.20</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-1" style={{ color: '#71717a' }}>02</span>
                    <span className="col-span-5">USB transceiver core</span>
                    <span className="col-span-4" style={{ color: '#71717a' }}>CH340E-SOIC</span>
                    <span className="col-span-2 text-right" style={{ color: '#22c55e' }}>$0.45</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-3 border-l pl-2 hidden md:flex flex-col text-left space-y-3 overflow-hidden h-full" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div className="text-[10px] font-semibold tracking-wider font-mono uppercase" style={{ color: '#71717a' }}>Assembly Stages</div>
              <div className="space-y-2 text-xs">
                <div className="p-2 border rounded" style={{ backgroundColor: '#18181b', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <div className="font-medium flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-mono" style={{ color: '#0ea5e9' }}>01 //</span>
                    <span>Substrate setup</span>
                  </div>
                  <p className="text-[10px] leading-normal" style={{ color: '#71717a' }}>Confirm placement of mounting holes relative to standard case metrics.</p>
                </div>
                <div className="p-2 border rounded opacity-60" style={{ borderColor: 'rgba(255, 255, 255, 0.6)' }}>
                  <div className="font-medium flex items-center gap-1.5 mb-1" style={{ color: '#71717a' }}>
                    <span className="text-[9px] font-mono">02 //</span>
                    <span>Active components</span>
                  </div>
                </div>
                <div className="p-2 border rounded opacity-30" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                  <div className="font-medium flex items-center gap-1.5 mb-1" style={{ color: '#71717a' }}>
                    <span className="text-[9px] font-mono">03 //</span>
                    <span>Connect passive array</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-12 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(17, 17, 19, 0.25)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16 text-left">
            <h2 className="text-xs uppercase tracking-widest font-mono mb-2" style={{ color: '#0ea5e9' }}>Compiled design blocks</h2>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Everything you need for clean manufacturing</h3>
            <p className="text-sm mt-1" style={{ color: '#71717a' }}>Wirecraft provides individual document models so you can review metrics step-by-step.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: 'AI Hardware Generation', desc: 'Describe complete boards in conversational text to design microcontrollers, safety diodes, and clean bypass capacitors from scratch.' },
              { icon: ClipboardList, title: 'Bill of Materials', desc: 'Download spreadsheets with real part numbers, component values, tolerance metrics, and quick supplier stock links.' },
              { icon: GitFork, title: 'Wiring Schematic', desc: 'Meticulous functional block configurations showing pin routing tracks between high-speed processors and standard sensors.' },
              { icon: Layers, title: 'PCB Layout', desc: 'Determine precise board dimensional sizes, multi-layer trace stack configurations, and silkscreen print details.' },
              { icon: Box, title: '3D Viewer', desc: 'Examine physical enclosures and spatial component fittings rendered with clean, high-contrast perspective views.' },
              { icon: CheckSquare, title: 'DRC Checker', desc: 'Verify complete electronic layouts automatically to spot floating pins, short circuit bugs, or missing chassis grounds.' }
            ].map((feature, i) => (
              <div key={i} className="p-6 border rounded hover:border-white/15 transition-all duration-150" style={{ backgroundColor: '#18181b', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="p-2 border w-10 h-10 rounded mb-4 flex items-center justify-center" style={{ backgroundColor: '#111113', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#0ea5e9' }}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold mb-2">{feature.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#71717a' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 lg:px-12 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(17, 17, 19, 0.4)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16 text-left">
            <h2 className="text-xs uppercase tracking-widest font-mono mb-2" style={{ color: '#0ea5e9' }}>Development workflow</h2>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Three steps to physical silicon</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: '01', title: 'Describe', desc: 'Outline your target requirements. Define what you want to create. Detail specific microcontrollers, dimensions, voltage caps, temperature boundaries, or radio targets.' },
              { num: '02', title: 'Generate', desc: 'Workspace compiles structures. The AI core parses instructions and runs design rule checks, placing pin headers, filters, and transceivers into coherent documents.' },
              { num: '03', title: 'Build', desc: 'Bring your layout to life. Export your physical bill of materials, source your components from common suppliers, and follow the clean solder guides.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col text-left">
                <span className="font-mono text-xs uppercase mb-3" style={{ color: '#0ea5e9' }}>{step.num} / {step.title}</span>
                <h4 className="text-base font-semibold mb-2">{step.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#71717a' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 lg:px-12 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16 text-center mx-auto">
            <h2 className="text-xs uppercase tracking-widest font-mono mb-2" style={{ color: '#0ea5e9' }}>Workspace Tiers</h2>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Select your engineering environment scale</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            <div className="p-8 border rounded flex flex-col justify-between text-left" style={{ backgroundColor: '#18181b', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase mb-2 block" style={{ color: '#71717a' }}>Standard</span>
                <h4 className="text-xl font-semibold mb-1">Free Plan</h4>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-xs" style={{ color: '#71717a' }}>forever</span>
                </div>
                <ul className="space-y-3.5 text-xs mb-8 border-t pt-6" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#71717a' }}>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>10 compilations per week</span></li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>Standard routing model resolution</span></li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>Local canvas storage format</span></li>
                </ul>
              </div>
              <button onClick={handleStartBuilding} className="w-full border hover:bg-white/5 font-semibold text-xs py-2.5 rounded transition-all duration-150" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>Start Building</button>
            </div>

            <div className="p-8 border-2 rounded flex flex-col justify-between text-left relative" style={{ backgroundColor: '#18181b', borderColor: 'rgba(14, 165, 233, 0.5)' }}>
              <span className="absolute -top-3 left-6 px-2.5 py-0.5 text-white text-[9px] font-mono uppercase tracking-wider rounded font-bold" style={{ backgroundColor: '#0ea5e9' }}>Standard Professional</span>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase mb-2 block" style={{ color: '#0ea5e9' }}>Accelerated</span>
                <h4 className="text-xl font-semibold mb-1">Pro Tier</h4>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-xs" style={{ color: '#71717a' }}>per month</span>
                </div>
                <ul className="space-y-3.5 text-xs mb-8 border-t pt-6" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#71717a' }}>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>Unlimited layout drafts</span></li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>High precision layout models</span></li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>Custom design rule profiling</span></li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>Interactive schematics compilation</span></li>
                </ul>
              </div>
              <button className="w-full hover:bg-[#0284c7] text-white font-semibold text-xs py-2.5 rounded transition-all duration-150" style={{ backgroundColor: '#0ea5e9' }}>Go Professional</button>
            </div>

            <div className="p-8 border rounded flex flex-col justify-between text-left" style={{ backgroundColor: '#18181b', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase mb-2 block" style={{ color: '#71717a' }}>Enterprise</span>
                <h4 className="text-xl font-semibold mb-1">Premium Plan</h4>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-3xl font-bold">$24.99</span>
                  <span className="text-xs" style={{ color: '#71717a' }}>per month</span>
                </div>
                <ul className="space-y-3.5 text-xs mb-8 border-t pt-6" style={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: '#71717a' }}>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>Everything in Pro tier included</span></li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>8k token context window models</span></li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>Premium vector schematic vector print</span></li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4" style={{ color: '#0ea5e9' }} /><span>Priority queue processing</span></li>
                </ul>
              </div>
              <button className="w-full border hover:bg-white/5 font-semibold text-xs py-2.5 rounded transition-all duration-150" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>Go Premium</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-12 border-t mt-auto" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: '#09090b' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col text-left">
            <div className="flex items-center space-x-2.5 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h6m-3 0v-2" />
                <path d="M6 19l4-6" />
                <circle cx="6" cy="19" r="1" fill="#0ea5e9" />
                <path d="M10 13l6-1" />
                <circle cx="10" cy="13" r="1.5" fill="#09090b" stroke="#0ea5e9" strokeWidth="2" />
                <path d="M16 12l2-4" />
                <circle cx="16" cy="12" r="1.5" fill="#09090b" stroke="#0ea5e9" strokeWidth="2" />
                <path d="M18 8h3M19 6l-1 2 1 2" />
              </svg>
              <span className="font-semibold text-sm tracking-tight">Wirecraft</span>
            </div>
            <p className="text-[11px] max-w-sm leading-relaxed" style={{ color: '#71717a' }}>
              AI-powered hardware synthesis. Build schematics, boards, and materials tables with speed.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 text-xs" style={{ color: '#71717a' }}>
            <a href="https://tally.so/r/A7dxxl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white transition-colors duration-150">
              <span>Give Feedback</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="hidden md:inline" style={{ color: 'rgba(255, 255, 255, 0.08)' }}>|</span>
            <span className="cursor-pointer hover:text-white transition-colors duration-150">Terms of Use</span>
            <span className="cursor-pointer hover:text-white transition-colors duration-150">Privacy Policy</span>
            <span className="text-[10px] text-slate-700">© 2026 Wirecraft</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
