import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Index } from "./pages/Index";
import { Products } from "./pages/Products";
import { AddProduct } from "./pages/AddProduct";
import { ProductDetailPage } from "./pages/ProductDetails";
import { Categories } from "./pages/Categories";
import { CreateCategory } from "./pages/CreateCategory";
import { CategoryDetails } from "./pages/CategoryDetails";
import { Offers } from "./pages/Offers";
import { CreateOffer } from "./pages/CreateOffer";
import { OfferDetails } from "./pages/OfferDetails";
import { Clients } from "./pages/Clients";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/details" element={<ProductDetailPage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/add" element={<CreateCategory />} />
            <Route path="/categories/details" element={<CategoryDetails />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/offers/create" element={<CreateOffer />} />
            <Route path="/offers/details" element={<OfferDetails />} />
            <Route path="/clients" element={<Clients />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
