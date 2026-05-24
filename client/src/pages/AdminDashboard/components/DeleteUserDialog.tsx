import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, CircularProgress } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IUser } from "../services/admin-api";

interface DeleteUserDialogProps {
  user: IUser | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export function DeleteUserDialog({ user, onClose, onConfirm, loading }: DeleteUserDialogProps) {
  return (
    <Dialog open={!!user} onClose={() => !loading && onClose()}>
      <DialogTitle>Delete user?</DialogTitle>
      <DialogContent>
        <Typography>
          Permanently delete{" "}
          <strong>{user?.name}</strong> ({user?.email})? This action cannot be
          undone and will remove all associated data.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          disabled={loading}
          onClick={onConfirm}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineIcon />}
        >
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
