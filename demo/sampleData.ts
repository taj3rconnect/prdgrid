// ═══════════════════════════════════════════════════════════════════════
// REALISTIC SAMPLE DATA — Inspired by AG Grid demos
// ═══════════════════════════════════════════════════════════════════════

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomDate(startYear: number, endYear: number): string {
  const year = startYear + Math.floor(Math.random() * (endYear - startYear));
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ─── 1. HR EMPLOYEE HIERARCHY (based on AG Grid HR demo) ────────────

export interface HREmployee {
  id: number;
  name: string;
  image: string;
  contact: string;
  jobTitle: string;
  department: string;
  employmentType: 'Permanent' | 'Contract';
  location: string;
  flag: string;
  joinDate: string;
  salary: number;
  currency: string;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Check';
  paymentStatus: 'Paid' | 'Pending';
  manager: string;
  level: number;
}

const hrNames = [
  'Ashley Rivers', 'Deborah Love', 'Michael Allen', 'Peggy Williams',
  'Kristy Zuniga', 'Lori West', 'Gregory Matthews', 'Jessica Turner',
  'David Mitchell', 'Sandra Cooper', 'Brian Hayes', 'Michelle Reed',
  'Robert Parker', 'Laura Evans', 'Christopher Brooks', 'Jennifer Scott',
  'James Rodriguez', 'Maria Gonzalez', 'Thomas Murphy', 'Patricia Kelly',
  'Daniel Wilson', 'Nancy Adams', 'Steven Wright', 'Barbara King',
  'Andrew Campbell', 'Margaret Hill', 'Kevin Morgan', 'Elizabeth James',
  'Paul Watson', 'Helen Foster', 'Mark Sullivan', 'Donna Russell',
  'Jason Howard', 'Carol Perry', 'Ryan Long', 'Sharon Butler',
  'Eric Barnes', 'Lisa Fisher', 'Joshua Gray', 'Betty Sanders',
  'Wei Chen', 'Priya Patel', 'Hiroshi Tanaka', 'Fatima Hassan',
  'Carlos Mendez', 'Olga Petrov', 'Ahmed Khan', 'Sofia Romano',
  'Raj Sharma', 'Yuki Watanabe', 'Pavel Novak', 'Aisha Okafor',
  'Liam O\'Brien', 'Emma Dupont', 'Noah Mueller', 'Chloe Larsson',
];

const hrDepartments = {
  executiveManagement: 'Executive Management',
  engineering: 'Engineering',
  product: 'Product',
  design: 'Design',
  customerSupport: 'Customer Support',
  legal: 'Legal',
  finance: 'Finance',
  marketing: 'Marketing',
  hr: 'Human Resources',
  operations: 'Operations',
} as const;

const hrLocations = [
  { name: 'United States', flag: 'us' },
  { name: 'United Kingdom', flag: 'gb' },
  { name: 'France', flag: 'fr' },
  { name: 'Germany', flag: 'de' },
  { name: 'Spain', flag: 'es' },
  { name: 'Netherlands', flag: 'nl' },
  { name: 'Portugal', flag: 'pt' },
  { name: 'Ireland', flag: 'ie' },
  { name: 'India', flag: 'in' },
  { name: 'Japan', flag: 'jp' },
  { name: 'Canada', flag: 'ca' },
  { name: 'Australia', flag: 'au' },
] as const;

const hrTitles: Record<string, string[]> = {
  executiveManagement: ['CEO', 'COO', 'CFO', 'CTO', 'VP Operations'],
  engineering: ['Engineering Manager', 'Staff Engineer', 'Senior Engineer', 'Software Engineer', 'DevOps Engineer', 'QA Lead'],
  product: ['VP Product', 'Product Manager', 'Product Owner', 'Product Analyst'],
  design: ['Design Director', 'UX Lead', 'Senior Designer', 'UI Designer', 'Design Systems'],
  customerSupport: ['Support Director', 'Support Lead', 'Support Agent', 'Customer Success Manager'],
  legal: ['General Counsel', 'Senior Paralegal', 'Legal Operations', 'Compliance Officer'],
  finance: ['Finance Director', 'Controller', 'Financial Analyst', 'Accountant', 'FP&A Manager'],
  marketing: ['Marketing VP', 'Growth Lead', 'Content Manager', 'SEO Specialist', 'Brand Manager'],
  hr: ['HR Director', 'Talent Partner', 'Recruiter', 'Benefits Specialist'],
  operations: ['Operations Manager', 'Project Manager', 'Business Analyst', 'Logistics Lead'],
};

const managers = [
  'Ashley Rivers', 'Deborah Love', 'Michael Allen', 'Gregory Matthews',
  'Jessica Turner', 'David Mitchell', 'Robert Parker', 'Laura Evans',
];

export function generateHREmployees(count: number = 56): HREmployee[] {
  const deptKeys = Object.keys(hrDepartments);
  return Array.from({ length: count }, (_, i) => {
    const name = hrNames[i % hrNames.length]!;
    const dept = deptKeys[i % deptKeys.length]!;
    const loc = hrLocations[i % hrLocations.length]!;
    const titles = hrTitles[dept] || ['Employee'];
    const level = i < 5 ? 0 : i < 15 ? 1 : i < 30 ? 2 : 3;
    return {
      id: 100000 + i,
      name,
      image: String((i % 30) + 1),
      contact: name.replace(' ', '.'),
      jobTitle: titles[Math.min(level, titles.length - 1)]!,
      department: dept,
      employmentType: Math.random() > 0.3 ? 'Permanent' : 'Contract',
      location: loc.name,
      flag: loc.flag,
      joinDate: randomDate(2000, 2025),
      salary: Math.round((2500 + Math.random() * 12000) * 100) / 100,
      currency: ['USD', 'EUR', 'GBP'][i % 3]!,
      paymentMethod: randomFrom(['Bank Transfer', 'Cash', 'Check'] as const),
      paymentStatus: Math.random() > 0.2 ? 'Paid' : 'Pending',
      manager: level === 0 ? '' : managers[i % managers.length]!,
      level,
    };
  });
}

// ─── 2. FINANCE / PORTFOLIO (based on AG Grid Finance demo) ─────────

export interface FinanceRow {
  id: number;
  ticker: string;
  name: string;
  instrument: 'Stock' | 'Bond' | 'ETF' | 'Crypto' | 'Commodity';
  sector: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice: number;
  change: number;
  changePct: number;
  pnl: number;
  totalValue: number;
  volume: number;
  high52w: number;
  low52w: number;
  peRatio: number | null;
  dividend: number;
  timeline: number[];
}

const financeData: { ticker: string; name: string; instrument: FinanceRow['instrument']; sector: string; basePrice: number; qty: number }[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', instrument: 'Stock', sector: 'Technology', basePrice: 178.50, qty: 150 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', instrument: 'Stock', sector: 'Technology', basePrice: 415.20, qty: 80 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', instrument: 'Stock', sector: 'Technology', basePrice: 175.80, qty: 120 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', instrument: 'Stock', sector: 'Consumer', basePrice: 185.30, qty: 90 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', instrument: 'Stock', sector: 'Technology', basePrice: 880.00, qty: 30 },
  { ticker: 'META', name: 'Meta Platforms', instrument: 'Stock', sector: 'Technology', basePrice: 505.00, qty: 60 },
  { ticker: 'TSLA', name: 'Tesla Inc.', instrument: 'Stock', sector: 'Automotive', basePrice: 245.00, qty: 100 },
  { ticker: 'JPM', name: 'JPMorgan Chase', instrument: 'Stock', sector: 'Finance', basePrice: 198.00, qty: 110 },
  { ticker: 'V', name: 'Visa Inc.', instrument: 'Stock', sector: 'Finance', basePrice: 280.00, qty: 70 },
  { ticker: 'JNJ', name: 'Johnson & Johnson', instrument: 'Stock', sector: 'Healthcare', basePrice: 158.00, qty: 140 },
  { ticker: 'UNH', name: 'UnitedHealth Group', instrument: 'Stock', sector: 'Healthcare', basePrice: 530.00, qty: 40 },
  { ticker: 'WMT', name: 'Walmart Inc.', instrument: 'Stock', sector: 'Consumer', basePrice: 165.00, qty: 130 },
  { ticker: 'PG', name: 'Procter & Gamble', instrument: 'Stock', sector: 'Consumer', basePrice: 162.00, qty: 100 },
  { ticker: 'XOM', name: 'Exxon Mobil', instrument: 'Stock', sector: 'Energy', basePrice: 105.00, qty: 200 },
  { ticker: 'KO', name: 'Coca-Cola Co.', instrument: 'Stock', sector: 'Consumer', basePrice: 60.00, qty: 250 },
  { ticker: 'DIS', name: 'Walt Disney Co.', instrument: 'Stock', sector: 'Media', basePrice: 112.00, qty: 120 },
  { ticker: 'NFLX', name: 'Netflix Inc.', instrument: 'Stock', sector: 'Media', basePrice: 620.00, qty: 25 },
  { ticker: 'CRM', name: 'Salesforce Inc.', instrument: 'Stock', sector: 'Technology', basePrice: 300.00, qty: 55 },
  { ticker: 'AMD', name: 'AMD Inc.', instrument: 'Stock', sector: 'Technology', basePrice: 178.00, qty: 110 },
  { ticker: 'INTC', name: 'Intel Corp.', instrument: 'Stock', sector: 'Technology', basePrice: 43.00, qty: 300 },
  { ticker: 'BA', name: 'Boeing Co.', instrument: 'Stock', sector: 'Industrial', basePrice: 210.00, qty: 75 },
  { ticker: 'GS', name: 'Goldman Sachs', instrument: 'Stock', sector: 'Finance', basePrice: 395.00, qty: 40 },
  // Bonds
  { ticker: 'US10Y', name: 'U.S. Treasury 10-Year Bond', instrument: 'Bond', sector: 'Government', basePrice: 102.50, qty: 1000 },
  { ticker: 'US30Y', name: 'U.S. Treasury 30-Year Bond', instrument: 'Bond', sector: 'Government', basePrice: 98.75, qty: 500 },
  { ticker: 'UKGILT10', name: 'UK 10-Year Gilt', instrument: 'Bond', sector: 'Government', basePrice: 98.50, qty: 350 },
  { ticker: 'CAD30Y', name: 'Canada 30-Year Gov Bond', instrument: 'Bond', sector: 'Government', basePrice: 97.00, qty: 550 },
  // ETFs
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF', instrument: 'ETF', sector: 'Index', basePrice: 510.00, qty: 50 },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust', instrument: 'ETF', sector: 'Index', basePrice: 440.00, qty: 45 },
  { ticker: 'MUB', name: 'iShares National Muni Bond', instrument: 'ETF', sector: 'Bond', basePrice: 116.00, qty: 75 },
  { ticker: 'VWO', name: 'Vanguard Emerging Markets', instrument: 'ETF', sector: 'Index', basePrice: 42.00, qty: 300 },
  // Crypto
  { ticker: 'BTC-USD', name: 'Bitcoin', instrument: 'Crypto', sector: 'Digital', basePrice: 68500, qty: 2 },
  { ticker: 'ETH-USD', name: 'Ethereum', instrument: 'Crypto', sector: 'Digital', basePrice: 3450, qty: 15 },
  // Commodities
  { ticker: 'GC=F', name: 'Gold Futures', instrument: 'Commodity', sector: 'Precious Metals', basePrice: 2340, qty: 10 },
  { ticker: 'CL=F', name: 'Crude Oil Futures', instrument: 'Commodity', sector: 'Energy', basePrice: 78.50, qty: 100 },
];

function generateTimeline(base: number, points: number = 24): number[] {
  const timeline: number[] = [];
  let price = base;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.48) * base * 0.04;
    price = Math.max(price * 0.7, price + change);
    timeline.push(+price.toFixed(2));
  }
  return timeline;
}

export function generateFinanceData(): FinanceRow[] {
  return financeData.map((stock, i) => {
    const variance = (Math.random() - 0.45) * 0.08;
    const currentPrice = +(stock.basePrice * (1 + variance)).toFixed(2);
    const purchasePrice = +(stock.basePrice * (0.9 + Math.random() * 0.15)).toFixed(2);
    const change = +(currentPrice - purchasePrice).toFixed(2);
    const changePct = +((change / purchasePrice) * 100).toFixed(2);
    const pnl = +(stock.qty * change).toFixed(2);
    const totalValue = +(stock.qty * currentPrice).toFixed(2);
    return {
      id: i + 1,
      ticker: stock.ticker,
      name: stock.name,
      instrument: stock.instrument,
      sector: stock.sector,
      quantity: stock.qty,
      purchasePrice,
      purchaseDate: randomDate(2022, 2025),
      currentPrice,
      change,
      changePct,
      pnl,
      totalValue,
      volume: Math.round(Math.random() * 80000000),
      high52w: +(currentPrice * (1 + Math.random() * 0.25)).toFixed(2),
      low52w: +(currentPrice * (1 - Math.random() * 0.25)).toFixed(2),
      peRatio: stock.instrument === 'Stock' ? +(5 + Math.random() * 45).toFixed(1) : null,
      dividend: stock.instrument === 'Stock' ? +(Math.random() * 4).toFixed(2) : 0,
      timeline: generateTimeline(stock.basePrice),
    };
  });
}

// ─── 3. STAFFING / RECRUITING PIPELINE ──────────────────────────────

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  client: string;
  source: string;
  stage: 'New' | 'Screening' | 'Submitted' | 'Interview' | 'Offer' | 'Placed' | 'Rejected';
  submitDate: string;
  lastActivity: string;
  salary: number;
  billRate: number;
  margin: number;
  recruiter: string;
  priority: 'Hot' | 'Warm' | 'Cold';
  skills: string;
  yearsExp: number;
  notes: string;
}

const candidateNames = [
  'Michael Chen', 'Sarah Johnson', 'David Kim', 'Emily Rodriguez', 'James Wilson',
  'Maria Garcia', 'Robert Taylor', 'Jennifer Brown', 'Christopher Lee', 'Amanda Martinez',
  'Daniel Anderson', 'Rachel Thomas', 'Kevin White', 'Stephanie Harris', 'Brandon Clark',
  'Nicole Lewis', 'Ryan Robinson', 'Michelle Walker', 'Justin Hall', 'Lauren Allen',
  'Alex Patel', 'Priya Sharma', 'Wei Zhang', 'Fatima Hassan', 'Carlos Mendez',
  'Yuki Tanaka', 'Ahmed Khan', 'Sofia Romano', 'Raj Kumar', 'Olga Petrov',
  'Liam O\'Brien', 'Emma Dupont', 'Noah Mueller', 'Chloe Larsson', 'Ethan Park',
  'Isabella Rossi', 'Mason Cooper', 'Ava Phillips', 'Logan Reed', 'Sophia Stewart',
];

const roles = [
  'Senior Software Engineer', 'Full Stack Developer', 'Data Engineer', 'Cloud Architect',
  'DevOps Engineer', 'QA Lead', 'Mobile Developer', 'ML Engineer', 'Security Engineer',
  'Product Manager', 'Scrum Master', 'Business Analyst', 'UX Designer', 'Technical Writer',
  'Database Administrator', 'Network Engineer', 'Solutions Architect', 'Site Reliability Engineer',
];

const clients = [
  'Goldman Sachs', 'JPMorgan Chase', 'Morgan Stanley', 'Deloitte', 'Accenture',
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber',
  'Stripe', 'Snowflake', 'Databricks', 'Palantir', 'Salesforce', 'Oracle',
];

const sources = ['LinkedIn', 'Indeed', 'Referral', 'Job Board', 'Career Fair', 'Direct Apply', 'Agency', 'Internal DB'];
const stages: Candidate['stage'][] = ['New', 'Screening', 'Submitted', 'Interview', 'Offer', 'Placed', 'Rejected'];
const priorities: Candidate['priority'][] = ['Hot', 'Hot', 'Warm', 'Warm', 'Warm', 'Cold'];
const recruiters = ['Alex Kim', 'Jordan Smith', 'Taylor Brown', 'Morgan Davis', 'Casey Wilson', 'Riley Martinez'];
const skillSets = [
  'React, TypeScript, Node.js', 'Python, AWS, Docker', 'Java, Spring, Kubernetes',
  'Go, gRPC, PostgreSQL', '.NET, Azure, C#', 'Ruby, Rails, Redis',
  'Scala, Spark, Kafka', 'Swift, iOS, Obj-C', 'Kotlin, Android, Firebase',
  'Rust, WebAssembly, Linux', 'Vue, PHP, Laravel', 'Angular, RxJS, NgRx',
];

export function generateCandidates(count: number = 200): Candidate[] {
  return Array.from({ length: count }, (_, i) => {
    const name = candidateNames[i % candidateNames.length]!;
    const [first, last] = name.split(' ');
    const salary = Math.round((75000 + Math.random() * 125000) / 1000) * 1000;
    const billRate = Math.round(salary / 2080 * (1.4 + Math.random() * 0.4));
    const cost = Math.round(salary / 2080);
    return {
      id: 1000 + i,
      name,
      email: `${first!.toLowerCase()}.${last!.toLowerCase()}@email.com`,
      phone: `(${Math.floor(200 + Math.random() * 800)}) ${Math.floor(200 + Math.random() * 800)}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      role: randomFrom(roles),
      client: randomFrom(clients),
      source: randomFrom(sources),
      stage: randomFrom(stages),
      submitDate: randomDate(2025, 2026),
      lastActivity: randomDate(2026, 2027),
      salary,
      billRate,
      margin: +((billRate - cost) / billRate * 100).toFixed(1),
      recruiter: randomFrom(recruiters),
      priority: randomFrom(priorities),
      skills: randomFrom(skillSets),
      yearsExp: Math.floor(1 + Math.random() * 20),
      notes: Math.random() > 0.65 ? randomFrom([
        'Strong technical skills, ready for interview',
        'Needs visa sponsorship',
        'Available immediately',
        'Counter-offer risk - currently employed',
        'Prefers remote only',
        'Excellent references from previous placement',
        'Rate negotiable',
        'Client specifically requested',
      ]) : '',
    };
  });
}

// ─── 4. SIMPLE PRODUCTS ─────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  inStock: boolean;
}

export function generateProducts(count: number = 50): Product[] {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'];
  const adjectives = ['Premium', 'Classic', 'Ultra', 'Pro', 'Deluxe', 'Essential', 'Elite', 'Basic'];
  const nouns = ['Widget', 'Gadget', 'Device', 'Tool', 'Kit', 'Pack', 'Set', 'Unit'];

  return Array.from({ length: count }, (_, i) => {
    const stock = Math.floor(Math.random() * 500);
    return {
      id: i + 1,
      name: `${randomFrom(adjectives)} ${randomFrom(nouns)} ${i + 1}`,
      category: randomFrom(categories),
      price: +(5 + Math.random() * 495).toFixed(2),
      stock,
      sku: `SKU-${String(i + 1).padStart(5, '0')}`,
      inStock: stock > 0,
    };
  });
}
