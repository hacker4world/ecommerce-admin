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
  DollarSign,
  Filter,
  Grid3X3,
  List,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Tag,
  Trash2,
  Warehouse,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Mock data with images ----------
const INITIAL_CATEGORIES = [
  {
    id: "1",
    name: "Casques",
    productCount: 12,
    totalStock: 340,
    totalSales: 1245,
    totalRevenue: 34250,
    active: true,
    image: "https://picsum.photos/id/20/300/300",
  },
  {
    id: "2",
    name: "Écouteurs",
    productCount: 8,
    totalStock: 210,
    totalSales: 890,
    totalRevenue: 22450,
    active: true,
    image: "https://picsum.photos/id/21/300/300",
  },
  {
    id: "3",
    name: "Enceintes",
    productCount: 5,
    totalStock: 85,
    totalSales: 430,
    totalRevenue: 10750,
    active: false,
    image: null,
  },
  {
    id: "4",
    name: "Microphones",
    productCount: 3,
    totalStock: 120,
    totalSales: 310,
    totalRevenue: 8200,
    active: true,
    image: "https://picsum.photos/id/22/300/300",
  },
  {
    id: "5",
    name: "Accessoires",
    productCount: 15,
    totalStock: 560,
    totalSales: 2100,
    totalRevenue: 52500,
    active: true,
    image: null,
  },
];

export function Categories() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<
    (typeof INITIAL_CATEGORIES)[0] | null
  >(null);

  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterProductsFrom, setFilterProductsFrom] = useState("");
  const [filterProductsTo, setFilterProductsTo] = useState("");
  const [filterSalesFrom, setFilterSalesFrom] = useState("");
  const [filterSalesTo, setFilterSalesTo] = useState("");
  const [filterRevenueFrom, setFilterRevenueFrom] = useState("");
  const [filterRevenueTo, setFilterRevenueTo] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const pFrom = parseInt(filterProductsFrom);
      const pTo = parseInt(filterProductsTo);
      if (!isNaN(pFrom) && cat.productCount < pFrom) return false;
      if (!isNaN(pTo) && cat.productCount > pTo) return false;

      const sFrom = parseInt(filterSalesFrom);
      const sTo = parseInt(filterSalesTo);
      if (!isNaN(sFrom) && cat.totalSales < sFrom) return false;
      if (!isNaN(sTo) && cat.totalSales > sTo) return false;

      const rFrom = parseFloat(filterRevenueFrom);
      const rTo = parseFloat(filterRevenueTo);
      if (!isNaN(rFrom) && cat.totalRevenue < rFrom) return false;
      if (!isNaN(rTo) && cat.totalRevenue > rTo) return false;

      if (filterActive === "active" && !cat.active) return false;
      if (filterActive === "inactive" && cat.active) return false;

      return true;
    });
  }, [
    categories,
    filterProductsFrom,
    filterProductsTo,
    filterSalesFrom,
    filterSalesTo,
    filterRevenueFrom,
    filterRevenueTo,
    filterActive,
  ]);

  // Stock summary
  const stockSummary = useMemo(() => {
    const well = filteredCategories.filter((c) => c.totalStock > 50).length;
    const low = filteredCategories.filter(
      (c) => c.totalStock > 10 && c.totalStock <= 50,
    ).length;
    const out = filteredCategories.filter((c) => c.totalStock <= 10).length;
    return { well, low, out };
  }, [filteredCategories]);

  // Delete handlers
  const openDeleteModal = (category: (typeof INITIAL_CATEGORIES)[0]) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
    }
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterProductsFrom("");
    setFilterProductsTo("");
    setFilterSalesFrom("");
    setFilterSalesTo("");
    setFilterRevenueFrom("");
    setFilterRevenueTo("");
    setFilterActive("all");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Management des catégories
          </h1>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher categories par nom"
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
            onClick={() => navigate("/categories/add")}
            className="gap-2 h-10 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Ajouter un catégorie
          </Button>
        </div>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Stock faible</p>
            <p className="text-2xl font-bold text-foreground">
              {stockSummary.low}
            </p>
            <p className="text-xs text-muted-foreground">11 – 50 unités</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-red-500/10">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Stock épuisé</p>
            <p className="text-2xl font-bold text-foreground">
              {stockSummary.out}
            </p>
            <p className="text-xs text-muted-foreground">≤ 10 unités</p>
          </div>
        </div>
      </div>

      {/* ========== Table View ========== */}
      {viewMode === "table" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="tracking-wider">Nom du catégorie</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary/70" />
                    <span className="tracking-wider">Produits associés</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-primary/70" />
                    <span className="tracking-wider">Stock total</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary/70" />
                    <span className="tracking-wider">Statut</span>
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
              {filteredCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                >
                  <td className="py-3 px-6 font-medium text-foreground">
                    {cat.name}
                  </td>
                  <td className="py-3 px-6 text-foreground">
                    {cat.productCount}
                  </td>
                  <td className="py-3 px-6">{cat.totalStock}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        cat.active
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          cat.active ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {cat.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(`/categories/${cat.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => openDeleteModal(cat)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Aucune catégorie trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========== Card View (with images) ========== */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 overflow-hidden flex flex-col group hover:shadow-md transition-all"
            >
              {/* Category Image */}
              <div className="h-32 w-full bg-muted relative">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted">
                    <Package className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      cat.active
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        cat.active ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    {cat.active ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {cat.name}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Produits</p>
                    <p className="font-medium">{cat.productCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stock total</p>
                    <p className="font-medium">{cat.totalStock}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ventes</p>
                    <p className="font-medium">{cat.totalSales}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenu</p>
                    <p className="font-medium">
                      {cat.totalRevenue.toLocaleString()} TND
                    </p>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-lg"
                    onClick={() => navigate(`/categories/${cat.id}`)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                    onClick={() => openDeleteModal(cat)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Aucune catégorie trouvée.
            </div>
          )}
        </div>
      )}

      {/* ========== Delete Confirmation Modal (unchanged) ========== */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle>Supprimer la catégorie</DialogTitle>
            </DialogHeader>
            <p className="text-center text-sm text-muted-foreground">
              Vous êtes sur le point de supprimer{" "}
              <span className="font-semibold text-foreground">
                {categoryToDelete?.name}
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
                    Suppression permanente de la catégorie et de ses données.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Les produits associés ne seront pas supprimés mais perdront
                    leur catégorie.
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

      {/* ========== Filter Modal (unchanged) ========== */}
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center gap-3 mb-2">
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

          <div className="space-y-5 py-4">
            <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
              <label className="text-sm font-medium mb-3 block">Statut</label>
              <div className="flex rounded-lg border border-border bg-background p-1 w-fit">
                <button
                  onClick={() => setFilterActive("all")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filterActive === "all"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Check className="h-4 w-4" />
                  Tous
                </button>
                <button
                  onClick={() => setFilterActive("active")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filterActive === "active"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  Actifs
                </button>
                <button
                  onClick={() => setFilterActive("inactive")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filterActive === "inactive"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <EyeOff className="h-4 w-4" />
                  Inactifs
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Produits associés</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filterProductsFrom}
                    onChange={(e) => setFilterProductsFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filterProductsTo}
                    onChange={(e) => setFilterProductsTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>

              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Ventes totales</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filterSalesFrom}
                    onChange={(e) => setFilterSalesFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filterSalesTo}
                    onChange={(e) => setFilterSalesTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>

              <div className="bg-muted/20 rounded-xl p-4 border border-border/50 md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Revenu total (TND)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filterRevenueFrom}
                    onChange={(e) => setFilterRevenueFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filterRevenueTo}
                    onChange={(e) => setFilterRevenueTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 mt-4">
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
