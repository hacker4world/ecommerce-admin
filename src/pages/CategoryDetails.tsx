import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BarChart3,
  Box,
  DollarSign,
  Eye,
  ImagePlus,
  Layers,
  Package,
  Plus,
  Save,
  Search,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Mock data (unchanged) ----------
const CATEGORY_ANALYTICS = {
  totalProducts: 45,
  activeProducts: 38,
  totalSales: 1245,
  totalRevenue: "34,250 TND",
  conversionRate: 4.8,
  salesTrend: [45, 52, 38, 61, 48, 55, 43],
  days: ["01/07", "02/07", "03/07", "04/07", "05/07", "06/07", "07/07"],
};

const TOP_PRODUCTS = [
  { name: "Casque Audio Pro", sales: 342, revenue: "12,450 TND" },
  { name: "Écouteurs Bluetooth", sales: 287, revenue: "8,610 TND" },
  { name: "Enceinte Portable", sales: 198, revenue: "5,940 TND" },
  { name: "Casque Gaming RGB", sales: 165, revenue: "4,950 TND" },
  { name: "Casque Filaire Pro", sales: 120, revenue: "3,600 TND" },
];

const PRODUCT_PERFORMANCE = [
  {
    name: "Casque Audio Pro",
    sales: 342,
    revenue: "12,450 TND",
    stock: 25,
    rating: 4.8,
  },
  {
    name: "Écouteurs Bluetooth",
    sales: 287,
    revenue: "8,610 TND",
    stock: 14,
    rating: 4.6,
  },
  {
    name: "Enceinte Portable",
    sales: 198,
    revenue: "5,940 TND",
    stock: 8,
    rating: 4.4,
  },
  {
    name: "Casque Gaming RGB",
    sales: 165,
    revenue: "4,950 TND",
    stock: 45,
    rating: 4.7,
  },
  {
    name: "Casque Filaire Pro",
    sales: 120,
    revenue: "3,600 TND",
    stock: 12,
    rating: 4.3,
  },
];

const RECENT_ORDERS = [
  {
    id: "CMD-001",
    customer: "Ahmed Ben Salah",
    date: "2026-07-01",
    amount: "320 TND",
    status: "Livré",
  },
  {
    id: "CMD-002",
    customer: "Sarra Mansour",
    date: "2026-07-03",
    amount: "145 TND",
    status: "En cours",
  },
  {
    id: "CMD-003",
    customer: "Mohamed Ali",
    date: "2026-07-05",
    amount: "89 TND",
    status: "Livré",
  },
  {
    id: "CMD-004",
    customer: "Leila Trabelsi",
    date: "2026-07-06",
    amount: "210 TND",
    status: "Annulé",
  },
];

// ---------- Mock category data for forms ----------
const MOCK_CATEGORY = {
  name: "Casques",
  isVisible: true,
  image: null as string | null,
  associatedProducts: [
    { id: "1", name: "Casque Audio Pro" },
    { id: "2", name: "Écouteurs Bluetooth" },
    { id: "3", name: "Enceinte Portable" },
  ],
  availableProducts: [
    { id: "4", name: "Casque Gaming RGB" },
    { id: "5", name: "Casque Filaire Pro" },
    { id: "6", name: "Microphone Studio" },
  ],
};

// ---------- SVG Charts (unchanged) ----------
const SalesTrendLineChart = ({
  data,
  days,
}: {
  data: number[];
  days: string[];
}) => {
  const width = 600,
    height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const max = Math.max(...data);
  const points = data.map((d, i) => {
    const x =
      padding.left +
      (i / (data.length - 1)) * (width - padding.left - padding.right);
    const y =
      height -
      padding.bottom -
      (d / max) * (height - padding.top - padding.bottom);
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

const HorizontalBarChart = ({
  data,
}: {
  data: { name: string; sales: number }[];
}) => {
  const max = Math.max(...data.map((d) => d.sales));
  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="w-24 text-xs text-muted-foreground truncate">
            {item.name}
          </span>
          <div className="flex-1 bg-muted/50 h-4 rounded-full">
            <div
              className="bg-primary h-4 rounded-full"
              style={{ width: `${(item.sales / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium w-10 text-right">
            {item.sales}
          </span>
        </div>
      ))}
    </div>
  );
};

// ---------- Page Component ----------
export function CategoryDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "analytics" | "details" | "products"
  >("analytics");

  // ----- Edition toggles -----
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingProducts, setIsEditingProducts] = useState(false);

  // ----- Category form state (details tab) -----
  const [categoryName, setCategoryName] = useState(MOCK_CATEGORY.name);
  const [isVisible, setIsVisible] = useState(MOCK_CATEGORY.isVisible);
  const [categoryImage, setCategoryImage] = useState<string | null>(
    MOCK_CATEGORY.image,
  );

  // ----- Associated products state -----
  const [associatedProducts, setAssociatedProducts] = useState(
    MOCK_CATEGORY.associatedProducts,
  );
  const [availableProducts, setAvailableProducts] = useState(
    MOCK_CATEGORY.availableProducts,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Image handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => setCategoryImage(null);

  // Product management
  const addProduct = (product: { id: string; name: string }) => {
    setAssociatedProducts((prev) => [...prev, product]);
    setAvailableProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  const removeProduct = (productId: string) => {
    const product = associatedProducts.find((p) => p.id === productId);
    if (product) {
      setAssociatedProducts((prev) => prev.filter((p) => p.id !== productId));
      setAvailableProducts((prev) => [...prev, product]);
    }
  };

  const filteredAvailable = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
              Casques
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Catégorie
              active • Mis à jour il y a 2 jours
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
              <Package className="h-4 w-4" /> Détails catégorie
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
              <Layers className="h-4 w-4" /> Produits associés
            </span>
            {activeTab === "products" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* ========== Analytics Tab (unchanged from original) ========== */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          {/* Row 1: Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Box className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +5
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total produits
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {CATEGORY_ANALYTICS.totalProducts}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Ce mois‑ci</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Package className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {CATEGORY_ANALYTICS.activeProducts}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Produits actifs
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {CATEGORY_ANALYTICS.activeProducts}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Sur {CATEGORY_ANALYTICS.totalProducts} total
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
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
                  {CATEGORY_ANALYTICS.totalSales}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">+12% ce mois</p>
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
                  {CATEGORY_ANALYTICS.totalRevenue}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Depuis le lancement
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <ShoppingCart className="h-5 w-5 text-violet-500" />
                </div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +1.2%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taux de conversion
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {CATEGORY_ANALYTICS.conversionRate}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Visites → achats</p>
            </div>
          </div>

          {/* Row 2: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />{" "}
                Évolution des ventes (7 jours)
              </h2>
              <SalesTrendLineChart
                data={CATEGORY_ANALYTICS.salesTrend}
                days={CATEGORY_ANALYTICS.days}
              />
            </div>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-muted-foreground" /> Top 5
                produits
              </h2>
              <HorizontalBarChart data={TOP_PRODUCTS} />
              <div className="mt-4 space-y-2">
                {TOP_PRODUCTS.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-xs text-muted-foreground"
                  >
                    <span>{p.name}</span>
                    <span className="font-medium">{p.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-muted-foreground" />{" "}
                Performance des produits
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                        Produit
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Ventes
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Revenu
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Stock
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Note
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
                          {product.sales}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          {product.revenue}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              product.stock > 20
                                ? "bg-emerald-500/10 text-emerald-600"
                                : product.stock > 10
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.stock > 20
                                  ? "bg-emerald-500"
                                  : product.stock > 10
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                            />
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right flex items-center justify-end gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          {product.rating}
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
        </div>
      )}

      {/* ========== Détails Catégorie Tab ========== */}
      {activeTab === "details" && (
        <div className="space-y-8">
          {/* Modification toggle */}
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
                    ? "Vous pouvez modifier les informations"
                    : "Formulaire en lecture seule"}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isEditingDetails}
              onClick={() => setIsEditingDetails(!isEditingDetails)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${isEditingDetails ? "bg-primary" : "bg-muted-foreground/30"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${isEditingDetails ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* Form */}
          <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
            <form className="space-y-8">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Package className="h-4 w-4 text-muted-foreground" /> Nom du
                  catégorie *
                </label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ex: Casque Audio Bluetooth"
                  className="h-11"
                  disabled={!isEditingDetails}
                />
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
                  aria-checked={isVisible}
                  onClick={() => {
                    if (isEditingDetails) setIsVisible(!isVisible);
                  }}
                  disabled={!isEditingDetails}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${isVisible ? "bg-primary" : "bg-muted-foreground/30"} ${!isEditingDetails ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${isVisible ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <div className="-mx-6 md:-mx-8 px-6 md:px-8 py-6 bg-muted/5 rounded-xl border-y border-border/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <ImagePlus className="h-4 w-4 text-muted-foreground" />{" "}
                      Image du catégorie
                    </label>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                      {categoryImage ? "1/1" : "0/1"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {categoryImage ? (
                      <div className="relative aspect-square rounded-xl border border-border/50 bg-muted overflow-hidden shadow-sm group">
                        <img
                          src={categoryImage}
                          alt="Catégorie"
                          className="h-full w-full object-cover"
                        />
                        {isEditingDetails && (
                          <>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm p-1.5 rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <label
                        htmlFor="category-image"
                        className={`aspect-square flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/40 hover:bg-muted/60 hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden ${!isEditingDetails ? "pointer-events-none opacity-50" : ""}`}
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
                          id="category-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={!isEditingDetails}
                        />
                      </label>
                    )}
                  </div>
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

      {/* ========== Produits Associés Tab ========== */}
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${isEditingProducts ? "bg-primary" : "bg-muted-foreground/30"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${isEditingProducts ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit à ajouter..."
                className="h-11 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!isEditingProducts}
              />
            </div>

            {isEditingProducts && searchQuery && (
              <div className="mb-6 bg-muted/20 rounded-xl p-3 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Produits disponibles
                </p>
                <div className="space-y-1">
                  {filteredAvailable.length > 0 ? (
                    filteredAvailable.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-muted/30 rounded-lg"
                      >
                        <span className="text-sm">{product.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addProduct(product)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Ajouter
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground px-3">
                      Aucun produit trouvé
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" /> Produits
                associés ({associatedProducts.length})
              </h3>
              {associatedProducts.length === 0 ? (
                <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border/50 rounded-xl">
                  Aucun produit associé pour le moment.
                </div>
              ) : (
                <div className="space-y-2">
                  {associatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between px-4 py-3 bg-muted/10 rounded-xl border border-border/50"
                    >
                      <span className="text-sm font-medium">
                        {product.name}
                      </span>
                      {isEditingProducts && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4 mr-1" /> Retirer
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-8">
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
      )}
    </DashboardLayout>
  );
}
