import React, { useState, useEffect } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BackToHome } from "@/components/BackToHome";
import { Panel } from "@/components/Panel";
import { Button, Stack, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api.js";
import { Pet } from "@/components/Pet";
import { PetMood } from "@/types/pet";

interface Fruit {
  key: string;
  name: string;
  img: string;
}

interface Treat {
  key: string;
  name: string;
  img: string;
}

const fruits: Fruit[] = [
  { key: "apple", name: "Apple", img: "/food/apple.png" },
  { key: "coconut", name: "Coconut", img: "/food/coconut.png" },
  { key: "orange", name: "Orange", img: "/food/orange.png" },
  { key: "grapes", name: "Grapes", img: "/food/grapes.png" },
  { key: "cherry", name: "Cherry", img: "/food/cherry.png" },
  { key: "pineapple", name: "Pineapple", img: "/food/pineapple.png" },
];

const combinations: Record<string, Treat> = {
  applecoconut: { key: "applecoconut", name: "Crabby Candy", img: "/food/brownorange.png" },
  appleorange: { key: "appleorange", name: "Opposites Candy", img: "/food/redorange.png" },
  applegrapes: { key: "applegrapes", name: "Grapple Candy", img: "/food/redpurple.png" },
  applecherry: { key: "applecherry", name: "Chapped Candy", img: "/food/redbrown.png" },
  applepineapple: {
    key: "applepineapple",
    name: "Apple Overload Candy",
    img: "/food/redyellow.png",
  },
  coconutorange: { key: "coconutorange", name: "Tiger Candy", img: "/food/brownorange.png" },
  coconutgrapes: {
    key: "coconutgrapes",
    name: "Coconut Grape Candy",
    img: "/food/purplebrown.png",
  },
  coconutcherry: { key: "coconutcherry", name: "Crunch Candy", img: "/food/redbrown.png" },
  coconutpineapple: {
    key: "coconutpineapple",
    name: "Tropical Candy",
    img: "/food/brownyellow.png",
  },
  grapesorange: { key: "orangegrapes", name: "Orange Grape Candy", img: "/food/purpleorange.png" },
  cherryorange: { key: "orangecherry", name: "Sunset Candy", img: "/food/redorange.png" },
  orangepineapple: { key: "orangepineapple", name: "Golden Candy", img: "/food/redyellow.png" },
  cherrygrapes: { key: "grapescherry", name: "Berry Grape Candy", img: "/food/redpurple.png" },
  grapespineapple: {
    key: "grapespineapple",
    name: "Complementary Candy",
    img: "/food/purpleyellow.png",
  },
  cherrypineapple: {
    key: "cherrypineapple",
    name: "Cherry Pineapple Candy",
    img: "/food/redyellow.png",
  },
};

export function CookingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<Treat | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [started, setStarted] = useState(false);
  const [fruitScores, setFruitScores] = useState<Record<string, number>>({});
  const [hunger, setHunger] = useState(0);
  // Pet mood state for CookingPage
  const [petMood, setPetMood] = useState<PetMood>(PetMood.HAPPY);
  const [moodTimeout, setMoodTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hungerBar, setHungerBar] = useState<number>(0);
  const [fruitsVisible, setFruitsVisible] = useState(true);
  const [isTempMood, setIsTempMood] = useState(false);
  const navigate = useNavigate();
  const updateHunger = useMutation(api.mutations.updateHunger.updateHunger);

  // Get current pet from localStorage
  const currentPet = localStorage.getItem("currentPet");
  const pet = currentPet ? JSON.parse(currentPet) : null;

  // Only set initial mood and hunger bar when game starts
  useEffect(() => {
    if (started && pet) {
      if (typeof pet.hunger === "number") setHungerBar(pet.hunger);
      // Set mood based on hunger
      if (typeof pet.hunger === "number") {
        if (pet.hunger < 33) setPetMood(PetMood.SAD);
        else if (pet.hunger < 66) setPetMood(PetMood.NEUTRAL);
        else setPetMood(PetMood.HAPPY);
      }
    }
    // eslint-disable-next-line
  }, [started]);

  // Mood change logic, matching SimonSaysPage
  const setPetMoodWithTimeout = (mood: PetMood, duration: number = 2 * 600) => {
    setPetMood(mood);
    setIsTempMood(true);
    if (moodTimeout) clearTimeout(moodTimeout);
    const timeout = setTimeout(() => {
      setIsTempMood(false);
      // Set mood based on current hungerBar after timeout
      if (hungerBar < 33) setPetMood(PetMood.SAD);
      else if (hungerBar < 66) setPetMood(PetMood.NEUTRAL);
      else setPetMood(PetMood.HAPPY);
    }, duration);
    setMoodTimeout(timeout as unknown as NodeJS.Timeout);
  };

  // Update mood automatically when hungerBar changes (after feeding)
  useEffect(() => {
    if (!started || isTempMood) return;
    if (hungerBar < 33) setPetMood(PetMood.SAD);
    else if (hungerBar < 66) setPetMood(PetMood.NEUTRAL);
    else setPetMood(PetMood.HAPPY);
  }, [hungerBar, started, isTempMood]);

  // Assign random integer values to each fruit between -5 and 5 when game starts
  const handleStart = () => {
    const scores: Record<string, number> = {};
    fruits.forEach((fruit) => {
      scores[fruit.key] = Math.floor(Math.random() * 21) - 10; // -10 to 10
    });
    setFruitScores(scores);
    setStarted(true);
    setSelected([]);
    setResult(null);
  };

  const handleSelect = (fruit: Fruit) => {
    if (selected.length < 2 && !selected.includes(fruit.key)) {
      setSelected([...selected, fruit.key]);
    }
  };

  const handleCombine = () => {
    const key = [...selected].sort().join("");
    setResult(
      combinations[key] || { key: "unknown", name: "Unknown Treat", img: "/food/coconut.png" }
    );
    setShowConfetti(true);
    setFruitsVisible(false); // Hide fruits after combining
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleFeedPet = async () => {
    if (selected.length === 2) {
      const score = (fruitScores[selected[0]] || 0) + (fruitScores[selected[1]] || 0);
      setHunger(hunger + score);
      setHungerBar((prev) => Math.max(0, Math.min(100, prev + score)));
      // Mood change logic (SimonSays style)
      if (score < 0) {
        setPetMoodWithTimeout(PetMood.SAD);
      } else if (score > 0) {
        setPetMoodWithTimeout(PetMood.EXCITED);
      } else {
        setPetMoodWithTimeout(PetMood.NEUTRAL);
      }
      // Update hunger in DB (assumes user and pet info available in localStorage)
      const currentPet = localStorage.getItem("currentPet");
      if (currentPet) {
        const pet = JSON.parse(currentPet);
        await updateHunger({ petId: pet.id, delta: score });
      }
    }
    // Hide candy and feed button, show fruits again
    setResult(null);
    setSelected([]);
    setFruitsVisible(true);
  };

  useEffect(() => {
    return () => {
      if (moodTimeout) clearTimeout(moodTimeout);
    };
  }, [moodTimeout]);

  const animatedBg =
    typeof window !== "undefined" ? localStorage.getItem("animatedBg") !== "false" : true;

  return (
    <AnimatedBackground animated={animatedBg}>
      <Panel
        sx={{
          width: 600,
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          background: "white",
          boxShadow: 3,
          position: "relative",
        }}
      >
        {/* Pet display row, only after game has started */}
        {started && (
          <Stack
            direction="row"
            alignItems="center"
            sx={{ width: "100%", position: "relative", mt: 2, mb: 1 }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pet mood={petMood} />
              {/* Hunger bar below pet */}
              <Box sx={{ mt: 1, width: 250 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body1">🍪</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: 20,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "2px solid #ccc",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${hungerBar}%`,
                          height: "100%",
                          backgroundColor:
                            hungerBar <= 30 ? "#f44336" : hungerBar <= 60 ? "#ff9800" : "#4caf50",
                          transition: "all 0.3s ease",
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        )}
        {showConfetti && (
          <Confetti width={600} height={500} recycle={false} numberOfPieces={400} gravity={0.2} />
        )}
        {!started ? (
          <Stack alignItems="center" justifyContent="center" height="100%" width="100%" gap={2}>
            <Typography variant="h4" fontWeight={700} color="#1976d2" mt={2} mb={1}>
              Cooking Minigame
            </Typography>
            <Typography fontSize={18} color="#1976d2" mb={1}>
              Select two fruits to combine into a treat!
            </Typography>
            <Typography fontSize={16} color="#1976d2" mb={2}>
              Try to figure out your pet's favorite
            </Typography>
            <Button
              variant="contained"
              onClick={handleStart}
              sx={{ background: "#1976d2", color: "#fff", fontWeight: 700, boxShadow: 3, mt: 2 }}
            >
              Start Game
            </Button>
          </Stack>
        ) : (
          <>
            {started && (
              <>
                {fruitsVisible && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 2,
                      width: 350,
                      minHeight: 160,
                      position: "relative",
                      mb: 2,
                    }}
                  >
                    {fruits.map((fruit) => (
                      <Box
                        key={fruit.key}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          cursor: selected.includes(fruit.key) ? "not-allowed" : "pointer",
                          opacity: selected.includes(fruit.key) ? 0.5 : 1,
                          transition: "all 0.2s ease",
                          borderRadius: 2,
                          border: selected.includes(fruit.key)
                            ? "2px solid #1976d2"
                            : "2px solid transparent",
                          boxShadow: selected.includes(fruit.key) ? "0 0 8px #1976d2" : undefined,
                          background: "#f5faff",
                          p: 1,
                          m: 1,
                          "&:hover": {
                            background: "#e3f2fd",
                            transform: selected.includes(fruit.key) ? undefined : "scale(1.05)",
                          },
                        }}
                        onClick={() => handleSelect(fruit)}
                      >
                        <img
                          src={fruit.img}
                          alt={fruit.name}
                          style={{ width: 48, height: 48, borderRadius: 8 }}
                        />
                        <Typography fontSize={14} textAlign="center" color="#1976d2">
                          {fruit.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                <Typography fontSize={16} color="#1976d2" mb={2}>
                  Selected:{" "}
                  {selected.map((key) => fruits.find((f) => f.key === key)?.name).join(" ")}
                </Typography>
                {selected.length === 2 && !result && fruitsVisible && (
                  <Button
                    variant="contained"
                    onClick={handleCombine}
                    sx={{
                      background: "#1976d2",
                      color: "#fff",
                      fontWeight: 700,
                      boxShadow: 3,
                      mb: 2,
                    }}
                  >
                    Combine
                  </Button>
                )}
                {result && !fruitsVisible && (
                  <Box
                    sx={{
                      mt: 2,
                      mb: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      background: "#f5faff",
                      borderRadius: 3,
                      boxShadow: 2,
                      p: 2,
                      zIndex: 2,
                    }}
                  >
                    <img
                      src={result.img}
                      alt={result.name}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        boxShadow: "0 0 12px #1976d2",
                        background: "#f5faff",
                      }}
                    />
                    <Typography variant="h6" color="#1976d2" mt={1}>
                      {result.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleFeedPet}
                      sx={{
                        border: "2px solid #1976d2",
                        color: "#1976d2",
                        fontWeight: 700,
                        background: "#fff",
                        mt: 1,
                      }}
                    >
                      Feed Your Pet
                    </Button>
                  </Box>
                )}
              </>
            )}
            <Box mt={2}>
              <BackToHome />
            </Box>
          </>
        )}
      </Panel>
    </AnimatedBackground>
  );
}
