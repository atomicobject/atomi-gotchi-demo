import { PanelCard } from "@/components/PanelCard";
import { PetCreationForm } from "@/components/PetCreationForm";
import { PetInfoCard } from "@/components/PetInfoCard";
import { RequestMessage } from "@/types/login";
import { mapPetMood, PetInfo } from "@/types/pet";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useMutation } from "convex/react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { SettingsMenu } from "@/components/SettingsMenu";
import { AnimatedBackground } from "@/components/AnimatedBackground";


export const HomePage = () => {
  const [user, setUser] = useState<any>(null);

  const [pet, setPet] = useState<PetInfo | undefined>(undefined);
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

  const getPetMutation = useMutation(api.mutations.getPet.getPet);
  const deletePetMutation = useMutation(api.mutations.deletePet.deletePet);

  const deriveMoodFromHealth = (health: number) => {
    if (health < 33) return "sad";
    if (health < 66) return "neutral";
    return "happy";
  };

  const loadPet = useCallback(async () => {
    console.log("Loading pet information... (HomePage)");
    if (!user?.email) return;

    setIsLoadingPet(true);
    const result = await getPetMutation({ email: user.email });
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

    if (petWithMood.health === 0) {
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
  }, [user, getPetMutation]);

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

  return (
    <AnimatedBackground animated={animatedBg}>
      <PanelCard panelSx={{ height: 550, width: 600, maxWidth: '95vw', mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 3, background: 'white', borderRadius: 4 }} message={message}>
        {isLoadingPet ? (
          <CircularProgress />
        ) : pet ? (
          <Stack gap={2} sx={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <PetInfoCard
              petInfo={{
                name: pet.name,
                health: pet.health,
                hunger: pet.hunger,
                mood: pet.mood,
              }}
            />
            <Stack direction="row" gap={1} sx={{ width: '100%', justifyContent: 'center' }}>
              <Button variant="contained" sx={{ fontSize: 13, px: 1.5, py: 0.75, minWidth: 70, height: 28 }} onClick={handleSettings}>
                Settings
              </Button>
              <Button variant="outlined" sx={{ fontSize: 13, px: 1.5, py: 0.75, minWidth: 70, height: 28 }} onClick={handleSignOut}>
                Sign Out
              </Button>
            </Stack>
            {/* Mini Game Buttons */}
            <Stack direction="row" gap={2} mt={2} sx={{ flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              <Button
                variant="contained"
                sx={{ background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 10, px: 0.5, py: 0.25, boxShadow: 2, whiteSpace: 'nowrap', minWidth: 120, maxWidth: 120, width: '45%', height: 28 }}
                onClick={() => navigate("/cooking")}
              >
                Cooking
              </Button>
              <Button
                variant="contained"
                sx={{ background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 10, px: 0.5, py: 0.25, boxShadow: 2, whiteSpace: 'nowrap', minWidth: 120, maxWidth: 120, width: '45%', height: 28 }}
                onClick={() => navigate("/rock-paper-scissors")}
              >
                Rock Paper Scissors
              </Button>
              <Button
                variant="contained"
                sx={{ background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 10, px: 0.5, py: 0.25, boxShadow: 2, whiteSpace: 'nowrap', minWidth: 120, maxWidth: 120, width: '45%', height: 28 }}
                onClick={() => navigate("/higher-lower")}
              >
                Higher/Lower
              </Button>
              <Button
                variant="contained"
                sx={{ background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 10, px: 0.5, py: 0.25, boxShadow: 2, whiteSpace: 'nowrap', minWidth: 120, maxWidth: 120, width: '45%', height: 28 }}
                onClick={() => navigate("/simon-says")}
              >
                Simon Says
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
        />
      </PanelCard>
    </AnimatedBackground>
  );
};
