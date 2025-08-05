import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { BackToHome } from "@/components/BackToHome";
import { Pet } from "@/components/Pet";
import { PetMood } from "@/types/pet";
import { Button, Paper, Stack, Typography, Box } from "@mui/material";
import { set } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";

const choices = [
  { name: "rock", img: "/rps/rock1.png" },
  { name: "paper", img: "/rps/paper.png" },
  { name: "scissors", img: "/rps/scissors1.png" },
];

//getts result if you won or lost your game
function getResult(player: string, opponent: string): string {
  if (player === opponent) return "It's a tie!";
  if (
    (player === "rock" && opponent === "scissors") ||
    (player === "paper" && opponent === "rock") ||
    (player === "scissors" && opponent === "paper")
  ) {
    return "Won";
  }
  return "Lost";
}

export const RockPaperScissors = () => {
  const [pet, setPet] = useState<any | null>(null);
  const getPet = useMutation(api.mutations.getPet.getPet);
  const updateHealth = useMutation(api.mutations.updateHealth.updateHealth);
  const [showDeadModal, setShowDeadModal] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [petMood, setPetMood] = useState<PetMood>(PetMood.HAPPY);
  const [finalResultMessage, setFinalResultMessage] = useState<string | null>(null);
  const [outcomes, setOutcomes] = useState<string[]>([]);
  const navigate = useNavigate();

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
          localStorage.setItem("currentPet", JSON.stringify(res.pet));
        }
      } catch {}
    };
    void loadPet();
  }, [getPet]);

  useEffect(() => {
    //dead pet modal
    if (pet && pet.health === 0) {
      setShowDeadModal(true);
    }
  }, [pet]);

  const handlePlay = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setGameStarted(true);
    setRound(0);
    setOutcomes([]);
    setFinalResultMessage(null);
    setPetMood(PetMood.HAPPY);
  };

  const handleChoice = async (choice: string) => {
    const opponent = choices[Math.floor(Math.random() * choices.length)].name;
    const res = getResult(choice, opponent);

    setPlayerChoice(choice);
    setOpponentChoice(opponent);
    setResult(res);
    setOutcomes((prev) => {
      const updated = [...prev, res];
      if (updated.length === 3) {
        void handleFinalResults(updated); //final result is after third round
      }
      return updated;
    });

    //update mood per turn
    if (res === "Won") {
      setPetMood(PetMood.HAPPY);
    } else if (res === "Lost") {
      setPetMood(PetMood.SAD);
    } else {
      setPetMood(PetMood.NEUTRAL);
    }
    setRound((prev) => prev + 1);
  };

  const handleFinalResults = async (results: string[]) => {
    const won = results.filter((r) => r === "Won").length;
    const lost = results.filter((r) => r === "Lost").length;
    const tied = results.filter((r) => r === "It's a tie!").length;
    let delta = 0;
    let message = "You tied Rock Paper Scissors!";
    // update health and mood per final result
    if (won >= 2 || (won === 1 && tied === 2)) {
      delta = 5;
      message = "You won Rock Paper Scissors!";
      setPetMood(PetMood.EXCITED);
    } else if (lost >= 2 || (lost === 1 && tied === 2)) {
      delta = -5;
      message = "You lost Rock Paper Scissors!";
      setPetMood(PetMood.SAD);
    } else {
      setPetMood(PetMood.NEUTRAL);
    }

    const res = await updateHealth({ petId: pet.id, delta });
    if (res.success) {
      const updatedPet = {
        ...pet,
        health: res.health,
        lastInteractionAt: res.lastInteractionAt,
      };
      setPet(updatedPet);
      localStorage.setItem("currentPet", JSON.stringify(updatedPet));
      window.dispatchEvent(new CustomEvent("pet-updated"));
    }

    setFinalResultMessage(message);
  };

  const handleClose = () => {
    setGameStarted(false);
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult(null);
    setRound(0);
    setOutcomes([]);
    setFinalResultMessage(null);
    setPetMood(PetMood.HAPPY);
  };

  const health = pet ? pet.health : 0;
  let healthColor = "#4caf50";
  if (health <= 30) healthColor = "#f44336";
  else if (health <= 60) healthColor = "#ff9800";

  return (
    <div style={{ textAlign: "center" }}>
      <Box sx={{ width: 400, mx: "auto", mb: 1 }}>
        <Box sx={{ mb: 1 }}>
          <Pet mood={petMood} />
        </Box>
        <Box sx={{ width: "100%", mb: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
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
      </Box>

      <h1>Rock Paper Scissors</h1>

      {!gameStarted && (
        <>
          <Button variant="contained" onClick={handlePlay} sx={{ mt: 2, mb: 2 }}>
            Play Game
          </Button>
          <BackToHome />
        </>
      )}

      {gameStarted && (
        <Paper elevation={4} sx={{ maxWidth: 400, mx: "auto", mt: 3, p: 3, borderRadius: 3 }}>
          {round < 3 ? (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Choose your move:
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                {choices.map((c) => (
                  <Box
                    key={c.name}
                    onClick={() => handleChoice(c.name)}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "16px",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 36,
                      cursor: "pointer",
                      boxShadow: 2,
                      transition: "background 0.2s",
                      "&:hover": { background: "#e0e0e0" },
                    }}
                  >
                    <img src={c.img} alt={c.name} style={{ width: 40, height: 40 }} />
                  </Box>
                ))}
              </Stack>

              {playerChoice && opponentChoice && (
                <Typography variant="h6" sx={{ mt: 2 }}>
                  You chose:{" "}
                  <img
                    src={choices.find((c) => c.name === playerChoice)?.img}
                    alt={playerChoice}
                    style={{ width: 40, height: 40, verticalAlign: "middle" }}
                  />
                  &nbsp; Your pet chose:{" "}
                  <img
                    src={choices.find((c) => c.name === opponentChoice)?.img}
                    alt={opponentChoice}
                    style={{ width: 40, height: 40, verticalAlign: "middle" }}
                  />
                  <br />
                  {result && (
                    <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
                      {result} Game number {round} / 3
                    </Typography>
                  )}
                </Typography>
              )}
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Game over! {finalResultMessage || "Loading..."}
              </Typography>
            </>
          )}
          <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>
            Close
          </Button>
        </Paper>
      )}
      <Dialog open={showDeadModal} onClose={() => {}} disableEscapeKeyDown>
        <DialogTitle>Game Over</DialogTitle>
        <DialogContent>Your pet has died. Create a new one to continue.</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              localStorage.removeItem("currentPet");
              setShowDeadModal(false);
              navigate("/");
            }}
            autoFocus
          >
            Create New Pet
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
