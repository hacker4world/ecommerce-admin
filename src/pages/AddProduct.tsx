import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomSelect } from "@/components/reusables/CustomSelect";
import { TextEditor } from "@/components/reusables/TextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Box,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  ImagePlus,
  Layers,
  List,
  Package,
  Plus,
  PlusCircle,
  Save,
  Tag,
  Trash2,
  Truck,
  Upload,
  X,
  Palette,
  Ruler,
  Shirt,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Types for variants
type VariantValue = {
  id: string;
  name: string;
  stock: string;
  image: File | null;
  imagePreview?: string;
};

type Variant = {
  id: string;
  name: string;
  values: VariantValue[];
};

// Suggested variant templates
const SUGGESTED_VARIANTS = [
  {
    label: "Couleur",
    icon: Palette,
    values: ["Rouge", "Bleu", "Vert", "Jaune"],
  },
  { label: "Taille", icon: Ruler, values: ["S", "M", "L", "XL"] },
  { label: "Matière", icon: Shirt, values: ["Coton", "Polyester", "Laine"] },
  { label: "Style", icon: Sparkles, values: ["Sport", "Classique", "Moderne"] },
];

const CATEGORY_OPTIONS = [
  { label: "Électronique", value: "electronics" },
  { label: "Vêtements", value: "clothing" },
  { label: "Alimentation", value: "food" },
  { label: "Maison & Bureau", value: "home_office" },
  { label: "Jouets", value: "toys" },
  { label: "Livres", value: "books" },
  { label: "Sport", value: "sports" },
  { label: "Informatique", value: "computers" },
];

export function AddProduct() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"basic" | "variants">("basic");
  const [images, setImages] = useState<File[]>([]);
  const [deliveryPrice, setDeliveryPrice] = useState<string>("");
  const [isVisibleInStore, setIsVisibleInStore] = useState<boolean>(true);
  const [specifications, setSpecifications] = useState<
    { name: string; value: string }[]
  >([{ name: "", value: "" }]);
  const [specificationsExpanded, setSpecificationsExpanded] =
    useState<boolean>(false);

  // Multi-category state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);

  const [variants, setVariants] = useState<Variant[]>([]);
  const fileInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  // ==================== IMAGES ====================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        alert("Vous ne pouvez sélectionner que 5 images maximum.");
        return;
      }
      setImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ==================== SPÉCIFICATIONS ====================
  const addSpecification = () => {
    setSpecifications([...specifications, { name: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const updateSpecification = (
    index: number,
    field: "name" | "value",
    newValue: string,
  ) => {
    const updated = [...specifications];
    updated[index][field] = newValue;
    setSpecifications(updated);
  };

  // ==================== CATEGORIES (multi-select) ====================
  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const removeCategory = (value: string) => {
    setSelectedCategories((prev) => prev.filter((v) => v !== value));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".category-dropdown")) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==================== VARIANTS ====================
  const addVariant = () => {
    const newVariant: Variant = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      name: "",
      values: [],
    };
    setVariants([...variants, newVariant]);
  };

  const addSuggestedVariant = (name: string, valueNames: string[]) => {
    const newVariant: Variant = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      name: name,
      values: valueNames.map((valName) => ({
        id: crypto.randomUUID?.() || Date.now().toString(),
        name: valName,
        stock: "",
        image: null,
      })),
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (variantId: string) => {
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const updateVariantName = (variantId: string, newName: string) => {
    setVariants(
      variants.map((v) => (v.id === variantId ? { ...v, name: newName } : v)),
    );
  };

  const addValue = (variantId: string) => {
    const newValue: VariantValue = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      name: "",
      stock: "",
      image: null,
    };
    setVariants(
      variants.map((v) =>
        v.id === variantId ? { ...v, values: [...v.values, newValue] } : v,
      ),
    );
  };

  const removeValue = (variantId: string, valueId: string) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, values: v.values.filter((val) => val.id !== valueId) }
          : v,
      ),
    );
  };

  const updateValueField = (
    variantId: string,
    valueId: string,
    field: keyof Pick<VariantValue, "name" | "stock">,
    newValue: string,
  ) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              values: v.values.map((val) =>
                val.id === valueId ? { ...val, [field]: newValue } : val,
              ),
            }
          : v,
      ),
    );
  };

  const handleValueImageChange = (
    variantId: string,
    valueId: string,
    file: File | null,
  ) => {
    if (!file) return;
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              values: v.values.map((val) =>
                val.id === valueId
                  ? {
                      ...val,
                      image: file,
                      imagePreview: URL.createObjectURL(file),
                    }
                  : val,
              ),
            }
          : v,
      ),
    );
  };

  const removeValueImage = (variantId: string, valueId: string) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              values: v.values.map((val) =>
                val.id === valueId
                  ? { ...val, image: null, imagePreview: undefined }
                  : val,
              ),
            }
          : v,
      ),
    );
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      variants.forEach((v) =>
        v.values.forEach((val) => {
          if (val.imagePreview) URL.revokeObjectURL(val.imagePreview);
        }),
      );
    };
  }, [variants]);

  return (
    <DashboardLayout>
      {/* En-tête */}
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
            Ajouter un nouveau produit
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Remplissez les informations de base pour créer un nouveau produit
          </p>
        </div>
      </div>

      {/* Onglets */}
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
            onClick={() => setActiveTab("variants")}
            className={`relative px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "variants"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Configuration des variantes
            </span>
            {activeTab === "variants" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {activeTab === "basic" ? (
        <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
          <form className="space-y-8">
            {/* ==================== 1. INFORMATIONS GÉNÉRALES ==================== */}

            {/* Nom du produit */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Package className="h-4 w-4 text-muted-foreground" />
                Nom du produit *
              </label>
              <Input
                id="name"
                placeholder="Ex: Casque Audio Bluetooth"
                className="h-11 pl-10"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Description détaillée
              </label>
              <div className="rounded-xl border border-border/60 bg-background shadow-inner overflow-hidden">
                <TextEditor />
              </div>
            </div>

            {/* Prix, stock, livraison, visibilité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prix unitaire */}
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Prix unitaire *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Tag className="h-4 w-4" />
                  </div>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    className="h-11 pl-10 pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                    TND
                  </span>
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label
                  htmlFor="stock"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Box className="h-4 w-4 text-muted-foreground" />
                  Stock disponible *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Box className="h-4 w-4" />
                  </div>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              {/* Prix de livraison */}
              <div className="space-y-2">
                <label
                  htmlFor="deliveryPrice"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  Prix de livraison
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Truck className="h-4 w-4" />
                  </div>
                  <Input
                    id="deliveryPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={deliveryPrice}
                    onChange={(e) => setDeliveryPrice(e.target.value)}
                    className="h-11 pl-10 pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                    TND
                  </span>
                </div>
              </div>

              {/* Visibilité (toggle) */}
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
                  aria-checked={isVisibleInStore}
                  onClick={() => setIsVisibleInStore(!isVisibleInStore)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30
                    ${isVisibleInStore ? "bg-primary" : "bg-muted-foreground/30"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
                      ${isVisibleInStore ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>
            </div>

            {/* Catégorie (multi-select) */}
            <div className="space-y-2 category-dropdown">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                Catégories *
              </label>
              <div className="relative">
                <div
                  className="flex items-center justify-between border border-border rounded-xl px-4 py-2.5 cursor-pointer hover:border-primary/50 transition"
                  onClick={() =>
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }
                >
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCategories.length === 0 ? (
                      <span className="text-muted-foreground text-sm">
                        Sélectionner des catégories
                      </span>
                    ) : (
                      selectedCategories.map((cat) => {
                        const label =
                          CATEGORY_OPTIONS.find((c) => c.value === cat)
                            ?.label || cat;
                        return (
                          <span
                            key={cat}
                            className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                          >
                            {label}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCategory(cat);
                              }}
                              className="hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      isCategoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isCategoryDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto p-1">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <label
                        key={cat.value}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.value)}
                          onChange={() => toggleCategory(cat.value)}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ==================== 2. IMAGES (pleine largeur) ==================== */}
            <div className="-mx-6 md:-mx-8 px-6 md:px-8 py-6 bg-muted/5 rounded-xl border-y border-border/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ImagePlus className="h-4 w-4 text-muted-foreground" />
                    Images du produit
                  </label>
                  <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                    {images.length}/5
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square rounded-xl border border-border/50 bg-muted overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Produit ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm p-1.5 rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-[10px] font-medium px-2 py-0.5 rounded-md">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}

                  {images.length < 5 && (
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
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* ==================== 3. SPÉCIFICATIONS (collapsible) ==================== */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() =>
                  setSpecificationsExpanded(!specificationsExpanded)
                }
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors w-full text-left"
              >
                {specificationsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span>Spécifications techniques</span>
                <span className="text-xs text-muted-foreground ml-1">
                  (
                  {
                    specifications.filter(
                      (s) => s.name.trim() !== "" || s.value.trim() !== "",
                    ).length
                  }{" "}
                  définies)
                </span>
              </button>

              {specificationsExpanded && (
                <div className="space-y-3 pl-6 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Ajoutez des caractéristiques produit (ex: Poids,
                      Dimensions, Matériau)
                    </div>
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="text-xs flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Nom (ex: Poids)"
                            value={spec.name}
                            onChange={(e) =>
                              updateSpecification(index, "name", e.target.value)
                            }
                            className="h-9 text-sm"
                          />
                          <Input
                            placeholder="Valeur (ex: 1.2 kg)"
                            value={spec.value}
                            onChange={(e) =>
                              updateSpecification(
                                index,
                                "value",
                                e.target.value,
                              )
                            }
                            className="h-9 text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          disabled={specifications.length === 1}
                          aria-label="Supprimer cette spécification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ==================== 4. ACTIONS ==================== */}
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
                Enregistrer le produit
              </Button>
            </div>
          </form>
        </div>
      ) : (
        // ==================== VARIANTS TAB ====================
        <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Configuration des variantes
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Ajoutez des attributs (ex: Taille, Couleur) et leurs valeurs
                  avec stock et image.
                </p>
              </div>
              <Button type="button" onClick={addVariant} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Ajouter une variante
              </Button>
            </div>

            {/* SUGGESTED VARIANTS BUTTONS */}
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_VARIANTS.map((suggested) => {
                const Icon = suggested.icon;
                return (
                  <Button
                    key={suggested.label}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addSuggestedVariant(suggested.label, suggested.values)
                    }
                    className="gap-1.5 border-border/60 hover:border-primary/40"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {suggested.label}
                  </Button>
                );
              })}
            </div>

            {variants.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-border/50 p-12 text-center">
                <Layers className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Aucune variante configurée. Utilisez les suggestions ci-dessus
                  ou cliquez sur "Ajouter une variante" pour commencer.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="rounded-xl border border-border/50 bg-background/50 p-5 space-y-4 shadow-sm"
                  >
                    {/* En-tête de la variante */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          placeholder="Nom de la variante (ex: Taille, Couleur)"
                          value={variant.name}
                          onChange={(e) =>
                            updateVariantName(variant.id, e.target.value)
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVariant(variant.id)}
                        className="h-9 w-9 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Liste des valeurs */}
                    <div className="space-y-3 pl-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Valeurs
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addValue(variant.id)}
                          className="h-7 text-xs gap-1"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          Ajouter une valeur
                        </Button>
                      </div>

                      {variant.values.length === 0 ? (
                        <div className="text-xs text-muted-foreground/60 py-2 px-3 bg-muted/20 rounded-md border border-dashed border-border/40">
                          Aucune valeur. Ajoutez-en une.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {variant.values.map((value) => (
                            <div
                              key={value.id}
                              className="flex items-center gap-3 bg-muted/10 p-3 rounded-lg border border-border/40"
                            >
                              {/* Nom */}
                              <div className="flex-1 min-w-[100px]">
                                <Input
                                  placeholder="Valeur (ex: S, M, L)"
                                  value={value.name}
                                  onChange={(e) =>
                                    updateValueField(
                                      variant.id,
                                      value.id,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  className="h-8 text-sm"
                                />
                              </div>

                              {/* Stock */}
                              <div className="w-24">
                                <Input
                                  type="number"
                                  placeholder="Stock"
                                  value={value.stock}
                                  onChange={(e) =>
                                    updateValueField(
                                      variant.id,
                                      value.id,
                                      "stock",
                                      e.target.value,
                                    )
                                  }
                                  className="h-8 text-sm"
                                />
                              </div>

                              {/* Image */}
                              <div className="relative flex items-center">
                                {value.imagePreview ? (
                                  <div className="relative group">
                                    <img
                                      src={value.imagePreview}
                                      alt={value.name || "Valeur"}
                                      className="h-10 w-10 rounded-md object-cover border border-border"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeValueImage(variant.id, value.id)
                                      }
                                      className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <label
                                    htmlFor={`image-${variant.id}-${value.id}`}
                                    className="cursor-pointer h-10 w-10 flex items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition bg-muted/20"
                                  >
                                    <ImagePlus className="h-4 w-4 text-muted-foreground" />
                                    <input
                                      ref={(el) => {
                                        if (el) {
                                          fileInputRefs.current.set(
                                            `${variant.id}-${value.id}`,
                                            el,
                                          );
                                        }
                                      }}
                                      id={`image-${variant.id}-${value.id}`}
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (
                                          e.target.files &&
                                          e.target.files[0]
                                        ) {
                                          handleValueImageChange(
                                            variant.id,
                                            value.id,
                                            e.target.files[0],
                                          );
                                        }
                                        e.target.value = "";
                                      }}
                                    />
                                  </label>
                                )}
                              </div>

                              {/* Supprimer la valeur */}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeValue(variant.id, value.id)
                                }
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-8">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="h-11 px-6 rounded-xl"
              >
                Annuler
              </Button>
              <Button className="h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Save className="h-4 w-4" />
                Enregistrer le produit
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
