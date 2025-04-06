import React, { useState, useEffect, useRef } from "react"
import {
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Pagination,
  Tabs,
  Tab,
  Box,
  Grid,
  Divider,
  Tooltip,
  useMediaQuery,
  MenuItem
} from "@mui/material"
import {
  styled,
  ThemeProvider,
  createTheme,
  useTheme,
} from "@mui/material/styles"
import axios from "axios"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ChatIcon from "@mui/icons-material/Chat"
import SendIcon from "@mui/icons-material/Send"

import { domain } from "../../Components/config"

// Create a custom theme with the deep green color
const theme = createTheme({
  palette: {
    primary: {
      main: "#4782ff",
    },
    secondary: {
      main: "#4caf50",
    },
    background: {
      default: "#f0f5f1",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
  },
})

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "0.3s",
  "&:hover": {
    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.15)",
  },
}))

const ChatContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
}))

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  backgroundColor: isUser
    ? theme.palette.primary.light
    : theme.palette.grey[200],
  color: isUser
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  maxWidth: "70%",
  marginBottom: theme.spacing(1),
  alignSelf: isUser ? "flex-end" : "flex-start",
  wordBreak: "break-word",
}))

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
  color: theme.palette.primary.main,
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "calc(100vh - 300px)",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
  },
}))

const SupportMain = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [updatedStatus, setUpdatedStatus] = useState("")
  const [updatedPriority, setUpdatedPriority] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [tabValue, setTabValue] = useState(0)
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [dateFilterStart, setDateFilterStart] = useState("")
  const [dateFilterEnd, setDateFilterEnd] = useState("")
  const ticketsPerPage = 10
  const chatContainerRef = useRef(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    fetchTickets()
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [selectedTicket])

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${domain}/admin/tickets`, {
        withCredentials: true,
      })
      setTickets(response.data)
    } catch (err) {
      setError("Error fetching tickets.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket)
    setUpdatedStatus(ticket.status)
    setUpdatedPriority(ticket.priority)
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
  }

  const handleSaveChanges = async () => {
    if (!selectedTicket) return

    try {
      await axios.put(
        `${domain}/tickets/admin/${selectedTicket._id}`,
        {
          status: updatedStatus,
          priority: updatedPriority,
        },
        { withCredentials: true }
      )
      await fetchTickets()
      handleCloseEditDialog()
    } catch (error) {
      console.error("Error updating ticket:", error)
      setError("Error updating ticket.")
    }
  }

  const handleDelete = async (ticketId) => {
    try {
      await axios.delete(`${domain}/tickets/admin/${ticketId}`, {
        withCredentials: true,
      })
      await fetchTickets()
    } catch (error) {
      console.error("Error deleting ticket:", error)
      setError("Error deleting ticket.")
    }
  }

  const handleOpenChat = (ticket) => {
    setSelectedTicket(ticket)
  }

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage) return

    try {
      const response = await axios.post(
        `${domain}/tickets/admin/${selectedTicket._id}/reply`,
        { message: replyMessage },
        { withCredentials: true }
      )

      const newMessage = {
        sender: "Admin",
        message: replyMessage,
        timestamp: new Date().toISOString(),
      }

      setSelectedTicket((prevTicket) => ({
        ...prevTicket,
        messages: [...prevTicket.messages, newMessage],
      }))

      setReplyMessage("")

      await fetchTickets()
    } catch (error) {
      console.error("Error sending reply:", error)
      setError("Error sending reply.")
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setCurrentPage(1)
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (tabValue === 0) return ticket.status === "Open"
    if (tabValue === 1) {
      const statusMatch = !statusFilter || ticket.status === statusFilter
      const priorityMatch =
        !priorityFilter || ticket.priority === priorityFilter

      const createdAt = new Date(ticket.createdAt)
      const startDate = dateFilterStart ? new Date(dateFilterStart) : null
      const endDate = dateFilterEnd ? new Date(dateFilterEnd) : null
      const dateMatch =
        (!startDate || createdAt >= startDate) &&
        (!endDate || createdAt <= endDate)

      return (
        ["In Progress", "Resolved", "Closed"].includes(ticket.status) &&
        statusMatch &&
        priorityMatch &&
        dateMatch
      )
    }
    return false
  })

  const indexOfLastTicket = currentPage * ticketsPerPage
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  )
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage)

  if (loading) return <Typography>Loading...</Typography>
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={8}>
            <StyledCard>
              <CardContent>
                <Typography variant="h5" gutterBottom color="#4782ff">
                  Support Tickets
                </Typography>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant={isMobile ? "fullWidth" : "standard"}
                  sx={{ mb: 2 }}
                >
                  <Tab label="Open Tickets" />
                  <Tab label="Reviewed Tickets" />
                </Tabs>
                {tabValue === 1 && (
                  <Box mt={2} mb={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          select
                          fullWidth
                          label="Status"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#4782ff", // Label color when focused
                            },
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "#4782ff", // Border color when focused
                              },
                          }}
                        >
                          <option value="">All</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          select
                          fullWidth
                          label="Priority"
                          value={priorityFilter}
                          onChange={(e) => setPriorityFilter(e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#4782ff", // Label color when focused
                            },
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "#4782ff", // Border color when focused
                              },
                          }}
                        >
                          <option value="">All</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          type="date"
                          fullWidth
                          label="Start Date"
                          InputLabelProps={{ shrink: true }}
                          value={dateFilterStart}
                          onChange={(e) => setDateFilterStart(e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#4782ff", // Label color when focused
                            },
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "#4782ff", // Border color when focused
                              },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          type="date"
                          fullWidth
                          label="End Date"
                          InputLabelProps={{ shrink: true }}
                          value={dateFilterEnd}
                          onChange={(e) => setDateFilterEnd(e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#4782ff", // Label color when focused
                            },
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "#4782ff", // Border color when focused
                              },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                <StyledTableContainer component={Paper}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#ccc" }}>
                        <TableCell sx={{ bgcolor: "#ccc" }}>No.</TableCell>
                        <TableCell sx={{ bgcolor: "#ccc" }}>Subject</TableCell>
                        <TableCell sx={{ bgcolor: "#ccc" }}>Status</TableCell>
                        <TableCell sx={{ bgcolor: "#ccc" }}>Priority</TableCell>
                        <TableCell sx={{ bgcolor: "#ccc" }}>
                          Created At
                        </TableCell>
                        <TableCell sx={{ bgcolor: "#ccc" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentTickets.map((ticket, index) => (
                        <TableRow key={ticket._id} hover>
                          <TableCell>
                            {indexOfFirstTicket + index + 1}
                          </TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>{ticket.status}</TableCell>
                          <TableCell>{ticket.priority}</TableCell>
                          <TableCell>
                            {new Date(ticket.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Chat" sx={{ color: "#4782ff" }}>
                              <ActionButton
                                onClick={() => handleOpenChat(ticket)}
                                size="small"
                              >
                                <ChatIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Edit" sx={{ color: "#4782ff" }}>
                              <ActionButton
                                onClick={() => handleEdit(ticket)}
                                size="small"
                              >
                                <EditIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                            <Tooltip title="Delete" sx={{ color: "#4782ff" }}>
                              <ActionButton
                                onClick={() => handleDelete(ticket._id)}
                                size="small"
                              >
                                <DeleteIcon fontSize="small" />
                              </ActionButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
                <Box mt={2} display="flex" justifyContent="center">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "green", // Default text color for page numbers
                      },
                      "& .MuiPaginationItem-page.Mui-selected": {
                        backgroundColor: "green", // Background color when selected
                        color: "#fff", // Text color when selected
                      },
                      "& .MuiPaginationItem-ellipsis": {
                        color: "green", // Color for ellipsis
                      },
                      "& .MuiPaginationItem-icon": {
                        color: "green", // Color for previous/next arrows
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={5} lg={4}>
            <StyledCard sx={{ height: "calc(100vh - 120px)" }}>
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom color="#4782ff">
                  {selectedTicket
                    ? `Chat - ${selectedTicket.subject}`
                    : "Select a ticket to view chat"}
                </Typography>
                {selectedTicket && (
                  <>
                    <ChatContainer ref={chatContainerRef}>
                      <Box display="flex" flexDirection="column">
                        {selectedTicket.messages &&
                        selectedTicket.messages.length > 0 ? (
                          selectedTicket.messages.map((message, index) => (
                            <MessageBubble
                              key={index}
                              isUser={message.sender !== "Admin"}
                              sx={{
                                color: `${
                                  message.sender !== "Admin" ? "white" : "#000"
                                }`,
                                bgcolor: `${
                                  message.sender !== "Admin"
                                    ? "#4782ff"
                                    : "#f6f6f6"
                                }`,
                              }}
                            >
                              <Typography variant="body2">
                                {message.sender} -{" "}
                                {new Date(message.timestamp).toLocaleString()}
                              </Typography>
                              <Typography>{message.message}</Typography>
                            </MessageBubble>
                          ))
                        ) : (
                          <Typography>No messages available</Typography>
                        )}
                      </Box>
                    </ChatContainer>
                    <Divider />
                    <Box mt={2} display="flex">
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendReply()
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleSendReply}
                        sx={{
                          ml: 1,
                          bgcolor: "#4782ff", // Normal background color
                          "&:hover": {
                            bgcolor: "#4782ff", // Background color on hover
                          },
                        }}
                      >
                        Send
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        <Dialog
  open={openEditDialog}
  onClose={handleCloseEditDialog}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Edit Ticket</DialogTitle>
  <DialogContent>
    <TextField
      select
      fullWidth
      label="Status"
      value={updatedStatus} // Bind the value to the updatedStatus state
      onChange={(e) => setUpdatedStatus(e.target.value)} // Update state when changed
      variant="outlined"
      margin="normal"
    >
      <MenuItem value="Open">Open</MenuItem>
      <MenuItem value="In Progress">In Progress</MenuItem>
      <MenuItem value="Resolved">Resolved</MenuItem>
      <MenuItem value="Closed">Closed</MenuItem>
    </TextField>

    <TextField
      select
      fullWidth
      label="Priority"
      value={updatedPriority} // Bind the value to the updatedPriority state
      onChange={(e) => setUpdatedPriority(e.target.value)} // Update state when changed
      variant="outlined"
      margin="normal"
    >
      <MenuItem value="Low">Low</MenuItem>
      <MenuItem value="Medium">Medium</MenuItem>
      <MenuItem value="High">High</MenuItem>
    </TextField>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseEditDialog} sx={{color: 'black'}}>
      Cancel
    </Button>
    <Button
      onClick={handleSaveChanges}
      sx={{ backgroundColor: '#4782ff', color: 'white', '&:hover': { backgroundColor: '#0d5316' } }}
    >
      Save Changes
    </Button>
  </DialogActions>
</Dialog>

      </Container>
    </ThemeProvider>
  )
}

export default SupportMain