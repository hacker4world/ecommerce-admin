import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Package,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Mock data ----------
const INITIAL_CLIENTS = [
  {
    id: "1",
    firstName: "Ahmed",
    lastName: "Ben Salah",
    totalPurchases: 24,
    phone: "+216 20 123 456",
  },
  {
    id: "2",
    firstName: "Sarra",
    lastName: "Mansour",
    totalPurchases: 18,
    phone: "+216 20 654 321",
  },
  {
    id: "3",
    firstName: "Mohamed",
    lastName: "Ali",
    totalPurchases: 35,
    phone: "+216 20 789 012",
  },
];

export function Clients() {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<
    (typeof INITIAL_CLIENTS)[0] | null
  >(null);

  // Filter clients by search query
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(q) ||
        client.lastName.toLowerCase().includes(q) ||
        client.phone.includes(q),
    );
  }, [clients, searchQuery]);

  // Delete handlers
  const openDeleteModal = (client: (typeof INITIAL_CLIENTS)[0]) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
    }
    setDeleteModalOpen(false);
    setClientToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gestion des clients
          </h1>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher clients par nom, prénom"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-background border-input shadow-sm focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Table View */}
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
                  <Package className="h-4 w-4 text-primary/70" />
                  <span className="tracking-wider">Total achats</span>
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
                  <Settings className="h-4 w-4 text-primary/70" />
                  <span className="tracking-wider">Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-border/30 hover:bg-muted/20 transition-colors"
              >
                <td className="py-3 px-6 font-medium text-foreground">
                  {client.lastName}
                </td>
                <td className="py-3 px-6 text-foreground">
                  {client.firstName}
                </td>
                <td className="py-3 px-6 text-foreground">
                  {client.totalPurchases}
                </td>
                <td className="py-3 px-6 text-muted-foreground">
                  {client.phone}
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate(`/clients/details`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => openDeleteModal(client)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  Aucun client trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========== Delete Confirmation Modal ========== */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle>Supprimer le client</DialogTitle>
            </DialogHeader>
            <p className="text-center text-sm text-muted-foreground">
              Vous êtes sur le point de supprimer{" "}
              <span className="font-semibold text-foreground">
                {clientToDelete?.firstName} {clientToDelete?.lastName}
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
                    Suppression permanente du client et de ses données.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Historique des commandes conservé mais anonymisé.</span>
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
    </DashboardLayout>
  );
}
