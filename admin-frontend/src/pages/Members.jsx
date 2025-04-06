/*eslint-disable*/
import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useToast } from "../components/ui/use-toast";
import {
  Search,
  Lock,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LazyMotion, domAnimation, m } from "framer-motion";
import React from "react";
import { getToken, removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utils/api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Co2Sharp } from "@mui/icons-material";

// Add these styles at the top of your component
const scrollbarHideStyles = {
  // Hide scrollbar for Chrome, Safari and Opera
  "::-webkit-scrollbar": {
    display: "none",
  },
  // Hide scrollbar for IE, Edge and Firefox
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

// Add this helper function at the top of the file
const storeDeletedUser = (user) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 360); // Add 360 days

  const deletedUser = {
    ...user,
    deletedAt: new Date().toISOString(),
    expiresAt: expirationDate.toISOString(),
  };

  // Get existing deleted users or initialize empty array
  const existingDeleted = JSON.parse(
    localStorage.getItem("deletedUsers") || "[]"
  );

  // Add new deleted user
  existingDeleted.push(deletedUser);

  // Store back in localStorage
  localStorage.setItem("deletedUsers", JSON.stringify(existingDeleted));
};

// Add this helper function to get deleted users
const getDeletedUsers = () => {
  const now = new Date();
  const deletedUsers = JSON.parse(localStorage.getItem("deletedUsers") || "[]");

  // Filter out expired entries
  const validUsers = deletedUsers.filter((user) => {
    return new Date(user.expiresAt) > now;
  });

  // Update storage without expired entries
  localStorage.setItem("deletedUsers", JSON.stringify(validUsers));

  return validUsers;
};

// First, add these tab-related components at the top
const TabButton = ({ active, count, children, onClick }) => (
  <Button
    variant={active ? "default" : "outline"}
    className={`${active ? "bg-blue-500 text-white" : "bg-white"} relative`}
    onClick={onClick}
  >
    {children}
    {count && (
      <span className="ml-2 px-2 py-0.5 text-xs bg-white text-blue-500 rounded-full">
        {count}
      </span>
    )}
  </Button>
);

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [actionStatus, setActionStatus] = useState(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState({});
  // console.log(selectedProfile);
  const fetchUsers = async () => {
    try {
      const response = await apiCall("/fetchuserdetails");
      console.log(response);
      setUsers(response.users);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users",
      });
    }
  };
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [user, setUser] = useState(null);
  const handleCloseForm = () => {
    setIsFormVisible(false);
    setSelectedProfile(null);
    setUser(null);
  };
  useEffect(() => {
    fetchUsers();
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (activeTab === "deleted") {
      setDeletedUsers(getDeletedUsers());
    }
  }, [activeTab]);

  const handleLockUser = async (mobile) => {
    try {
      setActionStatus({ type: "loading", uid: mobile, action: "lock" });

      // Find the user before deletion
      const userToDelete = users.find((user) => user.mobile === mobile);

      const response = await apiCall("/deleteuser", {
        method: "DELETE",
        body: JSON.stringify({ mobile }),
      });

      if (response.success) {
        // Store the deleted user info
        if (userToDelete) {
          storeDeletedUser(userToDelete);
        }

        // Remove the user from the local state
        setUsers((prev) => prev.filter((user) => user.mobile !== mobile));

        setActionStatus({ type: "success", uid: mobile, action: "lock" });

        toast({
          title: "Success",
          description: "User has been deleted successfully",
        });
      }
    } catch (err) {
      setActionStatus({ type: "error", uid: mobile, action: "lock" });
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete user",
      });
    }
  };

  const handleViewProfile = async (uid, u) => {
    setIsFormVisible(true);
    console.log(u);
    try {
      setIsProfileLoading(true);
      setIsProfileOpen(true);
      console.log(uid);
      const response = await apiCall(`/user-profile/${uid}`, {
        method: "GET",
      });
      // response=JSON.parse(response);
      console.log(response);
      if (response) {
        setSelectedProfile(response);
        setCurrentUser(u);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to load user profile",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };
  console.log(selectedProfile);
  // Add unlock user handler
  const handleUnlockUser = async (mobile) => {
    try {
      setActionStatus({ type: "loading", uid: mobile, action: "unlock" });

      // Get user data from localStorage
      const deletedUsers = getDeletedUsers();
      const userToUnlock = deletedUsers.find((user) => user.mobile === mobile);

      if (!userToUnlock) {
        throw new Error("User data not found");
      }

      const response = await apiCall("/unlockuser", {
        method: "PUT",
        body: JSON.stringify({
          mobile: userToUnlock.mobile, // Using mobile from localStorage data
        }),
      });

      if (response.success) {
        // Remove from deleted users in localStorage
        const updatedDeleted = deletedUsers.filter(
          (user) => user.mobile !== mobile
        );
        localStorage.setItem("deletedUsers", JSON.stringify(updatedDeleted));

        // Update state
        setDeletedUsers(updatedDeleted);

        toast({
          title: "Success",
          description: "User has been unlocked successfully",
        });

        // Refresh active users list
        fetchUsers();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to unlock user",
      });
    } finally {
      setActionStatus({ type: "idle", uid: mobile, action: "unlock" });
    }
  };

  // Enhanced TableSkeleton with wave effect
  const TableSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow key={i}>
          <TableCell className="px-3 sm:px-4">
            <motion.div
              animate={{
                background: [
                  "hsl(0, 0%, 95%)",
                  "hsl(0, 0%, 85%)",
                  "hsl(0, 0%, 95%)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
              className="h-4 w-8 rounded"
            />
          </TableCell>
          <TableCell className="px-3 sm:px-4">
            <div className="space-y-2">
              <motion.div
                animate={{
                  background: [
                    "hsl(0, 0%, 95%)",
                    "hsl(0, 0%, 85%)",
                    "hsl(0, 0%, 95%)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2,
                }}
                className="h-4 w-32 rounded"
              />
              <motion.div
                animate={{
                  background: [
                    "hsl(0, 0%, 95%)",
                    "hsl(0, 0%, 85%)",
                    "hsl(0, 0%, 95%)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2,
                }}
                className="h-3 w-24 sm:hidden"
              />
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <motion.div
              animate={{
                background: [
                  "hsl(0, 0%, 95%)",
                  "hsl(0, 0%, 85%)",
                  "hsl(0, 0%, 95%)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
              className="h-4 w-24 rounded"
            />
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            <motion.div
              animate={{
                background: [
                  "hsl(0, 0%, 95%)",
                  "hsl(0, 0%, 85%)",
                  "hsl(0, 0%, 95%)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
              className="h-4 w-16 rounded"
            />
          </TableCell>
          <TableCell>
            <motion.div
              animate={{
                background: [
                  "hsl(0, 0%, 95%)",
                  "hsl(0, 0%, 85%)",
                  "hsl(0, 0%, 95%)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
              className="h-4 w-16 rounded"
            />
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            <motion.div
              animate={{
                background: [
                  "hsl(0, 0%, 95%)",
                  "hsl(0, 0%, 85%)",
                  "hsl(0, 0%, 95%)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
              className="h-4 w-24 rounded"
            />
          </TableCell>
          <TableCell className="px-3 sm:px-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <motion.div
                animate={{
                  background: [
                    "hsl(0, 0%, 95%)",
                    "hsl(0, 0%, 85%)",
                    "hsl(0, 0%, 95%)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2,
                }}
                className="h-8 w-full sm:w-20 rounded"
              />
              <motion.div
                animate={{
                  background: [
                    "hsl(0, 0%, 95%)",
                    "hsl(0, 0%, 85%)",
                    "hsl(0, 0%, 95%)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2,
                }}
                className="h-8 w-full sm:w-20 rounded"
              />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </motion.div>
  );

  // Enhanced LoadingProgress component
  const LoadingProgress = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-2"
    >
      <Progress value={loadingProgress} className="h-2">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/50 to-blue-100/0"
          animate={{
            x: [-200, 200],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          animate={{
            x: [-200, 200],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        />
      </Progress>
      <div className="flex items-center justify-center gap-2">
        <motion.p
          className="text-sm text-gray-500"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          Loading users... {loadingProgress}%
        </motion.p>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-2 h-2 rounded-full bg-blue-500"
        />
      </div>
    </motion.div>
  );

  // Enhanced HeaderSkeleton with wave effect
  const HeaderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-6 rounded bg-gray-200"
          style={{ width: `${Math.random() * 30 + 50}%` }}
          animate={{
            opacity: [0.7, 0.4, 0.7],
            x: [0, 2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );

  // Add this new component for loading overlay
  const LoadingOverlay = () => {
    const spinTransition = {
      repeat: Infinity,
      ease: "linear",
      duration: 1,
      type: "tween",
    };

    return (
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
        transition={{ duration: 0.2 }}
      >
        <m.div
          className="flex flex-col items-center gap-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <div className="relative">
            <m.div
              className="w-12 h-12 border-4 border-blue-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={spinTransition}
            />
            <m.div
              className="absolute inset-0 border-t-4 border-blue-200 rounded-full"
              animate={{ rotate: -360 }}
              transition={spinTransition}
            />
          </div>
          <m.p
            className="text-blue-500 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Loading...
          </m.p>
        </m.div>
      </m.div>
    );
  };

  // Add animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // First, define ErrorAlert component
  const ErrorAlert = ({ error }) => {
    const errorTypes = {
      error: {
        icon: <AlertCircle className="h-4 w-4" />,
        className: "border-red-200 bg-red-50 text-red-800",
      },
      warning: {
        icon: <AlertTriangle className="h-4 w-4" />,
        className: "border-yellow-200 bg-yellow-50 text-yellow-800",
      },
      info: {
        icon: <Info className="h-4 w-4" />,
        className: "border-blue-200 bg-blue-50 text-blue-800",
      },
    };

    const { icon, className } = errorTypes[error.type] || errorTypes.error;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <Alert className={className}>
          {icon}
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium">{error.message}</p>
              {error.details && (
                <p className="text-xs mt-1 opacity-80">{error.details}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  };

  // Then, define ActionButton component
  const ActionButton = ({ user, action, onClick }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleClick = () => {
      setShowConfirm(true);
    };

    const handleConfirm = () => {
      setShowConfirm(false);
      onClick();
    };

    const handleCancel = () => {
      setShowConfirm(false);
    };

    const isLoading =
      actionStatus?.type === "loading" &&
      actionStatus.uid === user.mobile &&
      actionStatus.action === action;
    const isSuccess =
      actionStatus?.type === "success" &&
      actionStatus.uid === user.mobile &&
      actionStatus.action === action;
    const isError =
      actionStatus?.type === "error" &&
      actionStatus.uid === user.mobile &&
      actionStatus.action === action;

    return (
      <>
        {showConfirm && (
          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the user account. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirm}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <Button
              className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto justify-center"
              size="sm"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
              </motion.div>
              Success
            </Button>
          </motion.div>
        ) : isError ? (
          <Button
            className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto justify-center"
            size="sm"
            onClick={onClick}
          >
            <XCircle className="w-3 h-3 mr-1" />
            Retry
          </Button>
        ) : (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleClick}
              className="bg-destructive hover:bg-destructive/90 text-white w-full sm:w-auto justify-center"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                </motion.div>
              ) : (
                <Lock className="w-3 h-3 mr-1" />
              )}
              <span className="sm:hidden">Delete</span>
              <span className="hidden sm:inline">DELETE USER</span>
            </Button>
          </motion.div>
        )}
      </>
    );
  };

  // Then, memoize both components
  const MemoizedActionButton = React.memo(ActionButton);
  const MemoizedErrorAlert = React.memo(ErrorAlert);

  // Optimize table rendering with virtualization
  const TableContent = () => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    const formatBalance = (balance) => {
      if (balance === null || balance === undefined) return "₹0.00";
      return `₹${Number(balance).toFixed(2)}`;
    };

    // Get the appropriate users based on active tab
    const getDisplayUsers = () => {
      switch (activeTab) {
        case "active":
          return users.filter((user) => !user.locked);
        case "locked":
          return getDeletedUsers();
        default:
          return [];
      }
    };

    const displayUsers = getDisplayUsers();

    const loginToGame = async (mobile, plainPassword) => {
      try {
        const response = await fetch("https://api.747lottery.fun/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: mobile,
            password: plainPassword,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          // Get the token and admin status from the response
          const token = data.token;
          const isAdmin = data.user.accountType; // Adjust based on your API response

          // Redirect to main site with token and admin status in URL parameters
          window.location.href = `https://747lottery.fun/auth-path?token=${encodeURIComponent(
            token
          )}&admin=${isAdmin}`;
        } else {
          console.error("Login failed:", response.statusText);
          alert("Login failed! Please check your credentials.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
      }
    };
    return (
      <div ref={ref}>
        <TableHeader>
          <TableRow>
            <TableHead className="pr-16">UID</TableHead>
            <TableHead className="pr-16">Wallet Amount</TableHead>
            <TableHead className="pr-16">Mobile</TableHead>
            <TableHead className="pr-16">Password</TableHead>
            <TableHead className="pr-16">Status</TableHead>
          </TableRow>
        </TableHeader>
        {inView && (
          <m.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            layoutScroll
          >
            {displayUsers
              .filter((user) =>
                searchQuery
                  ? user.uid
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    String(user.mobile)?.includes(searchQuery)
                  : true
              )
              .map((user) => (
                <m.tr
                  key={user.mobile}
                  variants={itemVariants}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="pr-7">{user.uid}</TableCell>
                  <TableCell className="pr-16">
                    <span className="font-medium text-gray-900">
                      {formatBalance(user.walletAmount)}
                    </span>
                  </TableCell>
                  <TableCell className="pr-16">{user.mobile}</TableCell>
                  <TableCell className="pr-7">{user.plainPassword}</TableCell>
                  <TableCell className="pr-7">
                    <Badge
                      variant={
                        activeTab === "locked" ? "destructive" : "success"
                      }
                    >
                      {activeTab === "locked" ? "inactive" : "active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {activeTab === "active" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleLockUser(user.mobile)}
                        >
                          DELETE USER
                        </Button>
                      )}
                      {activeTab === "locked" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-200 hover:bg-green-50 text-green-600"
                            onClick={() => handleUnlockUser(user.mobile)}
                            disabled={
                              actionStatus?.uid === user.mobile &&
                              actionStatus?.type === "loading"
                            }
                          >
                            {actionStatus?.uid === user.mobile &&
                            actionStatus?.type === "loading" ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            UNLOCK USER
                          </Button>
                          <div className="text-sm text-gray-500">
                            Deleted on:{" "}
                            {new Date(user.deletedAt).toLocaleDateString()}
                          </div>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(user._id, user)}
                      >
                        PROFILE
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          loginToGame(user.mobile, user.plainPassword)
                        }
                      >
                        Login Game
                      </Button>
                    </div>
                  </TableCell>
                </m.tr>
              ))}
          </m.div>
        )}
      </div>
    );
  };
  const [filteredMembers, setFilteredMembers] = useState([]);
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter((member) =>
        member.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(users);
    }
  };
  console.log(selectedProfile);
  console.log(selectedProfile.directSubordinates);
  // Add this function to get the count of active/locked users
  const getUserCounts = () => ({
    active: users.filter((user) => !user.locked).length,
    locked: users.filter((user) => user.locked).length,
    deleted: deletedUsers.length,
  });
  console.log(selectedProfile);
  // Update the ProfileModal component
  const ProfileModal = ({ isOpen, onClose, profile, isLoading, user }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : profile ? (
            <div className="grid gap-6 py-4">
              {/* Basic Information */}
              <div className="grid gap-4">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">
                      Username
                    </span>
                    <p className="text-sm">{user.username}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">
                      Wallet Balance
                    </span>
                    <p className="text-sm">₹{user.walletAmount}</p>
                  </div>
                </div>
              </div>
              {/* Team Statistics */}
              <div className="grid gap-4">
                <h3 className="font-semibold">Team Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">
                      Direct Subordinates
                    </span>
                    <p className="text-sm">
                      Registrations: {profile.directSubordinates?.noOfRegister}
                    </p>
                    <p className="text-sm">
                      Deposits: ₹{profile.directSubordinates?.depositAmount}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">
                      Team Subordinates
                    </span>
                    <p className="text-sm">
                      Registrations: {profile.teamSubordinates?.noOfRegister}
                    </p>
                    <p className="text-sm">
                      Deposits: ₹{profile.teamSubordinates?.depositAmount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deposit History */}
              <div className="grid gap-4">
                <h3 className="font-semibold">Recent Deposits</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Method</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.depositHistory?.slice(0, 5).map((deposit) => (
                        <tr key={deposit._id} className="border-b">
                          <td className="py-2">₹{deposit.depositAmount}</td>
                          <td className="py-2">{deposit.depositMethod}</td>
                          <td className="py-2">
                            <Badge
                              variant={
                                deposit.depositStatus === "completed"
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {deposit.depositStatus}
                            </Badge>
                          </td>
                          <td className="py-2">
                            {new Date(deposit.depositDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Betting History */}
              <div className="grid gap-4">
                <h3 className="font-semibold">Recent Bets</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Result</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Win/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.bets?.slice(0, 5).map((bet) => (
                        <tr key={bet._id} className="border-b">
                          <td className="py-2">₹{bet.betAmount}</td>
                          <td className="py-2">{bet.result}</td>
                          <td className="py-2">
                            <Badge
                              variant={
                                bet.status === "Succeed"
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {bet.status}
                            </Badge>
                          </td>
                          <td
                            className={`py-2 ${
                              bet.winLoss.startsWith("-")
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            ₹{bet.winLoss}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Referred Users */}
              <div className="grid gap-4">
                <h3 className="font-semibold">Referred Users</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.referredUserMobiles?.map((mobile, index) => (
                    <Badge key={index} variant="outline">
                      {mobile}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">
              No profile data available
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  // console.log(selectedProfile.directSubordinates?.noOfRegister);
  return (
    <LazyMotion features={domAnimation}>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 relative">
        <AnimatePresence mode="wait" initial={false}>
          {/* Only render client-side animations after hydration */}
          {isClient && isLoading && <LoadingOverlay />}

          {/* Header Section with Loading State */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 shadow-sm">
            {isLoading ? (
              <HeaderSkeleton />
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                    User Management
                  </h1>
                  <p className="text-sm text-gray-600">
                    Manage and monitor user accounts
                  </p>
                </div>
                <div className="flex justify-center mb-6">
                  <Input
                    type="text"
                    placeholder="Search by UID"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full max-w-md"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm w-fit">
                    <span className="font-medium">Active Users</span>
                    <span className="bg-white text-blue-500 px-2 py-0.5 rounded-full text-xs font-bold">
                      {getUserCounts().active}
                    </span>
                  </div> */}
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button
                      variant={activeTab === "active" ? "default" : "outline"}
                      className={`${
                        activeTab === "active"
                          ? "bg-blue-500 text-white"
                          : "bg-white border-blue-100 hover:bg-blue-50 text-blue-600"
                      } flex-1 sm:flex-none justify-center`}
                      onClick={() => setActiveTab("active")}
                    >
                      <span className="font-medium">Active Users</span>
                      <span className="ml-2 px-2 py-0.5 text-xs bg-white text-blue-500 rounded-full">
                        {getUserCounts().active}
                      </span>
                    </Button>
                    <Button
                      variant={activeTab === "locked" ? "default" : "outline"}
                      className={`${
                        activeTab === "locked"
                          ? "bg-blue-500 text-white"
                          : "bg-white border-blue-100 hover:bg-blue-50 text-blue-600"
                      } flex-1 sm:flex-none justify-center`}
                      onClick={() => setActiveTab("locked")}
                    >
                      LOCKED USERS
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading Progress */}
          {isLoading && <LoadingProgress />}

          {/* Now we can use MemoizedErrorAlert safely */}
          {error && <MemoizedErrorAlert error={error} />}

          {/* Search and Filter Section with Loading State */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-3 sm:p-4">
              {isLoading ? (
                <div className="flex flex-col gap-3">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by username, mobile, or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="text-gray-600 flex-1 sm:flex-none justify-center"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                    <Button
                      variant="outline"
                      className="text-gray-600 flex-1 sm:flex-none justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              ) : (
                <TableContent />
              )}
            </CardContent>
          </Card>

          {/* Users Table - With Loading State */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {!error && (
                <div className="overflow-x-auto hide-scrollbar">
                  <Table>
                    {/* <TableHeader>
    <TableRow className="bg-gray-50/50">
      <TableHead className="w-36 px-4">ID</TableHead>
      <TableHead className="w-40 px-4">Username</TableHead>
      <TableHead className="w-40 px-4">Phone</TableHead>
      <TableHead className="w-24 px-4">Balance</TableHead>
      <TableHead className="w-24 px-4">Status</TableHead>
      <TableHead className="w-40 px-4">Created At</TableHead>
      <TableHead className="w-40 px-4">Action</TableHead>
    </TableRow>
  </TableHeader> */}
                    <TableBody>
                      {isLoading ? <TableSkeleton /> : <TableContent />}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination with Loading State */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 border-t border-gray-100 bg-gray-50/50 gap-3">
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-3 order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-4 order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-end">
                      <Skeleton className="h-4 w-32" />
                      <div className="flex gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start">
                    <select className="h-8 rounded-md border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>100</option>
                      <option>50</option>
                      <option>25</option>
                      <option>10</option>
                    </select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>
                )}
                <div className="flex items-center gap-4 order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-end">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    1-100 of 941
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled
                      className="h-8 w-8 border-gray-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-gray-200"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatePresence>

        {/* Add this near the end of your JSX */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => {
            setIsProfileOpen(!isProfileOpen);
            // setSelectedProfile(null);
          }}
          profile={selectedProfile}
          user={currentUser}
          isLoading={isProfileLoading}
        />
      </div>
    </LazyMotion>
  );
};

export default Members;

// import { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
// } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";
// import { useToast } from "../components/ui/use-toast";
// import { Search, Lock, UserCircle, ChevronLeft, ChevronRight, Download, Filter, AlertCircle, RefreshCw, CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
// import { Skeleton } from "../components/ui/skeleton";
// import { Alert, AlertDescription } from "../components/ui/alert";
// import { Progress } from "../components/ui/progress";
// import { motion, AnimatePresence } from "framer-motion";
// import { useInView } from 'react-intersection-observer';
// import { LazyMotion, domAnimation, m } from 'framer-motion';
// import React from 'react';
// import { getToken, removeToken } from '../utils/auth';
// import { useNavigate } from 'react-router-dom';
// import { apiCall } from '../utils/api';
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "../components/ui/alert-dialog";
// import { Badge } from "../components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import { Co2Sharp } from '@mui/icons-material';

// // Add these styles at the top of your component
// const scrollbarHideStyles = {
//   // Hide scrollbar for Chrome, Safari and Opera
//   '::-webkit-scrollbar': {
//     display: 'none',
//   },
//   // Hide scrollbar for IE, Edge and Firefox
//   msOverflowStyle: 'none',
//   scrollbarWidth: 'none',
// };

// // Add this helper function at the top of the file
// const storeDeletedUser = (user) => {
//   const expirationDate = new Date();
//   expirationDate.setDate(expirationDate.getDate() + 360); // Add 360 days

//   const deletedUser = {
//     ...user,
//     deletedAt: new Date().toISOString(),
//     expiresAt: expirationDate.toISOString()
//   };

//   // Get existing deleted users or initialize empty array
//   const existingDeleted = JSON.parse(localStorage.getItem('deletedUsers') || '[]');

//   // Add new deleted user
//   existingDeleted.push(deletedUser);

//   // Store back in localStorage
//   localStorage.setItem('deletedUsers', JSON.stringify(existingDeleted));
// };

// // Add this helper function to get deleted users
// const getDeletedUsers = () => {
//   const now = new Date();
//   const deletedUsers = JSON.parse(localStorage.getItem('deletedUsers') || '[]');

//   // Filter out expired entries
//   const validUsers = deletedUsers.filter(user => {
//     return new Date(user.expiresAt) > now;
//   });

//   // Update storage without expired entries
//   localStorage.setItem('deletedUsers', JSON.stringify(validUsers));

//   return validUsers;
// };

// // First, add these tab-related components at the top
// const TabButton = ({ active, count, children, onClick }) => (
//   <Button
//     variant={active ? "default" : "outline"}
//     className={`${active ? 'bg-blue-500 text-white' : 'bg-white'} relative`}
//     onClick={onClick}
//   >
//     {children}
//     {count && (
//       <span className="ml-2 px-2 py-0.5 text-xs bg-white text-blue-500 rounded-full">
//         {count}
//       </span>
//     )}
//   </Button>
// );

// const Members = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [actionStatus, setActionStatus] = useState(null);
//   const { toast } = useToast();
//   const [isClient, setIsClient] = useState(false);
//   const [users, setUsers] = useState([]);
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('active');
//   const [deletedUsers, setDeletedUsers] = useState([]);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState({});
//   const [isProfileLoading, setIsProfileLoading] = useState(false);

//   const [currentUser, setCurrentUser] = useState({});
//   // console.log(selectedProfile);
//   const fetchUsers = async () => {
//     try {
//       const response = await apiCall('/fetchuserdetails');
//       console.log(response);
//       setUsers(response.users);
//       setIsLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to fetch users",
//       });
//     }
//   };
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [user, setUser] = useState(null);
//   const handleCloseForm = () => {
//     setIsFormVisible(false);
//     setSelectedProfile(null);
//     setUser(null);
//   };
//   useEffect(() => {
//     fetchUsers();
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     if (activeTab === 'deleted') {
//       setDeletedUsers(getDeletedUsers());
//     }
//   }, [activeTab]);

//   const handleLockUser = async (mobile) => {
//     try {
//       setActionStatus({ type: 'loading', uid: mobile, action: 'lock' });

//       // Find the user before deletion
//       const userToDelete = users.find(user => user.mobile === mobile);

//       const response = await apiCall('/deleteuser', {
//         method: 'DELETE',
//         body: JSON.stringify({ mobile })
//       });

//       if (response.success) {
//         // Store the deleted user info
//         if (userToDelete) {
//           storeDeletedUser(userToDelete);
//         }

//         // Remove the user from the local state
//         setUsers(prev => prev.filter(user => user.mobile !== mobile));

//         setActionStatus({ type: 'success', uid: mobile, action: 'lock' });

//         toast({
//           title: "Success",
//           description: "User has been deleted successfully",
//         });
//       }
//     } catch (err) {
//       setActionStatus({ type: 'error', uid: mobile, action: 'lock' });
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: err.message || "Failed to delete user",
//       });
//     }
//   };

//   const handleViewProfile = async (uid,u) => {
//     setIsFormVisible(true);
//     console.log(u);
//     try {
//       setIsProfileLoading(true);
//       setIsProfileOpen(true);
//       console.log(uid);
//       const response = await apiCall(`/user-profile/${uid}`, {
//         method: 'GET'
//       });
//       // response=JSON.parse(response);
//       console.log(response);
//       if (response) {
//         setSelectedProfile(response);
//         setCurrentUser(u);
//       }
//     } catch (err) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: err.message || "Failed to load user profile",
//       });
//     } finally {
//       setIsProfileLoading(false);
//     }
//   };
//   console.log(selectedProfile);
//   // Add unlock user handler
//   const handleUnlockUser = async (mobile) => {
//     try {
//       setActionStatus({ type: 'loading', uid: mobile, action: 'unlock' });

//       // Get user data from localStorage
//       const deletedUsers = getDeletedUsers();
//       const userToUnlock = deletedUsers.find(user => user.mobile === mobile);

//       if (!userToUnlock) {
//         throw new Error('User data not found');
//       }

//       const response = await apiCall('/unlockuser', {
//         method: 'PUT',
//         body: JSON.stringify({
//           mobile: userToUnlock.mobile // Using mobile from localStorage data
//         })
//       });

//       if (response.success) {
//         // Remove from deleted users in localStorage
//         const updatedDeleted = deletedUsers.filter(user => user.mobile !== mobile);
//         localStorage.setItem('deletedUsers', JSON.stringify(updatedDeleted));

//         // Update state
//         setDeletedUsers(updatedDeleted);

//         toast({
//           title: "Success",
//           description: "User has been unlocked successfully",
//         });

//         // Refresh active users list
//         fetchUsers();
//       }
//     } catch (err) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: err.message || "Failed to unlock user",
//       });
//     } finally {
//       setActionStatus({ type: 'idle', uid: mobile, action: 'unlock' });
//     }
//   };

//   // Enhanced TableSkeleton with wave effect
//   const TableSkeleton = () => (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//     >
//       {[1, 2, 3, 4, 5].map((i) => (
//         <TableRow key={i}>
//           <TableCell className="px-3 sm:px-4">
//             <motion.div
//               animate={{
//                 background: ["hsl(0, 0%, 95%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 95%)"],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "linear",
//                 delay: i * 0.2,
//               }}
//               className="h-4 w-8 rounded"
//             />
//           </TableCell>
//           <TableCell className="px-3 sm:px-4">
//             <div className="space-y-2">
//               <motion.div
//                 animate={{
//                   background: ["hsl(0, 0%, 95%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 95%)"],
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "linear",
//                   delay: i * 0.2,
//                 }}
//                 className="h-4 w-32 rounded"
//               />
//               <motion.div
//                 animate={{
//                   background: ["hsl(0, 0%, 95%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 95%)"],
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "linear",
//                   delay: i * 0.2,
//                 }}
//                 className="h-3 w-24 sm:hidden"
//               />
//             </div>
//           </TableCell>
//           <TableCell className="hidden md:table-cell">
//             <motion.div
//               animate={{
//                 background: ["hsl(0, 0%, 95%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 95%)"],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "linear",
//                 delay: i * 0.2,
//               }}
//               className="h-4 w-24 rounded"
//             />
//           </TableCell>
//           <TableCell className="hidden sm:table-cell">
//             <motion.div
//               animate={{
//                 background: ["hsl(0, 0%, 95%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 95%)"],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "linear",
//                 delay: i * 0.2,
//               }}
//               className="h-4 w-16 rounded"
//             />
//           </TableCell>
//           <TableCell>
//             <motion.div
//               animate={{
//                 background: ["hsl(0, 0%, 95%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 95%)"],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "linear",
//                 delay: i * 0.2,
//               }}
//               className="h-4 w-16 rounded"
//             />
//           </TableCell>
//           <TableCell className="hidden lg:table-cell">
//             <motion.div
//               animate={{
//                 background: ["hsl(0, 0%, 95%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 95%)"],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "linear",
//                 delay: i * 0.2,
//               }}
//               className="h-4 w-24 rounded"
//             />
//           </TableCell>
//           <TableCell className="px-3 sm:px-4">
//             <div className="flex flex-col sm:flex-row gap-2">
//               <motion.div
//                 animate={{
//                   background: ["hsl(0, 0%, 95%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 95%)"],
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "linear",
//                   delay: i * 0.2,
//                 }}
//                 className="h-8 w-full sm:w-20 rounded"
//               />
//               <motion.div
//                 animate={{
//                   background: ["hsl(0, 0%, 95%)", "hsl(0, 0%, 85%)", "hsl(0, 0%, 95%)"],
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "linear",
//                   delay: i * 0.2,
//                 }}
//                 className="h-8 w-full sm:w-20 rounded"
//               />
//             </div>
//           </TableCell>
//         </TableRow>
//       ))}
//     </motion.div>
//   );

//   // Enhanced LoadingProgress component
//   const LoadingProgress = () => (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       className="space-y-2"
//     >
//       <Progress value={loadingProgress} className="h-2">
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/50 to-blue-100/0"
//           animate={{
//             x: [-200, 200],
//           }}
//           transition={{
//             duration: 1.5,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//         />
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
//           animate={{
//             x: [-200, 200],
//           }}
//           transition={{
//             duration: 1,
//             repeat: Infinity,
//             ease: "linear",
//             delay: 0.5,
//           }}
//         />
//       </Progress>
//       <div className="flex items-center justify-center gap-2">
//         <motion.p
//           className="text-sm text-gray-500"
//           animate={{
//             opacity: [0.5, 1, 0.5],
//           }}
//           transition={{
//             duration: 1.5,
//             repeat: Infinity,
//           }}
//         >
//           Loading users... {loadingProgress}%
//         </motion.p>
//         <motion.div
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [1, 0.7, 1],
//           }}
//           transition={{
//             duration: 1,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="w-2 h-2 rounded-full bg-blue-500"
//         />
//       </div>
//     </motion.div>
//   );

//   // Enhanced HeaderSkeleton with wave effect
//   const HeaderSkeleton = () => (
//     <div className="space-y-4">
//       {[1, 2, 3].map((i) => (
//         <motion.div
//           key={i}
//           className="h-6 rounded bg-gray-200"
//           style={{ width: `${Math.random() * 30 + 50}%` }}
//           animate={{
//             opacity: [0.7, 0.4, 0.7],
//             x: [0, 2, 0],
//           }}
//           transition={{
//             duration: 2,
//             repeat: Infinity,
//             ease: "linear",
//             delay: i * 0.2,
//           }}
//         />
//       ))}
//     </div>
//   );

//   // Add this new component for loading overlay
//   const LoadingOverlay = () => {
//     const spinTransition = {
//       repeat: Infinity,
//       ease: "linear",
//       duration: 1,
//       type: "tween",
//     };

//     return (
//       <m.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
//         transition={{ duration: 0.2 }}
//       >
//         <m.div
//           className="flex flex-col items-center gap-4"
//           initial={{ scale: 0.9 }}
//           animate={{ scale: 1 }}
//           transition={{ type: "tween", duration: 0.2 }}
//         >
//           <div className="relative">
//             <m.div
//               className="w-12 h-12 border-4 border-blue-500 rounded-full"
//               animate={{ rotate: 360 }}
//               transition={spinTransition}
//             />
//             <m.div
//               className="absolute inset-0 border-t-4 border-blue-200 rounded-full"
//               animate={{ rotate: -360 }}
//               transition={spinTransition}
//             />
//           </div>
//           <m.p
//             className="text-blue-500 font-medium"
//             animate={{ opacity: [0.5, 1, 0.5] }}
//             transition={{
//               duration: 1.5,
//               repeat: Infinity,
//               ease: "linear",
//             }}
//           >
//             Loading...
//           </m.p>
//         </m.div>
//       </m.div>
//     );
//   };

//   // Add animation variants
//   const listVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: {
//       opacity: 0,
//       y: 20,
//       scale: 0.95
//     },
//     show: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }
//     }
//   };

//   // First, define ErrorAlert component
//   const ErrorAlert = ({ error }) => {
//     const errorTypes = {
//       error: {
//         icon: <AlertCircle className="h-4 w-4" />,
//         className: "border-red-200 bg-red-50 text-red-800",
//       },
//       warning: {
//         icon: <AlertTriangle className="h-4 w-4" />,
//         className: "border-yellow-200 bg-yellow-50 text-yellow-800",
//       },
//       info: {
//         icon: <Info className="h-4 w-4" />,
//         className: "border-blue-200 bg-blue-50 text-blue-800",
//       },
//     };

//     const { icon, className } = errorTypes[error.type] || errorTypes.error;

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 20 }}
//       >
//         <Alert className={className}>
//           {icon}
//           <AlertDescription className="flex items-center justify-between">
//             <div>
//               <p className="font-medium">{error.message}</p>
//               {error.details && (
//                 <p className="text-xs mt-1 opacity-80">{error.details}</p>
//               )}
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={fetchUsers}
//               className="ml-4"
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Retry
//             </Button>
//           </AlertDescription>
//         </Alert>
//       </motion.div>
//     );
//   };

//   // Then, define ActionButton component
//   const ActionButton = ({ user, action, onClick }) => {
//     const [showConfirm, setShowConfirm] = useState(false);

//     const handleClick = () => {
//       setShowConfirm(true);
//     };

//     const handleConfirm = () => {
//       setShowConfirm(false);
//       onClick();
//     };

//     const handleCancel = () => {
//       setShowConfirm(false);
//     };

//     const isLoading = actionStatus?.type === 'loading' &&
//                      actionStatus.uid === user.mobile &&
//                      actionStatus.action === action;
//     const isSuccess = actionStatus?.type === 'success' &&
//                      actionStatus.uid === user.mobile &&
//                      actionStatus.action === action;
//     const isError = actionStatus?.type === 'error' &&
//                    actionStatus.uid === user.mobile &&
//                    actionStatus.action === action;

//     return (
//       <>
//         {showConfirm && (
//           <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This will permanently delete the user account. This action cannot be undone.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
//                 <AlertDialogAction
//                   onClick={handleConfirm}
//                   className="bg-destructive hover:bg-destructive/90"
//                 >
//                   Delete User
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         )}

//         {isSuccess ? (
//           <motion.div
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0.9 }}
//           >
//             <Button
//               className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto justify-center"
//               size="sm"
//             >
//               <motion.div
//                 animate={{ rotate: [0, 15, -15, 0] }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <CheckCircle className="w-3 h-3 mr-1" />
//               </motion.div>
//               Success
//             </Button>
//           </motion.div>
//         ) : isError ? (
//           <Button
//             className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto justify-center"
//             size="sm"
//             onClick={onClick}
//           >
//             <XCircle className="w-3 h-3 mr-1" />
//             Retry
//           </Button>
//         ) : (
//           <motion.div whileTap={{ scale: 0.95 }}>
//             <Button
//               onClick={handleClick}
//               className="bg-destructive hover:bg-destructive/90 text-white w-full sm:w-auto justify-center"
//               size="sm"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 >
//                   <RefreshCw className="w-3 h-3 mr-1" />
//                 </motion.div>
//               ) : (
//                 <Lock className="w-3 h-3 mr-1" />
//               )}
//               <span className="sm:hidden">Delete</span>
//               <span className="hidden sm:inline">DELETE USER</span>
//             </Button>
//           </motion.div>
//         )}
//       </>
//     );
//   };

//   // Then, memoize both components
//   const MemoizedActionButton = React.memo(ActionButton);
//   const MemoizedErrorAlert = React.memo(ErrorAlert);

//   // Optimize table rendering with virtualization
//   const TableContent = () => {
//     const { ref, inView } = useInView({
//       triggerOnce: true,
//       threshold: 0.1,
//     });

//     const formatBalance = (balance) => {
//       if (balance === null || balance === undefined) return '₹0.00';
//       return `₹${Number(balance).toFixed(2)}`;
//     };

//     // Get the appropriate users based on active tab
//     const getDisplayUsers = () => {
//       switch (activeTab) {
//         case 'active':
//           return users.filter(user => !user.locked);
//         case 'locked':
//           return getDeletedUsers();
//         default:
//           return [];
//       }
//     };

//     const displayUsers = getDisplayUsers();

//     return (
//       <div ref={ref}>
//         {inView && (
//           <m.div
//             variants={listVariants}
//             initial="hidden"
//             animate="show"
//             layoutScroll
//           >
//             {displayUsers
//               .filter(user =>
//                 searchQuery ?
//                   user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                   String(user.mobile)?.includes(searchQuery)
//                   : true
//               )
//               .map((user) => (
//                 <m.tr
//                   key={user.mobile}
//                   variants={itemVariants}
//                   className="hover:bg-gray-50/50 transition-colors"
//                 >
//                   <TableCell>{user.username}</TableCell>
//                   <TableCell>
//                     <span className="font-medium text-gray-900">
//                       {formatBalance(user.walletAmount)}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={activeTab === 'locked' ? "destructive" : "success"}
//                     >
//                       {activeTab === 'locked' ? 'inactive' : 'active'}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       {activeTab === 'active' && (
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => handleLockUser(user.mobile)}
//                         >
//                           DELETE USER
//                         </Button>
//                       )}
//                       {activeTab === 'locked' && (
//                         <>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="border-green-200 hover:bg-green-50 text-green-600"
//                             onClick={() => handleUnlockUser(user.mobile)}
//                             disabled={actionStatus?.uid === user.mobile && actionStatus?.type === 'loading'}
//                           >
//                             {actionStatus?.uid === user.mobile && actionStatus?.type === 'loading' ? (
//                               <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                             ) : null}
//                             UNLOCK USER
//                           </Button>
//                           <div className="text-sm text-gray-500">
//                             Deleted on: {new Date(user.deletedAt).toLocaleDateString()}
//                           </div>
//                         </>
//                       )}
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleViewProfile(user._id,user)}
//                       >
//                         PROFILE
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </m.tr>
//               ))}
//           </m.div>
//         )}
//       </div>
//     );
//   };
//   const [filteredMembers, setFilteredMembers] = useState([]);
//   const handleSearch = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     if (query) {
//       const filtered = users.filter(member => member.username.toLowerCase().includes(query.toLowerCase()));
//       setFilteredMembers(filtered);
//     } else {
//       setFilteredMembers(users);
//     }
//   };
//   console.log(selectedProfile);
//   console.log(selectedProfile.directSubordinates);
//   // Add this function to get the count of active/locked users
//   const getUserCounts = () => ({
//     active: users.filter(user => !user.locked).length,
//     locked: users.filter(user => user.locked).length,
//     deleted: deletedUsers.length
//   });
//   console.log(selectedProfile);
//   // Update the ProfileModal component
//   const ProfileModal = ({ isOpen, onClose, profile, isLoading, user }) => {
//     return (
//       <Dialog open={isOpen} onOpenChange={onClose}>
//         <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>User Profile</DialogTitle>
//           </DialogHeader>
//           {isLoading ? (
//             <div className="space-y-3">
//               <Skeleton className="h-4 w-3/4" />
//               <Skeleton className="h-4 w-1/2" />
//               <Skeleton className="h-4 w-2/3" />
//             </div>
//           ) : profile ? (
//             <div className="grid gap-6 py-4">
//               {/* Basic Information */}
//               <div className="grid gap-4">
//                 <h3 className="font-semibold">Basic Information</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <span className="text-sm font-medium text-gray-500">Username</span>
//                     <p className="text-sm">{user.username}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-sm font-medium text-gray-500">Wallet Balance</span>
//                     <p className="text-sm">₹{user.walletAmount}</p>
//                   </div>
//                 </div>
//               </div>
//               {/* Team Statistics */}
//               <div className="grid gap-4">
//                 <h3 className="font-semibold">Team Statistics</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <span className="text-sm font-medium text-gray-500">Direct Subordinates</span>
//                     <p className="text-sm">Registrations: {profile.directSubordinates?.noOfRegister}</p>
//                     <p className="text-sm">Deposits: ₹{profile.directSubordinates?.depositAmount}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-sm font-medium text-gray-500">Team Subordinates</span>
//                     <p className="text-sm">Registrations: {profile.teamSubordinates?.noOfRegister}</p>
//                     <p className="text-sm">Deposits: ₹{profile.teamSubordinates?.depositAmount}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Deposit History */}
//               <div className="grid gap-4">
//                 <h3 className="font-semibold">Recent Deposits</h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="border-b">
//                         <th className="text-left py-2">Amount</th>
//                         <th className="text-left py-2">Method</th>
//                         <th className="text-left py-2">Status</th>
//                         <th className="text-left py-2">Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {profile.depositHistory?.slice(0, 5).map((deposit) => (
//                         <tr key={deposit._id} className="border-b">
//                           <td className="py-2">₹{deposit.depositAmount}</td>
//                           <td className="py-2">{deposit.depositMethod}</td>
//                           <td className="py-2">
//                             <Badge variant={deposit.depositStatus === 'completed' ? 'success' : 'destructive'}>
//                               {deposit.depositStatus}
//                             </Badge>
//                           </td>
//                           <td className="py-2">{new Date(deposit.depositDate).toLocaleDateString()}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Betting History */}
//               <div className="grid gap-4">
//                 <h3 className="font-semibold">Recent Bets</h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="border-b">
//                         <th className="text-left py-2">Amount</th>
//                         <th className="text-left py-2">Result</th>
//                         <th className="text-left py-2">Status</th>
//                         <th className="text-left py-2">Win/Loss</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {profile.bets?.slice(0, 5).map((bet) => (
//                         <tr key={bet._id} className="border-b">
//                           <td className="py-2">₹{bet.betAmount}</td>
//                           <td className="py-2">{bet.result}</td>
//                           <td className="py-2">
//                             <Badge variant={bet.status === 'Succeed' ? 'success' : 'destructive'}>
//                               {bet.status}
//                             </Badge>
//                           </td>
//                           <td className={`py-2 ${bet.winLoss.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
//                             ₹{bet.winLoss}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Referred Users */}
//               <div className="grid gap-4">
//                 <h3 className="font-semibold">Referred Users</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {profile.referredUserMobiles?.map((mobile, index) => (
//                     <Badge key={index} variant="outline">
//                       {mobile}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="py-4 text-center text-gray-500">
//               No profile data available
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     );
//   };
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <Card className="bg-destructive/10 border-destructive">
//           <CardContent className="p-6">
//             <p className="text-destructive">Error: {error}</p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }
//   // console.log(selectedProfile.directSubordinates?.noOfRegister);
//   return (
//     <LazyMotion features={domAnimation}>
//       <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 relative">
//         <AnimatePresence mode="wait" initial={false}>
//           {/* Only render client-side animations after hydration */}
//           {isClient && isLoading && <LoadingOverlay />}

//           {/* Header Section with Loading State */}
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 shadow-sm">
//             {isLoading ? (
//               <HeaderSkeleton />
//             ) : (
//               <div className="flex flex-col gap-4">
//                 <div>
//                   <h1 className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
//                     User Management
//                   </h1>
//                   <p className="text-sm text-gray-600">
//                     Manage and monitor user accounts
//                   </p>
//                 </div>
//                 <div className="flex justify-center mb-6">
//                   <Input
//                     type="text"
//                     placeholder="Search by username"
//                     value={searchQuery}
//                     onChange={handleSearch}
//                     className="w-full max-w-md"
//                   />
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//                   <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm w-fit">
//                     <span className="font-medium">Active Users</span>
//                     <span className="bg-white text-blue-500 px-2 py-0.5 rounded-full text-xs font-bold">
//                       {getUserCounts().active}
//                     </span>
//                   </div>
//                   <div className="flex flex-wrap gap-2 w-full sm:w-auto">
//                     <Button
//                       variant={activeTab === 'active' ? 'default' : 'outline'}
//                       className={`${
//                         activeTab === 'active'
//                           ? 'bg-blue-500 text-white'
//                           : 'bg-white border-blue-100 hover:bg-blue-50 text-blue-600'
//                       } flex-1 sm:flex-none justify-center`}
//                       onClick={() => setActiveTab('active')}
//                     >
//                       <span className="font-medium">Active Users</span>
//                       <span className="ml-2 px-2 py-0.5 text-xs bg-white text-blue-500 rounded-full">
//                         {getUserCounts().active}
//                       </span>
//                     </Button>
//                     <Button
//                       variant={activeTab === 'locked' ? 'default' : 'outline'}
//                       className={`${
//                         activeTab === 'locked'
//                           ? 'bg-blue-500 text-white'
//                           : 'bg-white border-blue-100 hover:bg-blue-50 text-blue-600'
//                       } flex-1 sm:flex-none justify-center`}
//                       onClick={() => setActiveTab('locked')}
//                     >
//                       LOCKED USERS
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Loading Progress */}
//           {isLoading && <LoadingProgress />}

//           {/* Now we can use MemoizedErrorAlert safely */}
//           {error && <MemoizedErrorAlert error={error} />}

//           {/* Search and Filter Section with Loading State */}
//           <Card className="border-none shadow-sm">
//             <CardContent className="p-3 sm:p-4">
//               {isLoading ? (
//                 <div className="flex flex-col gap-3">
//                   <div className="relative w-full">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       placeholder="Search by username, mobile, or ID..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors w-full"
//                     />
//                   </div>
//                   <div className="flex gap-2">
//                     <Button variant="outline" className="text-gray-600 flex-1 sm:flex-none justify-center">
//                       <Filter className="w-4 h-4 mr-2" />
//                       Filters
//                     </Button>
//                     <Button variant="outline" className="text-gray-600 flex-1 sm:flex-none justify-center">
//                       <Download className="w-4 h-4 mr-2" />
//                       Export
//                     </Button>
//                   </div>
//                 </div>
//               ) : (
//                 <TableContent />
//               )}
//             </CardContent>
//           </Card>

//           {/* Users Table - With Loading State */}
//           <Card className="border-none shadow-sm overflow-hidden">
//             <CardContent className="p-0">
//               {!error && (
//                 <div className="overflow-x-auto hide-scrollbar">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-gray-50/50">
//                         <TableHead className="font-semibold text-gray-600 px-3 sm:px-4">ID</TableHead>
//                         <TableHead className="font-semibold text-gray-600 px-3 sm:px-4">Username</TableHead>
//                         <TableHead className="font-semibold text-gray-600 hidden md:table-cell">Phone</TableHead>
//                         <TableHead className="font-semibold text-gray-600">Balance</TableHead>
//                         <TableHead className="font-semibold text-gray-600">Status</TableHead>
//                         <TableHead className="font-semibold text-gray-600">Created At</TableHead>
//                         <TableHead className="font-semibold text-gray-600 px-3 sm:px-4">Action</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {isLoading ? (
//                         <TableSkeleton />
//                       ) : (
//                         <TableContent />
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               )}

//               {/* Pagination with Loading State */}
//               <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 border-t border-gray-100 bg-gray-50/50 gap-3">
//                 {isLoading ? (
//                   <>
//                     <div className="flex items-center gap-3 order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start">
//                       <Skeleton className="h-8 w-20" />
//                       <Skeleton className="h-4 w-16" />
//                     </div>
//                     <div className="flex items-center gap-4 order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-end">
//                       <Skeleton className="h-4 w-32" />
//                       <div className="flex gap-1">
//                         <Skeleton className="h-8 w-8" />
//                         <Skeleton className="h-8 w-8" />
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="flex items-center gap-3 order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start">
//                     <select className="h-8 rounded-md border border-gray-200 bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                       <option>100</option>
//                       <option>50</option>
//                       <option>25</option>
//                       <option>10</option>
//                     </select>
//                     <span className="text-sm text-gray-600">per page</span>
//                   </div>
//                 )}
//                 <div className="flex items-center gap-4 order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-end">
//                   <span className="text-sm text-gray-600 whitespace-nowrap">1-100 of 941</span>
//                   <div className="flex gap-1">
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       disabled
//                       className="h-8 w-8 border-gray-200"
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="h-8 w-8 border-gray-200"
//                     >
//                       <ChevronRight className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </AnimatePresence>

//         {/* Add this near the end of your JSX */}
//         <ProfileModal
//           isOpen={isProfileOpen}
//           onClose={() => {
//             setIsProfileOpen(!isProfileOpen);
//             // setSelectedProfile(null);
//           }}
//           profile={selectedProfile}
//           user={currentUser}
//           isLoading={isProfileLoading}
//         />
//       </div>
//     </LazyMotion>
//   );
// };

// export default Members;
