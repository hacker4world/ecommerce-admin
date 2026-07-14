import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  DollarSign,
  Eye,
  Layers,
  Megaphone,
  Package,
  Pencil,
  Percent,
  Save,
  Search,
  ShoppingCart,
  Star,
  Tag,
  TrendingUp,
  Truck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Mock data ----------
const OFFER_ANALYTICS = {
  totalUnitsSold: 342,
  totalRevenue: 28450,
  conversionRate: 9.2,
  growth: "+24%",
  topItem: "Casque Audio Pro",
  salesDuring: [45, 52, 38, 61, 48, 55, 43],
  salesBefore: [35, 40, 42, 38, 44, 39, 40],
  days: ["01/07", "02/07", "03/07", "04/07", "05/07", "06/07", "07/07"],
};

const TOP_PRODUCTS = [
  { name: "Casque Audio Pro", units: 124 },
  { name: "Écouteurs Bluetooth", units: 98 },
  { name: "Enceinte Portable", units: 120 },
  { name: "Casque Gaming RGB", units: 76 },
  { name: "Casque Filaire Pro", units: 54 },
];

const PRODUCT_PERFORMANCE = [
  {
    name: "Casque Audio Pro",
    unitsSold: 124,
    revenue: "12 400 TND",
    discountGiven: "3 100 TND",
    stock: 15,
  },
  {
    name: "Écouteurs Bluetooth",
    unitsSold: 98,
    revenue: "6 860 TND",
    discountGiven: "1 470 TND",
    stock: 8,
  },
  {
    name: "Enceinte Portable",
    unitsSold: 120,
    revenue: "7 200 TND",
    discountGiven: "1 800 TND",
    stock: 25,
  },
];

const RECENT_ORDERS = [
  {
    id: "CMD-101",
    customer: "Ahmed Ben Salah",
    date: "2026-07-07",
    amount: "320 TND",
    status: "Livré",
  },
  {
    id: "CMD-102",
    customer: "Sarra Mansour",
    date: "2026-07-06",
    amount: "145 TND",
    status: "En cours",
  },
  {
    id: "CMD-103",
    customer: "Mohamed Ali",
    date: "2026-07-05",
    amount: "89 TND",
    status: "Livré",
  },
  {
    id: "CMD-104",
    customer: "Leila Trabelsi",
    date: "2026-07-04",
    amount: "210 TND",
    status: "Annulé",
  },
];

const AFFECTED_PRODUCTS = [
  {
    name: "Casque Audio Pro",
    originalPrice: "160 TND",
    discount: "-20%",
    finalPrice: "128 TND",
    stock: 15,
  },
  {
    name: "Écouteurs Bluetooth",
    originalPrice: "120 TND",
    discount: "-20%",
    finalPrice: "96 TND",
    stock: 8,
  },
  {
    name: "Enceinte Portable",
    originalPrice: "200 TND",
    discount: "-20%",
    finalPrice: "160 TND",
    stock: 25,
  },
  {
    name: "Casque Gaming RGB",
    originalPrice: "180 TND",
    discount: "-20%",
    finalPrice: "144 TND",
    stock: 42,
  },
  {
    name: "Casque Filaire Pro",
    originalPrice: "100 TND",
    discount: "-20%",
    finalPrice: "80 TND",
    stock: 10,
  },
];

const MOCK_OFFER = {
  name: "Soldes d'été – 20% sur les casques",
  type: "category" as "category" | "product",
  showNotificationBar: false,
  notificationText: "🎉 Profitez de notre offre spéciale dès maintenant !",
  notificationColor: "#3b82f6",
  barStyle: "simple",
  showSaleCounter: false,
  activationMode: "now" as "now" | "schedule",
  startDate: "",
  endDate: "2026-07-31",
  selectedItemIds: ["1", "2", "3", "4", "5"],
  discountType: "percentage" as "percentage" | "fixed",
  reductionMode: "all" as "all" | "individual",
  globalReductionValue: "20",
  individualReductions: {} as Record<string, string>,
};

const MOCK_CATEGORIES = [
  { id: "1", name: "Casques" },
  { id: "2", name: "Écouteurs" },
  { id: "3", name: "Enceintes" },
  { id: "4", name: "Microphones" },
  { id: "5", name: "Accessoires" },
];

const MOCK_PRODUCTS = [
  { id: "1", name: "Casque Audio Pro" },
  { id: "2", name: "Écouteurs Bluetooth" },
  { id: "3", name: "Enceinte Portable" },
  { id: "4", name: "Casque Gaming RGB" },
  { id: "5", name: "Casque Filaire Pro" },
  { id: "6", name: "Microphone Studio" },
  { id: "7", name: "Chargeur sans fil" },
  { id: "8", name: "Câble USB-C" },
];

const BAR_STYLES = [
  {
    value: "simple",
    label: "Simple",
    description: "Bandeau uni avec message",
    previewBg: "bg-primary",
  },
  {
    value: "compact",
    label: "Compact",
    description: "Bandeau étroit avec icône",
    previewBg: "bg-gradient-to-r from-primary to-primary/80",
  },
  {
    value: "floating",
    label: "Flottant",
    description: "Barre détachée avec coins arrondis",
    previewBg: "bg-primary shadow-lg mx-4 rounded-b-xl",
  },
];

// ---------- SVG Charts ----------
const ComparisonLineChart = ({
  during,
  before,
  days,
}: {
  during: number[];
  before: number[];
  days: string[];
}) => {
  const width = 600,
    height = 200;
  const pad = { top: 20, right: 20, bottom: 30, left: 35 };
  const maxVal = Math.max(...during, ...before);
  const xScale = (i: number) =>
    pad.left + (i / (days.length - 1)) * (width - pad.left - pad.right);
  const yScale = (v: number) =>
    height - pad.bottom - (v / maxVal) * (height - pad.top - pad.bottom);
  const duringPoints = during.map((d, i) => ({
    x: xScale(i),
    y: yScale(d),
    day: days[i],
    value: d,
  }));
  const beforePoints = before.map((d, i) => ({
    x: xScale(i),
    y: yScale(d),
    day: days[i],
    value: d,
  }));
  const duringPath = duringPoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const beforePath = beforePoints
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
              {Math.round(maxVal * ratio)}
            </text>
          </g>
        );
      })}
      <path
        d={beforePath}
        fill="none"
        stroke="currentColor"
        className="text-muted-foreground/50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 4"
      />
      <path
        d={duringPath}
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {duringPoints.map((p, i) => (
        <g key={`during-${i}`}>
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
      {beforePoints.map((p, i) => (
        <circle
          key={`before-${i}`}
          cx={p.x}
          cy={p.y}
          r="2"
          className="fill-muted-foreground/50 stroke-background"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
};

const TopProductsBar = ({
  data,
}: {
  data: { name: string; units: number }[];
}) => {
  const max = Math.max(...data.map((d) => d.units));
  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="w-28 text-xs text-muted-foreground truncate">
            {item.name}
          </span>
          <div className="flex-1 bg-muted/50 h-4 rounded-full">
            <div
              className="bg-primary h-4 rounded-full"
              style={{ width: `${(item.units / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium w-10 text-right">
            {item.units}
          </span>
        </div>
      ))}
    </div>
  );
};

// ---------- Page Component ----------
export function OfferDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "analytics" | "details" | "products"
  >("analytics");

  // Editing toggles
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingProducts, setIsEditingProducts] = useState(false);

  // Details form state
  const [offerName, setOfferName] = useState(MOCK_OFFER.name);
  const [offerType, setOfferType] = useState<"category" | "product">(
    MOCK_OFFER.type,
  );
  const [showNotificationBar, setShowNotificationBar] = useState(
    MOCK_OFFER.showNotificationBar,
  );
  const [notificationText, setNotificationText] = useState(
    MOCK_OFFER.notificationText,
  );
  const [notificationColor, setNotificationColor] = useState(
    MOCK_OFFER.notificationColor,
  );
  const [barStyle, setBarStyle] = useState(MOCK_OFFER.barStyle);
  const [showSaleCounter, setShowSaleCounter] = useState(
    MOCK_OFFER.showSaleCounter,
  );
  const [activationMode, setActivationMode] = useState<"now" | "schedule">(
    MOCK_OFFER.activationMode,
  );
  const [endDate, setEndDate] = useState(MOCK_OFFER.endDate);
  const [startDate, setStartDate] = useState(MOCK_OFFER.startDate);
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  // Products form state
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    MOCK_OFFER.selectedItemIds,
  );
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    MOCK_OFFER.discountType,
  );
  const [reductionMode, setReductionMode] = useState<"all" | "individual">(
    MOCK_OFFER.reductionMode,
  );
  const [globalReductionValue, setGlobalReductionValue] = useState(
    MOCK_OFFER.globalReductionValue,
  );
  const [individualReductions, setIndividualReductions] = useState<
    Record<string, string>
  >(MOCK_OFFER.individualReductions);
  const [productSearch, setProductSearch] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const currentStyle =
    BAR_STYLES.find((s) => s.value === barStyle) || BAR_STYLES[0];

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return MOCK_PRODUCTS;
    const q = productSearch.toLowerCase();
    return MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
  }, [productSearch]);

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
    if (selectedItemIds.includes(id)) {
      setIndividualReductions((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const availableItems =
    offerType === "category" ? MOCK_CATEGORIES : MOCK_PRODUCTS;
  const selectedItems = availableItems.filter((item) =>
    selectedItemIds.includes(item.id),
  );

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
              Soldes d'été – 20% sur les casques
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Offre
              active • Depuis le 1er juillet
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-border">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${activeTab === "analytics" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Analyses
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
              <Package className="h-4 w-4" /> Détails
            </span>
            {activeTab === "details" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${activeTab === "products" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4" /> Produits
            </span>
            {activeTab === "products" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* ========== Analytics Tab ========== */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          {/* Row 1: Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +32
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Produits vendus
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {OFFER_ANALYTICS.totalUnitsSold}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Pendant l'offre</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +24%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Revenu généré
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {OFFER_ANALYTICS.totalRevenue.toLocaleString()} TND
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Pendant l'offre</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +9.2%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taux de conversion
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {OFFER_ANALYTICS.conversionRate}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Visiteurs → acheteurs
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Calendar className="h-5 w-5 text-violet-500" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +24%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Croissance vs. normal
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {OFFER_ANALYTICS.growth}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Par rapport à la période précédente
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Star className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  #1
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Meilleure vente
                </p>
                <p className="text-lg font-bold text-foreground mt-1 line-clamp-2">
                  {OFFER_ANALYTICS.topItem}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Produit le plus vendu
              </p>
            </div>
          </div>

          {/* Row 2: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />{" "}
                Évolution des ventes (7 jours)
              </h2>
              <ComparisonLineChart
                during={OFFER_ANALYTICS.salesDuring}
                before={OFFER_ANALYTICS.salesBefore}
                days={OFFER_ANALYTICS.days}
              />
              <div className="mt-3 flex justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-primary rounded-full" /> Pendant
                  l'offre
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-muted-foreground/50 rounded-full border-dashed" />{" "}
                  Période précédente
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-muted-foreground" /> Top 5
                produits
              </h2>
              <TopProductsBar data={TOP_PRODUCTS} />
            </div>
          </div>

          {/* Row 3: Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-muted-foreground" />{" "}
                Performance par produit
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                        Produit
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Vendus
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Revenu
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Réduc. accordée
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCT_PERFORMANCE.map((product) => (
                      <tr
                        key={product.name}
                        className="border-b border-border/30 hover:bg-muted/20"
                      >
                        <td className="py-2.5 px-2 font-medium text-foreground">
                          {product.name}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          {product.unitsSold}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          {product.revenue}
                        </td>
                        <td className="py-2.5 px-2 text-right text-amber-600">
                          {product.discountGiven}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              product.stock > 20
                                ? "bg-emerald-500/10 text-emerald-600"
                                : product.stock > 5
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.stock > 20
                                  ? "bg-emerald-500"
                                  : product.stock > 5
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                            />
                            {product.stock}
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
                <Truck className="h-5 w-5 text-muted-foreground" /> Commandes
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
                        Montant
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ORDERS.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border/30 hover:bg-muted/20"
                      >
                        <td className="py-2.5 px-2 font-medium text-foreground">
                          {order.id}
                        </td>
                        <td className="py-2.5 px-2">{order.customer}</td>
                        <td className="py-2.5 px-2 text-muted-foreground">
                          {order.date}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          {order.amount}
                        </td>
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
          </div>

          {/* Row 4: All Affected Products */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-muted-foreground" /> Produits
              concernés par l'offre
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-4 font-medium text-muted-foreground">
                      Produit
                    </th>
                    <th className="text-right py-2 px-4 font-medium text-muted-foreground">
                      Prix original
                    </th>
                    <th className="text-right py-2 px-4 font-medium text-muted-foreground">
                      Réduction
                    </th>
                    <th className="text-right py-2 px-4 font-medium text-muted-foreground">
                      Prix final
                    </th>
                    <th className="text-right py-2 px-4 font-medium text-muted-foreground">
                      Stock restant
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AFFECTED_PRODUCTS.map((product) => (
                    <tr
                      key={product.name}
                      className="border-b border-border/30 hover:bg-muted/20"
                    >
                      <td className="py-2.5 px-4 font-medium text-foreground">
                        {product.name}
                      </td>
                      <td className="py-2.5 px-4 text-right text-muted-foreground">
                        {product.originalPrice}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {product.discount}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-medium text-foreground">
                        {product.finalPrice}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock > 20
                              ? "bg-emerald-500/10 text-emerald-600"
                              : product.stock > 5
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.stock > 20
                                ? "bg-emerald-500"
                                : product.stock > 5
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          />
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========== Details Tab ========== */}
      {activeTab === "details" && (
        <div className="space-y-8">
          <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Mode modification
                </p>
                <p className="text-xs text-muted-foreground">
                  {isEditingDetails
                    ? "Vous pouvez modifier l'offre"
                    : "Formulaire en lecture seule"}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isEditingDetails}
              onClick={() => setIsEditingDetails(!isEditingDetails)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                isEditingDetails ? "bg-primary" : "bg-muted-foreground/30",
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                  isEditingDetails ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>

          <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
            <form className="space-y-8">
              {/* Offer Name */}
              <div className="space-y-2">
                <label
                  htmlFor="offerName"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Megaphone className="h-4 w-4 text-muted-foreground" /> Nom de
                  l'offre *
                </label>
                <Input
                  id="offerName"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  placeholder="Ex: Soldes d'été – 20% sur les casques"
                  className="h-11"
                  disabled={!isEditingDetails}
                />
              </div>

              {/* Offer Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" /> Type
                  d'offre
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingDetails) {
                        setOfferType("category");
                        setSelectedItemIds([]);
                      }
                    }}
                    disabled={!isEditingDetails}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 transition-colors",
                      offerType === "category"
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-background hover:border-primary/40",
                      !isEditingDetails && "opacity-60 cursor-not-allowed",
                    )}
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        Par catégorie
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Appliquer la réduction à toutes les catégories
                        sélectionnées
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingDetails) {
                        setOfferType("product");
                        setSelectedItemIds([]);
                      }
                    }}
                    disabled={!isEditingDetails}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 transition-colors",
                      offerType === "product"
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-background hover:border-primary/40",
                      !isEditingDetails && "opacity-60 cursor-not-allowed",
                    )}
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        Par produit
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Appliquer la réduction à des produits spécifiques
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Notification Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <Megaphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Afficher une barre de notification
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Une bannière sera visible en haut de la boutique pour
                        informer les clients
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showNotificationBar}
                    onClick={() => {
                      if (isEditingDetails)
                        setShowNotificationBar(!showNotificationBar);
                    }}
                    disabled={!isEditingDetails}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                      showNotificationBar
                        ? "bg-primary"
                        : "bg-muted-foreground/30",
                      !isEditingDetails && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                        showNotificationBar ? "translate-x-6" : "translate-x-1",
                      )}
                    />
                  </button>
                </div>

                {showNotificationBar && (
                  <div className="space-y-6 pl-1 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Texte de la notification
                        </label>
                        <Input
                          value={notificationText}
                          onChange={(e) => setNotificationText(e.target.value)}
                          placeholder="Votre message ici..."
                          className="h-10"
                          disabled={!isEditingDetails}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Couleur de la barre
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={notificationColor}
                            onChange={(e) =>
                              setNotificationColor(e.target.value)
                            }
                            className="h-10 w-10 rounded-md border border-border cursor-pointer"
                            disabled={!isEditingDetails}
                          />
                          <Input
                            value={notificationColor}
                            onChange={(e) =>
                              setNotificationColor(e.target.value)
                            }
                            className="h-10 flex-1"
                            placeholder="#3b82f6"
                            disabled={!isEditingDetails}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Style de la barre
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            if (isEditingDetails)
                              setStyleDropdownOpen(!styleDropdownOpen);
                          }}
                          className="flex items-center justify-between w-full border border-border rounded-xl px-4 py-2.5 text-left bg-background hover:border-primary/50 transition"
                        >
                          <span className="text-sm">{currentStyle.label}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform",
                              styleDropdownOpen && "rotate-180",
                            )}
                          />
                        </button>
                        {styleDropdownOpen && isEditingDetails && (
                          <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-xl shadow-lg p-1">
                            {BAR_STYLES.map((style) => (
                              <button
                                key={style.value}
                                type="button"
                                onClick={() => {
                                  setBarStyle(style.value);
                                  setStyleDropdownOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition",
                                  barStyle === style.value &&
                                    "bg-primary/10 text-primary font-medium",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-3 h-3 rounded-full border border-border"
                                    style={{
                                      backgroundColor: notificationColor,
                                    }}
                                  />
                                  <span>{style.label}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {style.description}
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Afficher un compte à rebours
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ajoute un décompte jusqu'à la fin de l'offre
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={showSaleCounter}
                        onClick={() => {
                          if (isEditingDetails)
                            setShowSaleCounter(!showSaleCounter);
                        }}
                        disabled={!isEditingDetails}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                          showSaleCounter
                            ? "bg-primary"
                            : "bg-muted-foreground/30",
                          !isEditingDetails && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                            showSaleCounter ? "translate-x-6" : "translate-x-1",
                          )}
                        />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" /> Aperçu
                        en temps réel
                      </label>
                      <div className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
                        {barStyle === "floating" ? (
                          <div className="px-4 pt-3 pb-1 bg-background">
                            <div
                              className="rounded-b-xl py-3 px-4 text-white"
                              style={{ backgroundColor: notificationColor }}
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">
                                  {notificationText}
                                </p>
                                {showSaleCounter && (
                                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    ⏱ 12j 05h 32m
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "py-3 px-4 text-white",
                              barStyle === "compact" && "py-2 text-xs",
                              currentStyle.previewBg,
                            )}
                            style={{ backgroundColor: notificationColor }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {barStyle === "compact" && (
                                  <Megaphone className="h-3.5 w-3.5" />
                                )}
                                <p className="text-sm font-medium">
                                  {notificationText}
                                </p>
                              </div>
                              {showSaleCounter && (
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                  ⏱ 12j 05h 32m
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="bg-background px-4 py-3 flex items-center gap-3 border-t border-border/30">
                          <div className="w-8 h-8 rounded-md bg-muted" />
                          <div className="flex-1 space-y-1">
                            <div className="h-2 w-24 bg-muted rounded" />
                            <div className="h-2 w-16 bg-muted rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Period */}
              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Période de validité
                  </h2>
                </div>
                <div className="bg-muted/20 rounded-xl p-5 border border-border/50 space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Mode d'activation
                    </label>
                    <div className="flex rounded-lg border border-border bg-background p-1 w-fit">
                      <button
                        type="button"
                        onClick={() => {
                          if (isEditingDetails) setActivationMode("now");
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                          activationMode === "now"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                          !isEditingDetails && "opacity-60 cursor-not-allowed",
                        )}
                      >
                        <Clock className="h-4 w-4" /> Activer maintenant
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isEditingDetails) setActivationMode("schedule");
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                          activationMode === "schedule"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                          !isEditingDetails && "opacity-60 cursor-not-allowed",
                        )}
                      >
                        <Calendar className="h-4 w-4" /> Planifier pour plus
                        tard
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {activationMode === "schedule" && (
                      <div className="space-y-2">
                        <label
                          htmlFor="startDate"
                          className="text-sm font-medium"
                        >
                          Date de début
                        </label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="h-10"
                          disabled={!isEditingDetails}
                        />
                      </div>
                    )}
                    <div
                      className={cn(
                        "space-y-2",
                        activationMode === "schedule" ? "" : "md:col-span-2",
                      )}
                    >
                      <label htmlFor="endDate" className="text-sm font-medium">
                        Date de fin
                      </label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-10"
                        disabled={!isEditingDetails}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activationMode === "now"
                      ? "L'offre est active immédiatement et expirera à la date de fin indiquée."
                      : "L'offre démarrera automatiquement à la date de début et expirera à la date de fin."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="h-11 px-6 rounded-xl"
                >
                  Annuler
                </Button>
                {isEditingDetails && (
                  <Button className="h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    <Save className="h-4 w-4" /> Enregistrer les modifications
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== Products Tab ========== */}
      {activeTab === "products" && (
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
                  {isEditingProducts
                    ? "Vous pouvez gérer les produits"
                    : "Liste en lecture seule"}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isEditingProducts}
              onClick={() => setIsEditingProducts(!isEditingProducts)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                isEditingProducts ? "bg-primary" : "bg-muted-foreground/30",
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                  isEditingProducts ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>

          <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
            <div className="space-y-10">
              {/* Item Selection */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {offerType === "category"
                      ? "Catégories concernées"
                      : "Produits concernés"}
                  </h2>
                </div>

                {offerType === "category" ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditingProducts)
                          setCategoryDropdownOpen(!categoryDropdownOpen);
                      }}
                      className={cn(
                        "flex items-center justify-between w-full border border-border rounded-xl px-4 py-2.5 text-left bg-background hover:border-primary/50 transition",
                        !isEditingProducts && "opacity-60 cursor-not-allowed",
                      )}
                    >
                      <span
                        className={
                          selectedItemIds.length === 0
                            ? "text-muted-foreground"
                            : ""
                        }
                      >
                        {selectedItemIds.length === 0
                          ? "Sélectionner des catégories"
                          : `${selectedItemIds.length} catégorie(s) sélectionnée(s)`}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          categoryDropdownOpen && "rotate-180",
                        )}
                      />
                    </button>
                    {categoryDropdownOpen && isEditingProducts && (
                      <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto p-2">
                        {MOCK_CATEGORIES.map((cat) => (
                          <label
                            key={cat.id}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedItemIds.includes(cat.id)}
                              onChange={() => toggleItem(cat.id)}
                              className="rounded border-border text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un produit..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="pl-10 h-10"
                        disabled={!isEditingProducts}
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto border border-border rounded-xl bg-background p-2 space-y-1">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <label
                            key={product.id}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedItemIds.includes(product.id)}
                              onChange={() => toggleItem(product.id)}
                              className="rounded border-border text-primary focus:ring-primary"
                              disabled={!isEditingProducts}
                            />
                            <span className="text-sm">{product.name}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground px-3 py-2">
                          Aucun produit trouvé
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedItems.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedItems.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {item.name}
                        {isEditingProducts && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleItem(item.id);
                            }}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border" />

              {/* Reduction Configuration */}
              {selectedItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-1.5 rounded-md bg-primary/10">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Configuration de la réduction
                    </h2>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-5 border border-border/50 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Type de réduction
                        </label>
                        <div className="flex rounded-lg border border-border bg-background p-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditingProducts)
                                setDiscountType("percentage");
                            }}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                              discountType === "percentage"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                              !isEditingProducts &&
                                "opacity-60 cursor-not-allowed",
                            )}
                          >
                            <Percent className="h-4 w-4" /> Pourcentage
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditingProducts) setDiscountType("fixed");
                            }}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                              discountType === "fixed"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                              !isEditingProducts &&
                                "opacity-60 cursor-not-allowed",
                            )}
                          >
                            <Tag className="h-4 w-4" /> Montant fixe
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Appliquer
                        </label>
                        <div className="flex rounded-lg border border-border bg-background p-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditingProducts) setReductionMode("all");
                            }}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                              reductionMode === "all"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                              !isEditingProducts &&
                                "opacity-60 cursor-not-allowed",
                            )}
                          >
                            <Check className="h-4 w-4" /> À tous
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditingProducts)
                                setReductionMode("individual");
                            }}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                              reductionMode === "individual"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                              !isEditingProducts &&
                                "opacity-60 cursor-not-allowed",
                            )}
                          >
                            <Layers className="h-4 w-4" /> Par élément
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      {reductionMode === "all" ? (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            {discountType === "percentage"
                              ? "Pourcentage de réduction"
                              : "Montant de la réduction (TND)"}
                          </label>
                          <div className="relative w-48">
                            <Input
                              type="number"
                              placeholder={
                                discountType === "percentage"
                                  ? "Ex: 20"
                                  : "Ex: 15.50"
                              }
                              value={globalReductionValue}
                              onChange={(e) =>
                                setGlobalReductionValue(e.target.value)
                              }
                              className="h-10 pr-12"
                              disabled={!isEditingProducts}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                              {discountType === "percentage" ? "%" : "TND"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="text-sm font-medium mb-3 block">
                            Réduction par élément
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3 bg-background rounded-xl px-4 py-3 border border-border/50"
                              >
                                <span className="text-sm font-medium flex-1 truncate">
                                  {item.name}
                                </span>
                                <div className="relative w-36">
                                  <Input
                                    type="number"
                                    placeholder={
                                      discountType === "percentage"
                                        ? "20"
                                        : "15"
                                    }
                                    value={individualReductions[item.id] || ""}
                                    onChange={(e) =>
                                      setIndividualReductions((prev) => ({
                                        ...prev,
                                        [item.id]: e.target.value,
                                      }))
                                    }
                                    className="h-9 pr-10 text-sm"
                                    disabled={!isEditingProducts}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                                    {discountType === "percentage"
                                      ? "%"
                                      : "TND"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="h-11 px-6 rounded-xl"
                >
                  Annuler
                </Button>
                {isEditingProducts && (
                  <Button className="h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    <Save className="h-4 w-4" /> Enregistrer les modifications
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
