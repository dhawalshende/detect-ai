import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner";
import { Loader2, Save, User, Sliders } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

interface Preferences {
  autoGeneratePdf: boolean;
  emailOnCritical: boolean;
  showBboxConfidence: boolean;
}

const PREFS_KEY = "detectai_preferences";

function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { autoGeneratePdf: true, emailOnCritical: true, showBboxConfidence: false };
}

function savePreferences(prefs: Preferences) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function Settings() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(loadPreferences);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Update Firebase Auth profile name
      if (displayName.trim() !== (user.displayName || "")) {
        await updateProfile(user, { displayName: displayName.trim() });
      }
      // Persist preferences to localStorage
      savePreferences(prefs);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updatePref = (key: keyof Preferences, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your workspace and preferences.</p>
        </div>

        {/* Profile */}
        <Card className="glass p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Profile</h2>
          </div>
          <div>
            <Label htmlFor="settings-name">Display Name</Label>
            <Input
              id="settings-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This name appears on your dashboard and inspection reports.
            </p>
          </div>
          <div>
            <Label htmlFor="settings-email">Email</Label>
            <Input
              id="settings-email"
              value={email}
              disabled
              className="mt-1.5 opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed here. Contact support if needed.
            </p>
          </div>
        </Card>

        {/* Inspection Preferences */}
        <Card className="glass p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Inspection preferences</h2>
          </div>
          <Toggle
            id="pref-auto-pdf"
            label="Auto-generate PDF reports"
            description="Automatically prepare a downloadable PDF after each inspection."
            checked={prefs.autoGeneratePdf}
            onChange={(v) => updatePref("autoGeneratePdf", v)}
          />
          <Toggle
            id="pref-email-critical"
            label="Email me when a critical defect is found"
            description="Receive an email notification for any REJECT-level inspection."
            checked={prefs.emailOnCritical}
            onChange={(v) => updatePref("emailOnCritical", v)}
          />
          <Toggle
            id="pref-bbox-conf"
            label="Show bounding box confidence scores"
            description="Display confidence percentages on defect overlays."
            checked={prefs.showBboxConfidence}
            onChange={(v) => updatePref("showBboxConfidence", v)}
          />
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-soft px-6"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 gap-4">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
