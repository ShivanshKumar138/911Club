// import Mobile from "../Components/Mobile";
// import {
//     AppBar,
//     Toolbar,
//     Typography,
//     IconButton,
//     TextField,
//     Button,
//     Box,
//     Container,
//     Grid,
//   } from "@mui/material";
//   import ArrowBackIcon from "@mui/icons-material/ArrowBack";
//   import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
//   import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// const RetrieveLogin = () => {
// const [image, setImage] = useState(null);
// const navigate = useNavigate();
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <Mobile>
//          <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
//       {/* Header */}
//       <AppBar position="static" sx={{ backgroundColor: "#FA6966", boxShadow: 1 }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <IconButton edge="start">
//             <ArrowBackIcon sx={{ color: "black" }} onClick={()=>navigate(-1)}/>
//           </IconButton>
//           <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>
//             Retrieve Login ID Account
//           </Typography>
//           <IconButton>
//             <HelpOutlineIcon sx={{ color: "black" }} />
//           </IconButton>
//         </Toolbar>
//       </AppBar>

//       {/* Form Section */}
//       <Container sx={{ mt: 3 }}>
//         {[
//           { label: "Bank Account Number", placeholder: "Please enter Bank Card Number" },
//           { label: "IFSC Code", placeholder: "Please enter IFSC" },
//           { label: "GAME ID", placeholder: "Please enter username" },
//           { label: "Email", placeholder: "Please enter content" },
//         ].map((field, index) => (
//           <Box key={index} sx={{ mt: 2 }}>
//             <Typography variant="subtitle1" fontWeight="bold">
//               {field.label} <span style={{ color: "red" }}>*</span>
//             </Typography>
//             <TextField
//               fullWidth
//               placeholder={field.placeholder}
//               variant="outlined"
//               sx={{ backgroundColor: "white", mt: 1 }}
//             />
//           </Box>
//         ))}

//         {/* Image Upload */}
//         <Box sx={{ mt: 3 }}>
//           <Typography variant="subtitle1" fontWeight="bold">
//             Latest Deposit Receipt Proof <span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Grid
//             container
//             sx={{
//               width: 100,
//               height: 100,
//               backgroundColor: "white",
//               borderRadius: "8px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               border: "1px dashed #aaa",
//               mt: 1,
//             }}
//           >
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               style={{ display: "none" }}
//               id="upload-receipt"
//             />
//             <label htmlFor="upload-receipt">
//               {image ? (
//                 <img
//                   src={image}
//                   alt="Uploaded"
//                   style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
//                 />
//               ) : (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     color: "#aaa",
//                   }}
//                 >
//                   <CloudUploadIcon fontSize="large" />
//                   <Typography variant="body2">photo</Typography>
//                 </Box>
//               )}
//             </label>
//           </Grid>
//         </Box>

//         {/* Confirm Button */}
//         <Button
//           fullWidth
//           variant="contained"
//           sx={{
//             backgroundColor: "#FA6966",
//             color: "white",
//             borderRadius: "30px",
//             mt: 4,
//             py: 1.5,
//             fontSize: "16px",
//           }}
//         >
//           Confirm
//         </Button>
//       </Container>
//     </Box>
//     </Mobile>
//   )
// }

// export default RetrieveLogin




import React, { useState } from "react";
import Mobile from "../Components/Mobile";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    TextField,
    Button,
    Box,
    Container,
    Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

const RetrieveLogin = () => {
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [gameId, setGameId] = useState("");
    const [email, setEmail] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    // Handle File Selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Handle Form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append("bankAccountNumber", bankAccountNumber);
        formData.append("ifscCode", ifscCode);
        formData.append("GameId", gameId);
        formData.append("email", email);
        
        // Append the image file under the field name "file"
        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        try {
            const response = await fetch("https://747lottery.fun  /create-retriveID", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response) {
                console.log(response);
                alert("Retrieve Ticket Created Successfully!");
                navigate(-1);
            } else {
                alert(`Error: ${data.msg}`);
            }
        } catch (error) {
            console.error("Error uploading data:", error);
        }
    };

    return (
        <Mobile>
            <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
                {/* Header */}
                <AppBar position="static" sx={{ backgroundColor: "#FA6966", boxShadow: 1 }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        <IconButton edge="start">
                            <ArrowBackIcon sx={{ color: "white" }} onClick={() => navigate(-1)} />
                        </IconButton>
                        <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
                            Retrieve Login ID Account
                        </Typography>
                        <IconButton>
                            <HelpOutlineIcon sx={{ color: "white" }} />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Form Section */}
                <Container sx={{ mt: 3 }}>
                    <form onSubmit={handleSubmit}>
                        {[{
                            label: "Bank Account Number", placeholder: "Please enter Bank Card Number", value: bankAccountNumber, setter: setBankAccountNumber
                        }, {
                            label: "IFSC Code", placeholder: "Please enter IFSC", value: ifscCode, setter: setIfscCode
                        }, {
                            label: "GAME ID", placeholder: "Please enter username", value: gameId, setter: setGameId
                        }, {
                            label: "Email", placeholder: "Please enter content", value: email, setter: setEmail
                        }].map((field, index) => (
                            <Box key={index} sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {field.label} <span style={{ color: "red" }}>*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder={field.placeholder}
                                    variant="outlined"
                                    sx={{ backgroundColor: "white", mt: 1 }}
                                    value={field.value}
                                    onChange={(e) => field.setter(e.target.value)}
                                />
                            </Box>
                        ))}

                        {/* Image Upload */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Latest Deposit Receipt Proof <span style={{ color: "red" }}>*</span>
                            </Typography>
                            <Grid
                                container
                                sx={{
                                    width: 100,
                                    height: 100,
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    border: "1px dashed #aaa",
                                    mt: 1,
                                }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                    id="upload-receipt"
                                />
                                <label htmlFor="upload-receipt">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Uploaded"
                                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                color: "#aaa",
                                            }}
                                        >
                                            <CloudUploadIcon fontSize="large" />
                                            <Typography variant="body2">Upload Photo</Typography>
                                        </Box>
                                    )}
                                </label>
                            </Grid>
                        </Box>

                        {/* Confirm Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                backgroundColor: "#FA6966",
                                color: "white",
                                borderRadius: "30px",
                                mt: 4,
                                py: 1.5,
                                fontSize: "16px",
                            }}
                        >
                            Confirm
                        </Button>
                    </form>
                </Container>
            </Box>
        </Mobile>
    );
};

export default RetrieveLogin;
