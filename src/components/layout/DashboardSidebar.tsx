import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Clock,
  CheckCircle,
  XCircle,
  FolderOpen,
  LayoutDashboard,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  Truck,
  Users,
  UserPlus,
  Wallet,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navigationItems = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  {
    title: "Gestion des produits",
    icon: Package,
    children: [
      { title: "Liste des produits", icon: ShoppingBag, url: "/products" },
      { title: "Liste des catégories", icon: FolderOpen, url: "/categories" },
      { title: "Offres et Remises", icon: Percent, url: "/offers" },
    ],
  },
  {
    title: "Gestion des comptes",
    icon: Users,
    children: [
      { title: "Comptes clients", icon: UserPlus, url: "/clients" },
      { title: "Comptes livreurs", icon: Truck, url: "/livreurs" },
    ],
  },
  {
    title: "Commandes",
    icon: ShoppingBag,
    children: [
      { title: "Commandes en attente", icon: Clock, url: "/orders/pending" },
      {
        title: "Commandes délivrées",
        icon: CheckCircle,
        url: "/orders/confirmed",
      },
      { title: "Commandes annulées", icon: XCircle, url: "/orders/canceled" },
    ],
  },
  { title: "Calendrier globale", url: "/calendar", icon: Calendar },
  { title: "Notifications", url: "/notifications", icon: Bell },
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
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-72",
      )}
    >
      {/* Logo */}
      <div className="flex h-20 flex-shrink-0 items-center justify-between border-b border-sidebar-border px-6">
        {collapsed ? (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
        ) : (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">
              Marketplace
            </h1>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navigationItems.map((item) => {
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

      {/* User Footer */}
      {!collapsed && (
        <div className="flex-shrink-0 border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <CircleUser className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">Administrateur</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
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
    </aside>
  );
}
