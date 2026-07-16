import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  Clock,
  Megaphone,
  Package,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

// ---------- Notification types ----------
type NotificationType =
  | "new_delivery"
  | "stock_alert"
  | "sale_start"
  | "sale_end";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  date: string;
  isRead: boolean;
}

// ---------- Mock data ----------
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "new_delivery",
    message: "Nouvelle livraison CMD-105 assignée à Ali Gharbi",
    date: "2026-07-07 09:15",
    isRead: false,
  },
  {
    id: "2",
    type: "stock_alert",
    message: "Stock faible : Casque Audio Pro (8 unités restantes)",
    date: "2026-07-07 08:30",
    isRead: false,
  },
  {
    id: "3",
    type: "sale_start",
    message: "Début des soldes d'été – 20% sur les casques",
    date: "2026-07-01 00:00",
    isRead: true,
  },
  {
    id: "4",
    type: "sale_end",
    message: "Fin de la promo accessoires 10% dans 24h",
    date: "2026-07-06 12:00",
    isRead: false,
  },
  {
    id: "5",
    type: "new_delivery",
    message: "Livraison CMD-102 effectuée par Leila Trabelsi",
    date: "2026-07-06 14:20",
    isRead: true,
  },
  {
    id: "6",
    type: "stock_alert",
    message: "Rupture de stock : Écouteurs Bluetooth",
    date: "2026-07-05 16:45",
    isRead: true,
  },
];

// ---------- Tabs ----------
type TabKey = "all" | NotificationType;
const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "Toutes", icon: Bell },
  { key: "new_delivery", label: "Nouvelles livraisons", icon: Truck },
  { key: "stock_alert", label: "Alertes stock", icon: Package },
  { key: "sale_start", label: "Début de soldes", icon: Megaphone },
  { key: "sale_end", label: "Fin de soldes", icon: Clock },
];

const typeLabels: Record<NotificationType, string> = {
  new_delivery: "Livraison",
  stock_alert: "Stock",
  sale_start: "Début soldes",
  sale_end: "Fin soldes",
};

export function Notifications() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Filter by active tab
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  // Counts for each tab
  const counts = useMemo(() => {
    const all = notifications.length;
    const new_delivery = notifications.filter(
      (n) => n.type === "new_delivery",
    ).length;
    const stock_alert = notifications.filter(
      (n) => n.type === "stock_alert",
    ).length;
    const sale_start = notifications.filter(
      (n) => n.type === "sale_start",
    ).length;
    const sale_end = notifications.filter((n) => n.type === "sale_end").length;
    const unreadAll = notifications.filter((n) => !n.isRead).length;
    const unreadDelivery = notifications.filter(
      (n) => n.type === "new_delivery" && !n.isRead,
    ).length;
    const unreadStock = notifications.filter(
      (n) => n.type === "stock_alert" && !n.isRead,
    ).length;
    const unreadSaleStart = notifications.filter(
      (n) => n.type === "sale_start" && !n.isRead,
    ).length;
    const unreadSaleEnd = notifications.filter(
      (n) => n.type === "sale_end" && !n.isRead,
    ).length;
    return {
      all,
      new_delivery,
      stock_alert,
      sale_start,
      sale_end,
      unreadAll,
      unreadDelivery,
      unreadStock,
      unreadSaleStart,
      unreadSaleEnd,
    };
  }, [notifications]);

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Mark single as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Restez informé des livraisons, stocks et événements
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={markAllAsRead}>
          <CheckCheck className="h-4 w-4" />
          Tout marquer comme lu
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-border">
        <nav className="-mb-px flex gap-6 flex-wrap">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const count = counts[tab.key === "all" ? "all" : tab.key];
            const unread =
              tab.key === "all"
                ? counts.unreadAll
                : tab.key === "new_delivery"
                  ? counts.unreadDelivery
                  : tab.key === "stock_alert"
                    ? counts.unreadStock
                    : tab.key === "sale_start"
                      ? counts.unreadSaleStart
                      : counts.unreadSaleEnd;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative px-1 py-4 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1 rounded-full text-xs font-bold",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/20 text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                )}
                {unread > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive" />
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Notifications Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground w-20">
                Statut
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                Message
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                Type
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                Date
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground"
                >
                  Aucune notification.
                </td>
              </tr>
            ) : (
              filteredNotifications.map((notif) => (
                <tr
                  key={notif.id}
                  className={cn(
                    "border-b border-border/30 transition-colors",
                    !notif.isRead
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-muted/20",
                  )}
                >
                  <td className="py-3 px-6 whitespace-nowrap">
                    {!notif.isRead ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-destructive" />
                        <span className="text-xs font-medium text-destructive">
                          Non lu
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Lu</span>
                    )}
                  </td>
                  <td className="py-3 px-6 font-medium text-foreground">
                    {notif.message}
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted-foreground/10 text-muted-foreground">
                      {typeLabels[notif.type]}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-muted-foreground">
                    {notif.date}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!notif.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notif.id)}
                          className="h-8 text-xs"
                        >
                          <CheckCheck className="h-3.5 w-3.5 mr-1" />
                          Lu
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteNotification(notif.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
