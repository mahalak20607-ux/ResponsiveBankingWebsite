import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard, CreditCard, ArrowLeftRight, PieChart as PieChartIcon,
  Settings, Search, Bell, ChevronDown, Menu, X, Eye, EyeOff, Snowflake,
  Send, Receipt, RefreshCw, TrendingUp, TrendingDown, Wallet, PiggyBank,
  Target, Filter, ShoppingBag, Zap, UtensilsCrossed, Landmark, Check,
  ArrowUpRight, ArrowDownRight, User, LogOut, HelpCircle, Sun, Moon,
  ChevronLeft, ChevronRight, Copy, CheckCircle2, AlertCircle, Plus
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const ACCOUNTS = [
  { id: "checking", label: "Checking", number: "•••• 4821", balance: 8420.55, color: "#34d399" },
  { id: "savings", label: "Savings", number: "•••• 7734", balance: 24310.12, color: "#22d3ee" },
  { id: "investment", label: "Investment", number: "•••• 1190", balance: 41865.90, color: "#a78bfa" },
];

const CARDS_INIT = [
  {
    id: "debit",
    kind: "Debit",
    brand: "Apex Visa",
    holder: "ADAEZE OKONKWO",
    number: "4532 1198 0021 4821",
    expiry: "09/29",
    cvv: "482",
    status: "active",
    gradient: "linear-gradient(135deg,#0f172a 0%,#1e293b 55%,#134e4a 100%)",
  },
  {
    id: "credit",
    kind: "Credit",
    brand: "Apex World Elite",
    holder: "ADAEZE OKONKWO",
    number: "5412 7734 4419 7734",
    expiry: "02/28",
    cvv: "917",
    status: "active",
    gradient: "linear-gradient(135deg,#052e2b 0%,#0f3d34 45%,#0b1220 100%)",
  },
];

const TX_CATEGORIES = {
  Shopping: { icon: ShoppingBag, color: "#a78bfa" },
  Salary: { icon: Landmark, color: "#34d399" },
  Utilities: { icon: Zap, color: "#fbbf24" },
  Food: { icon: UtensilsCrossed, color: "#fb7185" },
};

const TRANSACTIONS = [
  { id: 1, name: "Whole Foods Market", cat: "Food", date: "Aug 29", amount: -84.21 },
  { id: 2, name: "Monthly Salary — Vantage Corp", cat: "Salary", date: "Aug 28", amount: 6250.0 },
  { id: 3, name: "Zenith Power & Light", cat: "Utilities", date: "Aug 27", amount: -142.6 },
  { id: 4, name: "Sable & Co. Studio", cat: "Shopping", date: "Aug 25", amount: -219.99 },
  { id: 5, name: "Corner Bistro", cat: "Food", date: "Aug 24", amount: -38.5 },
  { id: 6, name: "Northside Fitness", cat: "Shopping", date: "Aug 22", amount: -64.0 },
  { id: 7, name: "Metro Transit Pass", cat: "Utilities", date: "Aug 21", amount: -75.0 },
  { id: 8, name: "Freelance — Ilium Design", cat: "Salary", date: "Aug 19", amount: 1180.0 },
];

const MONTHLY = [
  { month: "Mar", income: 6900, expenses: 4820 },
  { month: "Apr", income: 7120, expenses: 5010 },
  { month: "May", income: 6980, expenses: 4650 },
  { month: "Jun", income: 7430, expenses: 5320 },
  { month: "Jul", income: 7250, expenses: 4980 },
  { month: "Aug", income: 7530, expenses: 5145 },
];

const CATEGORY_SPEND = [
  { name: "Shopping", value: 620, color: "#a78bfa" },
  { name: "Food", value: 410, color: "#fb7185" },
  { name: "Utilities", value: 318, color: "#fbbf24" },
  { name: "Housing", value: 1850, color: "#22d3ee" },
  { name: "Other", value: 240, color: "#94a3b8" },
];

const PAYEES = [
  { id: "p1", name: "Ifeoma Balogun", detail: "Apex •••• 2201" },
  { id: "p2", name: "Marcus Webb", detail: "Zenith Bank •••• 7742" },
  { id: "p3", name: "Sable & Co. Studio", detail: "Vendor account" },
  { id: "p4", name: "Tolu Adeyemi", detail: "Apex •••• 9930" },
];

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "accounts", label: "Accounts & Cards", icon: CreditCard },
  { id: "transfer", label: "Money Transfer", icon: ArrowLeftRight },
  { id: "analytics", label: "Analytics & Insights", icon: PieChartIcon },
  { id: "settings", label: "Settings", icon: Settings },
];

const fmt = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/* ------------------------------------------------------------------ */
/*  Shared UI atoms                                                    */
/* ------------------------------------------------------------------ */

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-800 text-slate-300",
    good: "bg-emerald-500/15 text-emerald-400",
    bad: "bg-rose-500/15 text-rose-400",
    warn: "bg-amber-500/15 text-amber-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Modal({ open, onClose, children, width = "max-w-md" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${width} rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-[fadeIn_.18s_ease-out]`}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Top Bar                                                             */
/* ------------------------------------------------------------------ */

function TopBar({ onMenuClick, onNotifClick, notifOpen, profileOpen, setProfileOpen, notifCount }) {
  const profileRef = useRef(null);
  useEffect(() => {
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setProfileOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-800/80 bg-slate-950/85 px-4 backdrop-blur-md md:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2 pr-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
          <Landmark size={18} className="text-emerald-400" />
        </div>
        <span className="hidden font-display text-[17px] tracking-tight text-slate-50 sm:block">
          Apex Standard
        </span>
      </div>

      <div className="ml-2 hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 md:flex">
        <Search size={16} className="text-slate-500" />
        <input
          placeholder="Search transactions, payees, statements…"
          className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button
            onClick={onNotifClick}
            className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <Bell size={19} />
            {notifCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl">
              <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">Notifications</p>
              {[
                { t: "Salary deposited", d: "$6,250.00 credited to Checking", i: ArrowDownRight, c: "text-emerald-400" },
                { t: "Card payment", d: "Sable & Co. Studio — $219.99", i: ArrowUpRight, c: "text-rose-400" },
                { t: "Savings goal", d: "You're 68% toward your goal", i: Target, c: "text-cyan-400" },
              ].map((n, i) => (
                <div key={i} className="flex gap-3 rounded-lg px-2 py-2 hover:bg-slate-800/60">
                  <n.i size={16} className={`mt-0.5 shrink-0 ${n.c}`} />
                  <div>
                    <p className="text-sm text-slate-200">{n.t}</p>
                    <p className="text-xs text-slate-500">{n.d}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-semibold text-slate-950">
              AO
            </div>
            <ChevronDown size={15} className="hidden text-slate-500 sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-slate-200">Adaeze Okonkwo</p>
                <p className="text-xs text-slate-500">Premier member since 2019</p>
              </div>
              <div className="my-1 h-px bg-slate-800" />
              {[
                { icon: User, label: "Profile settings" },
                { icon: HelpCircle, label: "Help center" },
                { icon: LogOut, label: "Sign out" },
              ].map((it, i) => (
                <button
                  key={i}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
                >
                  <it.icon size={15} className="text-slate-500" />
                  {it.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                             */
/* ------------------------------------------------------------------ */

function Sidebar({ active, setActive, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed z-50 flex h-full flex-col border-r border-slate-800/80 bg-slate-950 transition-all duration-200 lg:sticky lg:top-0 lg:z-10 lg:h-screen
          ${collapsed ? "lg:w-[76px]" : "lg:w-64"}
          ${mobileOpen ? "left-0 w-64" : "-left-72 w-64 lg:left-0"}`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && <span className="font-display text-sm tracking-tight text-slate-400">MENU</span>}
          <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-1 text-slate-500 hover:bg-slate-800 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setMobileOpen(false);
                }}
                title={item.label}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors
                  ${isActive ? "bg-emerald-500/12 text-emerald-400" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"}`}
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isActive && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </nav>

        <div className="p-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden w-full items-center justify-center gap-2 rounded-xl border border-slate-800 py-2 text-xs text-slate-500 hover:bg-slate-900 lg:flex"
          >
            {collapsed ? <ChevronRight size={15} /> : (<><ChevronLeft size={15} /> Collapse</>)}
          </button>
        </div>
      </aside>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile bottom nav                                                   */
/* ------------------------------------------------------------------ */

function BottomNav({ active, setActive }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-md lg:hidden">
      {NAV.slice(0, 5).map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] ${isActive ? "text-emerald-400" : "text-slate-500"}`}
          >
            <item.icon size={19} />
            {item.label.split(" ")[0]}
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                           */
/* ------------------------------------------------------------------ */

function OverviewCard({ icon: Icon, label, value, sub, trend, accent }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${accent}22` }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
        {trend != null && (
          <Pill tone={trend >= 0 ? "good" : "bad"}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </Pill>
        )}
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-display text-2xl text-slate-50">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </Card>
  );
}

function SpendChart() {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base text-slate-100">Income vs. expenses</h3>
          <p className="text-xs text-slate-500">Last 6 months</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" />Income</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-500" />Expenses</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MONTHLY} margin={{ left: -20, right: 10, top: 5 }}>
            <defs>
              <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#64748b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: "#e2e8f0" }}
              formatter={(v) => fmt(v)}
            />
            <Area type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} fill="url(#inc)" />
            <Area type="monotone" dataKey="expenses" stroke="#64748b" strokeWidth={2} fill="url(#exp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function QuickActions({ onAction }) {
  const actions = [
    { id: "send", label: "Send Money", icon: Send },
    { id: "bills", label: "Pay Bills", icon: Receipt },
    { id: "between", label: "Transfer Between Accounts", icon: RefreshCw },
    { id: "freeze", label: "Freeze Card", icon: Snowflake },
  ];
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base text-slate-100">Quick actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <button
            key={a.id}
            onClick={() => onAction(a.id)}
            className="flex flex-col items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-left transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/5"
          >
            <a.icon size={18} className="text-emerald-400" />
            <span className="text-xs font-medium leading-tight text-slate-300">{a.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function SavingsGoal() {
  const pct = 68;
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base text-slate-100">Savings goal</h3>
        <Target size={16} className="text-cyan-400" />
      </div>
      <p className="text-xs text-slate-500">Home down payment</p>
      <p className="mt-1 font-display text-xl text-slate-50">{fmt(27200)} <span className="text-sm font-sans text-slate-500">/ {fmt(40000)}</span></p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">{pct}% complete · est. 4 months left</p>
    </Card>
  );
}

function TransactionsTable() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...Object.keys(TX_CATEGORIES)];
  const rows = TRANSACTIONS.filter((t) => filter === "All" || t.cat === filter);

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base text-slate-100">Recent transactions</h3>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter size={14} className="mr-1 shrink-0 text-slate-500" />
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
                filter === c ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800/70 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {rows.map((t) => {
          const meta = TX_CATEGORIES[t.cat];
          const Icon = meta.icon;
          return (
            <div key={t.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-slate-800/40">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${meta.color}22` }}>
                <Icon size={16} style={{ color: meta.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-200">{t.name}</p>
                <p className="text-xs text-slate-500">{t.date}</p>
              </div>
              <Pill>{t.cat}</Pill>
              <p className={`w-24 shrink-0 text-right text-sm font-medium ${t.amount >= 0 ? "text-emerald-400" : "text-slate-300"}`}>
                {t.amount >= 0 ? "+" : ""}{fmt(t.amount)}
              </p>
            </div>
          );
        })}
        {rows.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No transactions in this category.</p>}
      </div>
    </Card>
  );
}

function Dashboard({ goTo, setPrefillAction }) {
  const totalBalance = ACCOUNTS.reduce((s, a) => s + a.balance, 0);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl text-slate-50">Good afternoon, Adaeze</h1>
        <p className="text-sm text-slate-500">Here's what's happening with your money today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCard icon={Wallet} label="Total Balance" value={fmt(totalBalance)} sub="Across 3 accounts" accent="#34d399" trend={4.2} />
        <OverviewCard icon={ArrowDownRight} label="Monthly Income" value={fmt(7530)} sub="August 2026" accent="#22d3ee" trend={3.9} />
        <OverviewCard icon={ArrowUpRight} label="Monthly Spending" value={fmt(5145)} sub="August 2026" accent="#fb7185" trend={-2.1} />
        <OverviewCard icon={PiggyBank} label="Savings Goal" value="68%" sub="Home down payment" accent="#a78bfa" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <SpendChart />
          <TransactionsTable />
        </div>
        <div className="space-y-5">
          <QuickActions
            onAction={(id) => {
              if (id === "send" || id === "bills" || id === "between") {
                setPrefillAction(id);
                goTo("transfer");
              } else if (id === "freeze") {
                goTo("accounts");
              }
            }}
          />
          <SavingsGoal />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Accounts & Cards                                                    */
/* ------------------------------------------------------------------ */

function BankCard({ card, masked, flipped, onFlip, onToggleMask, onFreeze }) {
  const displayNumber = masked ? `•••• •••• •••• ${card.number.slice(-4)}` : card.number;
  return (
    <div className="[perspective:1200px]">
      <div
        className="relative h-52 w-full max-w-sm cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        onClick={onFlip}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl p-5 text-slate-100 shadow-xl [backface-visibility:hidden]"
          style={{ background: card.gradient }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-300">{card.brand}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400">{card.kind} card</p>
            </div>
            <Pill tone={card.status === "active" ? "good" : "bad"}>
              {card.status === "active" ? <Check size={11} /> : <Snowflake size={11} />}
              {card.status === "active" ? "Active" : "Frozen"}
            </Pill>
          </div>

          <div>
            <p className="font-mono text-lg tracking-widest text-slate-100">{displayNumber}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
              <span>{card.holder}</span>
              <span>{card.expiry}</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl p-5 text-slate-100 shadow-xl [backface-visibility:hidden]"
          style={{ background: card.gradient, transform: "rotateY(180deg)" }}
        >
          <div className="h-9 w-full rounded bg-slate-950/60" />
          <div className="flex items-center justify-end gap-2 rounded bg-slate-100 px-3 py-1.5">
            <span className="text-xs text-slate-500">CVV</span>
            <span className="font-mono text-sm text-slate-900">{masked ? "•••" : card.cvv}</span>
          </div>
          <p className="text-[11px] text-slate-400">Tap card to flip back · Apex Standard Bank, N.A.</p>
        </div>
      </div>

      <div className="mt-3 flex max-w-sm items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleMask(); }}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
        >
          {masked ? <Eye size={13} /> : <EyeOff size={13} />}
          {masked ? "Show details" : "Hide details"}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onFreeze(); }}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs ${
            card.status === "active"
              ? "border-slate-800 text-slate-300 hover:bg-slate-800"
              : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
          }`}
        >
          <Snowflake size={13} />
          {card.status === "active" ? "Freeze card" : "Unfreeze card"}
        </button>
      </div>
    </div>
  );
}

function AccountsPage() {
  const [cards, setCards] = useState(CARDS_INIT);
  const [activeCardId, setActiveCardId] = useState("debit");
  const [masked, setMasked] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [toast, setToast] = useState(null);

  const activeCard = cards.find((c) => c.id === activeCardId);

  function toggleFreeze() {
    setCards((prev) =>
      prev.map((c) => (c.id === activeCardId ? { ...c, status: c.status === "active" ? "frozen" : "active" } : c))
    );
    const willFreeze = activeCard.status === "active";
    setToast(`${activeCard.brand} card ${willFreeze ? "frozen" : "reactivated"}.`);
    setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-slate-50">Accounts & cards</h1>
        <p className="text-sm text-slate-500">Manage your cards and view balances across accounts.</p>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => { setActiveCardId(c.id); setFlipped(false); }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeCardId === c.id ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800/70 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {c.kind}
            </button>
          ))}
        </div>
        <BankCard
          card={activeCard}
          masked={masked}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          onToggleMask={() => setMasked((m) => !m)}
          onFreeze={toggleFreeze}
        />
        {toast && (
          <div className="mt-4 flex w-fit items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
            <CheckCircle2 size={14} /> {toast}
          </div>
        )}
      </Card>

      <div>
        <h3 className="mb-3 font-display text-base text-slate-100">Balance breakdown</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ACCOUNTS.map((a) => (
            <Card key={a.id} className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-slate-400">{a.label}</span>
                <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
              </div>
              <p className="font-display text-xl text-slate-50">{fmt(a.balance)}</p>
              <p className="mt-1 font-mono text-xs text-slate-500">{a.number}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Transfer page                                                       */
/* ------------------------------------------------------------------ */

function TransferPage({ prefillAction, accountsState, setAccountsState }) {
  const [fromId, setFromId] = useState("checking");
  const [toMode, setToMode] = useState(prefillAction === "between" ? "account" : "payee");
  const [payeeId, setPayeeId] = useState(PAYEES[0].id);
  const [toAccountId, setToAccountId] = useState("savings");
  const [amount, setAmount] = useState(250);
  const [note, setNote] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const fromAccount = accountsState.find((a) => a.id === fromId);
  const maxAmount = Math.max(fromAccount.balance, 1);

  function submit(e) {
    e.preventDefault();
    if (toMode === "account" && toAccountId === fromId) {
      setError("Choose two different accounts to transfer between.");
      return;
    }
    if (amount <= 0 || amount > fromAccount.balance) {
      setError("Enter an amount within your available balance.");
      return;
    }
    setError("");
    setAccountsState((prev) =>
      prev.map((a) => {
        if (a.id === fromId) return { ...a, balance: a.balance - amount };
        if (toMode === "account" && a.id === toAccountId) return { ...a, balance: a.balance + amount };
        return a;
      })
    );
    setModalOpen(true);
  }

  const recipientLabel =
    toMode === "payee" ? PAYEES.find((p) => p.id === payeeId)?.name : accountsState.find((a) => a.id === toAccountId)?.label;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-slate-50">Money transfer</h1>
        <p className="text-sm text-slate-500">Send to a payee or move funds between your own accounts.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <form onSubmit={submit} className="space-y-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setToMode("payee")}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm ${
                  toMode === "payee" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-slate-800 text-slate-400"
                }`}
              >
                Send to payee
              </button>
              <button
                type="button"
                onClick={() => setToMode("account")}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm ${
                  toMode === "account" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-slate-800 text-slate-400"
                }`}
              >
                Between my accounts
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">From account</label>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 focus:border-emerald-500/50 focus:outline-none"
              >
                {accountsState.map((a) => (
                  <option key={a.id} value={a.id}>{a.label} — {fmt(a.balance)}</option>
                ))}
              </select>
            </div>

            {toMode === "payee" ? (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Payee</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PAYEES.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPayeeId(p.id)}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${
                        payeeId === p.id ? "border-emerald-500/40 bg-emerald-500/10" : "border-slate-800 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-300">
                        {p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-slate-200">{p.name}</p>
                        <p className="truncate text-xs text-slate-500">{p.detail}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">To account</label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 focus:border-emerald-500/50 focus:outline-none"
                >
                  {accountsState.map((a) => (
                    <option key={a.id} value={a.id}>{a.label} — {fmt(a.balance)}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400">Amount</label>
                <span className="font-display text-lg text-slate-50">{fmt(amount)}</span>
              </div>
              <input
                type="range"
                min={10}
                max={Math.max(10, Math.round(maxAmount))}
                step={10}
                value={Math.min(amount, maxAmount)}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>$10</span>
                <span>Available: {fmt(fromAccount.balance)}</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Note (optional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-emerald-400"
            >
              <Send size={15} /> Review & send {fmt(amount)}
            </button>
          </form>
        </Card>

        <Card className="h-fit p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-base text-slate-100">Transfer summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-500">From</span>
              <span className="text-slate-200">{fromAccount.label}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-500">To</span>
              <span className="text-slate-200">{recipientLabel}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-500">Amount</span>
              <span className="font-display text-base text-slate-50">{fmt(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fee</span>
              <span className="text-emerald-400">Free</span>
            </div>
          </div>
        </Card>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 size={28} className="text-emerald-400" />
          </div>
          <h3 className="font-display text-lg text-slate-50">Transfer complete</h3>
          <p className="mt-1 text-sm text-slate-400">
            {fmt(amount)} sent to {recipientLabel}.
          </p>
          <p className="mt-0.5 text-xs text-slate-500">New {fromAccount.label} balance: {fmt(fromAccount.balance - amount)}</p>
          <button
            onClick={() => setModalOpen(false)}
            className="mt-6 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400"
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Analytics                                                           */
/* ------------------------------------------------------------------ */

function AnalyticsPage() {
  const total = CATEGORY_SPEND.reduce((s, c) => s + c.value, 0);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-slate-50">Analytics & insights</h1>
        <p className="text-sm text-slate-500">Where your money went this month, broken down by category.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Card className="p-5 xl:col-span-2">
          <h3 className="mb-1 font-display text-base text-slate-100">Category breakdown</h3>
          <p className="mb-4 text-xs text-slate-500">Total spend: {fmt(total)}</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_SPEND} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {CATEGORY_SPEND.map((c, i) => (
                    <Cell key={i} fill={c.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, fontSize: 12 }}
                  formatter={(v) => fmt(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {CATEGORY_SPEND.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="text-slate-300">{fmt(c.value)} · {Math.round((c.value / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 xl:col-span-3">
          <h3 className="mb-1 font-display text-base text-slate-100">Budget tracking</h3>
          <p className="mb-4 text-xs text-slate-500">Monthly income against expenses</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY} margin={{ left: -20, right: 10, top: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, fontSize: 12 }}
                  formatter={(v) => fmt(v)}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar dataKey="income" name="Income" fill="#34d399" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#475569" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings                                                            */
/* ------------------------------------------------------------------ */

function SettingsPage({ darkMode, setDarkMode }) {
  const [rows, setRows] = useState({
    biometric: true,
    push: true,
    email: false,
    twoFactor: true,
  });
  const toggle = (k) => setRows((r) => ({ ...r, [k]: !r[k] }));

  const Switch = ({ on, onClick }) => (
    <button
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-slate-700"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-slate-50">Settings</h1>
        <p className="text-sm text-slate-500">Manage your appearance, security, and communication preferences.</p>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 font-display text-base text-slate-100">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={17} className="text-slate-400" /> : <Sun size={17} className="text-amber-400" />}
            <div>
              <p className="text-sm text-slate-200">Dark mode</p>
              <p className="text-xs text-slate-500">Apex looks best in dark — toggle for a lighter surface.</p>
            </div>
          </div>
          <Switch on={darkMode} onClick={() => setDarkMode((v) => !v)} />
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 font-display text-base text-slate-100">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-200">Biometric login</p>
              <p className="text-xs text-slate-500">Use Face ID or fingerprint to sign in.</p>
            </div>
            <Switch on={rows.biometric} onClick={() => toggle("biometric")} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-200">Two-factor authentication</p>
              <p className="text-xs text-slate-500">Require a code for new-device sign-ins.</p>
            </div>
            <Switch on={rows.twoFactor} onClick={() => toggle("twoFactor")} />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 font-display text-base text-slate-100">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-200">Push notifications</p>
              <p className="text-xs text-slate-500">Real-time alerts for transactions and transfers.</p>
            </div>
            <Switch on={rows.push} onClick={() => toggle("push")} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-200">Email summaries</p>
              <p className="text-xs text-slate-500">Weekly digest of your spending activity.</p>
            </div>
            <Switch on={rows.email} onClick={() => toggle("email")} />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App shell                                                           */
/* ------------------------------------------------------------------ */

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [prefillAction, setPrefillAction] = useState(null);
  const [accountsState, setAccountsState] = useState(ACCOUNTS);

  const goTo = (id) => setActive(id);

  return (
    <div className={darkMode ? "dark" : ""}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
        body, .font-sans { font-family: 'Inter', ui-sans-serif, system-ui; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div className="min-h-screen bg-slate-950 font-sans text-slate-200 dark:bg-slate-950" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
        <div className="flex">
          <Sidebar
            active={active}
            setActive={goTo}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          <div className="min-h-screen flex-1 lg:w-0">
            <TopBar
              onMenuClick={() => setMobileOpen(true)}
              onNotifClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
              notifOpen={notifOpen}
              profileOpen={profileOpen}
              setProfileOpen={setProfileOpen}
              notifCount={3}
            />

            <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6 lg:pb-10">
              {active === "dashboard" && <Dashboard goTo={goTo} setPrefillAction={setPrefillAction} />}
              {active === "accounts" && <AccountsPage />}
              {active === "transfer" && (
                <TransferPage prefillAction={prefillAction} accountsState={accountsState} setAccountsState={setAccountsState} />
              )}
              {active === "analytics" && <AnalyticsPage />}
              {active === "settings" && <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />}
            </main>
          </div>
        </div>

        <BottomNav active={active} setActive={goTo} />
      </div>
    </div>
  );
}
