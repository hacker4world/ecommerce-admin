import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Eye,
  Layers,
  Megaphone,
  Package,
  Percent,
  Save,
  Search,
  Tag,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Mock data ----------
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

// ---------- Bar style options ----------
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

export function CreateOffer() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"basic" | "products" | "period">(
    "basic",
  );

  // Basic info state
  const [offerName, setOfferName] = useState("");
  const [offerType, setOfferType] = useState<"category" | "product">(
    "category",
  );
  const [showNotificationBar, setShowNotificationBar] = useState(false);
  const [notificationText, setNotificationText] = useState(
    "🎉 Profitez de notre offre spéciale dès maintenant !",
  );
  const [notificationColor, setNotificationColor] = useState("#3b82f6");
  const [barStyle, setBarStyle] = useState("simple");
  const [showSaleCounter, setShowSaleCounter] = useState(false);
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  // Products/categories selection
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [reductionMode, setReductionMode] = useState<"all" | "individual">(
    "all",
  );
  const [globalReductionValue, setGlobalReductionValue] = useState("");
  const [individualReductions, setIndividualReductions] = useState<
    Record<string, string>
  >({});
  const [productSearch, setProductSearch] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Period state
  const [activationMode, setActivationMode] = useState<"now" | "schedule">(
    "now",
  );
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");

  const currentStyle =
    BAR_STYLES.find((s) => s.value === barStyle) || BAR_STYLES[0];

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return MOCK_PRODUCTS;
    const q = productSearch.toLowerCase();
    return MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
  }, [productSearch]);

  // Toggle item selection
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
      <div className="mb-8 flex items-center gap-4">
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
            Créer une nouvelle offre
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configurez les informations de base, les produits concernés et la
            période
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-border">
        <nav className="-mb-px flex gap-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("basic")}
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "basic"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Informations de base
            </span>
            {activeTab === "basic" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "products"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Sélection des produits
            </span>
            {activeTab === "products" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("period")}
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "period"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Période de validité
            </span>
            {activeTab === "period" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* ========== Basic Info Tab ========== */}
      {activeTab === "basic" && (
        <div className="space-y-8">
          <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
            <form className="space-y-8">
              {/* Offer Name */}
              <div className="space-y-2">
                <label
                  htmlFor="offerName"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                  Nom de l'offre *
                </label>
                <Input
                  id="offerName"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  placeholder="Ex: Soldes d'été – 20% sur les casques"
                  className="h-11"
                />
              </div>

              {/* Offer Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  Type d'offre
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOfferType("category");
                      setSelectedItemIds([]);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      offerType === "category"
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-background hover:border-primary/40"
                    }`}
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
                      setOfferType("product");
                      setSelectedItemIds([]);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      offerType === "product"
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-background hover:border-primary/40"
                    }`}
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

              {/* Notification Bar Section */}
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
                    onClick={() => setShowNotificationBar(!showNotificationBar)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                      showNotificationBar
                        ? "bg-primary"
                        : "bg-muted-foreground/30",
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
                    {/* Text & Color */}
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
                          />
                          <Input
                            value={notificationColor}
                            onChange={(e) =>
                              setNotificationColor(e.target.value)
                            }
                            className="h-10 flex-1"
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Style Select */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Style de la barre
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setStyleDropdownOpen(!styleDropdownOpen)
                          }
                          className="flex items-center justify-between w-full border border-border rounded-xl px-4 py-2.5 text-left bg-background hover:border-primary/50 transition"
                        >
                          <span className="text-sm">{currentStyle.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform ${
                              styleDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {styleDropdownOpen && (
                          <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-xl shadow-lg p-1">
                            {BAR_STYLES.map((style) => (
                              <button
                                key={style.value}
                                type="button"
                                onClick={() => {
                                  setBarStyle(style.value);
                                  setStyleDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition ${
                                  barStyle === style.value
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-foreground"
                                }`}
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

                    {/* Sale Counter Toggle */}
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
                        onClick={() => setShowSaleCounter(!showSaleCounter)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                          showSaleCounter
                            ? "bg-primary"
                            : "bg-muted-foreground/30",
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

                    {/* Live Preview */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        Aperçu en temps réel
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
                            className={`py-3 px-4 text-white ${
                              barStyle === "compact" ? "py-2 text-xs" : ""
                            } ${currentStyle.previewBg}`}
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
                        {/* Simulated store header */}
                        <div className="bg-background px-4 py-3 flex items-center gap-3 border-t border-border/30">
                          <div className="w-8 h-8 rounded-md bg-muted" />
                          <div className="flex-1 space-y-1">
                            <div className="h-2 w-24 bg-muted rounded" />
                            <div className="h-2 w-16 bg-muted rounded" />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cette bannière apparaîtra en haut de chaque page de la
                        boutique pendant la période de l'offre.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="h-11 px-6 rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => setActiveTab("products")}
                  className="h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  <Save className="h-4 w-4" />
                  Continuer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== Products Selection Tab ========== */}
      {activeTab === "products" && (
        <div className="space-y-8">
          <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
            <div className="space-y-10">
              {/* Section 1: Item Selection */}
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
                      onClick={() =>
                        setCategoryDropdownOpen(!categoryDropdownOpen)
                      }
                      className="flex items-center justify-between w-full border border-border rounded-xl px-4 py-2.5 text-left bg-background hover:border-primary/50 transition"
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
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          categoryDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {categoryDropdownOpen && (
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
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Section 2: Reduction Configuration */}
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
                            onClick={() => setDiscountType("percentage")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              discountType === "percentage"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Percent className="h-4 w-4" /> Pourcentage
                          </button>
                          <button
                            type="button"
                            onClick={() => setDiscountType("fixed")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              discountType === "fixed"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
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
                            onClick={() => setReductionMode("all")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              reductionMode === "all"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Check className="h-4 w-4" /> À tous
                          </button>
                          <button
                            type="button"
                            onClick={() => setReductionMode("individual")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              reductionMode === "individual"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
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

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("basic")}
                  className="h-11 px-6 rounded-xl"
                >
                  Précédent
                </Button>
                <Button
                  onClick={() => setActiveTab("period")}
                  className="h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  <Save className="h-4 w-4" />
                  Continuer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== Period Tab ========== */}
      {activeTab === "period" && (
        <div className="space-y-8">
          <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
            <div className="space-y-10">
              {/* Section Title */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Période de validité
                </h2>
              </div>

              <div className="bg-muted/20 rounded-xl p-5 border border-border/50 space-y-6">
                {/* Activation Mode Toggle */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Mode d'activation
                  </label>
                  <div className="flex rounded-lg border border-border bg-background p-1 w-fit">
                    <button
                      type="button"
                      onClick={() => setActivationMode("now")}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activationMode === "now"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Clock className="h-4 w-4" /> Activer maintenant
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivationMode("schedule")}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activationMode === "schedule"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Calendar className="h-4 w-4" /> Planifier pour plus tard
                    </button>
                  </div>
                </div>

                {/* Date Inputs */}
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
                      />
                    </div>
                  )}
                  <div
                    className={`space-y-2 ${activationMode === "schedule" ? "" : "md:col-span-2"}`}
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
                    />
                  </div>
                </div>

                {/* Helper text */}
                <p className="text-xs text-muted-foreground">
                  {activationMode === "now"
                    ? "L'offre sera active immédiatement et expirera à la date de fin indiquée."
                    : "L'offre démarrera automatiquement à la date de début et expirera à la date de fin."}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("products")}
                  className="h-11 px-6 rounded-xl"
                >
                  Précédent
                </Button>
                <Button className="h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  <Save className="h-4 w-4" /> Enregistrer l'offre
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
