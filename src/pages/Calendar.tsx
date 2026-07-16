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
  Clock,
  LogIn,
  LogOut,
  MapPin,
  Package,
  RotateCcw,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

// ---------- Types & Mock Data ----------
type EventType = "delivery" | "return" | "stock_in" | "stock_out" | "event";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
}

const MOCK_EVENTS: CalendarEvent[] = [
  // Deliveries
  {
    id: "d1",
    title: "Livraison CMD-101",
    date: new Date(2026, 6, 2),
    type: "delivery",
  },
  {
    id: "d2",
    title: "Livraison CMD-102",
    date: new Date(2026, 6, 5),
    type: "delivery",
  },
  {
    id: "d3",
    title: "Livraison CMD-103",
    date: new Date(2026, 6, 10),
    type: "delivery",
  },
  {
    id: "d4",
    title: "Livraison CMD-104",
    date: new Date(2026, 6, 15),
    type: "delivery",
  },
  // Returns
  {
    id: "r1",
    title: "Retour CMD-101",
    date: new Date(2026, 6, 7),
    type: "return",
  },
  {
    id: "r2",
    title: "Retour CMD-103",
    date: new Date(2026, 6, 12),
    type: "return",
  },
  // Stock changes
  {
    id: "s1",
    title: "Entrée stock #451",
    date: new Date(2026, 6, 3),
    type: "stock_in",
  },
  {
    id: "s2",
    title: "Sortie stock #89",
    date: new Date(2026, 6, 8),
    type: "stock_out",
  },
  {
    id: "s3",
    title: "Entrée stock #452",
    date: new Date(2026, 6, 18),
    type: "stock_in",
  },
  // Custom events
  {
    id: "e1",
    title: "Inventaire mensuel",
    date: new Date(2026, 6, 20),
    type: "event",
  },
];

// ---------- Event Badge Component ----------
const EventBadge = ({ type, title }: { type: EventType; title: string }) => {
  const styles: Record<EventType, string> = {
    delivery:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    return:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    stock_in:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    stock_out:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    event:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  };

  const icons: Record<EventType, JSX.Element> = {
    delivery: <Truck className="h-2.5 w-2.5 mr-1" />,
    return: <RotateCcw className="h-2.5 w-2.5 mr-1" />,
    stock_in: <LogIn className="h-2.5 w-2.5 mr-1" />,
    stock_out: <LogOut className="h-2.5 w-2.5 mr-1" />,
    event: <CalendarDays className="h-2.5 w-2.5 mr-1" />,
  };

  return (
    <div
      className={cn(
        "flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border truncate w-full mb-1",
        styles[type],
      )}
    >
      {icons[type]}
      {title}
    </div>
  );
};

// ---------- Global Calendar Component ----------
export function GlobalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 7)); // July 2026

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Generate calendar days (padding + month)
  const calendarDays = useMemo(() => {
    const firstDay = startOfMonth(currentDate);
    const lastDay = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    const startDow = firstDay.getDay();
    const paddingDays = startDow === 0 ? 6 : startDow - 1;

    const paddedDays = Array.from({ length: paddingDays }).map((_, i) => {
      const d = new Date(firstDay);
      d.setDate(d.getDate() - (paddingDays - i));
      return { date: d, isCurrentMonth: false };
    });

    const monthDays = daysInMonth.map((d) => ({
      date: d,
      isCurrentMonth: true,
    }));

    return [...paddedDays, ...monthDays];
  }, [currentDate]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    MOCK_EVENTS.forEach((event) => {
      const key = format(event.date, "yyyy-MM-dd");
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, []);

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Calendrier global
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble des livraisons, retours, mouvements de stock et
            événements
          </p>
        </div>

        <div className="flex items-center gap-2">
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
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-6 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Livraison</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span>Retour</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Entrée stock</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Sortie stock</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>Événement</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-background">
          {calendarDays.map((dayObj, idx) => {
            const dateKey = format(dayObj.date, "yyyy-MM-dd");
            const dayEvents = eventsByDate[dateKey] || [];
            const isTodayDate = isToday(dayObj.date);

            return (
              <div
                key={idx}
                className={cn(
                  "group relative min-h-[120px] p-2 border-b border-r border-border/50 transition-colors hover:bg-muted/30 flex flex-col gap-1",
                  !dayObj.isCurrentMonth && "bg-muted/20 text-muted-foreground",
                  isTodayDate && "bg-blue-50/50 dark:bg-blue-950/10",
                )}
              >
                {/* Date Number */}
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium mb-1 ml-auto",
                    isTodayDate &&
                      "bg-primary text-primary-foreground shadow-sm",
                  )}
                >
                  {format(dayObj.date, "d")}
                </div>

                {/* Events List */}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventBadge
                      key={event.id}
                      type={event.type}
                      title={event.title}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-muted-foreground font-medium pl-1">
                      +{dayEvents.length - 3} plus
                    </div>
                  )}
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 ring-2 ring-primary/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-lg" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state if no events in month (optional) */}
      {MOCK_EVENTS.filter(
        (e) => format(e.date, "yyyy-MM") === format(currentDate, "yyyy-MM"),
      ).length === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Aucun événement pour ce mois.
        </p>
      )}
    </DashboardLayout>
  );
}
