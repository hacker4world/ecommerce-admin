import {
  Wrench,
  Bell,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CalendarSync,
  CircleUser,
  Box,
  Warehouse,
  Truck,
  HardHat,
  Factory,
  Bolt,
  Power,
  FileSpreadsheet,
  Package,
  Filter,
  Layers,
  TriangleAlert,
  ListChecks,
  ListRestart,
  PackageCheck,
  PackageX,
  Calendar,
  Lock,
  List,
  User,
  Package2,
  Cog,
  ShoppingBag,
  FolderOpen,
  Percent,
  Users,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  Wallet,
  Settings,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.jfif";
import { title } from "process";
import { url } from "inspector";


const navigationItems = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  {
    title: "Gestion des produits",
    icon: Package,
    children: [
      {
        title: "Liste des produits",
        icon: ShoppingBag,
        url: "/products",
      },
      {
        title: "Liste des catégories",
        icon: FolderOpen,
        url: "/categories",
      },
      {
        title: "Offres et Remises",
        icon: Percent,
        url: "/offers",
      },
    ],
  },
  {
    title: "Gestion des comptes",
    icon: Users,
    children: [
      {
        title: "Comptes clients",
        icon: UserPlus,
        url: "/clients",
      },
      {
        title: "Comptes livreurs",
        icon: Truck,
        url: "/livreurs",
      },
    ],
  },
  {
    title: "Commandes",
    icon: Box,
    children: [
      {
        title: "Commandes en attente",
        icon: Clock,
        url: "/imports/pending",
      },
      {
        title: "Commandes délivrées",
        icon: CheckCircle,
        url: "/imports/confirmed",
      },
      {
        title: "Commandes annulées",
        icon: XCircle,
        url: "/imports/canceled",
      },
    ],
  },
  {
    title: "Gestion finances",
    url: "/finances",
    icon: Wallet,
  },
  {
    title: "Calendrier globale",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Paramètres magasin",
    url: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (collapsed) {
      setExpandedItem(null);
      return;
    }
    const activeParent = navigationItems.find((item) =>
      item.children?.some((child) => location.pathname === child.url),
    );
    if (activeParent) {
      setExpandedItem(activeParent.title);
    }
  }, [location.pathname, collapsed]);

  const handleToggle = (title: string) => {
    if (collapsed) return;
    setExpandedItem(expandedItem === title ? null : title);
  };

  return (
    // Added "flex flex-col" here
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-25" : "w-72",
      )}
    >
      {/* Logo - Added flex-shrink-0 to prevent it from shrinking */}
      <div className="flex h-20 flex-shrink-0 items-center justify-between border-b border-sidebar-border px-6">
        {!collapsed && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary overflow-hidden">
              <Package />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                SmartStock
              </h1>
              <p className="text-xs text-muted-foreground">
                Stock management solution
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary overflow-hidden">
            <img
              src={logo}
              alt="AutoRent Logo"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Navigation - Added flex-1 overflow-y-auto here to make it scrollable */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navigationItems.map((item, index) => {
          const isChildActive = item.children?.some(
            (child) => location.pathname === child.url,
          );
          const isActive = location.pathname === item.url || isChildActive;
          const isExpanded = expandedItem === item.title;

          return (
            <div key={item.title}>
              {item.children ? (
                <button
                  onClick={() => handleToggle(item.title)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-sidebar-foreground border border-transparent",
                    collapsed && "justify-center px-3",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-sidebar-foreground group-hover:text-primary",
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">
                        {item.title}
                      </span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                          isExpanded ? "rotate-90" : "rotate-0",
                        )}
                      />
                    </>
                  )}
                </button>
              ) : (
                <NavLink
                  to={item.url}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-sidebar-foreground border border-transparent",
                    collapsed && "justify-center px-3",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-sidebar-foreground group-hover:text-primary",
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                  )}
                </NavLink>
              )}

              {item.children && !collapsed && isExpanded && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-4">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.title}
                      to={child.url}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        location.pathname === child.url
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-sidebar-foreground/70 border border-transparent",
                      )}
                    >
                      <child.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{child.title}</span>
                      {location.pathname === child.url && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-muted-foreground shadow-lg transition-colors hover:bg-sidebar-accent hover:text-foreground"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Footer - Removed absolute positioning, added flex-shrink-0 and mt-auto to stick to bottom safely */}
      {!collapsed && (
        <div className="flex-shrink-0 border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <span className="text-sm font-medium text-foreground">TT</span>
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-foreground">Testing</p>
              <p className="text-xs text-muted-foreground">Testing</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
