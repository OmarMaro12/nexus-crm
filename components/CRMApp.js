"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, BriefcaseBusiness, CheckSquare, Settings,
  LogOut, Bell, Search, Plus, Pencil, Trash2, X, TrendingUp,
  DollarSign, Target, CalendarDays, Check, Menu, Building2, Mail, Phone
} from "lucide-react";

const initialCustomers = [
  { id: 1, name: "Ahmed Mohamed", company: "Cairo Tech", email: "ahmed@cairotech.com", phone: "+20 100 123 4567", status: "Active" },
  { id: 2, name: "Sarah Ali", company: "Bright Solutions", email: "sarah@bright.com", phone: "+20 101 222 3344", status: "Active" },
  { id: 3, name: "Omar Hassan", company: "Nile Group", email: "omar@nilegroup.com", phone: "+20 102 333 4455", status: "Lead" },
  { id: 4, name: "Mona Samir", company: "Pixel House", email: "mona@pixel.com", phone: "+20 103 444 5566", status: "Inactive" }
];
const initialDeals = [
  { id: 1, title: "Website redesign", customer: "Cairo Tech", value: 24000, stage: "Negotiation", closeDate: "2026-12-10" },
  { id: 2, title: "CRM subscription", customer: "Bright Solutions", value: 12000, stage: "Proposal", closeDate: "2026-12-18" },
  { id: 3, title: "Mobile application", customer: "Nile Group", value: 45000, stage: "Lead", closeDate: "2027-01-05" }
];
const initialTasks = [
  { id: 1, title: "Call Ahmed about proposal", dueDate: "2026-11-18", priority: "High", status: "Pending" },
  { id: 2, title: "Prepare monthly sales report", dueDate: "2026-11-20", priority: "Medium", status: "Pending" },
  { id: 3, title: "Send onboarding documents", dueDate: "2026-11-14", priority: "Low", status: "Completed" }
];
const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
const money = (n, currency) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(n || 0));

function Modal({ title, onClose, children }) {
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal"><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>{children}</div>
  </div>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

export default function CRMApp({ section }) {
  const router = useRouter();
  const [customers, setCustomers] = useState(initialCustomers);
  const [deals, setDeals] = useState(initialDeals);
  const [tasks, setTasks] = useState(initialTasks);
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@nexuscrm.com", company: "NEXUS Company", currency: "USD" });
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [loginEmail, setLoginEmail] = useState("admin@nexuscrm.com");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("nexus-crm-data") || "null");
      if (saved) {
        setCustomers(saved.customers || initialCustomers);
        setDeals(saved.deals || initialDeals);
        setTasks(saved.tasks || initialTasks);
        setProfile(saved.profile || profile);
      }
      setLoggedIn(localStorage.getItem("nexus-crm-auth") === "yes");
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("nexus-crm-data", JSON.stringify({ customers, deals, tasks, profile }));
  }, [customers, deals, tasks, profile, ready]);

  useEffect(() => {
    if (ready && section !== "login" && !loggedIn) router.replace("/login");
    if (ready && section === "login" && loggedIn) router.replace("/dashboard");
  }, [ready, loggedIn, section, router]);

  const title = section.charAt(0).toUpperCase() + section.slice(1);
  const nav = [
    ["Dashboard", "/dashboard", LayoutDashboard],
    ["Customers", "/customers", Users],
    ["Deals", "/deals", BriefcaseBusiness],
    ["Tasks", "/tasks", CheckSquare],
    ["Settings", "/settings", Settings]
  ];
  const filteredCustomers = useMemo(() => customers.filter(c => [c.name,c.company,c.email,c.phone].join(" ").toLowerCase().includes(query.toLowerCase())), [customers, query]);
  const totalRevenue = deals.filter(d => d.stage === "Won").reduce((s,d) => s + Number(d.value), 0);
  const activeDeals = deals.filter(d => !["Won","Lost"].includes(d.stage)).length;
  const pendingTasks = tasks.filter(t => t.status !== "Completed").length;

  function logout() {
    localStorage.removeItem("nexus-crm-auth");
    setLoggedIn(false);
    router.replace("/login");
  }
  function saveRecord(type, record) {
    const setter = type === "customer" ? setCustomers : type === "deal" ? setDeals : setTasks;
    const list = type === "customer" ? customers : type === "deal" ? deals : tasks;
    setter(record.id ? list.map(x => x.id === record.id ? record : x) : [...list, { ...record, id: Date.now() }]);
    setModal(null);
  }
  function removeRecord(type, id) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const setter = type === "customer" ? setCustomers : type === "deal" ? setDeals : setTasks;
    setter(prev => prev.filter(x => x.id !== id));
  }

  if (!ready) return <div className="loading">Loading NEXUS CRM…</div>;

  if (section === "login") {
    return <main className="login-page"><form className="login-card" onSubmit={(e) => {
      e.preventDefault();
      if (loginEmail.trim().toLowerCase() === "admin@nexuscrm.com" && loginPassword === "admin123") {
        localStorage.setItem("nexus-crm-auth", "yes"); setLoggedIn(true); router.replace("/dashboard");
      } else setLoginError("Incorrect demo email or password.");
    }}>
      <div className="brand-mark">◆ NEXUS</div><p className="muted">Sign in to your workspace</p>
      <Field label="Email"><input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} required /></Field>
      <Field label="Password"><input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} required /></Field>
      {loginError && <p className="error">{loginError}</p>}
      <button className="btn primary full">Sign in</button>
      <p className="demo-hint">Demo: admin@nexuscrm.com / admin123</p>
    </form></main>;
  }

  if (!loggedIn) return <div className="loading">Redirecting to login…</div>;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
      <div className="brand"><span>◆</span> NEXUS</div>
      <div className="nav-caption">WORKSPACE</div>
      {nav.map(([name, href, Icon]) => <Link key={href} href={href} onClick={()=>setMobileNav(false)} className={`nav-item ${section === href.slice(1) ? "selected" : ""}`}><Icon size={18}/><span>{name}</span></Link>)}
      <div className="sidebar-bottom"><button className="nav-item logout" onClick={logout}><LogOut size={18}/><span>Logout</span></button></div>
    </aside>
    <main className="main">
      <header className="topbar"><button className="mobile-menu icon-btn" onClick={()=>setMobileNav(!mobileNav)}><Menu/></button><div><h1>{title}</h1><p className="muted">{section === "dashboard" ? "Welcome back! Here's your business overview." : `Manage your ${section} in one place.`}</p></div><div className="top-user"><span className="avatar">{(profile.name || "A").charAt(0).toUpperCase()}</span><span>{profile.name}</span></div></header>

      {section === "dashboard" && <div className="content">
        <div className="stats-grid">
          <Stat icon={Users} label="Total Customers" value={customers.length.toLocaleString()} hint="Customers in your workspace"/>
          <Stat icon={Target} label="Active Deals" value={activeDeals} hint="Deals still in progress"/>
          <Stat icon={DollarSign} label="Won Revenue" value={money(totalRevenue, profile.currency)} hint="Revenue from won deals"/>
          <Stat icon={CheckSquare} label="Pending Tasks" value={pendingTasks} hint="Tasks awaiting completion"/>
        </div>
        <div className="two-col">
          <section className="panel"><div className="panel-head"><div><h2>Sales Pipeline</h2><p className="muted">Deal value by stage</p></div><Link className="text-link" href="/deals">View deals →</Link></div>
            <div className="pipeline-bars">{stages.map(stage => { const value=deals.filter(d=>d.stage===stage).reduce((s,d)=>s+Number(d.value),0); const max=Math.max(1,...stages.map(st=>deals.filter(d=>d.stage===st).reduce((s,d)=>s+Number(d.value),0))); return <div className="bar-row" key={stage}><span>{stage}</span><div className="bar-track"><div className="bar-fill" style={{width:`${value/max*100}%`}}/></div><b>{money(value,profile.currency)}</b></div>; })}</div>
          </section>
          <section className="panel"><div className="panel-head"><div><h2>Upcoming Tasks</h2><p className="muted">Your next actions</p></div><Link className="text-link" href="/tasks">View tasks →</Link></div>
            {tasks.filter(t=>t.status!=="Completed").slice(0,4).map(t=><div className="activity" key={t.id}><span className={`priority-dot ${t.priority.toLowerCase()}`}/><div><b>{t.title}</b><small>{t.dueDate || "No due date"} · {t.priority}</small></div></div>)}
            {pendingTasks===0 && <p className="empty">No pending tasks. You're all caught up!</p>}
          </section>
        </div>
        <section className="panel"><div className="panel-head"><div><h2>Recent Customers</h2><p className="muted">Latest contacts added</p></div><Link className="text-link" href="/customers">All customers →</Link></div><DataTable headers={["Name","Company","Email","Status"]} rows={customers.slice(0,5).map(c=>[c.name,c.company,c.email,<Status key={c.id} value={c.status}/>])}/></section>
      </div>}

      {section === "customers" && <div className="content"><div className="toolbar"><div className="search"><Search size={17}/><input placeholder="Search customers…" value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="btn primary" onClick={()=>setModal({type:"customer"})}><Plus size={17}/> Add customer</button></div>
        <section className="panel"><DataTable headers={["Customer","Company","Email","Phone","Status","Actions"]} rows={filteredCustomers.map(c=>[<div className="person" key={c.id}><span className="avatar small">{c.name[0]}</span>{c.name}</div>,c.company,c.email,c.phone,<Status value={c.status}/>,<Actions key={c.id} edit={()=>setModal({type:"customer",record:c})} del={()=>removeRecord("customer",c.id)}/>])}/>{filteredCustomers.length===0&&<p className="empty">No customers found.</p>}</section>
      </div>}

      {section === "deals" && <div className="content"><div className="toolbar"><p className="muted">Track opportunities from lead to close.</p><button className="btn primary" onClick={()=>setModal({type:"deal"})}><Plus size={17}/> Add deal</button></div>
        <div className="deal-grid">{stages.map(stage=><section className="deal-column" key={stage}><div className="column-title"><b>{stage}</b><span>{deals.filter(d=>d.stage===stage).length}</span></div>{deals.filter(d=>d.stage===stage).map(d=><article className="deal-card" key={d.id}><h3>{d.title}</h3><p className="muted">{d.customer}</p><strong>{money(d.value,profile.currency)}</strong><small>Close: {d.closeDate || "Not set"}</small><div className="card-actions"><button onClick={()=>setModal({type:"deal",record:d})}><Pencil size={15}/> Edit</button><button onClick={()=>removeRecord("deal",d.id)}><Trash2 size={15}/> Delete</button></div></article>)}</section>)}</div>
      </div>}

      {section === "tasks" && <div className="content"><div className="toolbar"><p className="muted">{tasks.filter(t=>t.status==="Completed").length} completed · {pendingTasks} pending</p><button className="btn primary" onClick={()=>setModal({type:"task"})}><Plus size={17}/> Add task</button></div><section className="panel"><DataTable headers={["Task","Due date","Priority","Status","Actions"]} rows={tasks.map(t=>[<b key={t.id}>{t.title}</b>,t.dueDate || "—",<Status value={t.priority}/>,<button className={`status-toggle ${t.status==="Completed"?"done":""}`} onClick={()=>setTasks(prev=>prev.map(x=>x.id===t.id?{...x,status:x.status==="Completed"?"Pending":"Completed"}:x))}>{t.status==="Completed"?<Check size={14}/>:null}{t.status}</button>,<Actions key={t.id} edit={()=>setModal({type:"task",record:t})} del={()=>removeRecord("task",t.id)}/>])}/>{tasks.length===0&&<p className="empty">No tasks yet. Add your first task.</p>}</section></div>}

      {section === "settings" && <div className="content settings-grid"><section className="panel"><h2>Profile settings</h2><p className="muted section-sub">Update the details shown in your workspace.</p><form className="form-stack" onSubmit={e=>{e.preventDefault();alert("Profile saved.");}}><Field label="Your name"><input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} required/></Field><Field label="Email address"><input type="email" value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})} required/></Field><Field label="Company"><input value={profile.company} onChange={e=>setProfile({...profile,company:e.target.value})}/></Field><Field label="Display currency"><select value={profile.currency} onChange={e=>setProfile({...profile,currency:e.target.value})}><option value="USD">USD — US Dollar</option><option value="EGP">EGP — Egyptian Pound</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — British Pound</option></select></Field><button className="btn primary">Save settings</button></form></section><section className="panel"><h2>Workspace</h2><p className="muted section-sub">Your data is saved in this browser.</p><div className="info-line"><span>Customers</span><b>{customers.length}</b></div><div className="info-line"><span>Deals</span><b>{deals.length}</b></div><div className="info-line"><span>Tasks</span><b>{tasks.length}</b></div><button className="btn danger-outline" onClick={()=>{if(confirm("Reset all CRM demo data?")){setCustomers(initialCustomers);setDeals(initialDeals);setTasks(initialTasks);}}}>Reset demo data</button></section></div>}

      {!["dashboard","customers","deals","tasks","settings"].includes(section) && <section className="panel"><h2>Page not found</h2><Link className="text-link" href="/dashboard">Return to dashboard</Link></section>}
    </main>

    {modal && <RecordModal modal={modal} customers={customers} onClose={()=>setModal(null)} onSave={record=>saveRecord(modal.type,record)}/>}
  </div>;
}

function Stat({icon:Icon,label,value,hint}) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon size={20}/></span></div><strong>{value}</strong><small>{hint}</small></div>; }
function Status({value}) { return <span className={`pill ${String(value).toLowerCase()}`}>{value}</span>; }
function Actions({edit,del}) { return <div className="actions"><button aria-label="Edit" onClick={edit}><Pencil size={15}/></button><button aria-label="Delete" onClick={del}><Trash2 size={15}/></button></div>; }
function DataTable({headers,rows}) { return <div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>; }

function RecordModal({modal,customers,onClose,onSave}) {
  const old=modal.record||{};
  const [form,setForm]=useState(modal.type==="customer"?{name:old.name||"",company:old.company||"",email:old.email||"",phone:old.phone||"",status:old.status||"Active"}:modal.type==="deal"?{title:old.title||"",customer:old.customer||customers[0]?.company||"",value:old.value||"",stage:old.stage||"Lead",closeDate:old.closeDate||""}:{title:old.title||"",dueDate:old.dueDate||"",priority:old.priority||"Medium",status:old.status||"Pending"});
  const update=(key,value)=>setForm(prev=>({...prev,[key]:value}));
  return <Modal title={`${old.id?"Edit":"Add"} ${modal.type}`} onClose={onClose}><form className="form-stack" onSubmit={e=>{e.preventDefault();onSave({...form,...(old.id?{id:old.id}:{})});}}>
    {modal.type==="customer" && <><Field label="Full name"><input value={form.name} onChange={e=>update("name",e.target.value)} required/></Field><Field label="Company"><input value={form.company} onChange={e=>update("company",e.target.value)} required/></Field><Field label="Email"><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} required/></Field><Field label="Phone"><input value={form.phone} onChange={e=>update("phone",e.target.value)}/></Field><Field label="Status"><select value={form.status} onChange={e=>update("status",e.target.value)}><option>Active</option><option>Lead</option><option>Inactive</option></select></Field></>}
    {modal.type==="deal" && <><Field label="Deal title"><input value={form.title} onChange={e=>update("title",e.target.value)} required/></Field><Field label="Customer"><select value={form.customer} onChange={e=>update("customer",e.target.value)}>{customers.map(c=><option key={c.id} value={c.company}>{c.company}</option>)}</select></Field><Field label="Deal value"><input type="number" min="0" value={form.value} onChange={e=>update("value",e.target.value)} required/></Field><Field label="Stage"><select value={form.stage} onChange={e=>update("stage",e.target.value)}>{stages.map(s=><option key={s}>{s}</option>)}</select></Field><Field label="Expected close date"><input type="date" value={form.closeDate} onChange={e=>update("closeDate",e.target.value)}/></Field></>}
    {modal.type==="task" && <><Field label="Task title"><input value={form.title} onChange={e=>update("title",e.target.value)} required/></Field><Field label="Due date"><input type="date" value={form.dueDate} onChange={e=>update("dueDate",e.target.value)}/></Field><Field label="Priority"><select value={form.priority} onChange={e=>update("priority",e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></Field><Field label="Status"><select value={form.status} onChange={e=>update("status",e.target.value)}><option>Pending</option><option>Completed</option></select></Field></>}
    <div className="modal-actions"><button type="button" className="btn secondary" onClick={onClose}>Cancel</button><button className="btn primary">Save {modal.type}</button></div>
  </form></Modal>;
}