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
  Archive,
  ArrowLeft,
  DollarSign,
  Hash,
  MapPin,
  Package,
  Phone,
  ShoppingCart,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ---------- Mock delivered order data ----------
const ORDER = {
  id: "CMD-201",
  date: "2026-07-02",
  client: {
    name: "Leila Trabelsi",
    phone: "+216 20 333 444",
    address: "15 Avenue Habib Bourguiba, Tunis",
  },
  deliveryDriver: {
    name: "Ali Gharbi",
    phone: "+216 20 111 222",
  },
  status: "delivered",
  subtotal: "200 TND",
  deliveryFee: "10 TND",
  total: "210 TND",
  lat: 36.8008,
  lng: 10.1864,
  products: [
    { name: "Casque Audio Pro", quantity: 1, price: "128 TND" },
    { name: "Chargeur sans fil", quantity: 2, price: "45 TND" },
  ],
};

export function DeliveredOrderDetails() {
  const navigate = useNavigate();

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleArchive = () => {
    alert(`Commande ${ORDER.id} archivée.`);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    alert(`Commande ${ORDER.id} supprimée.`);
    setDeleteModalOpen(false);
    navigate(-1);
  };

  return (
    <DashboardLayout>
      {/* Header with action buttons */}
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
              Commande {ORDER.id}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Livrée le{" "}
              {ORDER.date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleArchive}>
            <Archive className="h-4 w-4" />
            Archiver
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total produits</p>
              <p className="text-2xl font-bold text-foreground">
                {ORDER.products.reduce((acc, p) => acc + p.quantity, 0)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total TTC</p>
              <p className="text-2xl font-bold text-foreground">
                {ORDER.total}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Truck className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Frais de livraison
              </p>
              <p className="text-2xl font-bold text-foreground">
                {ORDER.deliveryFee}
              </p>
            </div>
          </div>
        </div>

        {/* Client & Delivery Worker & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Info */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-muted-foreground" />
              Client
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Nom</p>
                <p className="text-sm font-medium">{ORDER.client.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Téléphone</p>
                <p className="text-sm font-medium">{ORDER.client.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Adresse</p>
                <p className="text-sm font-medium">{ORDER.client.address}</p>
              </div>
            </div>
          </div>

          {/* Delivery Worker Info */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-muted-foreground" />
              Livreur
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Nom</p>
                <p className="text-sm font-medium">
                  {ORDER.deliveryDriver.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Téléphone</p>
                <p className="text-sm font-medium">
                  {ORDER.deliveryDriver.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 overflow-hidden">
            <div className="p-6 pb-2">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-1">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                Localisation
              </h2>
            </div>
            <div className="h-64 md:h-72 w-full">
              <MapContainer
                center={[ORDER.lat, ORDER.lng]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[ORDER.lat, ORDER.lng]}>
                  <Popup>Adresse de livraison</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            Produits commandés
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                    Produit
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Quantité
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Prix unitaire
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {ORDER.products.map((product, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/30 hover:bg-muted/20"
                  >
                    <td className="py-2.5 px-2 font-medium text-foreground">
                      {product.name}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      {product.quantity}
                    </td>
                    <td className="py-2.5 px-2 text-right">{product.price}</td>
                    <td className="py-2.5 px-2 text-right font-medium">
                      {parseInt(product.price) * product.quantity} TND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
              <span className="font-semibold text-foreground">{ORDER.id}</span>.
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
    </DashboardLayout>
  );
}
