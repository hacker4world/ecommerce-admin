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
  Clock,
  Filter,
  Package,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Mock data (extended with additional fields) ----------
const INITIAL_WORKERS = [
  {
    id: "1",
    firstName: "Ali",
    lastName: "Gharbi",
    phone: "+216 20 111 222",
    totalDeliveries: 148,
    creationDate: "2026-01-15",
    successfulDeliveries: 130,
    canceledDeliveries: 12,
    pendingDeliveries: 6,
  },
  {
    id: "2",
    firstName: "Leila",
    lastName: "Trabelsi",
    phone: "+216 20 333 444",
    totalDeliveries: 95,
    creationDate: "2026-03-10",
    successfulDeliveries: 80,
    canceledDeliveries: 10,
    pendingDeliveries: 5,
  },
  {
    id: "3",
    firstName: "Omar",
    lastName: "Cherif",
    phone: "+216 20 555 666",
    totalDeliveries: 210,
    creationDate: "2025-11-20",
    successfulDeliveries: 190,
    canceledDeliveries: 15,
    pendingDeliveries: 5,
  },
];

export function Workers() {
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterTotalFrom, setFilterTotalFrom] = useState("");
  const [filterTotalTo, setFilterTotalTo] = useState("");
  const [filterCreationDate, setFilterCreationDate] = useState("");
  const [filterSuccessfulFrom, setFilterSuccessfulFrom] = useState("");
  const [filterSuccessfulTo, setFilterSuccessfulTo] = useState("");
  const [filterCanceledFrom, setFilterCanceledFrom] = useState("");
  const [filterCanceledTo, setFilterCanceledTo] = useState("");
  const [filterPendingFrom, setFilterPendingFrom] = useState("");
  const [filterPendingTo, setFilterPendingTo] = useState("");

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState<
    (typeof INITIAL_WORKERS)[0] | null
  >(null);

  // Filter workers by search query and advanced filters
  const filteredWorkers = useMemo(() => {
    let result = workers;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (worker) =>
          worker.firstName.toLowerCase().includes(q) ||
          worker.lastName.toLowerCase().includes(q) ||
          worker.phone.includes(q),
      );
    }

    // Total deliveries range
    const totalFrom = parseInt(filterTotalFrom);
    const totalTo = parseInt(filterTotalTo);
    if (!isNaN(totalFrom))
      result = result.filter((w) => w.totalDeliveries >= totalFrom);
    if (!isNaN(totalTo))
      result = result.filter((w) => w.totalDeliveries <= totalTo);

    // Creation date filter (after specified date)
    if (filterCreationDate) {
      result = result.filter((w) => w.creationDate >= filterCreationDate);
    }

    // Successful deliveries range
    const successfulFrom = parseInt(filterSuccessfulFrom);
    const successfulTo = parseInt(filterSuccessfulTo);
    if (!isNaN(successfulFrom))
      result = result.filter((w) => w.successfulDeliveries >= successfulFrom);
    if (!isNaN(successfulTo))
      result = result.filter((w) => w.successfulDeliveries <= successfulTo);

    // Canceled deliveries range
    const canceledFrom = parseInt(filterCanceledFrom);
    const canceledTo = parseInt(filterCanceledTo);
    if (!isNaN(canceledFrom))
      result = result.filter((w) => w.canceledDeliveries >= canceledFrom);
    if (!isNaN(canceledTo))
      result = result.filter((w) => w.canceledDeliveries <= canceledTo);

    // Pending deliveries range
    const pendingFrom = parseInt(filterPendingFrom);
    const pendingTo = parseInt(filterPendingTo);
    if (!isNaN(pendingFrom))
      result = result.filter((w) => w.pendingDeliveries >= pendingFrom);
    if (!isNaN(pendingTo))
      result = result.filter((w) => w.pendingDeliveries <= pendingTo);

    return result;
  }, [
    workers,
    searchQuery,
    filterTotalFrom,
    filterTotalTo,
    filterCreationDate,
    filterSuccessfulFrom,
    filterSuccessfulTo,
    filterCanceledFrom,
    filterCanceledTo,
    filterPendingFrom,
    filterPendingTo,
  ]);

  // Reset filters
  const resetFilters = () => {
    setFilterTotalFrom("");
    setFilterTotalTo("");
    setFilterCreationDate("");
    setFilterSuccessfulFrom("");
    setFilterSuccessfulTo("");
    setFilterCanceledFrom("");
    setFilterCanceledTo("");
    setFilterPendingFrom("");
    setFilterPendingTo("");
  };

  // Delete handlers
  const openDeleteModal = (worker: (typeof INITIAL_WORKERS)[0]) => {
    setWorkerToDelete(worker);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (workerToDelete) {
      setWorkers((prev) => prev.filter((w) => w.id !== workerToDelete.id));
    }
    setDeleteModalOpen(false);
    setWorkerToDelete(null);
  };

  const getDeliveryBadgeStyle = (count: number) => {
    if (count > 150) return "bg-emerald-500/10 text-emerald-600";
    if (count > 100) return "bg-amber-500/10 text-amber-600";
    return "bg-muted-foreground/20 text-muted-foreground";
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gestion des livreurs
          </h1>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher livreurs par nom, prénom ou téléphone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-background border-input shadow-sm focus-visible:ring-1"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 border-border h-10 shadow-sm"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Filtres avancés
          </Button>
          <Button
            onClick={() => navigate("/livreurs/add")}
            className="gap-2 h-10 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Ajouter un livreur
          </Button>
        </div>
      </div>

      {/* Table View (unchanged, but now displays filtered workers) */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="tracking-wider">Nom</span>
                </div>
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary/70" />
                  <span className="tracking-wider">Prénom</span>
                </div>
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary/70" />
                  <span className="tracking-wider">Téléphone</span>
                </div>
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary/70" />
                  <span className="tracking-wider">Livraisons effectuées</span>
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
            {filteredWorkers.map((worker) => (
              <tr
                key={worker.id}
                className="border-b border-border/30 hover:bg-muted/20 transition-colors"
              >
                <td className="py-3 px-6 font-medium text-foreground">
                  {worker.lastName}
                </td>
                <td className="py-3 px-6 text-foreground">
                  {worker.firstName}
                </td>
                <td className="py-3 px-6 text-muted-foreground">
                  {worker.phone}
                </td>
                <td className="py-3 px-6">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getDeliveryBadgeStyle(worker.totalDeliveries)}`}
                  >
                    <Truck className="h-3.5 w-3.5" />
                    {worker.totalDeliveries}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate(`/livreurs/details`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => openDeleteModal(worker)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredWorkers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  Aucun livreur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal (unchanged) */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle>Supprimer le livreur</DialogTitle>
            </DialogHeader>
            <p className="text-center text-sm text-muted-foreground">
              Vous êtes sur le point de supprimer{" "}
              <span className="font-semibold text-foreground">
                {workerToDelete?.firstName} {workerToDelete?.lastName}
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
                    Suppression permanente du livreur et de ses données.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Les livraisons attribuées seront réassignées ou annulées.
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

      {/* ========== Advanced Filters Modal ========== */}
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
            {/* Total deliveries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total livraisons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filterTotalFrom}
                    onChange={(e) => setFilterTotalFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filterTotalTo}
                    onChange={(e) => setFilterTotalTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>

              {/* Creation date */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Date de création</span>
                </div>
                <Input
                  type="date"
                  value={filterCreationDate}
                  onChange={(e) => setFilterCreationDate(e.target.value)}
                  className="h-9 bg-background"
                />
              </div>

              {/* Successful deliveries */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Livraisons réussies
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filterSuccessfulFrom}
                    onChange={(e) => setFilterSuccessfulFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filterSuccessfulTo}
                    onChange={(e) => setFilterSuccessfulTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>

              {/* Canceled deliveries */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Livraisons annulées
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filterCanceledFrom}
                    onChange={(e) => setFilterCanceledFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filterCanceledTo}
                    onChange={(e) => setFilterCanceledTo(e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>

              {/* Pending deliveries */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50 md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Livraisons en attente
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filterPendingFrom}
                    onChange={(e) => setFilterPendingFrom(e.target.value)}
                    className="h-9 bg-background"
                  />
                  <span className="text-muted-foreground text-sm">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filterPendingTo}
                    onChange={(e) => setFilterPendingTo(e.target.value)}
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
