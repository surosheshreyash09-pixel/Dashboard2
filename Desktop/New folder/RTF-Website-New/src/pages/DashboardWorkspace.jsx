import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  CircleUserRound,
  Cpu,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  Trash2,
  Trophy,
  Users,
  Wrench,
  X,
} from "lucide-react";
import "../styles/dashboard.css";

const initialMembers = [
  { id: 1, name: "Aarav Patil", detail: "Mechanical · Year 3", status: "Active" },
  { id: 2, name: "Riya Sharma", detail: "Computer Science · Year 2", status: "Active" },
  { id: 3, name: "Aditya Joshi", detail: "Electronics · Year 3", status: "Active" },
  { id: 4, name: "Sara Khan", detail: "Electrical · Year 2", status: "On leave" },
];

const initialProjects = [
  { id: 1, name: "Autonomous Rover", detail: "Rover Team · Updated today", status: "In progress", progress: 78 },
  { id: 2, name: "Line Following Bot", detail: "Embedded Team · Updated yesterday", status: "In progress", progress: 62 },
  { id: 3, name: "Smart Agriculture Robot", detail: "AI & Robotics · Updated Sep 20", status: "Development", progress: 45 },
  { id: 4, name: "Vision-Based Sorting Bot", detail: "Computer Vision · Updated Sep 18", status: "Testing", progress: 91 },
];

const initialEvents = [
  { id: 1, name: "Robotics Workshop", detail: "Sep 24, 2026 · 10:00 AM · RTF Lab", status: "Upcoming" },
  { id: 2, name: "Project Showcase", detail: "Sep 28, 2026 · 02:00 PM · Innovation Hall", status: "Upcoming" },
  { id: 3, name: "Tech Talk 2026", detail: "Oct 04, 2026 · 11:30 AM · Seminar Hall", status: "Upcoming" },
];

const initialCompetitions = [
  { id: 1, name: "Robocon 2026", detail: "National robotics competition · Team registration", status: "Preparing" },
  { id: 2, name: "IRoC-U 2026", detail: "Innovation challenge · Prototype stage", status: "In progress" },
  { id: 3, name: "Smart India Hackathon", detail: "Internal selection · 6 teams", status: "Open" },
];

const initialResources = [
  { id: 1, name: "Arduino Kits", detail: "18 of 25 available · Electronics", status: "Available" },
  { id: 2, name: "Robotic Arms", detail: "4 of 6 available · Mechatronics", status: "Available" },
  { id: 3, name: "3D Printers", detail: "2 of 3 available · Fabrication", status: "In use" },
];

const initialBlogs = [
  { id: 1, name: "Building our first autonomous rover", detail: "Aarav Patil · Sep 22, 2026", status: "Published" },
  { id: 2, name: "Inside the RTF fabrication lab", detail: "Riya Sharma · Sep 18, 2026", status: "Draft" },
  { id: 3, name: "Robocon: lessons from the arena", detail: "RTF Team · Sep 12, 2026", status: "Published" },
];

const initialRequests = [
  { id: 1, name: "Mihir Deshmukh", detail: "New member · 10 minutes ago", status: "Pending" },
  { id: 2, name: "Riya Sharma", detail: "Project access · 32 minutes ago", status: "Pending" },
  { id: 3, name: "Aditya Joshi", detail: "Workshop request · 1 hour ago", status: "Pending" },
];

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Members", icon: Users },
  { name: "Projects", icon: FolderKanban },
  { name: "Events", icon: CalendarDays },
  { name: "Competitions", icon: Trophy },
  { name: "Resources", icon: Package },
  { name: "Blogs", icon: BookOpen },
];

const statusCycles = {
  Members: ["Active", "On leave"],
  Projects: ["In progress", "Paused", "Completed"],
  Events: ["Upcoming", "Completed"],
  Competitions: ["Preparing", "In progress", "Completed"],
  Resources: ["Available", "In use"],
  Blogs: ["Draft", "Published"],
};

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the dashboard usable when browser storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue];
}

function StatCard({ label, value, detail, icon: Icon, positive = true }) {
  return (
    <article className="dw-stat">
      <div className="dw-stat-top">
        <span className="dw-stat-icon"><Icon size={18} /></span>
        <span className={`dw-stat-change ${positive ? "is-positive" : ""}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {detail}
        </span>
      </div>
      <strong className="dw-stat-value">{value}</strong>
      <span className="dw-stat-label">{label}</span>
    </article>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="dw-section-heading">
      <div>
        <span className="dw-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export default function DashboardWorkspace() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState({ name: "", detail: "" });
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useStoredState("rtf-dashboard-profile", { name: "RTF Admin", organization: "Robo Tech Forum" });
  const [members, setMembers] = useStoredState("rtf-dashboard-members", initialMembers);
  const [projects, setProjects] = useStoredState("rtf-dashboard-projects", initialProjects);
  const [events, setEvents] = useStoredState("rtf-dashboard-events", initialEvents);
  const [competitions, setCompetitions] = useStoredState("rtf-dashboard-competitions", initialCompetitions);
  const [resources, setResources] = useStoredState("rtf-dashboard-resources", initialResources);
  const [blogs, setBlogs] = useStoredState("rtf-dashboard-blogs", initialBlogs);
  const [requests, setRequests] = useStoredState("rtf-dashboard-requests", initialRequests);

  const lists = {
    Members: [members, setMembers],
    Projects: [projects, setProjects],
    Events: [events, setEvents],
    Competitions: [competitions, setCompetitions],
    Resources: [resources, setResources],
    Blogs: [blogs, setBlogs],
  };
  const activeList = lists[activeMenu];
  const rows = activeList?.[0] ?? [];
  const query = searchTerm.trim().toLowerCase();
  const filteredRows = query
    ? rows.filter((row) => `${row.name} ${row.detail} ${row.status}`.toLowerCase().includes(query))
    : rows;

  const chooseMenu = (name) => {
    setActiveMenu(name);
    setSidebarOpen(false);
    setSearchTerm("");
  };

  const createRecord = (event) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    const [items, setItems] = lists[activeMenu];
    const newStatus = activeMenu === "Blogs" ? "Draft" : activeMenu === "Events" ? "Upcoming" : activeMenu === "Resources" ? "Available" : "Active";
    setItems([{ id: Date.now(), name: draft.name.trim(), detail: draft.detail.trim() || "Added just now", status: newStatus }, ...items]);
    setDraft({ name: "", detail: "" });
    setShowCreate(false);
  };

  const updateRecord = (id, updates) => {
    const [items, setItems] = lists[activeMenu];
    setItems(items.map((item) => item.id === id ? { ...item, ...updates } : item));
  };

  const removeRecord = (id) => {
    const [items, setItems] = lists[activeMenu];
    setItems(items.filter((item) => item.id !== id));
  };

  const approveRequest = (request) => {
    setRequests((items) => items.filter((item) => item.id !== request.id));
    setMembers((items) => [{ id: Date.now(), name: request.name, detail: "New member · Just joined", status: "Active" }, ...items]);
  };

  const descriptions = {
    Members: "Keep member records and team access up to date.",
    Projects: "Track project ownership, progress, and current status.",
    Events: "Manage the forum calendar and upcoming sessions.",
    Competitions: "Follow team preparation and competition milestones.",
    Resources: "See lab equipment availability and usage.",
    Blogs: "Manage stories and updates from the RTF community.",
  };

  return (
    <div className="dw-app">
      {sidebarOpen && <button className="dw-overlay" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`dw-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="dw-brand">
          <div className="dw-brand-mark"><Bot size={22} /></div>
          <div><strong>RTF</strong><span>ROBO-TECH FORUM</span></div>
          <button className="dw-close-menu" aria-label="Close menu" onClick={() => setSidebarOpen(false)}><X size={19} /></button>
        </div>
        <span className="dw-nav-label">WORKSPACE</span>
        <nav className="dw-nav" aria-label="Dashboard sections">
          {navigation.map(({ name, icon: Icon }) => (
            <button key={name} className={`dw-nav-item ${activeMenu === name ? "is-active" : ""}`} aria-current={activeMenu === name ? "page" : undefined} onClick={() => chooseMenu(name)}>
              <Icon size={18} /><span>{name}</span>
              {name === "Events" && <span className="dw-nav-count">{events.length}</span>}
            </button>
          ))}
        </nav>
        <span className="dw-nav-label dw-system-label">SYSTEM</span>
        <nav className="dw-nav" aria-label="System sections">
          <button className={`dw-nav-item ${activeMenu === "Notifications" ? "is-active" : ""}`} aria-current={activeMenu === "Notifications" ? "page" : undefined} onClick={() => chooseMenu("Notifications")}>
            <Bell size={18} /><span>Notifications</span>{requests.length > 0 && <span className="dw-nav-count">{requests.length}</span>}
          </button>
          <button className={`dw-nav-item ${activeMenu === "Settings" ? "is-active" : ""}`} aria-current={activeMenu === "Settings" ? "page" : undefined} onClick={() => chooseMenu("Settings")}>
            <Settings size={18} /><span>Settings</span>
          </button>
        </nav>
        <div className="dw-sidebar-bottom">
          <div className="dw-user-card"><span className="dw-avatar"><CircleUserRound size={21} /></span><span><strong>{profile.name}</strong><small>Workspace admin</small></span></div>
          <a className="dw-site-link" href="/"><ExternalLink size={15} /> Visit public website</a>
        </div>
      </aside>

      <main className="dw-main">
        <header className="dw-header">
          <div className="dw-header-title">
            <button className="dw-menu-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div><span className="dw-breadcrumb">RTF / WORKSPACE</span><h1>{activeMenu === "Notifications" ? "Notifications" : activeMenu}</h1></div>
          </div>
          <div className="dw-header-actions">
            <button className="dw-icon-button" aria-label={`Notifications, ${requests.length} pending`} onClick={() => chooseMenu("Notifications")}><Bell size={18} />{requests.length > 0 && <i />}</button>
            <button className="dw-profile-button" onClick={() => chooseMenu("Settings")}><span className="dw-avatar"><CircleUserRound size={20} /></span><span><strong>{profile.name}</strong><small>Admin</small></span></button>
          </div>
        </header>

        <div className="dw-content">
          {activeMenu === "Dashboard" && (
            <>
              <section className="dw-welcome">
                <div><span className="dw-eyebrow">{profile.organization.toUpperCase()} · OVERVIEW</span><h2>Build, test, <span>repeat.</span></h2><p>Your forum at a glance. Here’s what’s moving across the lab today.</p></div>
                <div className="dw-welcome-art" aria-hidden="true"><span className="dw-orbit dw-orbit-a" /><span className="dw-orbit dw-orbit-b" /><Bot size={66} strokeWidth={1.2} /></div>
                <button className="dw-primary-button dw-welcome-button" onClick={() => chooseMenu("Projects")}><FolderKanban size={16} /> Explore projects</button>
              </section>
              <section className="dw-stats-grid" aria-label="Forum summary">
                <StatCard label="Active members" value={members.filter((item) => item.status === "Active").length} detail="community" icon={Users} />
                <StatCard label="Active projects" value={projects.length} detail="in workspace" icon={FolderKanban} />
                <StatCard label="Upcoming events" value={events.length} detail="scheduled" icon={CalendarDays} />
                <StatCard label="Pending requests" value={requests.length} detail="needs review" icon={Bell} positive={requests.length > 0} />
              </section>
              <section className="dw-overview-grid">
                <article className="dw-panel">
                  <div className="dw-panel-heading"><div><span className="dw-eyebrow">ON THE CALENDAR</span><h3>Upcoming events</h3></div><button className="dw-text-button" onClick={() => chooseMenu("Events")}>All events <ChevronRight size={15} /></button></div>
                  {events.length === 0 ? <p className="dw-empty">No events yet. Add one in the Events tab.</p> : events.slice(0, 4).map((item) => <div className="dw-event-row" key={item.id}><span className="dw-event-icon"><CalendarDays size={17} /></span><span className="dw-row-copy"><strong>{item.name}</strong><small>{item.detail}</small></span><span className="dw-status">{item.status}</span></div>)}
                </article>
                <article className="dw-panel">
                  <div className="dw-panel-heading"><div><span className="dw-eyebrow">LAB INVENTORY</span><h3>Resource status</h3></div><button className="dw-round-link" aria-label="Open resources" onClick={() => chooseMenu("Resources")}><ArrowUpRight size={16} /></button></div>
                  <div className="dw-capacity"><div><span>Equipment tracked</span><strong>{resources.length} items</strong></div><div className="dw-capacity-bar"><span style={{ width: `${Math.min(100, resources.length * 20)}%` }} /></div><small><i /> Lab operational</small></div>
                  {resources.slice(0, 3).map((item, index) => { const Icon = [Cpu, Bot, Wrench][index % 3]; return <div className="dw-resource-row" key={item.id}><span className="dw-resource-icon"><Icon size={16} /></span><span>{item.name}</span><strong>{item.status}</strong></div>; })}
                </article>
                <article className="dw-panel">
                  <div className="dw-panel-heading"><div><span className="dw-eyebrow">IN THE WORKSHOP</span><h3>Project progress</h3></div><button className="dw-text-button" onClick={() => chooseMenu("Projects")}>All projects <ChevronRight size={15} /></button></div>
                  {projects.length === 0 ? <p className="dw-empty">No active projects. Add one in the Projects tab.</p> : projects.slice(0, 4).map((item) => <div className="dw-project-row" key={item.id}><span className="dw-project-name"><span className="dw-project-icon"><Bot size={16} /></span><span><strong>{item.name}</strong><small>{item.detail}</small></span></span><span className="dw-project-progress"><span className="dw-progress-track"><i style={{ width: `${item.progress ?? 0}%` }} /></span><strong>{item.progress ?? 0}%</strong></span></div>)}
                </article>
                <article className="dw-panel">
                  <div className="dw-panel-heading"><div><span className="dw-eyebrow">ACTION NEEDED</span><h3>Pending requests</h3></div><span className="dw-count-badge">{requests.length}</span></div>
                  {requests.length === 0 ? <p className="dw-empty">You’re all caught up.</p> : requests.slice(0, 4).map((item) => <div className="dw-request-row" key={item.id}><span className="dw-request-avatar">{item.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span className="dw-row-copy"><strong>{item.name}</strong><small>{item.detail}</small></span><button className="dw-approve-button" aria-label={`Approve ${item.name}`} onClick={() => approveRequest(item)}><Check size={16} /></button></div>)}
                  <button className="dw-bottom-link" onClick={() => chooseMenu("Notifications")}>Review all requests <ArrowUpRight size={15} /></button>
                </article>
              </section>
            </>
          )}

          {activeList && (
            <section className="dw-management-view">
              <SectionHeading eyebrow={`${profile.organization} · MANAGEMENT`} title={activeMenu} description={descriptions[activeMenu]} action={<button className="dw-primary-button" onClick={() => setShowCreate(true)}><Plus size={16} /> Add {activeMenu === "Members" ? "member" : activeMenu === "Blogs" ? "post" : activeMenu.slice(0, -1).toLowerCase()}</button>} />
              <div className="dw-toolbar"><label className="dw-search"><Search size={17} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={`Search ${activeMenu.toLowerCase()}...`} /></label><span>{filteredRows.length} of {rows.length} records</span></div>
              {filteredRows.length === 0 ? <div className="dw-empty-state"><span><Search size={21} /></span><strong>{rows.length ? "No matching records" : `No ${activeMenu.toLowerCase()} yet`}</strong><p>{rows.length ? "Try another search term." : "Add a record to get this section started."}</p></div> : (
                <div className="dw-record-list">
                  {filteredRows.map((item, index) => {
                    const Icon = activeMenu === "Members" ? Users : activeMenu === "Projects" ? Bot : activeMenu === "Events" ? CalendarDays : activeMenu === "Competitions" ? Trophy : activeMenu === "Resources" ? Package : BookOpen;
                    const cycle = statusCycles[activeMenu];
                    const nextStatus = cycle[(cycle.indexOf(item.status) + 1 + cycle.length) % cycle.length];
                    return <article className="dw-record" key={item.id}><span className="dw-record-icon"><Icon size={18} /></span><div className="dw-record-copy"><strong>{item.name}</strong><span>{item.detail}</span></div><span className={`dw-status ${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.status}</span>{item.progress !== undefined && <span className="dw-record-progress">{item.progress}% complete</span>}<div className="dw-record-actions"><button className="dw-action-button" title={`Change status to ${nextStatus}`} aria-label={`Change ${item.name} status to ${nextStatus}`} onClick={() => updateRecord(item.id, { status: nextStatus })}><Check size={15} /></button><button className="dw-action-button is-danger" title={`Remove ${item.name}`} aria-label={`Remove ${item.name}`} onClick={() => removeRecord(item.id)}><Trash2 size={15} /></button></div></article>;
                  })}
                </div>
              )}
            </section>
          )}

          {activeMenu === "Notifications" && (
            <section className="dw-management-view">
              <SectionHeading eyebrow="INBOX · MEMBER ACTIVITY" title="Notifications" description="Review requests and keep the forum moving." />
              <div className="dw-notification-summary"><Bell size={19} /><span><strong>{requests.length} pending requests</strong><small>Approving a request adds that person to Members.</small></span></div>
              {requests.length === 0 ? <div className="dw-empty-state"><span><Check size={21} /></span><strong>You’re all caught up</strong><p>New member and access requests will appear here.</p></div> : <div className="dw-record-list">{requests.map((item) => <article className="dw-record" key={item.id}><span className="dw-request-avatar">{item.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div className="dw-record-copy"><strong>{item.name}</strong><span>{item.detail}</span></div><span className="dw-status pending">{item.status}</span><div className="dw-record-actions"><button className="dw-approve-button" onClick={() => approveRequest(item)}><Check size={15} /> Approve</button><button className="dw-action-button is-danger" aria-label={`Dismiss ${item.name}`} onClick={() => setRequests((items) => items.filter((request) => request.id !== item.id))}><X size={15} /></button></div></article>)}</div>}
            </section>
          )}

          {activeMenu === "Settings" && (
            <section className="dw-management-view">
              <SectionHeading eyebrow="WORKSPACE PREFERENCES" title="Settings" description="Update the identity shown across your dashboard." />
              <form className="dw-settings-form" onSubmit={(event) => { event.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 2200); }}>
                <label>Display name<input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} /></label>
                <label>Organization<input value={profile.organization} onChange={(event) => setProfile((current) => ({ ...current, organization: event.target.value }))} /></label>
                <div className="dw-settings-note"><Activity size={17} /><span><strong>Local workspace</strong><small>Changes are saved in this browser and reflected across dashboard sections.</small></span></div>
                <button className="dw-primary-button" type="submit"><Check size={16} /> {saved ? "Saved" : "Save settings"}</button>
              </form>
            </section>
          )}
        </div>
      </main>

      {showCreate && (
        <div className="dw-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreate(false); }}>
          <form className="dw-modal" role="dialog" aria-modal="true" aria-labelledby="dw-modal-title" onSubmit={createRecord}>
            <div className="dw-modal-heading"><span className="dw-modal-icon"><Plus size={18} /></span><button type="button" className="dw-action-button" aria-label="Close dialog" onClick={() => setShowCreate(false)}><X size={17} /></button></div>
            <span className="dw-eyebrow">NEW RECORD</span><h2 id="dw-modal-title">Add {activeMenu === "Members" ? "member" : activeMenu === "Blogs" ? "post" : activeMenu.slice(0, -1).toLowerCase()}</h2><p>This sample record will be available across your dashboard.</p>
            <label>Name<input autoFocus required value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Enter a name" /></label>
            <label>Details<input value={draft.detail} onChange={(event) => setDraft((current) => ({ ...current, detail: event.target.value }))} placeholder="Team, date, or short description" /></label>
            <div className="dw-modal-actions"><button type="button" className="dw-secondary-button" onClick={() => setShowCreate(false)}>Cancel</button><button className="dw-primary-button" type="submit"><Plus size={15} /> Add record</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
