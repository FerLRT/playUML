import React from "react";
import { Modal, Box, Typography } from "@mui/material";

import { arrayBufferToUrl } from "../utils/arrayBufferToUrl";

import "../styles/newAchievement.css";

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
          width: "auto",
          minWidth: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className="new-achievement-modal-content">
          <img
            src={arrayBufferToUrl(achievement.badge_url, "png")}
            alt={achievement.name}
          />

          <div className="new-achievement-modal-text">
            <Typography
              id="new-achievement-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
              style={{ fontWeight: "bold" }}
            >
              ¡Nuevo logro obtenido!
            </Typography>
            <Typography
              id="new-achievement-modal-description"
              variant="h6"
              component="div"
              gutterBottom
            >
              Has desbloqueado el logro "{achievement.name}"
            </Typography>
            <Typography
              id="new-achievement-modal-description"
              variant="body1"
              component="div"
              gutterBottom
            >
              {achievement.description}
            </Typography>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
