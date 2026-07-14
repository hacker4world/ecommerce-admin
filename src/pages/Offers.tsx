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
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Filter,
  Grid3X3,
  Layers,
  List,
  Package,
  Pencil,
  Percent,
  Plus,
  RotateCcw,
  Search,
  Tag,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Extended mock data ----------
const INITIAL_OFFERS = [
  {
    id: "1",
    name: "Soldes d'été – 20% sur les casques",
    type: "category" as const,
    affectedProducts: 12,
    soldProducts: 342,
    totalRevenue: 28450,
    reductionType: "percentage" as const,
    reductionValue: 20,
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    status: "active",
    usageCount: 45,
    usageLimit: 100,
  },
  {
    id: "2",
    name: "Réduction fixe sur les enceintes",
    type: "product" as const,
    affectedProducts: 5,
    soldProducts: 98,
    totalRevenue: 6860,
    reductionType: "fixed" as const,
    reductionValue: 15,
    startDate: "2026-07-10",
    endDate: "2026-08-15",
    status: "scheduled",
    usageCount: 0,
    usageLimit: 50,
  },
  {
    id: "3",
    name: "Pack microphone + pied",
    type: "product" as const,
    affectedProducts: 2,
    soldProducts: 30,
    totalRevenue: 2100,
    reductionType: "fixed" as const,
    reductionValue: 30,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    status: "expired",
    usageCount: 12,
    usageLimit: 0,
  },
  {
    id: "4",
    name: "Promo accessoires 10%",
    type: "category" as const,
    affectedProducts: 15,
    soldProducts: 120,
    totalRevenue: 8400,
    reductionType: "percentage" as const,
    reductionValue: 10,
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    status: "draft",
    usageCount: 0,
    usageLimit: 0,
  },
];

export function Offers() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<
    (typeof INITIAL_OFFERS)[0] | null
  >(null);

  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "category" | "product">(
    "all",
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "scheduled" | "expired"
  >("all");
  const [filterReductionType, setFilterReductionType] = useState<
    "all" | "percentage" | "fixed"
  >("all");
  const [filterReductionFrom, setFilterReductionFrom] = useState("");
  const [filterReductionTo, setFilterReductionTo] = useState("");
  const [filterSoldFrom, setFilterSoldFrom] = useState("");
  const [filterSoldTo, setFilterSoldTo] = useState("");
  const [filterRevenueFrom, setFilterRevenueFrom] = useState("");
  const [filterRevenueTo, setFilterRevenueTo] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Filtered offers
  const filteredOffers = useMemo(() => {
    let result = offers;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o) => o.name.toLowerCase().includes(q));
    }

    // Type filter
    if (filterType !== "all") {
      result = result.filter((o) => o.type === filterType);
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((o) => o.status === filterStatus);
    }

    // Reduction type filter
    if (filterReductionType !== "all") {
      result = result.filter((o) => o.reductionType === filterReductionType);
    }

    // Reduction value range
    const rFrom = parseFloat(filterReductionFrom);
    const rTo = parseFloat(filterReductionTo);
    if (!isNaN(rFrom)) {
      result = result.filter((o) => o.reductionValue >= rFrom);
    }
    if (!isNaN(rTo)) {
      result = result.filter((o) => o.reductionValue <= rTo);
    }

    // Sold products range
    const sFrom = parseInt(filterSoldFrom);
    const sTo = parseInt(filterSoldTo);
    if (!isNaN(sFrom)) {
      result = result.filter((o) => o.soldProducts >= sFrom);
    }
    if (!isNaN(sTo)) {
      result = result.filter((o) => o.soldProducts <= sTo);
    }

    // Revenue range
    const revFrom = parseFloat(filterRevenueFrom);
    const revTo = parseFloat(filterRevenueTo);
    if (!isNaN(revFrom)) {
      result = result.filter((o) => o.totalRevenue >= revFrom);
    }
    if (!isNaN(revTo)) {
      result = result.filter((o) => o.totalRevenue <= revTo);
    }

    // Start date range (filter offers whose startDate >= filterStartDate)
    if (filterStartDate) {
      result = result.filter((o) => o.startDate >= filterStartDate);
    }
    // End date range (filter offers whose endDate <= filterEndDate)
    if (filterEndDate) {
      result = result.filter((o) => o.endDate <= filterEndDate);
    }

    return result;
  }, [
    offers,
    searchQuery,
    filterType,
    filterStatus,
    filterReductionType,
    filterReductionFrom,
    filterReductionTo,
    filterSoldFrom,
    filterSoldTo,
    filterRevenueFrom,
    filterRevenueTo,
    filterStartDate,
    filterEndDate,
  ]);

  // Summary counts based on filtered offers
  const summary = useMemo(() => {
    const active = filteredOffers.filter((o) => o.status === "active").length;
    const scheduled = filteredOffers.filter(
      (o) => o.status === "scheduled",
    ).length;
    const expired = filteredOffers.filter((o) => o.status === "expired").length;
    return { active, scheduled, expired };
  }, [filteredOffers]);

  const formatReduction = (offer: (typeof offers)[0]) => {
    if (offer.reductionType === "percentage")
      return `-${offer.reductionValue}%`;
    return `-${offer.reductionValue} TND`;
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-emerald-500/10 text-emerald-600",
      scheduled: "bg-blue-500/10 text-blue-600",
      expired: "bg-red-500/10 text-red-600",
      draft: "bg-muted-foreground/20 text-muted-foreground",
    };
    const labels: Record<string, string> = {
      active: "Actif",
      scheduled: "Planifié",
      expired: "Expiré",
      draft: "Brouillon",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || ""}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === "active"
              ? "bg-emerald-500"
              : status === "scheduled"
                ? "bg-blue-500"
                : status === "expired"
                  ? "bg-red-500"
                  : "bg-muted-foreground"
          }`}
        />
        {labels[status] || status}
      </span>
    );
  };

  // Delete handlers
  const openDeleteModal = (offer: (typeof INITIAL_OFFERS)[0]) => {
    setOfferToDelete(offer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (offerToDelete) {
      setOffers((prev) => prev.filter((o) => o.id !== offerToDelete.id));
    }
    setDeleteModalOpen(false);
    setOfferToDelete(null);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterType("all");
    setFilterStatus("all");
    setFilterReductionType("all");
    setFilterReductionFrom("");
    setFilterReductionTo("");
    setFilterSoldFrom("");
    setFilterSoldTo("");
    setFilterRevenueFrom("");
    setFilterRevenueTo("");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Management des offres
          </h1>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher offres par nom"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-background border-input shadow-sm focus-visible:ring-1"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border bg-background p-1">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === "table"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="h-4 w-4" /> Tableau
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === "cards"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Grid3X3 className="h-4 w-4" /> Cartes
            </button>
          </div>

          <Button
            variant="outline"
            className="gap-2 border-border h-10 shadow-sm"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4" /> Filtres avancés
          </Button>
          <Button
            onClick={() => navigate("/offers/create")}
            className="gap-2 h-10 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Ajouter une offre
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Offres actives</p>
            <p className="text-2xl font-bold text-foreground">
              {summary.active}
            </p>
            <p className="text-xs text-muted-foreground">En cours</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Offres planifiées</p>
            <p className="text-2xl font-bold text-foreground">
              {summary.scheduled}
            </p>
            <p className="text-xs text-muted-foreground">À venir</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-sm p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-red-500/10">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Offres expirées</p>
            <p className="text-2xl font-bold text-foreground">
              {summary.expired}
            </p>
            <p className="text-xs text-muted-foreground">Terminées</p>
          </div>
        </div>
      </div>

      {/* Table View (unchanged except using filteredOffers) */}
      {viewMode === "table" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span>Nom de l'offre</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary/70" />
                    <span>Produits affectés</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary/70" />
                    <span>Réduction</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary/70" />
                    <span>Période</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary/70" />
                    <span>Statut</span>
                  </div>
                </th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                >
                  <td className="py-3 px-6 font-medium text-foreground">
                    {offer.name}
                  </td>
                  <td className="py-3 px-6 text-foreground">
                    {offer.affectedProducts}
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {formatReduction(offer)}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-xs text-muted-foreground">
                    {offer.startDate} → {offer.endDate}
                  </td>
                  <td className="py-3 px-6">{statusBadge(offer.status)}</td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => navigate("/offers/details")}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => openDeleteModal(offer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOffers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Aucune offre trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Card View (unchanged except using filteredOffers) */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => {
            const statusAccent =
              offer.status === "active"
                ? "border-t-emerald-500"
                : offer.status === "scheduled"
                  ? "border-t-blue-500"
                  : offer.status === "expired"
                    ? "border-t-red-500"
                    : "border-t-muted-foreground";
            return (
              <div
                key={offer.id}
                className={cn(
                  "rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 overflow-hidden flex flex-col group hover:shadow-md transition-all",
                  "border-t-4",
                  statusAccent,
                )}
              >
                <div className="p-5 pb-2 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        offer.status === "active"
                          ? "bg-emerald-500/10"
                          : offer.status === "scheduled"
                            ? "bg-blue-500/10"
                            : offer.status === "expired"
                              ? "bg-red-500/10"
                              : "bg-muted-foreground/20",
                      )}
                    >
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                        {offer.name}
                      </h3>
                    </div>
                  </div>
                  {statusBadge(offer.status)}
                </div>
                <div className="px-5 py-3 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{offer.affectedProducts}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-muted-foreground">Réduction :</span>
                      <span className="font-medium text-foreground">
                        {formatReduction(offer)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">
                      {offer.startDate} → {offer.endDate}
                    </span>
                  </div>
                </div>
                <div className="px-5 pb-5 mt-auto pt-3 border-t border-border/50 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-lg"
                    onClick={() => navigate("/offers/details")}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                    onClick={() => openDeleteModal(offer)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </Button>
                </div>
              </div>
            );
          })}
          {filteredOffers.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Aucune offre trouvée.
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle>Supprimer l'offre</DialogTitle>
            </DialogHeader>
            <p className="text-center text-sm text-muted-foreground">
              Vous êtes sur le point de supprimer{" "}
              <span className="font-semibold text-foreground">
                {offerToDelete?.name}
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
                    Suppression permanente de l'offre et de ses données.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Les produits inclus retrouveront leur prix d'origine.
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

      {/* ========== Filter Modal ========== */}
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
            {/* Type filter */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
              <label className="text-sm font-medium mb-3 block">
                Type d'offre
              </label>
              <div className="flex rounded-lg border border-border bg-background p-1 w-fit">
                <button
                  onClick={() => setFilterType("all")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterType === "all"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Check className="h-4 w-4" /> Tous
                </button>
                <button
                  onClick={() => setFilterType("category")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterType === "category"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Layers className="h-4 w-4" /> Par catégorie
                </button>
                <button
                  onClick={() => setFilterType("product")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterType === "product"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Package className="h-4 w-4" /> Par produit
                </button>
              </div>
            </div>

            {/* Status filter */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
              <label className="text-sm font-medium mb-3 block">Statut</label>
              <div className="flex rounded-lg border border-border bg-background p-1 w-fit flex-wrap gap-1">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterStatus === "all"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Check className="h-4 w-4" /> Tous
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterStatus === "active"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <CheckCircle className="h-4 w-4" /> Actif
                </button>
                <button
                  onClick={() => setFilterStatus("scheduled")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterStatus === "scheduled"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Clock className="h-4 w-4" /> Planifié
                </button>
                <button
                  onClick={() => setFilterStatus("expired")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterStatus === "expired"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <XCircle className="h-4 w-4" /> Expiré
                </button>
              </div>
            </div>

            {/* Reduction type */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
              <label className="text-sm font-medium mb-3 block">
                Type de réduction
              </label>
              <div className="flex rounded-lg border border-border bg-background p-1 w-fit">
                <button
                  onClick={() => setFilterReductionType("all")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterReductionType === "all"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Check className="h-4 w-4" /> Tous
                </button>
                <button
                  onClick={() => setFilterReductionType("percentage")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterReductionType === "percentage"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Percent className="h-4 w-4" /> Pourcentage
                </button>
                <button
                  onClick={() => setFilterReductionType("fixed")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterReductionType === "fixed"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Tag className="h-4 w-4" /> Montant fixe
                </button>
              </div>
            </div>

            {/* Reduction value range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Percent className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Valeur de réduction
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filterReductionFrom}
                    onChange={(e) => setFilterReductionFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filterReductionTo}
                    onChange={(e) => setFilterReductionTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>

              {/* Sold products range */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Produits vendus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filterSoldFrom}
                    onChange={(e) => setFilterSoldFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filterSoldTo}
                    onChange={(e) => setFilterSoldTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>

              {/* Revenue range */}
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

            {/* Date range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Date de début (après le)
                  </span>
                </div>
                <Input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="h-9 bg-background"
                />
              </div>
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Date de fin (avant le)
                  </span>
                </div>
                <Input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="h-9 bg-background"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Réinitialiser
            </Button>
            <Button onClick={() => setFilterModalOpen(false)} className="gap-2">
              <Check className="h-4 w-4" /> Appliquer les filtres
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
