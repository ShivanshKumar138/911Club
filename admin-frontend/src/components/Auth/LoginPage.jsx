import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { Domain} from "../Config"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData);

    try {
      const response = await fetch(`${Domain}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          username: data.user.username,
          avatar: data.user.avatar
            ? `http://747lottery.in${data.user.avatar}`
            : null,
          accountType: data.user.accountType,
        })
      );

      toast({
        title: "Success",
        description: "Login successful",
        variant: "success",
        duration: 3000,
      });

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      console.log(error.message);
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderRadius: 3,
          bgcolor: "white",
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img
            src="https://static.vecteezy.com/system/resources/previews/041/731/151/non_2x/login-icon-vector.jpg"
            alt="Admin Panel"
            style={{ height: 40, width: 40 }}
          />
          <span>Admin Panel</span>
        </Box>

        {/* Welcome Text */}
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 1,
            background: "linear-gradient(to right, #6B46C1, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Hi, Welcome Back
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            mb: 4,
            color: "text.secondary",
          }}
        >
          Enter your credentials to continue
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Username/Email Field */}
          <TextField
            fullWidth
            label="Email Address / Username"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            sx={{ mb: 3 }}
            disabled={isLoading}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <Box
                  component="button"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    p: 1,
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Box>
              ),
            }}
          />

          {/* Remember Me & Forgot Password */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Keep me logged in"
            />
          </Box>

          {/* Sign In Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.5,
              bgcolor: "#6B46C1",
              "&:hover": {
                bgcolor: "#8B5CF6",
              },
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Don't have account */}
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
