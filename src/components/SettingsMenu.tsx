import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Button,
  Stack,
} from "@mui/material";

interface SettingsMenuProps {
  open: boolean;
  onClose: () => void;
  emailEnabled: boolean;
  onEmailToggle: (enabled: boolean) => void;
  animatedBg: boolean;
  onBgToggle: (enabled: boolean) => void;
  petName: string;
  onRenamePet: (newName: string) => void;
  onDeleteAccount: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  open,
  onClose,
  emailEnabled,
  onEmailToggle,
  animatedBg,
  onBgToggle,
  petName,
  onRenamePet,
  onDeleteAccount,
}) => {
  const [showDormantDialog, setShowDormantDialog] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(petName ?? "");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [showDeletedPopup, setShowDeletedPopup] = React.useState(false);

  React.useEffect(() => {
    setRenameValue(petName ?? "");
  }, [petName, open, renameDialogOpen]);

  const handleEmailToggle = (enabled: boolean) => {
    if (!enabled) {
      setShowDormantDialog(true);
    }
    onEmailToggle(enabled);
  };

  const handleDormantDialogClose = () => {
    setShowDormantDialog(false);
  };

  const handleRenameDialogOpen = () => {
    setRenameDialogOpen(true);
  };

  const handleRenameDialogClose = () => {
    setRenameDialogOpen(false);
    setRenameValue(petName ?? "");
  };

  const handleRename = () => {
    if (typeof renameValue === "string" && renameValue.trim() && renameValue !== petName) {
      onRenamePet(renameValue.trim());
      setRenameDialogOpen(false);
    }
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteAccount = () => {
    // Confirm deletion
    onDeleteAccount();
    setDeleteDialogOpen(false);
    setShowDeletedPopup(true);
    setTimeout(() => {
      setShowDeletedPopup(false);
      window.location.href = '/login';
    }, 5000);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <FormControlLabel
              control={<Switch checked={emailEnabled} onChange={e => handleEmailToggle(e.target.checked)} />}
              label="Enable Email Sending"
            />
            <FormControlLabel
              control={<Switch checked={animatedBg} onChange={e => onBgToggle(e.target.checked)} />}
              label="Animated Background"
            />
            <Button variant="outlined" color="primary" onClick={handleRenameDialogOpen}>
              Rename Pet
            </Button>
            <Button variant="outlined" color="error" onClick={handleDeleteDialogOpen}>
              Delete Account
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={renameDialogOpen} onClose={handleRenameDialogClose}>
        <DialogTitle>Rename Your Pet</DialogTitle>
        <DialogContent>
          <Stack direction="row" gap={1} alignItems="center">
            <input
              type="text"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              placeholder="Enter new pet name"
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <Button onClick={handleRename} variant="contained" color="primary" disabled={!renameValue.trim() || renameValue === petName}>
              Confirm
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameDialogClose} variant="outlined" color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          Are you sure you want to delete your account? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} variant="outlined" color="primary">Cancel</Button>
          <Button onClick={handleDeleteAccount} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showDeletedPopup}>
        <DialogTitle>Account Deleted</DialogTitle>
        <DialogContent>
          <Stack alignItems="center" justifyContent="center">
            <img src="/gifs/dead.png" alt="Pet is dead" style={{ width: 120, height: 120 }} />
            <div style={{ marginTop: 16, fontWeight: 600, color: '#d32f2f' }}>
              Your pet has died and your account has been deleted.<br />You will be redirected to login.
            </div>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={showDormantDialog} onClose={handleDormantDialogClose}>
        <DialogTitle>Email Disabled</DialogTitle>
        <DialogContent>
          Your pet will be dormant until email sending is turned back on.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDormantDialogClose} variant="contained" color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
