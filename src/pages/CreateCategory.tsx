import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Eye,
  ImagePlus,
  Layers,
  Package,
  Save,
  Search,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateCategory() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("basic");

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center gap-4">
        <Button
          onClick={() => navigate("/categories")}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-primary/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Ajouter un nouveau catégorie
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Remplissez les informations de base pour créer un nouveau catégorie
          </p>
        </div>
      </div>

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
              Produits associées
            </span>
            {activeTab === "products" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {activeTab == "basic" && (
        <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
          <form className="space-y-8">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Package className="h-4 w-4 text-muted-foreground" />
                Nom du catégorie *
              </label>
              <Input
                id="name"
                placeholder="Ex: Casque Audio Bluetooth"
                className="h-11 pl-10"
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
                className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30
                            `}
              >
                <span
                  className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
                              `}
                />
              </button>
            </div>
            <div className="-mx-6 md:-mx-8 px-6 md:px-8 py-6 bg-muted/5 rounded-xl border-y border-border/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ImagePlus className="h-4 w-4 text-muted-foreground" />
                    Image du catégorie
                  </label>
                  <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                    0/1
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <label
                    htmlFor="images"
                    className="aspect-square flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/40 hover:bg-muted/60 hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden"
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
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </form>
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="h-11 px-6 rounded-xl"
            >
              Annuler
            </Button>
            <Button className="h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              <Save className="h-4 w-4" />
              Enregistrer le catégorie
            </Button>
          </div>
        </div>
      )}

      {activeTab == "products" && (
        <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-foreground flex items-center gap-2"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              Recherchez produits :
            </label>
            <Input
              id="name"
              placeholder="Ex: Casque Audio Bluetooth"
              className="h-11 pl-10"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="h-11 px-6 rounded-xl"
            >
              Annuler
            </Button>
            <Button className="h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              <Save className="h-4 w-4" />
              Enregistrer le catégorie
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
