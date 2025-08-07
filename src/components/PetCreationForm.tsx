import { BackToHome } from "@/components/BackToHome";
import { Pet } from "@/components/Pet";
import { RequestMessage } from "@/types/login";
import { PetMood } from "@/types/pet";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useAction, useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../convex/_generated/api";
import { EmailTemplates, getEmailTemplate } from "../../convex/emailTemplates";

interface PetCreationFormData {
  petName: string;
}

interface Props {
  user: any; // TODO: this should be typed
  onSubmitPetForm: (message: RequestMessage) => void;
  notice?: string;
}

export const PetCreationForm = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [petCreated, setPetCreated] = useState(false);
  const [petMood, setPetMood] = useState(PetMood.HAPPY);

  const createPetMutation = useMutation(api.mutations.createPet.createPet);
  const sendEmailAction = useAction(api.sendEmail.sendEmail);

  const { register, handleSubmit, watch, setValue } = useForm<PetCreationFormData>({
    defaultValues: {
      petName: "",
    },
  });

  const petName = watch("petName");
  const isFormValid = petName.trim() !== "";

  const sendPetCreatedEmail = async () => {
    if (!props.user?.email) {
      return;
    }

    console.log(props.user?.email);

    try {
      const result = await sendEmailAction({
        email: props.user?.email,
        subject: "Atomi-Gotchi: Your pet has been created!",
        message: getEmailTemplate(EmailTemplates.PET_CREATED, {
          name: petName,
          health: 100,
          hunger: 100,
          mood: PetMood.HAPPY,
        }),
      });

      if (result?.success) {
        props.onSubmitPetForm({
          type: "success",
          text: `Pet created successfully! We have sent an email to ${props.user?.email} with more information about your pet.`,
        });

        setPetCreated(true);
        setPetMood(PetMood.EXCITED);
      } else {
        props.onSubmitPetForm({
          type: "error",
          text: "Failed to send email",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitForm = async (data: PetCreationFormData) => {
    setLoading(true);

    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        console.error("No user found");
        return;
      }

      const user = JSON.parse(currentUser);

      const result = await createPetMutation({
        petName: data.petName,
        email: user.email,
      });

      if (result?.success) {
        await sendPetCreatedEmail();
      } else {
        props.onSubmitPetForm({
          type: "error",
          text: "Pet creation failed",
        });
      }
    } catch (error) {
      console.error("Error creating pet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmitForm)(e)} style={{ width: "100%" }}>
      <Stack width="100%" alignItems="center" gap={2}>
        {props.notice && (
          <Box
            sx={{
              backgroundColor: "#e3f7ff",
              borderRadius: 2,
              padding: "8px 16px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span role="img" aria-label="info">
              ℹ️
            </span>
            <Typography variant="body1">{props.notice}</Typography>
          </Box>
        )}
        <Typography variant="h1" align="center">
          {petCreated ? `${petName} says hello!` : "Create Your Pet!"}
        </Typography>
        <Pet mood={petMood} />
        {!petCreated ? (
          <>
            <Stack flexDirection="row" gap={1} width="100%">
              <Box flex={0.9}>
                <TextField
                  label="Pet Name"
                  {...register("petName")}
                  fullWidth
                  slotProps={{
                    inputLabel: {
                      shrink: petName.length > 0,
                    },
                    input: {
                      inputProps: {
                        maxLength: 20,
                      },
                    },
                  }}
                />
              </Box>
              <Box flex={0.1} display="flex" justifyContent="center" alignItems="center">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setValue("petName", randomPetName());
                  }}
                  sx={{ minWidth: "unset", typography: "h5" }}
                >
                  🎲
                </Button>
              </Box>
            </Stack>
            <Button variant="contained" disabled={!isFormValid || loading} type="submit">
              {loading ? "Creating your pet..." : "Create"}
            </Button>
          </>
        ) : (
          <BackToHome onClick={() => window.location.reload()} />
        )}
      </Stack>
    </form>
  );
};

const randomPetName = () => {
  const petNames = [
    "Pixel",
    "Mochi",
    "Luna",
    "Boba",
    "Gizmo",
    "Echo",
    "Nova",
    "Pico",
    "Milo",
    "Taco",
    "Cosmo",
    "Pebble",
    "Nugget",
    "Waffles",
    "Chai",
    "Nimbus",
    "Blink",
    "Juno",
    "Sprout",
    "Orbit",
    "Doodle",
    "Snap",
    "Froyo",
    "Noodle",
    "Yuzu",
    "Jelly",
    "Twix",
    "Kiwi",
    "Mango",
    "Zephyr",
    "Loaf",
    "Katsu",
    "Crumbs",
    "Pesto",
    "Amino",
    "Sushi",
    "Gloop",
    "Crouton",
    "Geoff",
    "Bloo",
  ];

  return petNames[Math.floor(Math.random() * petNames.length)];
};
