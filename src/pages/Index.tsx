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
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

// ---------- Mock data ----------
const MOCK_SUMMARY = {
  recentDeliveries: 12,
  recentMoney: "3 450 TND",
  totalProducts: 45,
};

const RECENT_DELIVERIES = [
  {
    id: "CMD-105",
    customer: "Ahmed Ben Salah",
    date: "2026-07-07",
    status: "En cours",
    amount: "320 TND",
  },
  {
    id: "CMD-106",
    customer: "Sarra Mansour",
    date: "2026-07-07",
    status: "En cours",
    amount: "145 TND",
  },
  {
    id: "CMD-104",
    customer: "Fatima Zahra",
    date: "2026-07-06",
    status: "Livré",
    amount: "210 TND",
  },
  {
    id: "CMD-103",
    customer: "Mohamed Ali",
    date: "2026-07-05",
    status: "Livré",
    amount: "89 TND",
  },
];

const UPCOMING_SALES = [
  {
    name: "Soldes d'été – 20% sur les casques",
    discount: "-20%",
    start: "2026-07-01",
    end: "2026-07-31",
  },
  {
    name: "Promo accessoires 10%",
    discount: "-10%",
    start: "2026-08-01",
    end: "2026-08-31",
  },
];

// Daily deliveries (last 7 days)
const DELIVERY_TREND = {
  days: ["01/07", "02/07", "03/07", "04/07", "05/07", "06/07", "07/07"],
  counts: [8, 12, 10, 15, 11, 9, 14],
};

// Today's events
const TODAY_EVENTS = [
  { id: "e1", title: "Livraison CMD-105", time: "09:00", type: "delivery" },
  { id: "e2", title: "Livraison CMD-106", time: "11:00", type: "delivery" },
  { id: "e3", title: "Fin promo accessoires", time: "23:59", type: "sale_end" },
];

// ---------- Line Chart Component ----------
const DeliveriesLineChart = ({
  data,
  days,
}: {
  data: number[];
  days: string[];
}) => {
  const width = 500,
    height = 200;
  const pad = { top: 20, right: 20, bottom: 30, left: 35 };
  const max = Math.max(...data);
  const points = data.map((d, i) => {
    const x =
      pad.left + (i / (data.length - 1)) * (width - pad.left - pad.right);
    const y = height - pad.bottom - (d / max) * (height - pad.top - pad.bottom);
    return { x, y, day: days[i], value: d };
  });
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = height - pad.bottom - ratio * (height - pad.top - pad.bottom);
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
              {Math.round(max * ratio)}
            </text>
          </g>
        );
      })}
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r="3"
            className="fill-primary stroke-background"
            strokeWidth="1.5"
          />
          <text
            x={p.x}
            y={height - 5}
            textAnchor="middle"
            className="text-[9px] fill-muted-foreground"
          >
            {p.day}
          </text>
          {i % 2 === 0 && (
            <text
              x={p.x}
              y={p.y - 8}
              textAnchor="middle"
              className="text-[9px] fill-foreground font-medium"
            >
              {p.value}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

// ---------- Small Calendar Component (similar to previous product calendar) ----------
const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 7)); // July 2026
  const todayEvents = TODAY_EVENTS; // we can show events for the selected date? For simplicity, just highlight today.

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

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

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          Aujourd'hui
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium capitalize">
            {format(currentDate, "MMM yyyy")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Mini calendar grid */}
      <div className="overflow-hidden rounded-lg border border-border/50">
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-1 text-center text-[10px] font-semibold text-muted-foreground uppercase"
            >
              {day.charAt(0)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-background">
          {calendarDays.map((dayObj, idx) => {
            const isTodayDate = isToday(dayObj.date);
            return (
              <div
                key={idx}
                className={cn(
                  "relative flex h-8 w-full items-center justify-center text-xs border-b border-r border-border/30",
                  !dayObj.isCurrentMonth &&
                    "bg-muted/10 text-muted-foreground/50",
                  isTodayDate && "bg-primary/10 font-bold text-primary",
                )}
              >
                {format(dayObj.date, "d")}
                {isTodayDate && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Today's events list */}
      <div className="mt-4 space-y-2">
        {todayEvents.length > 0 ? (
          todayEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">{event.time}</span>
              <span className="font-medium">{event.title}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">
            Aucun événement aujourd'hui
          </p>
        )}
      </div>
    </div>
  );
};

// ---------- Dashboard Page ----------
export function Index() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Tableau de bord
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bienvenue ! Voici un aperçu de votre activité récente.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Livraisons récentes</p>
            <p className="text-3xl font-bold text-foreground">
              {MOCK_SUMMARY.recentDeliveries}
            </p>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10">
            <DollarSign className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Argent gagné</p>
            <p className="text-3xl font-bold text-foreground">
              {MOCK_SUMMARY.recentMoney}
            </p>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10">
            <Package className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Produits ajoutés</p>
            <p className="text-3xl font-bold text-foreground">
              {MOCK_SUMMARY.totalProducts}
            </p>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </div>
        </div>
      </div>

      {/* Recent Deliveries and Upcoming Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Deliveries Table */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-muted-foreground" /> Livraisons
            récentes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                    Commande
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                    Client
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Statut
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_DELIVERIES.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="border-b border-border/30 hover:bg-muted/20"
                  >
                    <td className="py-2.5 px-2 font-medium text-foreground">
                      {delivery.id}
                    </td>
                    <td className="py-2.5 px-2">{delivery.customer}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">
                      {delivery.date}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          delivery.status === "Livré"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : delivery.status === "En cours"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            delivery.status === "Livré"
                              ? "bg-emerald-500"
                              : delivery.status === "En cours"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                        {delivery.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium">
                      {delivery.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Sales Table */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" /> Ventes à
            venir
          </h2>
          {UPCOMING_SALES.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                      Offre
                    </th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                      Réduction
                    </th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                      Début
                    </th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                      Fin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {UPCOMING_SALES.map((sale, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-border/30 hover:bg-muted/20"
                    >
                      <td className="py-2.5 px-2 font-medium text-foreground">
                        {sale.name}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {sale.discount}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right text-muted-foreground">
                        {sale.start}
                      </td>
                      <td className="py-2.5 px-2 text-right text-muted-foreground">
                        {sale.end}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Aucune vente à venir.
            </p>
          )}
        </div>
      </div>

      {/* Deliveries Trend Chart and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-muted-foreground" /> Évolution
            des livraisons (7 jours)
          </h2>
          <DeliveriesLineChart
            data={DELIVERY_TREND.counts}
            days={DELIVERY_TREND.days}
          />
        </div>
        <div>
          <MiniCalendar />
        </div>
      </div>
    </DashboardLayout>
  );
}
