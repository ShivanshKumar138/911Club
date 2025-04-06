// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
// } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CloseIcon from "@mui/icons-material/Close";

// const NotificationModal = ({ open, onClose }) => {
//   const [shouldShow, setShouldShow] = useState(true);

//   useEffect(() => {
//     const lastConfirmedDate = localStorage.getItem("notificationConfirmedDate");
//     const today = new Date().toDateString();

//     if (lastConfirmedDate === today) {
//       setShouldShow(false);
//     } else {
//       setShouldShow(true);
//     }
//   }, [open]);

//   const handleConfirm = () => {
//     const today = new Date().toDateString();
//     localStorage.setItem("notificationConfirmedDate", today);
//     onClose();
//   };

//   const handleClose = () => {
//     onClose();
//   };

//   if (!shouldShow) {
//     return null;
//   }

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         borderRadius: "20px",
//       }}
//     >
//       <Box
//         sx={{
//           width: "90%",
//           maxWidth: "333px",
//           maxHeight: "444px",
//           bgcolor: "#ffffff",
//           borderRadius: "15px",
//           boxShadow: 24,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Header Section */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             bgcolor: "#F95959", // Change to yellow
//             borderTopLeftRadius: "15px",
//             borderTopRightRadius: "15px",
//             p: 2,
//             color: "#ffffff", // Black text for the header
//             position: "relative",
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{ fontSize: "16px", textAlign: "center", fontWeight: "bold" }}
//           >
//             Prompt
//           </Typography>
//           <CloseIcon
//             sx={{
//               cursor: "pointer",
//               color: "#ffffff", // Black color for the close icon
//               position: "absolute",
//               right: "8px",
//               top: "50%",
//               transform: "translateY(-50%)",
//             }}
//             onClick={handleClose}
//           />
//         </Box>

//         {/* Content Section */}
//         <Box
//           sx={{
//             flex: 1,
//             overflowY: "auto",
//             p: 2,
//             fontFamily: "Arial, sans-serif",
//             color: "#666",fontSize: "14px",fontFamily: "helvetica",fontWeight: 400,
//           }}
//         >
//         <Typography  gutterBottom fontWeight="bold">
//         📣 📣 📣 Super important announcement, surprises! 📣 📣 📣
//       </Typography>

//       <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//         👑 👑 747 Lottery   wins limited-time recharge reward event 👑
//       </Typography>

//       <Typography variant="body1" fontWeight="bold" gutterBottom>
//         💰 Open from time to time, you can get up to 5% to 10% recharge reward after opening 💰
//       </Typography>

//       <Typography variant="body1" fontWeight="bold" gutterBottom>
//         💵 💵 All recharge channels can get recharge rewards 🔖
//       </Typography>

//       <Typography variant="body2" gutterBottom>
//         😍 😍 😍 😍 ✅ ✅ ✅ ✅
//       </Typography>

//       <Typography variant="body1" sx={{ borderTop: '1px solid #ddd', pt: 2, mt: 2 }} gutterBottom>
//         Follow the channel to send bonuses and benefits from time to time, so that you can get the benefits as quickly as possible.
//       </Typography>

//       <Typography variant="body1" sx={{ borderTop: '1px solid #ddd', pt: 2, mt: 2 }} gutterBottom fontWeight="bold">
//         😍 747 Lottery   launches a new agent reward plan. For each recommended downline, you can get a high first deposit bonus. 
//         The specific reward is subject to the event. The activation quota is limited. Please contact your agent to activate.
//       </Typography>

//       <Typography variant="body1" sx={{ borderTop: '1px solid #ddd', pt: 2, mt: 2 }} gutterBottom fontWeight="bold">
//         WinGo game 1-3 level turnover team commission, downline WinGo game turnover below level 3 will be included in the team turnover, 
//         please check the event page for details
//       </Typography>
//         </Box>

//         {/* Confirm Button */}
//         <Box
//           sx={{
//             textAlign: "center",
//             p: 2,
//             bgcolor: "#ffffff",
//             borderTop: "1px solid #E0E0E0",
//             borderBottomLeftRadius: "15px",
//             borderBottomRightRadius: "15px",
//           }}
//         >
//           <Button
//             variant="contained"
//             sx={{
//               borderRadius: "20px",
//               px: 3,
//               py: 1,
//               background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)", // Matching button color to yellow
//               color: "#ffffff", // Black text
//               "&:hover": {
//                 background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)", // Slightly darker yellow on hover
//               },
//             }}
//             onClick={handleConfirm}
//           >
//             Confirm
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default NotificationModal;



import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

const NotificationModal = ({ open, onClose }) => {
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const lastConfirmedDate = localStorage.getItem("notificationConfirmedDate");
    const today = new Date().toDateString();

    if (lastConfirmedDate === today) {
      setShouldShow(false);
    } else {
      setShouldShow(true);
    }
  }, [open]);

  const handleConfirm = () => {
    const today = new Date().toDateString();
    localStorage.setItem("notificationConfirmedDate", today);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20px",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "333px", // Same width
          maxHeight: "444px", // Same height
          bgcolor: "#ffffff",
          borderRadius: "15px",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Section with Orange Gradient */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgb(245,68,68)",  // Gradient header
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            p: 2,
            color: "#ffffff",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "16px", textAlign: "center", fontWeight: "bold" }}
          >
            Prompt
          </Typography>
          <CloseIcon
            sx={{
              cursor: "pointer",
              color: "#ffffff",
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={handleClose}
          />
        </Box>

        {/* Content Section (unchanged) */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            fontFamily: "Arial, sans-serif",
            color: "#666",fontSize: "14px",fontFamily: "helvetica",fontWeight: 400,
          }}
        >
          <Typography gutterBottom fontWeight="bold">
            📣 📣 📣 Super important announcement, surprises! 📣 📣 📣
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            👑 👑 747 Lottery wins limited-time recharge reward event 👑
          </Typography>

          <Typography variant="body1" fontWeight="bold" gutterBottom>
            💰 Open from time to time, you can get up to 5% to 10% recharge reward after opening 💰
          </Typography>

          <Typography variant="body1" fontWeight="bold" gutterBottom>
            💵 💵 All recharge channels can get recharge rewards 🔖
          </Typography>

          <Typography variant="body2" gutterBottom>
            😍 😍 😍 😍 ✅ ✅ ✅ ✅
          </Typography>

          <Typography variant="body1" sx={{ borderTop: '1px solid #ddd', pt: 2, mt: 2 }} gutterBottom>
            Follow the channel to send bonuses and benefits from time to time, so that you can get the benefits as quickly as possible.
          </Typography>

          <Typography variant="body1" sx={{ borderTop: '1px solid #ddd', pt: 2, mt: 2 }} gutterBottom fontWeight="bold">
            😍 747 Lottery launches a new agent reward plan. For each recommended downline, you can get a high first deposit bonus. 
            The specific reward is subject to the event. The activation quota is limited. Please contact your agent to activate.
          </Typography>

          <Typography variant="body1" sx={{ borderTop: '1px solid #ddd', pt: 2, mt: 2 }} gutterBottom fontWeight="bold">
            WinGo game 1-3 level turnover team commission, downline WinGo game turnover below level 3 will be included in the team turnover, 
            please check the event page for details
          </Typography>
        </Box>

        {/* Confirm Button with Same Orange Gradient */}
        <Box
          sx={{
            textAlign: "center",
            p: 2,
            bgcolor: "#ffffff",
            borderTop: "1px solid #E0E0E0",
            borderBottomLeftRadius: "15px",
            borderBottomRightRadius: "15px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: "20px",
              px: 3,
              py: 1,
              background: "rgb(245,68,68)",  // Orange gradient button
              color: "#ffffff",
              "&:hover": {
                background: "rgb(245,68,68)",  // No color change on hover
              },
            }}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NotificationModal;
