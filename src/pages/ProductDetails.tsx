import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  CalendarPlus,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  Clock,
  DollarSign,
  Eye,
  FileText,
  ImagePlus,
  Layers,
  LogIn,
  LogOut,
  MapPin,
  Package,
  Palette,
  Plus,
  PlusCircle,
  Save,
  ShoppingCart,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  Undo2,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ---------- Correction des icônes Leaflet ----------
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ---------- Types ----------
type EventType = "import" | "export" | "request" | "retour" | "event";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
}

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  status: "Livré" | "En cours" | "Annulé";
  amount: string;
}

interface RegionSale {
  id: number;
  name: string;
  lat: number;
  lng: number;
  sales: number;
}

// ---------- Données mockées ----------
const MOCK_ANALYTICS = {
  totalSales: 342,
  totalRevenue: "12,450 TND",
  inCart: 28,
  trend: "+12% ce mois",
  returnRate: 5.8,
  returnTrend: "-2.1%",
};

const MOCK_DELIVERIES: Delivery[] = [
  {
    id: "1",
    orderId: "CMD-001",
    customer: "Ahmed Ben Salah",
    date: "2026-07-01",
    status: "Livré",
    amount: "320 TND",
  },
  {
    id: "2",
    orderId: "CMD-002",
    customer: "Sarra Mansour",
    date: "2026-07-03",
    status: "En cours",
    amount: "145 TND",
  },
  {
    id: "3",
    orderId: "CMD-003",
    customer: "Mohamed Ali",
    date: "2026-07-05",
    status: "Livré",
    amount: "89 TND",
  },
  {
    id: "4",
    orderId: "CMD-004",
    customer: "Leila Trabelsi",
    date: "2026-07-06",
    status: "Annulé",
    amount: "210 TND",
  },
  {
    id: "5",
    orderId: "CMD-005",
    customer: "Youssef Gharbi",
    date: "2026-07-07",
    status: "En cours",
    amount: "560 TND",
  },
];

const SALES_DATA = [
  { day: "01/07", sales: 45 },
  { day: "02/07", sales: 52 },
  { day: "03/07", sales: 38 },
  { day: "04/07", sales: 61 },
  { day: "05/07", sales: 48 },
  { day: "06/07", sales: 55 },
  { day: "07/07", sales: 43 },
];

const STOCK_HISTORY = [
  { day: "01/07", stock: 85 },
  { day: "02/07", stock: 78 },
  { day: "03/07", stock: 82 },
  { day: "04/07", stock: 70 },
  { day: "05/07", stock: 65 },
  { day: "06/07", stock: 60 },
  { day: "07/07", stock: 55 },
];

const VARIANT_SALES = [
  { name: "Noir", quantity: 124, revenue: "4 216 TND" },
  { name: "Blanc", quantity: 98, revenue: "3 332 TND" },
  { name: "Bleu", quantity: 120, revenue: "4 080 TND" },
];

const REGION_SALES: RegionSale[] = [
  { id: 1, name: "Tunis", lat: 36.8065, lng: 10.1815, sales: 112 },
  { id: 2, name: "Sfax", lat: 34.7456, lng: 10.7613, sales: 67 },
  { id: 3, name: "Sousse", lat: 35.8252, lng: 10.6346, sales: 53 },
  { id: 4, name: "Nabeul", lat: 36.4563, lng: 10.7379, sales: 42 },
  { id: 5, name: "Bizerte", lat: 37.2744, lng: 9.8739, sales: 38 },
  { id: 6, name: "Kairouan", lat: 35.6712, lng: 10.0915, sales: 30 },
];

const ORDER_STATUS = {
  delivered: 280,
  canceled: 42,
  refunded: 20,
};

const CATEGORY_OPTIONS = [
  { label: "Électronique", value: "electronics" },
  { label: "Audio", value: "audio" },
  { label: "Accessoires", value: "accessories" },
  { label: "Bluetooth", value: "bluetooth" },
  { label: "Casques", value: "headphones" },
];

// ---------- Composants graphiques ----------
const EventBadge = ({ type, title }: { type: EventType; title: string }) => {
  const styles = {
    import:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    export:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    request:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    retour:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    event:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  };
  const icons = {
    import: <LogIn className="h-2.5 w-2.5 mr-1" />,
    export: <LogOut className="h-2.5 w-2.5 mr-1" />,
    request: <Clock className="h-2.5 w-2.5 mr-1" />,
    retour: <MapPin className="h-2.5 w-2.5 mr-1" />,
    event: <CalendarPlus className="h-2.5 w-2.5 mr-1" />,
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

const SalesLineChart = () => {
  const width = 500,
    height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const maxSales = Math.max(...SALES_DATA.map((d) => d.sales));
  const points = SALES_DATA.map((d, i) => {
    const x =
      padding.left +
      (i / (SALES_DATA.length - 1)) * (width - padding.left - padding.right);
    const y =
      height -
      padding.bottom -
      (d.sales / maxSales) * (height - padding.top - padding.bottom);
    return { x, y, ...d };
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
        const y =
          height -
          padding.bottom -
          ratio * (height - padding.top - padding.bottom);
        return (
          <g key={ratio}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="currentColor"
              className="text-muted-foreground/20"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={y + 3}
              textAnchor="end"
              className="text-[9px] fill-muted-foreground"
            >
              {Math.round(maxSales * ratio)}
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
              {p.sales}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

const StockLineChart = () => {
  const width = 500,
    height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const stocks = STOCK_HISTORY.map((d) => d.stock);
  const minStock = Math.min(...stocks),
    maxStock = Math.max(...stocks),
    range = maxStock - minStock || 1;
  const paddingFactor = 0.2;
  const yMin = minStock - range * paddingFactor,
    yMax = maxStock + range * paddingFactor,
    yRange = yMax - yMin || 1;
  const points = STOCK_HISTORY.map((d, i) => {
    const x =
      padding.left +
      (i / (STOCK_HISTORY.length - 1)) * (width - padding.left - padding.right);
    const y =
      height -
      padding.bottom -
      ((d.stock - yMin) / yRange) * (height - padding.top - padding.bottom);
    return { x, y, ...d };
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
      <line
        x1={padding.left}
        y1={height - padding.bottom}
        x2={width - padding.right}
        y2={height - padding.bottom}
        stroke="currentColor"
        className="text-muted-foreground/30"
        strokeWidth="1"
      />
      <text
        x={padding.left - 5}
        y={padding.top + 4}
        textAnchor="end"
        className="text-[9px] fill-muted-foreground"
      >
        {Math.round(yMax)}
      </text>
      <text
        x={padding.left - 5}
        y={height - padding.bottom + 3}
        textAnchor="end"
        className="text-[9px] fill-muted-foreground"
      >
        {Math.round(yMin)}
      </text>
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        className="text-blue-500"
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
            className="fill-blue-500 stroke-background"
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
              {p.stock}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

const OrderStatusBarChart = () => {
  const width = 300,
    height = 200;
  const padding = { top: 20, right: 20, bottom: 35, left: 35 };
  const maxVal = Math.max(
    ORDER_STATUS.delivered,
    ORDER_STATUS.canceled,
    ORDER_STATUS.refunded,
  );
  const barWidth = 40,
    gap = 30;
  const bars = [
    {
      label: "Livré",
      value: ORDER_STATUS.delivered,
      color: "fill-emerald-500",
    },
    { label: "Annulé", value: ORDER_STATUS.canceled, color: "fill-red-500" },
    { label: "Remb.", value: ORDER_STATUS.refunded, color: "fill-amber-500" },
  ];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {[0, 0.5, 1].map((ratio) => {
        const y =
          padding.top + (1 - ratio) * (height - padding.top - padding.bottom);
        return (
          <g key={ratio}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="currentColor"
              className="text-muted-foreground/20"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
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
          (bar.value / maxVal) * (height - padding.top - padding.bottom);
        const x = padding.left + i * (barWidth + gap) + gap / 2;
        const y = height - padding.bottom - barHeight;
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
              y={height - padding.bottom + 14}
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

const RegionSalesMap = ({
  regions = REGION_SALES,
}: {
  regions?: RegionSale[];
}) => {
  const center: [number, number] = [35.0, 10.0];
  const zoom = 7;
  return (
    <div className="h-[380px] md:h-[460px] w-full rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {regions.map((region) => (
          <Marker key={region.id} position={[region.lat, region.lng]}>
            <Popup>
              <div className="text-sm">
                <strong>{region.name}</strong>
                <br />
                Ventes: <span className="font-bold">{region.sales}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

function ProductCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 7));
  const mockEvents: CalendarEvent[] = useMemo(
    () => [
      {
        id: "1",
        title: "Entrée #451",
        date: new Date(2026, 6, 2),
        type: "import",
      },
      {
        id: "2",
        title: "Sortie #89",
        date: new Date(2026, 6, 5),
        type: "export",
      },
      {
        id: "3",
        title: "Demande #12",
        date: new Date(2026, 6, 10),
        type: "request",
      },
      {
        id: "4",
        title: "Retour #3",
        date: new Date(2026, 6, 15),
        type: "retour",
      },
      {
        id: "5",
        title: "Inventaire",
        date: new Date(2026, 6, 20),
        type: "event",
      },
      {
        id: "6",
        title: "Sortie #90",
        date: new Date(2026, 5, 28),
        type: "export",
      },
      {
        id: "7",
        title: "Entrée #452",
        date: new Date(2026, 7, 3),
        type: "import",
      },
    ],
    [],
  );

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });
    const startDayOfWeek = firstDayOfMonth.getDay();
    const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    const paddedDays = Array.from({ length: paddingDays }).map((_, i) => {
      const d = new Date(firstDayOfMonth);
      d.setDate(d.getDate() - (paddingDays - i));
      return { date: d, isCurrentMonth: false };
    });
    const monthDays = daysInMonth.map((d) => ({
      date: d,
      isCurrentMonth: true,
    }));
    return [...paddedDays, ...monthDays];
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    mockEvents.forEach((event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(event);
    });
    return map;
  }, [mockEvents]);

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CalendarPlus className="h-5 w-5 text-muted-foreground" />
          Calendrier des événements
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
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Entrée
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>Sortie
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          Demande
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>Retour
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          Événement
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
                  "group relative min-h-[80px] p-1.5 border-b border-r border-border/50 transition-colors hover:bg-muted/30 flex flex-col gap-0.5",
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
                    <EventBadge
                      key={event.id}
                      type={event.type}
                      title={event.title}
                    />
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
}

// ---------- Page Principale ----------
export function ProductDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "analytics" | "details" | "variants"
  >("analytics");

  // ----- États formulaire Détails -----
  const [isEditing, setIsEditing] = useState(false);
  const [productName, setProductName] = useState("Casque Audio Bluetooth Pro");
  const [description, setDescription] = useState(
    "Casque Bluetooth haut de gamme avec réduction de bruit active et autonomie de 30h.",
  );
  const [price, setPrice] = useState("149.90");
  const [stock, setStock] = useState("55");
  const [deliveryPrice, setDeliveryPrice] = useState("7.00");
  const [isVisibleInStore, setIsVisibleInStore] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "electronics",
    "audio",
    "headphones",
  ]);
  const [images, setImages] = useState<string[]>([
    "https://picsum.photos/200?random=1",
    "https://picsum.photos/200?random=2",
    "https://picsum.photos/200?random=3",
  ]);
  const [specifications, setSpecifications] = useState([
    { name: "Poids", value: "250g" },
    { name: "Autonomie", value: "30h" },
    { name: "Bluetooth", value: "5.3" },
  ]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [specificationsExpanded, setSpecificationsExpanded] = useState(false);

  const toggleCategory = (value: string) =>
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  const removeCategory = (value: string) =>
    setSelectedCategories((prev) => prev.filter((c) => c !== value));
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        alert("Maximum 5 images autorisées.");
        return;
      }
      setImages((prev) => [
        ...prev,
        ...files.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };
  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));
  const addSpecification = () =>
    setSpecifications((prev) => [...prev, { name: "", value: "" }]);
  const updateSpecification = (
    index: number,
    field: "name" | "value",
    value: string,
  ) => {
    setSpecifications((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)),
    );
  };
  const removeSpecification = (index: number) =>
    setSpecifications((prev) => prev.filter((_, i) => i !== index));

  // ----- États variantes -----
  const [isVariantsEditing, setIsVariantsEditing] = useState(false);
  const fileInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  interface VariantValue {
    id: string;
    name: string;
    stock: string;
    image: File | null;
    imagePreview: string | null;
  }
  interface Variant {
    id: string;
    name: string;
    values: VariantValue[];
  }

  const SUGGESTED_VARIANTS = [
    { label: "Taille", icon: Layers, values: ["S", "M", "L", "XL"] },
    {
      label: "Couleur",
      icon: Palette,
      values: ["Noir", "Blanc", "Bleu", "Rouge"],
    },
    {
      label: "Matériau",
      icon: Box,
      values: ["Plastique", "Aluminium", "Cuir"],
    },
  ];

  const [variants, setVariants] = useState<Variant[]>([
    {
      id: "1",
      name: "Taille",
      values: [
        { id: "11", name: "S", stock: "10", image: null, imagePreview: null },
        { id: "12", name: "M", stock: "25", image: null, imagePreview: null },
        { id: "13", name: "L", stock: "15", image: null, imagePreview: null },
      ],
    },
    {
      id: "2",
      name: "Couleur",
      values: [
        {
          id: "21",
          name: "Noir",
          stock: "30",
          image: null,
          imagePreview: null,
        },
        {
          id: "22",
          name: "Blanc",
          stock: "20",
          image: null,
          imagePreview: null,
        },
      ],
    },
  ]);

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", values: [] },
    ]);
  };
  const removeVariant = (id: string) =>
    setVariants((prev) => prev.filter((v) => v.id !== id));
  const updateVariantName = (id: string, name: string) =>
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, name } : v)));
  const addValue = (variantId: string) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
              ...v,
              values: [
                ...v.values,
                {
                  id: Date.now().toString(),
                  name: "",
                  stock: "",
                  image: null,
                  imagePreview: null,
                },
              ],
            }
          : v,
      ),
    );
  };
  const removeValue = (variantId: string, valueId: string) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, values: v.values.filter((val) => val.id !== valueId) }
          : v,
      ),
    );
  };
  const updateValueField = (
    variantId: string,
    valueId: string,
    field: "name" | "stock",
    value: string,
  ) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
              ...v,
              values: v.values.map((val) =>
                val.id === valueId ? { ...val, [field]: value } : val,
              ),
            }
          : v,
      ),
    );
  };
  const handleValueImageChange = (
    variantId: string,
    valueId: string,
    file: File,
  ) => {
    const preview = URL.createObjectURL(file);
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
              ...v,
              values: v.values.map((val) =>
                val.id === valueId
                  ? { ...val, image: file, imagePreview: preview }
                  : val,
              ),
            }
          : v,
      ),
    );
  };
  const removeValueImage = (variantId: string, valueId: string) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? {
              ...v,
              values: v.values.map((val) =>
                val.id === valueId
                  ? { ...val, image: null, imagePreview: null }
                  : val,
              ),
            }
          : v,
      ),
    );
  };
  const addSuggestedVariant = (label: string, values: string[]) => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      name: label,
      values: values.map((val) => ({
        id: `${Date.now()}-${val}`,
        name: val,
        stock: "",
        image: null,
        imagePreview: null,
      })),
    };
    setVariants((prev) => [...prev, newVariant]);
  };

  return (
    <DashboardLayout>
      {/* En-tête */}
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
              Casque Audio Bluetooth Pro
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Produit
              actif • Mis à jour il y a 2 jours
            </p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="mb-8 border-b border-border">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${activeTab === "analytics" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
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
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${activeTab === "details" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Détails du produit
            </span>
            {activeTab === "details" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("variants")}
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${activeTab === "variants" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Variantes
            </span>
            {activeTab === "variants" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* ========== Onglet ANALYSES ========== */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +12%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ventes totales
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {MOCK_ANALYTICS.totalSales}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {MOCK_ANALYTICS.trend}
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +8%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Revenu total
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {MOCK_ANALYTICS.totalRevenue}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Depuis le lancement
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  En attente
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Dans le panier
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {MOCK_ANALYTICS.inCart}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Clients avec l'article ajouté
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Undo2 className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                  {MOCK_ANALYTICS.returnTrend}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taux de retour
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {MOCK_ANALYTICS.returnRate}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Par rapport au mois dernier
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Ventes quotidiennes (7 jours)
              </h2>
              <SalesLineChart />
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Layers className="h-5 w-5 text-muted-foreground" />
                Ventes par variante
              </h2>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                      Variante
                    </th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                      Qté
                    </th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                      Revenu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {VARIANT_SALES.map((v) => (
                    <tr
                      key={v.name}
                      className="border-b border-border/30 hover:bg-muted/20"
                    >
                      <td className="py-2.5 px-2 font-medium text-foreground">
                        {v.name}
                      </td>
                      <td className="py-2.5 px-2 text-right text-foreground">
                        {v.quantity}
                      </td>
                      <td className="py-2.5 px-2 text-right text-foreground">
                        {v.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {VARIANT_SALES.map((v) => {
                const maxQty = Math.max(
                  ...VARIANT_SALES.map((x) => x.quantity),
                );
                return (
                  <div key={v.name} className="flex items-center gap-2 mt-2">
                    <span className="text-xs w-10 text-muted-foreground">
                      {v.name}
                    </span>
                    <div className="flex-1 bg-muted/50 h-2 rounded-full">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(v.quantity / maxQty) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {v.quantity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-muted-foreground" />
                Évolution du stock (7 jours)
              </h2>
              <StockLineChart />
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>
                  Min: {Math.min(...STOCK_HISTORY.map((d) => d.stock))}
                </span>
                <span>
                  Max: {Math.max(...STOCK_HISTORY.map((d) => d.stock))}
                </span>
                <span>
                  Actuel: {STOCK_HISTORY[STOCK_HISTORY.length - 1].stock}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                Ventes par région
              </h2>
              <RegionSalesMap />
              <div className="mt-3 text-xs text-muted-foreground">
                Données mockées – Tunis, Sfax, Sousse, etc.
              </div>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
                Statut des commandes
              </h2>
              <OrderStatusBarChart />
              <div className="mt-4 flex justify-around text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  Livré : {ORDER_STATUS.delivered}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  Annulé : {ORDER_STATUS.canceled}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  Remb. : {ORDER_STATUS.refunded}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                Livraisons associées
              </h2>
              <Button variant="outline" size="sm" className="rounded-lg">
                <Eye /> Voir tout
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Commande
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Statut
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DELIVERIES.map((delivery) => (
                    <tr
                      key={delivery.id}
                      className="border-b border-border/30 hover:bg-muted/20"
                    >
                      <td className="py-3 px-4 font-medium text-foreground">
                        {delivery.orderId}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {delivery.customer}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {delivery.date}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${delivery.status === "Livré" ? "bg-emerald-500/10 text-emerald-600" : delivery.status === "En cours" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${delivery.status === "Livré" ? "bg-emerald-500" : delivery.status === "En cours" ? "bg-amber-500" : "bg-red-500"}`}
                          />
                          {delivery.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-foreground">
                        {delivery.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ProductCalendar />
        </div>
      )}

      {/* ========== Onglet DÉTAILS DU PRODUIT ========== */}
      {activeTab === "details" && (
        <div className="space-y-8">
          <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Mode modification
                </p>
                <p className="text-xs text-muted-foreground">
                  {isEditing
                    ? "Vous pouvez modifier les informations"
                    : "Formulaire en lecture seule"}
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

          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
            <form className="space-y-8">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Nom du produit *
                </label>
                <Input
                  id="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Description détaillée
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[150px]"
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="price"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Prix unitaire *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="h-11 pl-10 pr-14"
                      disabled={!isEditing}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                      TND
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Box className="h-4 w-4 text-muted-foreground" />
                    Stock disponible *
                  </label>
                  <div className="relative">
                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="stock"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="h-11 pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="deliveryPrice"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    Prix de livraison
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deliveryPrice"
                      type="number"
                      step="0.01"
                      value={deliveryPrice}
                      onChange={(e) => setDeliveryPrice(e.target.value)}
                      className="h-11 pl-10 pr-14"
                      disabled={!isEditing}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                      TND
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Visible dans la boutique
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Apparaît dans le catalogue public
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isVisibleInStore}
                    onClick={() => {
                      if (isEditing) setIsVisibleInStore(!isVisibleInStore);
                    }}
                    disabled={!isEditing}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                      isVisibleInStore
                        ? "bg-primary"
                        : "bg-muted-foreground/30",
                      !isEditing && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                        isVisibleInStore ? "translate-x-6" : "translate-x-1",
                      )}
                    />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  Catégories *
                </label>
                <div className="relative">
                  <div
                    className={cn(
                      "flex items-center justify-between border border-border rounded-xl px-4 py-2.5 transition",
                      isEditing && "cursor-pointer hover:border-primary/50",
                      !isEditing && "bg-muted/20",
                    )}
                    onClick={() => {
                      if (isEditing)
                        setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                    }}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCategories.length === 0 ? (
                        <span className="text-muted-foreground text-sm">
                          Sélectionner des catégories
                        </span>
                      ) : (
                        selectedCategories.map((cat) => {
                          const label =
                            CATEGORY_OPTIONS.find((c) => c.value === cat)
                              ?.label || cat;
                          return (
                            <span
                              key={cat}
                              className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                            >
                              {label}
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeCategory(cat);
                                  }}
                                  className="hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </span>
                          );
                        })
                      )}
                    </div>
                    {isEditing && (
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                  {isEditing && isCategoryDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto p-1">
                      {CATEGORY_OPTIONS.map((cat) => (
                        <label
                          key={cat.value}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.value)}
                            onChange={() => toggleCategory(cat.value)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="-mx-6 md:-mx-8 px-6 md:px-8 py-6 bg-muted/5 rounded-xl border-y border-border/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <ImagePlus className="h-4 w-4 text-muted-foreground" />
                      Images du produit
                    </label>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                      {images.length}/5
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square rounded-xl border border-border/50 bg-muted overflow-hidden shadow-sm hover:shadow-md transition-all"
                      >
                        <img
                          src={img}
                          alt={`Produit ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {isEditing && (
                          <>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm p-1.5 rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-[10px] font-medium px-2 py-0.5 rounded-md">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                    {isEditing && images.length < 5 && (
                      <label
                        htmlFor="images"
                        className="aspect-square flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/40 hover:bg-muted/60 hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <div className="p-2 rounded-full bg-background/80 shadow-sm group-hover:scale-110 transition-transform">
                            <Upload className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-center px-3">
                            <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                              Cliquez pour ajouter
                            </p>
                            <p className="text-[10px] text-muted-foreground/60">
                              PNG, JPG jusqu'à 5 Mo
                            </p>
                          </div>
                        </div>
                        <input
                          id="images"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Spécifications */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    setSpecificationsExpanded(!specificationsExpanded)
                  }
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors w-full text-left"
                >
                  {specificationsExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                  <span>Spécifications techniques</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    (
                    {
                      specifications.filter(
                        (s) => s.name.trim() !== "" || s.value.trim() !== "",
                      ).length
                    }{" "}
                    définies)
                  </span>
                </button>
                {specificationsExpanded && (
                  <div className="space-y-3 pl-6 pt-2">
                    {isEditing && (
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Ajoutez des caractéristiques produit (ex: Poids,
                          Dimensions, Matériau)
                        </div>
                        <button
                          type="button"
                          onClick={addSpecification}
                          className="text-xs flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Ajouter
                        </button>
                      </div>
                    )}
                    <div className="space-y-2.5">
                      {specifications.map((spec, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Nom (ex: Poids)"
                              value={spec.name}
                              onChange={(e) =>
                                updateSpecification(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="h-9 text-sm"
                              disabled={!isEditing}
                            />
                            <Input
                              placeholder="Valeur (ex: 1.2 kg)"
                              value={spec.value}
                              onChange={(e) =>
                                updateSpecification(
                                  index,
                                  "value",
                                  e.target.value,
                                )
                              }
                              className="h-9 text-sm"
                              disabled={!isEditing}
                            />
                          </div>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => removeSpecification(index)}
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:pointer-events-none"
                              disabled={specifications.length === 1}
                              aria-label="Supprimer cette spécification"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

      {/* ========== Onglet VARIANTES ========== */}
      {activeTab === "variants" && (
        <div className="space-y-8">
          <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Mode modification
                </p>
                <p className="text-xs text-muted-foreground">
                  {isVariantsEditing
                    ? "Vous pouvez modifier les variantes"
                    : "Variantes en lecture seule"}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isVariantsEditing}
              onClick={() => setIsVariantsEditing(!isVariantsEditing)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                isVariantsEditing ? "bg-primary" : "bg-muted-foreground/30",
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                  isVariantsEditing ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>

          <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Configuration des variantes
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ajoutez des attributs (ex: Taille, Couleur) et leurs valeurs
                    avec stock et image.
                  </p>
                </div>
                {isVariantsEditing && (
                  <Button type="button" onClick={addVariant} className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Ajouter une variante
                  </Button>
                )}
              </div>

              {isVariantsEditing && (
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_VARIANTS.map((suggested) => (
                    <Button
                      key={suggested.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addSuggestedVariant(suggested.label, suggested.values)
                      }
                      className="gap-1.5 border-border/60 hover:border-primary/40"
                    >
                      <suggested.icon className="h-3.5 w-3.5" />
                      {suggested.label}
                    </Button>
                  ))}
                </div>
              )}

              {variants.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-border/50 p-12 text-center">
                  <Layers className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Aucune variante configurée. Utilisez les suggestions
                    ci-dessus ou cliquez sur "Ajouter une variante" pour
                    commencer.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="rounded-xl border border-border/50 bg-background/50 p-5 space-y-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Input
                            placeholder="Nom de la variante (ex: Taille, Couleur)"
                            value={variant.name}
                            onChange={(e) =>
                              updateVariantName(variant.id, e.target.value)
                            }
                            className="h-9 text-sm"
                            disabled={!isVariantsEditing}
                          />
                        </div>
                        {isVariantsEditing && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeVariant(variant.id)}
                            className="h-9 w-9 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3 pl-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Valeurs
                          </span>
                          {isVariantsEditing && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => addValue(variant.id)}
                              className="h-7 text-xs gap-1"
                            >
                              <PlusCircle className="h-3.5 w-3.5" />
                              Ajouter une valeur
                            </Button>
                          )}
                        </div>
                        {variant.values.length === 0 ? (
                          <div className="text-xs text-muted-foreground/60 py-2 px-3 bg-muted/20 rounded-md border border-dashed border-border/40">
                            Aucune valeur. Ajoutez-en une.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {variant.values.map((value) => (
                              <div
                                key={value.id}
                                className="flex items-center gap-3 bg-muted/10 p-3 rounded-lg border border-border/40"
                              >
                                <div className="flex-1 min-w-[100px]">
                                  <Input
                                    placeholder="Valeur (ex: S, M, L)"
                                    value={value.name}
                                    onChange={(e) =>
                                      updateValueField(
                                        variant.id,
                                        value.id,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                    className="h-8 text-sm"
                                    disabled={!isVariantsEditing}
                                  />
                                </div>
                                <div className="w-24">
                                  <Input
                                    type="number"
                                    placeholder="Stock"
                                    value={value.stock}
                                    onChange={(e) =>
                                      updateValueField(
                                        variant.id,
                                        value.id,
                                        "stock",
                                        e.target.value,
                                      )
                                    }
                                    className="h-8 text-sm"
                                    disabled={!isVariantsEditing}
                                  />
                                </div>
                                <div className="relative flex items-center">
                                  {value.imagePreview ? (
                                    <div className="relative group">
                                      <img
                                        src={value.imagePreview}
                                        alt={value.name || "Valeur"}
                                        className="h-10 w-10 rounded-md object-cover border border-border"
                                      />
                                      {isVariantsEditing && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeValueImage(
                                              variant.id,
                                              value.id,
                                            )
                                          }
                                          className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    <label
                                      htmlFor={`image-${variant.id}-${value.id}`}
                                      className={cn(
                                        "h-10 w-10 flex items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/20",
                                        isVariantsEditing
                                          ? "cursor-pointer hover:border-primary/50 transition"
                                          : "cursor-default",
                                      )}
                                    >
                                      <ImagePlus className="h-4 w-4 text-muted-foreground" />
                                      {isVariantsEditing && (
                                        <input
                                          ref={(el) => {
                                            if (el)
                                              fileInputRefs.current.set(
                                                `${variant.id}-${value.id}`,
                                                el,
                                              );
                                          }}
                                          id={`image-${variant.id}-${value.id}`}
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                              handleValueImageChange(
                                                variant.id,
                                                value.id,
                                                e.target.files[0],
                                              );
                                              e.target.value = "";
                                            }
                                          }}
                                        />
                                      )}
                                    </label>
                                  )}
                                </div>
                                {isVariantsEditing && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeValue(variant.id, value.id)
                                    }
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="h-11 px-6 rounded-xl"
                >
                  Annuler
                </Button>
                {isVariantsEditing && (
                  <Button className="h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    <Save className="h-4 w-4" />
                    Enregistrer le produit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
