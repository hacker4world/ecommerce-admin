import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Hash,
  MapPin,
  Package,
  Phone,
  Save,
  Search,
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

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ---------- Mock data ----------
const ORDER = {
  id: "CMD-101",
  date: "2026-07-07",
  client: {
    name: "Ahmed Ben Salah",
    phone: "+216 20 123 456",
    address: "123 Rue de la Liberté, Tunis",
  },
  deliveryDriver: {
    name: "Ali Gharbi",
    phone: "+216 20 111 222",
  },
  status: "pending",
  subtotal: "290 TND",
  deliveryFee: "7 TND",
  total: "297 TND",
  lat: 36.8065,
  lng: 10.1815,
  products: [
    { name: "Casque Audio Pro", quantity: 1, price: "128 TND" },
    { name: "Chargeur sans fil", quantity: 2, price: "45 TND" },
    { name: "Câble USB-C", quantity: 1, price: "25 TND" },
  ],
};

const AVAILABLE_DRIVERS = [
  { id: "1", name: "Ali Gharbi" },
  { id: "2", name: "Leila Trabelsi" },
  { id: "3", name: "Omar Cherif" },
];

export function OrderDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"info" | "assign">("info");

  // Assign driver state
  const [selectedDriver, setSelectedDriver] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredDrivers = AVAILABLE_DRIVERS.filter((d) =>
    d.name.toLowerCase().includes(driverSearch.toLowerCase()),
  );

  // Mock actions
  const handleAssign = () => {
    alert(`Livreur ${selectedDriver} assigné à la commande ${ORDER.id}`);
  };

  const handleMarkComplete = () => {
    alert(`Commande ${ORDER.id} marquée comme terminée`);
  };

  const handleDeleteOrder = () => {
    alert(`Commande ${ORDER.id} supprimée`);
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
              <span className="w-2 h-2 rounded-full bg-amber-500" /> En attente
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 text-destructive hover:bg-destructive/10"
            onClick={handleDeleteOrder}
          >
            <Trash2 className="h-4 w-4" />
            Supprimer la commande
          </Button>
          <Button className="gap-2" onClick={handleMarkComplete}>
            <CheckCircle className="h-4 w-4" />
            Marquer comme terminée
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-border">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab("info")}
            className={cn(
              "relative px-1 py-4 text-sm font-medium transition-colors",
              activeTab === "info"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Informations
            </span>
            {activeTab === "info" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("assign")}
            className={cn(
              "relative px-1 py-4 text-sm font-medium transition-colors",
              activeTab === "assign"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Assigner un livreur
            </span>
            {activeTab === "assign" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* ========== Information Tab ========== */}
      {activeTab === "info" && (
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
              {ORDER.deliveryDriver ? (
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
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Non assigné
                </p>
              )}
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
                      <td className="py-2.5 px-2 text-right">
                        {product.price}
                      </td>
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
      )}

      {/* ========== Assign Driver Tab (full width) ========== */}
      {activeTab === "assign" && (
        <div>
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-lg shadow-primary/5 p-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-muted-foreground" />
              Assigner un livreur
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Choisissez un livreur parmi la liste pour prendre en charge la
              commande {ORDER.id}.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium mb-2 block">
                  Livreur
                </label>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between w-full border border-border rounded-xl px-4 py-2.5 text-left bg-background hover:border-primary/50 transition"
                >
                  <span
                    className={selectedDriver ? "" : "text-muted-foreground"}
                  >
                    {selectedDriver || "Sélectionner un livreur"}
                  </span>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
                {dropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-xl shadow-lg p-2 space-y-1">
                    <Input
                      placeholder="Rechercher..."
                      value={driverSearch}
                      onChange={(e) => setDriverSearch(e.target.value)}
                      className="mb-2 h-9"
                    />
                    {filteredDrivers.length > 0 ? (
                      filteredDrivers.map((driver) => (
                        <button
                          key={driver.id}
                          type="button"
                          onClick={() => {
                            setSelectedDriver(driver.name);
                            setDropdownOpen(false);
                            setDriverSearch("");
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition"
                        >
                          {driver.name}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground px-3 py-2">
                        Aucun livreur trouvé
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Button
                onClick={handleAssign}
                className="gap-2 w-full"
                disabled={!selectedDriver}
              >
                <Save className="h-4 w-4" />
                Assigner ce livreur
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
