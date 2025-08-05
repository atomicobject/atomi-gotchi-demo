import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch, Button, Stack } from "@mui/material";

interface SettingsMenuProps {
  open: boolean;
  onClose: () => void;
  emailEnabled: boolean;
  onEmailToggle: (enabled: boolean) => void;
  animatedBg: boolean;
  onBgToggle: (enabled: boolean) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  open,
  onClose,
  emailEnabled,
  onEmailToggle,
  animatedBg,
  onBgToggle,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <FormControlLabel
            control={<Switch checked={emailEnabled} onChange={e => onEmailToggle(e.target.checked)} />}
            label="Enable Email Sending"
          />
          <FormControlLabel
            control={<Switch checked={animatedBg} onChange={e => onBgToggle(e.target.checked)} />}
            label="Animated Background"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
