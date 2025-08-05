// src/pages/games/HigherOrLower.tsx
import { BackToHome } from "@/components/BackToHome";
import { Panel } from "@/components/Panel";
import { Pet } from "@/components/Pet";
import { PetMood, ANIMATION_TIME } from "@/types/pet";
import { Box, Button, Stack, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

// helper to get 1–100
const randomNumber = () => Math.floor(Math.random() * 100) + 1;

const deriveMoodFromHealth = (health: number): PetMood => {
if (health < 33) return PetMood.SAD;
if (health < 66) return PetMood.NEUTRAL;
return PetMood.HAPPY;
};

const getCombinedMood = (pet: any) => {
  if (pet?.health === 0) return { label: 'dead', text: `${pet.name} has died.` };
  const composite = 0.7 * pet.health + 0.3 * pet.hunger;
  if (composite < 33) return { label: 'sad', text: `${pet.name} seems sad.` };
  if (composite >= 80) return { label: 'happy', text: `${pet.name} seems happy.` };
  return { label: 'okay', text: `${pet.name} seems okay.` };
};

export const HigherLowerPage = () => {
const [current, setCurrent] = useState<number>(randomNumber());
const [next, setNext] = useState<number | null>(null);
const [canGuess, setCanGuess] = useState(true);
const [petMood, setPetMood] = useState<PetMood>(PetMood.HAPPY);
const [score, setScore] = useState(0);
const [highScore, setHighScore] = useState(0);
const [triesLeft, setTriesLeft] = useState(5);
const [feedback, setFeedback] = useState<{
message: string;
severity: "success" | "error";
open: boolean;
}>({
message: "",
severity: "success",
open: false,
});

const [pet, setPet] = useState<any | null>(null);
const getPet = useMutation(api.mutations.getPet.getPet);
const updateHealth = useMutation(api.mutations.updateHealth.updateHealth);

const navigate = useNavigate();
const [showDeadModal, setShowDeadModal] = useState(false);
const [started, setStarted] = useState(false);

useEffect(() => {
const loadPet = async () => {
    const currentUserRaw = localStorage.getItem("currentUser");
    if (!currentUserRaw) return;
    try {
    const user = JSON.parse(currentUserRaw);
    if (!user?.email) return;
    const res = await getPet({ email: user.email });
    if (res.success && res.pet) {
        setPet(res.pet);
        setPetMood(deriveMoodFromHealth(res.pet.health));
        localStorage.setItem("currentPet", JSON.stringify(res.pet));
    }
    } catch {
    // ignore parse errors
    }
};
void loadPet();
}, [getPet]);

useEffect(() => {
  if (pet && pet.health === 0) {
    setShowDeadModal(true);
  }
}, [pet]);

const combinedMood = pet ? getCombinedMood(pet) : null;

const handleGuess = async (guessHigher: boolean) => {
if ((pet && pet.health === 0) || triesLeft <= 0 || !canGuess) return;
setCanGuess(false);
setTriesLeft((prev) => prev - 1);

let drawn = randomNumber();
while (drawn === current) {
    drawn = randomNumber();
}
setNext(drawn);

const correct = guessHigher ? drawn > current : drawn < current;

setPetMood(correct ? PetMood.EXCITED : PetMood.SAD);

if (pet) {
    try {
    const delta = correct ? 10 : -5;
    const result = await updateHealth({ petId: pet.id, delta });
    console.log("updateHealth result:", result);
    window.dispatchEvent(new CustomEvent("pet-updated"));
    console.log("Dispatched pet-updated event");
if (result.success) {
    const updatedPet = { ...pet, health: result.health, lastInteractionAt: result.lastInteractionAt };
    setPet(updatedPet);
    localStorage.setItem("currentPet", JSON.stringify(updatedPet));
    // update mood immediately based on new health if wrong (since you override earlier)
    if (!correct) {
        setPetMood(deriveMoodFromHealth(result.health));
    }
}    } catch {
    // ignore failure
    }
}

setTimeout(() => {
    // Generate a fresh current number for the next round
    setCurrent(randomNumber());
    // Hide the next number until the user guesses again
    setNext(null);
    // Re-enable guessing
    setCanGuess(true);

    // Update score if correct
    if (correct) {
      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore > highScore) setHighScore(newScore);
        return newScore;
      });
    }

    // Reset pet mood
    if (pet) {
      setPetMood(deriveMoodFromHealth(pet.health));
    } else {
      setPetMood(PetMood.HAPPY);
    }
}, ANIMATION_TIME * 2);

setFeedback({
    message: correct ? "Nice! You're right!" : "Oops! Wrong guess.",
    severity: correct ? "success" : "error",
    open: true,
});
};

const health = pet ? pet.health : 0;
let healthColor = "#4caf50";
if (health <= 30) healthColor = "#f44336";
else if (health <= 60) healthColor = "#ff9800";

// Show rules screen if not started
if (!started) {
  return (
    <Panel
      sx={{
        width: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        sx={{ color: '#1976d2' }}
      >
        🎉 Higher or Lower 🎉
      </Typography>
      <Typography
        variant="body2"
        align="center"
        sx={{ px: 3, mb: 2, lineHeight: 1.5 }}
      >
        <strong>How to Play</strong><br/>
        You'll see a <strong>current number</strong> on the left and a <strong>“?”</strong> on the right hiding the next number. Guess whether the hidden number will be <strong>higher</strong> or <strong>lower</strong> than the current one. You can play the game <strong>5 times</strong>!<br/><br/>
        <strong>What happens next:</strong><br/>
        - If you're right, your pet's health gets a <strong>boost</strong> and your score climbs.<br/>
        - If you're wrong, your pet's health takes a <strong>small hit</strong>, but don't worry - you've got this! 🐾<br/><br/>
      </Typography>
      <Button
        variant="contained"
        size="small"
        sx={{ borderRadius: 4, textTransform: 'none', fontWeight: 600 }}
        onClick={() => setStarted(true)}
      >
        Start Playing!
      </Button>
    </Panel>
  );
}

return (
<Panel
    sx={{
    width: 500,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    }}
>
    <Dialog open={showDeadModal} onClose={() => {}} disableEscapeKeyDown>
      <DialogTitle>Game Over</DialogTitle>
      <DialogContent>Your pet has died. Create a new one to continue.</DialogContent>
      <DialogActions>
        <Button onClick={() => {
          localStorage.removeItem("currentPet");
          setShowDeadModal(false);
          navigate("/");
        }} autoFocus>
          Create New Pet
        </Button>
      </DialogActions>
    </Dialog>

    <Box sx={{ mb: 1 }}>
    <Pet mood={petMood} />
    {combinedMood && (
      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        {combinedMood.text}
      </Typography>
    )}
    </Box>

    {pet ? (
    <Box sx={{ width: "100%", mb: 1 }}>
        <Typography vafriant="subtitle1" sx={{ mb: 0.5 }}>
        ❤️ Health:
        </Typography>
        <Box
        sx={{
            position: "relative",
            height: 20,
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
            variant="body2"
            sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
            color: "#000",
            userSelect: "none",
            }}
        >
            {health}%
        </Typography>
        </Box>
    </Box>
    ) : (
    <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Health: N/A
    </Typography>
    )}

    <Typography variant="h6">
    Score: {score} | High Score: {highScore}
    </Typography>
    <Typography variant="subtitle1">Tries left: {triesLeft}</Typography>

    <Snackbar
    open={feedback.open}
    autoHideDuration={1500}
    onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
    <Alert
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        severity={feedback.severity}
        variant="filled"
        sx={{ width: "100%" }}
    >
        {feedback.message}
    </Alert>
    </Snackbar>

    {triesLeft === 0 ? (
    <Box
        sx={{
        mt: 3,
        p: 2,
        border: "2px solid",
        borderColor: "error.main",
        borderRadius: 2,
        textAlign: "center",
        width: "100%",
        }}
    >
        <Typography variant="h5" sx={{ mb: 2 }}>
        Game Over
        </Typography>
    </Box>
    ) : (
    <>
        <Stack direction="row" spacing={4} alignItems="center">
        <Typography variant="h3">{current}</Typography>
        <Typography variant="h3">{next !== null ? next : "?"}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
        <Button variant="contained" disabled={!canGuess || triesLeft <= 0 || pet?.health === 0} onClick={() => void handleGuess(true)}>
            Higher
        </Button>
        <Button variant="contained" disabled={!canGuess || triesLeft <= 0 || pet?.health === 0} onClick={() => void handleGuess(false)}>
            Lower
        </Button>
        </Stack>
    </>
    )}

    <Box sx={{ mt: 3 }}>
    <BackToHome />
    </Box>
</Panel>
);
};
