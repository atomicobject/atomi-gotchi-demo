import { Pet } from "@/components/Pet";
import { PetInfo } from "@/types/pet";
import { Box, Stack, Typography } from "@mui/material";

interface Props {
  petInfo: PetInfo;
}

export const PetInfoCard = (props: Props) => {
  return (
    <Stack justifyContent="center" alignItems="center" gap={1}>
      <Typography variant="h1" sx={{ color: "primary.main" }}>
        {props.petInfo.name}
      </Typography>
      <Pet mood={props.petInfo.mood} />
      <Typography variant="body1">{getPetMoodDescription(props.petInfo)}</Typography>
      <Stack flexDirection="row" gap={1}>
        <Typography variant="body1">❤️</Typography>
        {getHealthBar(props.petInfo.health)}
      </Stack>
      <Stack flexDirection="row" gap={1}>
        <Typography variant="body1">🍪</Typography>
        {getHungerBar(props.petInfo.hunger)}
      </Stack>
    </Stack>
  );
};

// Mood description based only on health
const getPetMoodDescription = (petInfo: PetInfo) => {
  if (petInfo.health === 0) {
    return `${petInfo.name} is dead.`;
  }

  const healthWeight = 0.7;
  const hungerWeight = 0.3;

  const composite =
    (petInfo.health * healthWeight + petInfo.hunger * hungerWeight) / (healthWeight + hungerWeight);

  if (composite < 33) {
    return `${petInfo.name} seems sad.`;
  }
  // optionally add a “happy” tier if composite is high
  if (composite >= 80) {
    return `${petInfo.name} seems happy!`;
  }
  return `${petInfo.name} seems okay.`;
};

const getHealthBar = (health: number) => {
  const percentage = Math.max(0, Math.min(100, health));
  let color = "#4caf50";
  if (percentage <= 30) color = "#f44336";
  else if (percentage <= 60) color = "#ff9800";
  return (
    <Box
      sx={{
        width: 250,
        height: 20,
        backgroundColor: "#e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
        border: "2px solid #ccc",
      }}
    >
      <Box
        sx={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor: color,
          transition: "all 0.3s ease",
          borderRadius: 1,
        }}
      />
    </Box>
  );
};

const getHungerBar = (hunger: number) => {
  const percentage = Math.max(0, Math.min(100, hunger));
  let color = "#4caf50";
  if (percentage <= 30) color = "#f44336";
  else if (percentage <= 60) color = "#ff9800";
  return (
    <Box
      sx={{
        width: 250,
        height: 20,
        backgroundColor: "#e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
        border: "2px solid #ccc",
      }}
    >
      <Box
        sx={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor: color,
          transition: "all 0.3s ease",
          borderRadius: 1,
        }}
      />
    </Box>
  );
};
