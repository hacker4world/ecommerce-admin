import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import {
  ArrowLeft,
  BarChart3,
  Box,
  CalendarDays,
  CheckCircle,
  DollarSign,
  Eye,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Mock data ----------
const CLIENT_ANALYTICS = {
  clientName: "Ahmed Ben Salah",
  totalPurchases: 24,
  moneySpent: "4 520 TND",
  cartItemCount: 5,
  productViews: 187,
};

const CART_ITEMS = [
  {
    name: "Casque Audio Pro",
    price: "128 TND",
    dateAdded: "2026-07-05",
    status: "Dans le panier",
  },
  {
    name: "Écouteurs Bluetooth",
    price: "96 TND",
    dateAdded: "2026-07-03",
    status: "Dans le panier",
  },
  {
    name: "Enceinte Portable",
    price: "160 TND",
    dateAdded: "2026-07-01",
    status: "Dans le panier",
  },
];

const BOUGHT_PRODUCTS = [
  {
    name: "Casque Audio Pro",
    price: "128 TND",
    dateBought: "2026-06-30",
    status: "Livré",
  },
  {
    name: "Chargeur sans fil",
    price: "45 TND",
    dateBought: "2026-06-28",
    status: "Livré",
  },
  {
    name: "Câble USB-C",
    price: "25 TND",
    dateBought: "2026-06-25",
    status: "Livré",
  },
];

// Orders made by the client
const ORDERS = [
  { id: "CMD-001", date: "2026-06-30", total: "173 TND", status: "Livré" },
  { id: "CMD-002", date: "2026-06-28", total: "70 TND", status: "Livré" },
  { id: "CMD-003", date: "2026-06-25", total: "25 TND", status: "Annulé" },
  { id: "CMD-004", date: "2026-07-03", total: "96 TND", status: "En cours" },
];

// Products viewed by the client
const VIEWED_PRODUCTS = [
  {
    name: "Casque Audio Pro",
    category: "Audio",
    price: "128 TND",
    viewedAt: "2026-07-06",
  },
  {
    name: "Souris Gaming RGB",
    category: "Périphériques",
    price: "79 TND",
    viewedAt: "2026-07-05",
  },
  {
    name: "Clavier Mécanique",
    category: "Périphériques",
    price: "249 TND",
    viewedAt: "2026-07-04",
  },
  {
    name: "Écouteurs Bluetooth",
    category: "Audio",
    price: "96 TND",
    viewedAt: "2026-07-02",
  },
];

// Delivered / Canceled counts for the chart
const ORDER_STATUS_COUNTS = {
  delivered: 18,
  canceled: 3,
};

// ---------- Calendar Component (unchanged) ----------
type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type: "purchase";
};

const ClientCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 7));
  const mockEvents: CalendarEvent[] = useMemo(
    () => [
      {
        id: "1",
        title: "Achat Casque Audio Pro",
        date: new Date(2026, 5, 28),
        type: "purchase",
      },
      {
        id: "2",
        title: "Achat Chargeur sans fil",
        date: new Date(2026, 5, 28),
        type: "purchase",
      },
      {
        id: "3",
        title: "Achat Câble USB-C",
        date: new Date(2026, 5, 25),
        type: "purchase",
      },
      {
        id: "4",
        title: "Achat Enceinte Portable",
        date: new Date(2026, 6, 1),
        type: "purchase",
      },
      {
        id: "5",
        title: "Achat Écouteurs Bluetooth",
        date: new Date(2026, 6, 3),
        type: "purchase",
      },
      {
        id: "6",
        title: "Achat Casque Audio Pro",
        date: new Date(2026, 6, 5),
        type: "purchase",
      },
    ],
    [],
  );

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const calendarDays = useMemo(() => {
    const first = startOfMonth(currentDate);
    const last = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: first, end: last });
    const startDow = first.getDay();
    const padding = startDow === 0 ? 6 : startDow - 1;
    const padded = Array.from({ length: padding }).map((_, i) => {
      const d = new Date(first);
      d.setDate(d.getDate() - (padding - i));
      return { date: d, isCurrentMonth: false };
    });
    return [...padded, ...days.map((d) => ({ date: d, isCurrentMonth: true }))];
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    mockEvents.forEach((event) => {
      const key = format(event.date, "yyyy-MM-dd");
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [mockEvents]);

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          Historique des achats
        </h2>
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleToday}
            className="h-8 px-3 text-xs font-medium"
          >
            Aujourd'hui
          </Button>
          <span className="text-sm font-semibold capitalize px-2">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr bg-background">
          {calendarDays.map((dayObj, idx) => {
            const dateKey = format(dayObj.date, "yyyy-MM-dd");
            const dayEvents = eventsByDate[dateKey] || [];
            const isTodayDate = isToday(dayObj.date);
            return (
              <div
                key={idx}
                className={cn(
                  "group relative min-h-[70px] p-1.5 border-b border-r border-border/50 transition-colors hover:bg-muted/30 flex flex-col gap-0.5",
                  !dayObj.isCurrentMonth && "bg-muted/20 text-muted-foreground",
                  isTodayDate && "bg-blue-50/50 dark:bg-blue-950/10",
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium mb-1 ml-auto",
                    isTodayDate &&
                      "bg-primary text-primary-foreground shadow-sm",
                  )}
                >
                  {format(dayObj.date, "d")}
                </div>
                <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border bg-primary/10 text-primary border-primary/20 truncate w-full"
                    >
                      <ShoppingCart className="h-2.5 w-2.5 mr-1" />
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-muted-foreground font-medium pl-1">
                      +{dayEvents.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---------- Delivered vs Canceled Bar Chart ----------
const OrderStatusBarChart = () => {
  const width = 300;
  const height = 200;
  const pad = { top: 20, right: 20, bottom: 35, left: 35 };
  const maxVal = Math.max(
    ORDER_STATUS_COUNTS.delivered,
    ORDER_STATUS_COUNTS.canceled,
  );
  const barWidth = 50;
  const gap = 30;

  const bars = [
    {
      label: "Livré",
      value: ORDER_STATUS_COUNTS.delivered,
      color: "fill-emerald-500",
    },
    {
      label: "Annulé",
      value: ORDER_STATUS_COUNTS.canceled,
      color: "fill-red-500",
    },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {[0, 0.5, 1].map((ratio) => {
        const y = pad.top + (1 - ratio) * (height - pad.top - pad.bottom);
        return (
          <g key={ratio}>
            <line
              x1={pad.left}
              y1={y}
              x2={width - pad.right}
              y2={y}
              stroke="currentColor"
              className="text-muted-foreground/20"
              strokeWidth="1"
            />
            <text
              x={pad.left - 8}
              y={y + 3}
              textAnchor="end"
              className="text-[9px] fill-muted-foreground"
            >
              {Math.round(maxVal * ratio)}
            </text>
          </g>
        );
      })}
      {bars.map((bar, i) => {
        const barHeight =
          (bar.value / maxVal) * (height - pad.top - pad.bottom);
        const x = pad.left + i * (barWidth + gap) + gap / 2;
        const y = height - pad.bottom - barHeight;
        return (
          <g key={bar.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              className={bar.color}
              rx="4"
            />
            <text
              x={x + barWidth / 2}
              y={y - 6}
              textAnchor="middle"
              className="text-[9px] fill-foreground font-medium"
            >
              {bar.value}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - pad.bottom + 14}
              textAnchor="middle"
              className="text-[9px] fill-muted-foreground"
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ---------- Page Component ----------
export function ClientAnalytics() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Header with back button */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {CLIENT_ANALYTICS.clientName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Client
              actif • Depuis janvier 2026
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              +3 ce mois
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total achats
            </p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {CLIENT_ANALYTICS.totalPurchases}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Commandes effectuées</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              +12%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Argent dépensé
            </p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {CLIENT_ANALYTICS.moneySpent}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Depuis l'inscription</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Box className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
              En attente
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Articles au panier
            </p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {CLIENT_ANALYTICS.cartItemCount}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Non encore achetés</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Eye className="h-5 w-5 text-violet-500" />
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              +24%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Produits consultés
            </p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {CLIENT_ANALYTICS.productViews}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Pages produits vues</p>
        </div>
      </div>

      {/* Cart Items & Bought Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cart Items */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" /> Articles
            dans le panier
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                    Produit
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Prix
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Ajouté le
                  </th>
                </tr>
              </thead>
              <tbody>
                {CART_ITEMS.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/30 hover:bg-muted/20"
                  >
                    <td className="py-2.5 px-2 font-medium text-foreground">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-2 text-right">{item.price}</td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">
                      {item.dateAdded}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bought Products */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-muted-foreground" /> Produits
            achetés
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                    Produit
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Prix
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Acheté le
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {BOUGHT_PRODUCTS.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/30 hover:bg-muted/20"
                  >
                    <td className="py-2.5 px-2 font-medium text-foreground">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-2 text-right">{item.price}</td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">
                      {item.dateBought}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Orders Table & Viewed Products Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Table */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-muted-foreground" /> Commandes
            passées
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                    Commande
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border/30 hover:bg-muted/20"
                  >
                    <td className="py-2.5 px-2 font-medium text-foreground">
                      {order.id}
                    </td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">
                      {order.date}
                    </td>
                    <td className="py-2.5 px-2 text-right">{order.total}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "Livré"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : order.status === "En cours"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            order.status === "Livré"
                              ? "bg-emerald-500"
                              : order.status === "En cours"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Viewed Products Table */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-muted-foreground" /> Produits consultés
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                    Produit
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                    Catégorie
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Prix
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Consulté le
                  </th>
                </tr>
              </thead>
              <tbody>
                {VIEWED_PRODUCTS.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/30 hover:bg-muted/20"
                  >
                    <td className="py-2.5 px-2 font-medium text-foreground">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-2 text-right">{item.price}</td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">
                      {item.viewedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delivered vs Canceled Bar Chart */}
      <div className="mb-8">
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-muted-foreground" /> Commandes
            livrées vs annulées
          </h2>
          <OrderStatusBarChart />
          <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Livrées : {ORDER_STATUS_COUNTS.delivered}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              Annulées : {ORDER_STATUS_COUNTS.canceled}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <ClientCalendar />
    </DashboardLayout>
  );
}
