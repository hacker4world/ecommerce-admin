import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Grid3X3,
  Layers,
  List,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
  Warehouse,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Produits mockés ----------
const INITIAL_PRODUCTS = [
  {
    id: "1",
    name: "Casque Audio Bluetooth Pro",
    price: 149.9,
    stock: 55,
    category: "Audio",
    purchases: 342,
    images: [
      "https://picsum.photos/id/1/300/300",
      "https://picsum.photos/id/2/300/300",
      "https://picsum.photos/id/3/300/300",
    ],
  },
  {
    id: "2",
    name: "Souris Gaming RGB",
    price: 79.9,
    stock: 120,
    category: "Périphériques",
    purchases: 187,
    images: [
      "https://picsum.photos/id/4/300/300",
      "https://picsum.photos/id/5/300/300",
    ],
  },
  {
    id: "3",
    name: "Clavier Mécanique Sans Fil",
    price: 249.9,
    stock: 32,
    category: "Périphériques",
    purchases: 94,
    images: [
      "https://picsum.photos/id/6/300/300",
      "https://picsum.photos/id/7/300/300",
      "https://picsum.photos/id/8/300/300",
    ],
  },
];

export function Products() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [carouselIndexes, setCarouselIndexes] = useState<
    Record<string, number>
  >({});

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<
    (typeof INITIAL_PRODUCTS)[0] | null
  >(null);

  // Advanced filters modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Filter values
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [stockFrom, setStockFrom] = useState("");
  const [stockTo, setStockTo] = useState("");
  const [salesFrom, setSalesFrom] = useState("");
  const [salesTo, setSalesTo] = useState("");
  const [deliveryPriceFrom, setDeliveryPriceFrom] = useState("");
  const [deliveryPriceTo, setDeliveryPriceTo] = useState("");

  // Category dropdown state
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleNextImage = (productId: string, imagesLength: number) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % imagesLength,
    }));
  };

  const handlePrevImage = (productId: string, imagesLength: number) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + imagesLength) % imagesLength,
    }));
  };

  const openDeleteModal = (product: (typeof INITIAL_PRODUCTS)[0]) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    }
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterCategory([]);
    setPriceFrom("");
    setPriceTo("");
    setStockFrom("");
    setStockTo("");
    setSalesFrom("");
    setSalesTo("");
    setDeliveryPriceFrom("");
    setDeliveryPriceTo("");
  };

  // Apply filters locally (mock filtering for demo)
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (filterCategory.length > 0 && !filterCategory.includes(product.category))
      return false;

    // Price range
    const fromP = parseFloat(priceFrom);
    const toP = parseFloat(priceTo);
    if (!isNaN(fromP) && product.price < fromP) return false;
    if (!isNaN(toP) && product.price > toP) return false;

    // Stock range
    const fromS = parseInt(stockFrom);
    const toS = parseInt(stockTo);
    if (!isNaN(fromS) && product.stock < fromS) return false;
    if (!isNaN(toS) && product.stock > toS) return false;

    // Sales range
    const fromSa = parseInt(salesFrom);
    const toSa = parseInt(salesTo);
    if (!isNaN(fromSa) && product.purchases < fromSa) return false;
    if (!isNaN(toSa) && product.purchases > toSa) return false;

    // Delivery price - we don't have a field, we'll ignore but keep UI (can be extended)
    // For now, skip delivery price filtering

    return true;
  });

  const stockSummary = useMemo(() => {
    const well = filteredProducts.filter((p) => p.stock > 50).length;
    const nearing = filteredProducts.filter(
      (p) => p.stock > 10 && p.stock <= 50,
    ).length;
    const ended = filteredProducts.filter((p) => p.stock <= 10).length;
    return { well, nearing, ended };
  }, [filteredProducts]);

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Management des produits
          </h1>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher produits par nom"
            className="pl-10 h-10 bg-background border-input shadow-sm focus-visible:ring-1"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border bg-background p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
              Tableau
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              Cartes
            </button>
          </div>

          <Button
            variant="outline"
            className="gap-2 border-border h-10 shadow-sm"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Filtres avancés
          </Button>
          <Button
            onClick={() => navigate("/products/add")}
            className="gap-2 h-10 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Bien approvisionné */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bien approvisionné</p>
            <p className="text-2xl font-bold text-foreground">
              {stockSummary.well}
            </p>
            <p className="text-xs text-muted-foreground">Stock &gt; 50</p>
          </div>
        </div>

        {/* Stock faible */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Stock faible</p>
            <p className="text-2xl font-bold text-foreground">
              {stockSummary.nearing}
            </p>
            <p className="text-xs text-muted-foreground">11 – 50 unités</p>
          </div>
        </div>

        {/* Rupture de stock */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-red-500/10">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Stock épuisé</p>
            <p className="text-2xl font-bold text-foreground">
              {stockSummary.ended}
            </p>
            <p className="text-xs text-muted-foreground">≤ 10 unités</p>
          </div>
        </div>
      </div>

      {/* ========== Vue Tableau ========== */}
      {viewMode === "table" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="tracking-wider">Nom du produit</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary/70" />
                    <span className="tracking-wider">Prix unitaire</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-primary/70" />
                    <span className="tracking-wider">Stock disponible</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-primary/70" />
                    <span className="tracking-wider">Catégorie</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary/70" />
                    <span className="tracking-wider">Achats</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary/70" />
                    <span className="tracking-wider">Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                >
                  <td className="py-3 px-6 font-medium text-foreground">
                    {product.name}
                  </td>
                  <td className="py-3 px-6 text-foreground">
                    {product.price.toFixed(2)} TND
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 50
                          ? "bg-emerald-500/10 text-emerald-600"
                          : product.stock > 10
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          product.stock > 50
                            ? "bg-emerald-500"
                            : product.stock > 10
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      />
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="py-3 px-6 text-foreground">
                    {product.purchases}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(`/products/details`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => openDeleteModal(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Aucun produit trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========== Vue Cartes ========== */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const currentImageIndex = carouselIndexes[product.id] || 0;
            return (
              <div
                key={product.id}
                className="rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-4 flex flex-col gap-4 group hover:shadow-md transition-all"
              >
                {/* Carrousel d'images */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border/50 bg-muted">
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-opacity duration-300"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage(product.id, product.images.length);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 hover:bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="h-4 w-4 text-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage(product.id, product.images.length);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 hover:bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-4 w-4 text-foreground" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {product.images.map((_, idx) => (
                          <span
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              idx === currentImageIndex
                                ? "bg-white shadow-sm"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Infos */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-foreground leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 text-xs font-medium">
                      {product.category}
                    </span>
                    <span className="font-bold text-foreground">
                      {product.price.toFixed(2)} TND
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Warehouse className="h-3.5 w-3.5" />
                    Stock: {product.stock}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-lg"
                    onClick={() => navigate(`/products/details`)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                    onClick={() => openDeleteModal(product)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </Button>
                </div>
              </div>
            );
          })}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Aucun produit trouvé.
            </div>
          )}
        </div>
      )}

      {/* ========== Modal de confirmation de suppression ========== */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle>Supprimer le produit</DialogTitle>
            </DialogHeader>
            <p className="text-center text-sm text-muted-foreground">
              Vous êtes sur le point de supprimer{" "}
              <span className="font-semibold text-foreground">
                {productToDelete?.name}
              </span>
              .
            </p>
            <div className="w-full space-y-3 bg-muted/30 rounded-xl p-4 text-sm">
              <p className="font-medium text-foreground">
                Cette action est irréversible et entraînera :
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Trash2 className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
                  <span>
                    Suppression permanente du produit et de toutes ses données.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Retrait immédiat du catalogue de la boutique.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Annulation des paniers clients contenant cet article.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== Modal des filtres avancés ========== */}
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* En‑tête avec icône */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Filtres avancés</DialogTitle>
              <DialogDescription className="text-xs">
                Affinez votre recherche avec les critères ci‑dessous.
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-5">
            {/* Catégories */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Catégories</span>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="flex items-center justify-between w-full bg-background border border-border rounded-xl px-4 py-2.5 text-left hover:border-primary/50 transition"
                >
                  <span
                    className={
                      filterCategory.length === 0 ? "text-muted-foreground" : ""
                    }
                  >
                    {filterCategory.length === 0
                      ? "Toutes les catégories"
                      : `${filterCategory.length} catégorie(s) sélectionnée(s)`}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      categoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto p-2">
                    {[
                      "Audio",
                      "Périphériques",
                      "Électronique",
                      "Accessoires",
                    ].map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filterCategory.includes(cat)}
                          onChange={() =>
                            setFilterCategory((prev) =>
                              prev.includes(cat)
                                ? prev.filter((c) => c !== cat)
                                : [...prev, cat],
                            )
                          }
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Plages numériques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prix */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Prix (TND)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Warehouse className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={stockFrom}
                    onChange={(e) => setStockFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={stockTo}
                    onChange={(e) => setStockTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>

              {/* Ventes */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Ventes totales</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={salesFrom}
                    onChange={(e) => setSalesFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={salesTo}
                    onChange={(e) => setSalesTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>

              {/* Prix de livraison */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Prix de livraison (TND)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={deliveryPriceFrom}
                    onChange={(e) => setDeliveryPriceFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={deliveryPriceTo}
                    onChange={(e) => setDeliveryPriceTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d’action */}
          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
            <Button onClick={() => setFilterModalOpen(false)} className="gap-2">
              <Check className="h-4 w-4" />
              Appliquer les filtres
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
