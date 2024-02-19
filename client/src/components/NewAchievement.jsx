import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

export function NewAchievement({ open, onClose, achievement }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="new-achievement-modal-title"
      aria-describedby="new-achievement-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="new-achievement-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          ¡Nuevo logro obtenido!
        </Typography>
        <Typography
          id="new-achievement-modal-description"
          variant="body1"
          component="div"
          gutterBottom
        >
          Has desbloqueado el logro "{achievement}".
        </Typography>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
}
