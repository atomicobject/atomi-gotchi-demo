import { AnimatedBackground } from "@/components/AnimatedBackground";
import { PanelCard } from "@/components/PanelCard";
import { PetCreationForm } from "@/components/PetCreationForm";
import { PetInfoCard } from "@/components/PetInfoCard";
import { SettingsMenu } from "@/components/SettingsMenu";
import { RequestMessage } from "@/types/login";
import { mapPetMood, PetInfo } from "@/types/pet";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export const HomePage = () => {
  const [user, setUser] = useState<any>(null);

  const [pet, setPet] = useState<PetInfo | undefined>(undefined);

  const [petName, setPetName] = useState<string>("");

  const [isLoadingPet, setIsLoadingPet] = useState(false);

  const [message, setMessage] = useState<RequestMessage | undefined>(undefined);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(() => {
    const val = localStorage.getItem("emailEnabled");
    return val === null ? true : val === "true";
  });
  const [animatedBg, setAnimatedBg] = useState(() => {
    const val = localStorage.getItem("animatedBg");
    return val === null ? true : val === "true";
  });

  const navigate = useNavigate();

  const petQuery = useQuery(api.mutations.getPet.getPet, user?.email ? { email: user.email } : "skip");
  const deletePetMutation = useMutation(api.mutations.deletePet.deletePet);

  const renamePetMutation = useMutation(api.mutations.renamePet.renamePet);

  const deleteAccountMutation = useMutation(api.mutations.deleteAccount.deleteAccount);

  const deriveMoodFromHealth = (health: number) => {
    if (health < 33) return "sad";
    if (health < 66) return "neutral";
    return "happy";
  };

  const loadPet = useCallback(async () => {
    console.log("Loading pet information... (HomePage)");
    if (!user?.email) return;

    setIsLoadingPet(true);

    const result = petQuery;
    console.log("getPet response on HomePage:", result);
    if (!result?.pet) {
      setIsLoadingPet(false);
      return;
    }

    // Derive mood from health for consistency
    const derivedMood = deriveMoodFromHealth(result.pet.health);
    const petWithMood = {
      ...result.pet,
      mood: mapPetMood(derivedMood), // or just use derivedMood if PetInfoCard accepts that
    };

    if (petWithMood.health === 0 || petWithMood.hunger === 0) {
      await deletePetMutation({ petId: petWithMood.id });
      setPet(undefined);
      setMessage({ type: "info", text: "Your pet has died. Create a new one to continue." });
      localStorage.removeItem("currentPet");
      setIsLoadingPet(false);
      return;
    }

    setPet(petWithMood);
    localStorage.setItem("currentPet", JSON.stringify(petWithMood));
    setIsLoadingPet(false);
  }, [user, petQuery]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  useEffect(() => {
    void loadPet();
  }, [loadPet]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void loadPet();
      }
    };
    window.addEventListener("visibilitychange", onVisibility);
    return () => window.removeEventListener("visibilitychange", onVisibility);
  }, [loadPet]);

  useEffect(() => {
    const handlePetUpdated = () => {
      console.log("Received 'pet-updated' event, reloading pet...");
      void loadPet();
    };

    window.addEventListener("pet-updated", handlePetUpdated);

    return () => {
      window.removeEventListener("pet-updated", handlePetUpdated);
    };
  }, [loadPet]);

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    void navigate("/login");
  };

  const handleSettings = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const handleEmailToggle = (enabled: boolean) => {
    setEmailEnabled(enabled);
    localStorage.setItem("emailEnabled", String(enabled));
  };

  const handleBgToggle = (enabled: boolean) => {
    setAnimatedBg(enabled);
    localStorage.setItem("animatedBg", String(enabled));
  };

  const handleSubmitPetForm = (message: RequestMessage) => {
    setMessage(message);
  };

  const handleRenamePet = async (newName: string) => {
    setPetName(newName);
    if (user?.email) {
      await renamePetMutation({ email: user.email, newName });
      // Optionally reload pet info after renaming
      void loadPet();
    }
  };

  async function handleDeleteAccount(): Promise<void> {
    if (!user?.email) return;
    try {
      await deleteAccountMutation({ email: user.email });
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentPet");
      setPet(undefined);
      setUser(null);
      setMessage({ type: "success", text: "Your account has been deleted." });
      navigate("/login");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete account. Please try again." });
    }
  }

  return (
    <AnimatedBackground animated={animatedBg}>
      <PanelCard
        panelSx={{
          width: 450,
        }}
        message={message}
      >
        {isLoadingPet ? (
          <CircularProgress />
        ) : pet ? (
          <Stack gap={2} sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
            <PetInfoCard
              petInfo={{
                name: pet.name,
                health: pet.health,
                hunger: pet.hunger,
                mood: pet.mood,
              }}
            />
            <Stack direction="row" gap={1} sx={{ width: "100%", justifyContent: "center" }}>
              <Button variant="contained" onClick={handleSettings}>
                Settings
              </Button>
              <Button variant="outlined" onClick={handleSignOut}>
                Sign Out
              </Button>
            </Stack>
          </Stack>
        ) : (
          <PetCreationForm user={user} onSubmitPetForm={handleSubmitPetForm} />
        )}
        <SettingsMenu
          open={settingsOpen}
          onClose={handleSettingsClose}
          emailEnabled={emailEnabled}
          onEmailToggle={handleEmailToggle}
          animatedBg={animatedBg}
          onBgToggle={handleBgToggle}
          petName={pet?.name ?? ""}
          onRenamePet={handleRenamePet}
          onDeleteAccount={handleDeleteAccount}
        />
      </PanelCard>
    </AnimatedBackground>
  );
};
