import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  Save,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Mock data ----------
const WORKER_ANALYTICS = {
  workerName: "Ali Gharbi",
  firstName: "Ali",
  lastName: "Gharbi",
  phone: "+216 20 111 222",
  totalDeliveries: 148,
  currentAssigned: 7,
  canceledDeliveries: 12,
};

const COMPLETED_DELIVERIES = [
  {
    id: "CMD-101",
    customer: "Ahmed Ben Salah",
    date: "2026-07-06",
    status: "Livré",
  },
  {
    id: "CMD-102",
    customer: "Sarra Mansour",
    date: "2026-07-04",
    status: "Livré",
  },
  {
    id: "CMD-103",
    customer: "Mohamed Ali",
    date: "2026-07-03",
    status: "Livré",
  },
  {
    id: "CMD-104",
    customer: "Leila Trabelsi",
    date: "2026-07-02",
    status: "Livré",
  },
];

const ASSIGNED_DELIVERIES = [
  {
    id: "CMD-105",
    customer: "Fatima Zahra",
    date: "2026-07-07",
    status: "En cours",
  },
  {
    id: "CMD-106",
    customer: "Omar Cherif",
    date: "2026-07-07",
    status: "En cours",
  },
];

const CANCELED_DELIVERIES = [
  {
    id: "CMD-107",
    customer: "Youssef Gharbi",
    date: "2026-07-05",
    status: "Annulé",
  },
  {
    id: "CMD-108",
    customer: "Nadia Ben Ali",
    date: "2026-07-01",
    status: "Annulé",
  },
];

const DELIVERY_STATUS_COUNTS = {
  completed: 148,
  canceled: 12,
};

// ---------- Calendar Component ----------
type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type: "delivery";
};

const WorkerCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 7));
  const mockEvents: CalendarEvent[] = useMemo(
    () => [
      {
        id: "1",
        title: "Livraison CMD-101",
        date: new Date(2026, 6, 6),
        type: "delivery",
      },
      {
        id: "2",
        title: "Livraison CMD-102",
        date: new Date(2026, 6, 4),
        type: "delivery",
      },
      {
        id: "3",
        title: "Livraison CMD-103",
        date: new Date(2026, 6, 3),
        type: "delivery",
      },
      {
        id: "4",
        title: "Livraison CMD-104",
        date: new Date(2026, 6, 2),
        type: "delivery",
      },
      {
        id: "5",
        title: "Livraison CMD-105",
        date: new Date(2026, 6, 7),
        type: "delivery",
      },
      {
        id: "6",
        title: "Livraison CMD-106",
        date: new Date(2026, 6, 7),
        type: "delivery",
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
          Calendrier des livraisons
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
                      <Truck className="h-2.5 w-2.5 mr-1" />
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

// ---------- Bar Chart ----------
const DeliveryStatusBarChart = () => {
  const width = 260;
  const height = 180;
  const pad = { top: 18, right: 18, bottom: 32, left: 32 };
  const maxVal = Math.max(
    DELIVERY_STATUS_COUNTS.completed,
    DELIVERY_STATUS_COUNTS.canceled,
  );
  const barWidth = 42;
  const gap = 28;

  const bars = [
    {
      label: "Livré",
      value: DELIVERY_STATUS_COUNTS.completed,
      color: "fill-emerald-500",
    },
    {
      label: "Annulé",
      value: DELIVERY_STATUS_COUNTS.canceled,
      color: "fill-red-500",
    },
  ];

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-56 h-auto">
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
                x={pad.left - 6}
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
                y={height - pad.bottom + 13}
                textAnchor="middle"
                className="text-[9px] fill-muted-foreground"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ---------- Page Component ----------
export function WorkerAnalytics() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"analytics" | "details">(
    "analytics",
  );

  // Details form state
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(WORKER_ANALYTICS.firstName);
  const [lastName, setLastName] = useState(WORKER_ANALYTICS.lastName);
  const [phone, setPhone] = useState(WORKER_ANALYTICS.phone);

  return (
    <DashboardLayout>
      {/* Header */}
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
              {WORKER_ANALYTICS.workerName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Livreur
              actif • Depuis mars 2026
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-border">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "analytics"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analyses
            </span>
            {activeTab === "analytics" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "details"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Détails
            </span>
            {activeTab === "details" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* ========== Analytics Tab ========== */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +12 ce mois
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total livraisons
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {WORKER_ANALYTICS.totalDeliveries}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Depuis le début</p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  En cours
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Livraisons assignées
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {WORKER_ANALYTICS.currentAssigned}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                À livrer aujourd'hui
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                  -3% ce mois
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Livraisons annulées
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {WORKER_ANALYTICS.canceledDeliveries}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Par le client ou le système
              </p>
            </div>
          </div>

          {/* Delivery Tables: Completed & Assigned side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />{" "}
                Livraisons complétées
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
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPLETED_DELIVERIES.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-border/30 hover:bg-muted/20"
                      >
                        <td className="py-2.5 px-2 font-medium text-foreground">
                          {item.id}
                        </td>
                        <td className="py-2.5 px-2">{item.customer}</td>
                        <td className="py-2.5 px-2 text-right text-muted-foreground">
                          {item.date}
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

            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-muted-foreground" /> Livraisons
                en cours
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
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ASSIGNED_DELIVERIES.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-border/30 hover:bg-muted/20"
                      >
                        <td className="py-2.5 px-2 font-medium text-foreground">
                          {item.id}
                        </td>
                        <td className="py-2.5 px-2">{item.customer}</td>
                        <td className="py-2.5 px-2 text-right text-muted-foreground">
                          {item.date}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
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

          {/* Canceled Deliveries (full width) */}
          <div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-muted-foreground" /> Livraisons
                annulées
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
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CANCELED_DELIVERIES.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-border/30 hover:bg-muted/20"
                      >
                        <td className="py-2.5 px-2 font-medium text-foreground">
                          {item.id}
                        </td>
                        <td className="py-2.5 px-2">{item.customer}</td>
                        <td className="py-2.5 px-2 text-right text-muted-foreground">
                          {item.date}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
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

          {/* Bar Chart */}
          <div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />{" "}
                Livraisons complétées vs annulées
              </h2>
              <DeliveryStatusBarChart />
              <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  Complétées : {DELIVERY_STATUS_COUNTS.completed}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  Annulées : {DELIVERY_STATUS_COUNTS.canceled}
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <WorkerCalendar />
        </div>
      )}

      {/* ========== Details Tab ========== */}
      {activeTab === "details" && (
        <div className="space-y-8">
          <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Mode modification
                </p>
                <p className="text-xs text-muted-foreground">
                  {isEditing
                    ? "Vous pouvez modifier les informations"
                    : "Informations en lecture seule"}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isEditing}
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                isEditing ? "bg-primary" : "bg-muted-foreground/30",
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                  isEditing ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>

          <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
            <form className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-muted-foreground" /> Nom *
                </label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nom"
                  className="h-11"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-muted-foreground" /> Prénom *
                </label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Prénom"
                  className="h-11"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-muted-foreground" /> Téléphone
                  *
                </label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+216 XX XXX XXX"
                  className="h-11"
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="h-11 px-6 rounded-xl"
                >
                  Annuler
                </Button>
                {isEditing && (
                  <Button className="h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    <Save className="h-4 w-4" />
                    Enregistrer les modifications
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
