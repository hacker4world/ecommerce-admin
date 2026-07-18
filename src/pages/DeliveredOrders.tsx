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
  Clock,
  DollarSign,
  Eye,
  Filter,
  Package,
  RotateCcw,
  Search,
  Settings,
  Tag,
  Trash2,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Mock data for delivered orders ----------
const INITIAL_ORDERS = [
  {
    id: "CMD-201",
    date: "2026-07-01",
    client: "Leila Trabelsi",
    productCount: 2,
    status: "delivered",
    deliveryDriver: "Ali Gharbi",
    totalCost: 210,
    products: ["Casque Audio Pro", "Chargeur sans fil"],
  },
  {
    id: "CMD-202",
    date: "2026-07-02",
    client: "Omar Cherif",
    productCount: 1,
    status: "delivered",
    deliveryDriver: "Leila Trabelsi",
    totalCost: 150,
    products: ["Écouteurs Bluetooth"],
  },
  {
    id: "CMD-203",
    date: "2026-07-03",
    client: "Nadia Ben Ali",
    productCount: 4,
    status: "delivered",
    deliveryDriver: "Omar Cherif",
    totalCost: 450,
    products: ["Enceinte Portable", "Câble USB-C", "Casque Gaming RGB"],
  },
];

export function DeliveredOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<
    (typeof INITIAL_ORDERS)[0] | null
  >(null);

  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterClient, setFilterClient] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [filterTotalCostFrom, setFilterTotalCostFrom] = useState("");
  const [filterTotalCostTo, setFilterTotalCostTo] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "delivered">("all");

  // Combined filtering
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(q) ||
          order.client.toLowerCase().includes(q) ||
          (order.deliveryDriver &&
            order.deliveryDriver.toLowerCase().includes(q)) ||
          order.products.some((p) => p.toLowerCase().includes(q)),
      );
    }

    // Advanced filters
    if (filterClient.trim()) {
      const q = filterClient.toLowerCase();
      result = result.filter((o) => o.client.toLowerCase().includes(q));
    }
    if (filterDriver.trim()) {
      const q = filterDriver.toLowerCase();
      result = result.filter(
        (o) => o.deliveryDriver && o.deliveryDriver.toLowerCase().includes(q),
      );
    }
    if (filterDate) {
      result = result.filter((o) => o.date === filterDate);
    }
    if (filterProduct.trim()) {
      const q = filterProduct.toLowerCase();
      result = result.filter((o) =>
        o.products.some((p) => p.toLowerCase().includes(q)),
      );
    }
    const costFrom = parseFloat(filterTotalCostFrom);
    const costTo = parseFloat(filterTotalCostTo);
    if (!isNaN(costFrom))
      result = result.filter((o) => o.totalCost >= costFrom);
    if (!isNaN(costTo)) result = result.filter((o) => o.totalCost <= costTo);
    if (filterStatus !== "all")
      result = result.filter((o) => o.status === filterStatus);

    return result;
  }, [
    orders,
    searchQuery,
    filterClient,
    filterDriver,
    filterDate,
    filterProduct,
    filterTotalCostFrom,
    filterTotalCostTo,
    filterStatus,
  ]);

  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Livré
      </span>
    );
  };

  // Delete handlers
  const openDeleteModal = (order: (typeof INITIAL_ORDERS)[0]) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
    }
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const resetFilters = () => {
    setFilterClient("");
    setFilterDriver("");
    setFilterDate("");
    setFilterProduct("");
    setFilterTotalCostFrom("");
    setFilterTotalCostTo("");
    setFilterStatus("all");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Commandes livrées
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Historique des commandes livrées avec succès
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par commande, client, livreur ou produit"
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
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="tracking-wider">Date</span>
                </div>
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary/70" />
                  <span className="tracking-wider">Client</span>
                </div>
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary/70" />
                  <span className="tracking-wider">Nb produits</span>
                </div>
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary/70" />
                  <span className="tracking-wider">Total</span>
                </div>
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary/70" />
                  <span className="tracking-wider">Livreur assigné</span>
                </div>
              </th>
              <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">
                <span className="tracking-wider">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border/30 hover:bg-muted/20 transition-colors"
              >
                <td className="py-3 px-6 text-muted-foreground">
                  {order.date}
                </td>
                <td className="py-3 px-6 font-medium text-foreground">
                  {order.client}
                </td>
                <td className="py-3 px-6 text-foreground">
                  {order.productCount}
                </td>
                <td className="py-3 px-6 text-foreground">
                  {order.totalCost} TND
                </td>
                <td className="py-3 px-6">
                  {order.deliveryDriver ? (
                    <span className="text-foreground">
                      {order.deliveryDriver}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Non assigné
                    </span>
                  )}
                </td>
                <td className="py-3 px-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate(`/orders/delivered/details`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => openDeleteModal(order)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  Aucune commande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle>Supprimer la commande</DialogTitle>
            </DialogHeader>
            <p className="text-center text-sm text-muted-foreground">
              Vous êtes sur le point de supprimer la commande{" "}
              <span className="font-semibold text-foreground">
                {orderToDelete?.id}
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
                    Suppression permanente de la commande et de ses données.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>L'historique client sera mis à jour.</span>
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

      {/* Advanced Filters Modal */}
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
            {/* Client & Driver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Client</span>
                </div>
                <Input
                  placeholder="Nom du client"
                  value={filterClient}
                  onChange={(e) => setFilterClient(e.target.value)}
                  className="h-9 bg-background"
                />
              </div>

              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Livreur</span>
                </div>
                <Input
                  placeholder="Nom du livreur"
                  value={filterDriver}
                  onChange={(e) => setFilterDriver(e.target.value)}
                  className="h-9 bg-background"
                />
              </div>
            </div>

            {/* Date & Product */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Date</span>
                </div>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="h-9 bg-background"
                />
              </div>

              <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Produit</span>
                </div>
                <Input
                  placeholder="Nom du produit"
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  className="h-9 bg-background"
                />
              </div>
            </div>

            {/* Total Cost Range */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total (TND)</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filterTotalCostFrom}
                  onChange={(e) => setFilterTotalCostFrom(e.target.value)}
                  className="h-9 bg-background"
                />
                <span className="text-muted-foreground text-sm">–</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filterTotalCostTo}
                  onChange={(e) => setFilterTotalCostTo(e.target.value)}
                  className="h-9 bg-background"
                />
              </div>
            </div>

            {/* Status (only "Livré" or "Tous") */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
              <label className="text-sm font-medium mb-3 block">Statut</label>
              <div className="flex rounded-lg border border-border bg-background p-1 w-fit">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterStatus === "all"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Check className="h-4 w-4" />
                  Tous
                </button>
                <button
                  onClick={() => setFilterStatus("delivered")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filterStatus === "delivered"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Clock className="h-4 w-4" />
                  Livré
                </button>
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
