import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Key, Phone, Save, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateWorker() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <DashboardLayout>
      {/* Header with back button */}
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
            Ajouter un nouveau livreur
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Remplissez les informations pour créer un compte livreur
          </p>
        </div>
      </div>

      {/* Form – full width */}
      <div className="w-full rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-lg shadow-primary/5 p-6 md:p-8">
        <form className="space-y-6">
          {/* First Name */}
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-foreground flex items-center gap-2"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Nom *
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ex: Ben Salah"
              className="h-11"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-foreground flex items-center gap-2"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Prénom *
            </label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ex: Ahmed"
              className="h-11"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-foreground flex items-center gap-2"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              Nom d'utilisateur *
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: ahmed_bs"
              className="h-11"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-foreground flex items-center gap-2"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              Numéro de téléphone *
            </label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: +216 20 123 456"
              className="h-11"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground flex items-center gap-2"
            >
              <Key className="h-4 w-4 text-muted-foreground" />
              Mot de passe *
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères"
              className="h-11"
            />
          </div>

          {/* Actions */}
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
              Enregistrer le livreur
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
