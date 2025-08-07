// src/pages/games/SimonSaysPage.tsx
import { BackToHome } from "@/components/BackToHome";
import { Panel } from "@/components/Panel";
import { Pet } from "@/components/Pet";
import { PetMood, ANIMATION_TIME } from "@/types/pet";
import { Box, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

const squares = [
  { id: 1, color: "#ff4444", activeColor: "#ff8888" },
  { id: 2, color: "#44ff44", activeColor: "#88ff88" },
  { id: 3, color: "#4444ff", activeColor: "#8888ff" },
  { id: 4, color: "#ffff44", activeColor: "#ffff88" },
];
const NUM_ROUNDS = 6;

export const SimonSaysPage = () => {
  // --- Pet & health setup ---
  const [pet, setPet] = useState<any | null>(null);
  const getPet = useMutation(api.mutations.getPet.getPet);
  const updateHealth = useMutation(api.mutations.updateHealth.updateHealth);

  useEffect(() => {
    const loadPet = async () => {
      const raw = localStorage.getItem("currentUser");
      if (!raw) return;
      try {
        const user = JSON.parse(raw);
        if (!user?.email) return;
        const res = await getPet({ email: user.email });
        if (res.success && res.pet) setPet(res.pet);
      } catch {}
    };
    void loadPet();
  }, [getPet]);

  const navigate = useNavigate();
  const [showDeadModal, setShowDeadModal] = useState(false);

  useEffect(() => {
    if (pet?.health === 0) {
      setShowDeadModal(true);
    }
  }, [pet]);

  const health = pet?.health ?? 0;
  let healthColor = "#4caf50";
  if (health <= 30) healthColor = "#f44336";
  else if (health <= 60) healthColor = "#ff9800";

  // --- Game state ---
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedSquare, setDisplayedSquare] = useState<string>("");
  const [canClick, setCanClick] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [petMood, setPetMood] = useState<PetMood>(PetMood.HAPPY);

  const addSquare = () =>
    setSequence((seq) => [...seq, Math.floor(Math.random() * 4) + 1]);

  const replay = () => {
    setCanClick(false);
    sequence.forEach((sq, i) => {
      setTimeout(() => {
        setDisplayedSquare(["", "🟥", "🟩", "🟦", "🟨"][sq]);
        setTimeout(() => setDisplayedSquare(""), 800);
        if (i === sequence.length - 1) {
          setTimeout(() => setCanClick(true), 800);
        }
      }, i * 1000);
    });
  };

  useEffect(() => {
    addSquare();
  }, []);

  useEffect(() => {
    if (sequence.length) replay();
  }, [sequence]);

  const deriveMood = (h: number) =>
    h < 33 ? PetMood.SAD : h < 66 ? PetMood.NEUTRAL : PetMood.HAPPY;

  const checkInputtedSequence = async (sqId: number) => {
    if (!canClick || !isPlaying) return;
    const target = sequence[currentIndex];

    if (sqId === target) {
      // correct
      setPetMood(PetMood.EXCITED);
      if (pet) {
        const res = await updateHealth({ petId: pet.id, delta: 10 });
        if (res.success) setPet({ ...pet, health: res.health });
      }
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (nextIdx === sequence.length) {
        if (sequence.length < NUM_ROUNDS) {
          setTimeout(() => {
            setPetMood(PetMood.HAPPY);
            setCurrentIndex(0);
            addSquare();
          }, ANIMATION_TIME * 2);
        } else {
          setIsPlaying(false);
          setCanClick(false);
        }
      }
    } else {
      // wrong: immediate health drop and retry
      setPetMood(PetMood.SAD);
      setCanClick(false);
      if (pet) {
        const res = await updateHealth({ petId: pet.id, delta: -10 });
        if (res.success) setPet({ ...pet, health: res.health });
      }
      setCurrentIndex(0);
      replay();
    }
  };

  return (
    <>
      <Dialog open={showDeadModal} onClose={() => {}} disableEscapeKeyDown>
        <DialogTitle>Game Over</DialogTitle>
        <DialogContent>Your pet has died. Create a new one to continue.</DialogContent>
        <DialogActions>
          <Button onClick={() => {
            localStorage.removeItem("currentPet");
            setShowDeadModal(false);
            navigate("/home");
          }} autoFocus>
            Create New Pet
          </Button>
        </DialogActions>
      </Dialog>
      <Panel
        sx={{
          width: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Top row: Pet, health bar, flash */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{ width: "100%", position: "relative" }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Pet mood={petMood} />

            {/* Health bar with percentage */}
            <Box sx={{ width: 200, mt: 1, position: 'relative' }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Health:
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  height: 16,
                  width: "100%",
                  backgroundColor: "#ddd",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${health}%`,
                    backgroundColor: healthColor,
                    transition: "width 0.5s ease",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    lineHeight: '16px',
                    fontWeight: 'bold',
                    userSelect: 'none'
                  }}
                >{`${health}%`}</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ position: "absolute", right: 150 }}>
            <Typography variant="h4">
              {displayedSquare || "\u00A0"}
            </Typography>
          </Box>
        </Stack>

        {/* Game grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            width: 350,
            height: 350,
            position: "relative",
          }}
        >
          {squares.map((sq) => (
            <Box
              key={sq.id}
              sx={{
                backgroundColor: sq.color,
                borderRadius: 2,
                cursor: canClick ? "pointer" : "not-allowed",
                opacity: canClick ? 1 : 0.6,
                pointerEvents: canClick ? "auto" : "none",
                transition: "all 0.2s ease",
                ...(canClick && {
                  "&:hover": { backgroundColor: sq.activeColor, transform: "scale(1.05)" },
                  "&:active": { transform: "scale(0.95)" },
                }),
              }}
              onClick={() => void checkInputtedSequence(sq.id)}
            />
          ))}

          {!isPlaying && (
            <Panel
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 250,
              }}
            >
              <Typography variant="h1">You Win!</Typography>
              <BackToHome />
            </Panel>
          )}
        </Box>
      </Panel>
    </>
  );
};
