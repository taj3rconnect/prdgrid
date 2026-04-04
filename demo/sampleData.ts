// ═══════════════════════════════════════════════════════════════════════
// SAMPLE DATA GENERATORS
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

// ─── 1. HR EMPLOYEE HIERARCHY ───────────────────────────────────────

export interface HREmployee {
  id: number;
  name: string;
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
  initials: string;
  avatarColor: string;
}

const avatarColors = [
  '#4F46E5', '#7C3AED', '#DB2777', '#DC2626', '#EA580C',
  '#D97706', '#65A30D', '#059669', '#0891B2', '#2563EB',
  '#7C3AED', '#9333EA', '#C026D3', '#E11D48', '#F97316',
];

const hrNames = [
  'Adrian Conner', 'Deborah Love', 'Michael Allen', 'Peggy Williams',
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

const departments = [
  'Executive Management', 'Engineering', 'Product', 'Design',
  'Customer Support', 'Legal', 'Finance', 'Marketing',
  'Human Resources', 'Operations',
] as const;

const hrLocations = [
  { name: 'United States', flag: '🇺����' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', flag: '🇦🇺' },
];

const titlesByLevel: string[][] = [
  ['CEO', 'COO', 'CFO', 'CTO', 'VP Operations'],
  ['Engineering Manager', 'Design Director', 'VP Product', 'Finance Director', 'Marketing VP', 'HR Director', 'Support Director', 'General Counsel', 'Operations Manager'],
  ['Staff Engineer', 'Senior Engineer', 'UX Lead', 'Product Manager', 'FP&A Manager', 'Growth Lead', 'Talent Partner', 'Support Lead', 'Compliance Officer', 'Project Manager'],
  ['Software Engineer', 'DevOps Engineer', 'QA Lead', 'UI Designer', 'Product Analyst', 'Financial Analyst', 'Content Manager', 'Recruiter', 'Support Agent', 'Business Analyst'],
];

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function generateHREmployees(count: number = 56): HREmployee[] {
  const managers = hrNames.slice(0, 4);
  return Array.from({ length: count }, (_, i) => {
    const name = hrNames[i % hrNames.length]!;
    const dept = departments[i % departments.length]!;
    const loc = hrLocations[i % hrLocations.length]!;
    const level = i < 4 ? 0 : i < 13 ? 1 : i < 28 ? 2 : 3;
    const titles = titlesByLevel[level]!;
    return {
      id: 100000 + i,
      name,
      jobTitle: titles[i % titles.length]!,
      department: dept,
      employmentType: Math.random() > 0.3 ? 'Permanent' as const : 'Contract' as const,
      location: loc.name,
      flag: loc.flag,
      joinDate: randomDate(2000, 2025),
      salary: Math.round((2500 + Math.random() * 12000) * 100) / 100,
      currency: ['USD', 'EUR', 'GBP'][i % 3]!,
      paymentMethod: randomFrom(['Bank Transfer', 'Cash', 'Check'] as const),
      paymentStatus: Math.random() > 0.2 ? 'Paid' as const : 'Pending' as const,
      manager: level === 0 ? '' : managers[i % managers.length]!,
      level,
      initials: getInitials(name),
      avatarColor: avatarColors[i % avatarColors.length]!,
    };
  });
}

// ─── 2. FINANCE DATA ────────────────────────────────────────────────

export interface FinanceRow {
  id: number;
  ticker: string;
  name: string;
  instrument: 'Stock' | 'Bond' | 'ETF' | 'Crypto';
  quantity: number;
  currentPrice: number;
  pnl: number;
  pnlDelta: number;
  totalValue: number;
  totalValueDelta: number;
  timeline: number[];
  color: string;
}

const financeData = [
  { ticker: 'AAPL', name: 'Apple Inc.', instrument: 'Stock' as const, basePrice: 178.50, qty: 150, color: '#555555' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', instrument: 'Stock' as const, basePrice: 415.20, qty: 80, color: '#00A4EF' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', instrument: 'Stock' as const, basePrice: 175.80, qty: 120, color: '#4285F4' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', instrument: 'Stock' as const, basePrice: 185.30, qty: 90, color: '#FF9900' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', instrument: 'Stock' as const, basePrice: 880.00, qty: 30, color: '#76B900' },
  { ticker: 'META', name: 'Meta Platforms', instrument: 'Stock' as const, basePrice: 505.00, qty: 60, color: '#0081FB' },
  { ticker: 'TSLA', name: 'Tesla Inc.', instrument: 'Stock' as const, basePrice: 245.00, qty: 100, color: '#CC0000' },
  { ticker: 'JPM', name: 'JPMorgan Chase', instrument: 'Stock' as const, basePrice: 198.00, qty: 110, color: '#003F87' },
  { ticker: 'V', name: 'Visa Inc.', instrument: 'Stock' as const, basePrice: 280.00, qty: 70, color: '#1A1F71' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', instrument: 'Stock' as const, basePrice: 158.00, qty: 140, color: '#D51900' },
  { ticker: 'UNH', name: 'UnitedHealth Group', instrument: 'Stock' as const, basePrice: 530.00, qty: 40, color: '#002677' },
  { ticker: 'WMT', name: 'Walmart Inc.', instrument: 'Stock' as const, basePrice: 165.00, qty: 130, color: '#0071CE' },
  { ticker: 'PG', name: 'Procter & Gamble', instrument: 'Stock' as const, basePrice: 162.00, qty: 100, color: '#003DA5' },
  { ticker: 'XOM', name: 'Exxon Mobil', instrument: 'Stock' as const, basePrice: 105.00, qty: 200, color: '#DA291C' },
  { ticker: 'KO', name: 'Coca-Cola Co.', instrument: 'Stock' as const, basePrice: 60.00, qty: 250, color: '#F40009' },
  { ticker: 'DIS', name: 'Walt Disney Co.', instrument: 'Stock' as const, basePrice: 112.00, qty: 120, color: '#113CCF' },
  { ticker: 'NFLX', name: 'Netflix Inc.', instrument: 'Stock' as const, basePrice: 620.00, qty: 25, color: '#E50914' },
  { ticker: 'CRM', name: 'Salesforce Inc.', instrument: 'Stock' as const, basePrice: 300.00, qty: 55, color: '#00A1E0' },
  { ticker: 'AMD', name: 'AMD Inc.', instrument: 'Stock' as const, basePrice: 178.00, qty: 110, color: '#ED1C24' },
  { ticker: 'INTC', name: 'Intel Corp.', instrument: 'Stock' as const, basePrice: 43.00, qty: 300, color: '#0071C5' },
  { ticker: 'BA', name: 'Boeing Co.', instrument: 'Stock' as const, basePrice: 210.00, qty: 75, color: '#0033A0' },
  { ticker: 'GS', name: 'Goldman Sachs', instrument: 'Stock' as const, basePrice: 395.00, qty: 40, color: '#6FA8DC' },
  { ticker: 'T', name: 'AT&T Inc.', instrument: 'Stock' as const, basePrice: 17.50, qty: 500, color: '#00A8E0' },
  { ticker: 'DAL', name: 'Delta Air Lines', instrument: 'Stock' as const, basePrice: 42.00, qty: 200, color: '#003366' },
  { ticker: 'MA', name: 'Mastercard Inc.', instrument: 'Stock' as const, basePrice: 460.00, qty: 35, color: '#EB001B' },
  { ticker: 'AIG', name: 'American Int. Group', instrument: 'Stock' as const, basePrice: 72.00, qty: 150, color: '#004C97' },
  { ticker: 'PBR', name: 'Petrobras', instrument: 'Stock' as const, basePrice: 15.00, qty: 600, color: '#009639' },
  { ticker: 'US10Y', name: 'U.S. Treasury 10-Year Bond', instrument: 'Bond' as const, basePrice: 102.50, qty: 1000, color: '#1B5E20' },
  { ticker: 'US30Y', name: 'U.S. Treasury 30-Year Bond', instrument: 'Bond' as const, basePrice: 98.75, qty: 500, color: '#1B5E20' },
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF', instrument: 'ETF' as const, basePrice: 510.00, qty: 50, color: '#F57C00' },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust', instrument: 'ETF' as const, basePrice: 440.00, qty: 45, color: '#00695C' },
  { ticker: 'BTC-USD', name: 'Bitcoin', instrument: 'Crypto' as const, basePrice: 68500, qty: 2, color: '#F7931A' },
  { ticker: 'ETH-USD', name: 'Ethereum', instrument: 'Crypto' as const, basePrice: 3450, qty: 15, color: '#627EEA' },
  { ticker: 'GC=F', name: 'Gold Futures', instrument: 'ETF' as const, basePrice: 2340, qty: 10, color: '#FFD700' },
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
    const pnl = +(currentPrice - stock.basePrice).toFixed(2);
    const totalValue = +(stock.qty * currentPrice).toFixed(2);
    return {
      id: i + 1,
      ticker: stock.ticker,
      name: stock.name,
      instrument: stock.instrument,
      quantity: stock.qty,
      currentPrice,
      pnl,
      pnlDelta: 0,
      totalValue,
      totalValueDelta: 0,
      timeline: generateTimeline(stock.basePrice),
      color: stock.color,
    };
  });
}

export function tickFinanceData(data: FinanceRow[]): FinanceRow[] {
  return data.map(row => {
    const change = (Math.random() - 0.48) * row.currentPrice * 0.005;
    const newPrice = +(row.currentPrice + change).toFixed(2);
    const newPnl = +(newPrice - (row.totalValue / row.quantity - row.pnl) + row.pnl + change).toFixed(2);
    const pnlDelta = +(change).toFixed(2);
    const newTotalValue = +(row.quantity * newPrice).toFixed(2);
    const totalValueDelta = +(newTotalValue - row.totalValue).toFixed(2);
    const newTimeline = [...row.timeline.slice(1), newPrice];
    return {
      ...row,
      currentPrice: newPrice,
      pnl: +(row.pnl + change).toFixed(2),
      pnlDelta,
      totalValue: newTotalValue,
      totalValueDelta,
      timeline: newTimeline,
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

// ─── 5. PERFORMANCE / GAMING DATA ───────────────────────────────────

export interface GameRow {
  id: number;
  name: string;
  language: string;
  country: string;
  countryFlag: string;
  gameName: string;
  bought: boolean;
  bankBalance: number;
  rating: number;
  totalWinnings: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
}

const gameNames = ['Chess', 'Poker', 'Blackjack', 'Roulette', 'Craps', 'Baccarat', 'Slots', 'Bridge', 'Mahjong', 'Solitaire'];
const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic', 'Russian', 'Italian'];
const countries = [
  { name: 'United States', flag: '🇺🇸' }, { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'France', flag: '🇫🇷' }, { name: 'Germany', flag: '🇩🇪' },
  { name: 'Spain', flag: '🇪🇸' }, { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Japan', flag: '🇯🇵' }, { name: 'China', flag: '🇨🇳' },
  { name: 'India', flag: '🇮🇳' }, { name: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', flag: '🇦🇺' }, { name: 'Italy', flag: '🇮🇹' },
  { name: 'South Korea', flag: '🇰🇷' }, { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Russia', flag: '🇷🇺' }, { name: 'Netherlands', flag: '🇳🇱' },
];
const perfNames = [
  'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Charlotte', 'James', 'Amelia',
  'Benjamin', 'Sophia', 'Lucas', 'Isabella', 'Henry', 'Mia', 'Alexander', 'Harper',
  'Mason', 'Evelyn', 'Ethan', 'Abigail', 'Daniel', 'Emily', 'Logan', 'Ella',
  'Jackson', 'Elizabeth', 'Sebastian', 'Camila', 'Mateo', 'Luna', 'Jack', 'Sofia',
  'Owen', 'Avery', 'Theodore', 'Mila', 'Aiden', 'Aria', 'Samuel', 'Scarlett',
];
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris',
  'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen',
];

export function generateGameData(count: number = 1000): GameRow[] {
  return Array.from({ length: count }, (_, i) => {
    const country = countries[i % countries.length]!;
    return {
      id: i + 1,
      name: `${perfNames[i % perfNames.length]} ${lastNames[i % lastNames.length]}`,
      language: randomFrom(languages),
      country: country.name,
      countryFlag: country.flag,
      gameName: randomFrom(gameNames),
      bought: Math.random() > 0.4,
      bankBalance: Math.round(Math.random() * 50000),
      rating: Math.floor(Math.random() * 5) + 1,
      totalWinnings: Math.round(Math.random() * 1000000),
      jan: Math.round(Math.random() * 10000),
      feb: Math.round(Math.random() * 10000),
      mar: Math.round(Math.random() * 10000),
      apr: Math.round(Math.random() * 10000),
      may: Math.round(Math.random() * 10000),
      jun: Math.round(Math.random() * 10000),
    };
  });
}
