import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Avatar,
  Modal,
  Backdrop,
  Fade,
  Collapse,
  Paper
} from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { MessageSquare, Edit, Trash2, X, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import axios from 'axios';

const GameProblemTickets = () => {
  const [activeTab, setActiveTab] = useState("open");
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalRecords: 0,
    totalPages: 0
  });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.747lottery.fun/game-problem');
      
      if (response.data.success) {
        // Transform API data to match the table structure
        const formattedTickets = response.data.GameProblemData.map((ticket) => {
          // Format the date if available, or use a placeholder
          const date = ticket.createdAt ? new Date(ticket.createdAt) : new Date();
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
          
          return {
            id: ticket._id,
            gameId: ticket.gameId,
            issue: ticket.issue,
            status: "Open",
            priority: "High",
            createdAt: formattedDate,
            // Construct the full image URL
            image: ticket.issueImage.startsWith('http') 
              ? ticket.issueImage 
              : `https://api.747lottery.fun  ${ticket.issueImage}`
          };
        });
        
        setTickets(formattedTickets);
        setPagination(response.data.pagination);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError("Error fetching data: " + err.message);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = (id) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenImageModal(true);
  };

  const handleCloseModal = () => {
    setOpenImageModal(false);
  };

  const handleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handlePageChange = (page) => {
    setPagination({...pagination, page: page});
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card className="w-[90%] max-w-4xl p-6 shadow-md">
        <Typography variant="h5" className="text-blue-600 font-bold mb-4">
          Game Problem Tickets
        </Typography>

        <Tabs defaultValue="open" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex gap-4 border-b border-gray-200 pb-2">
            <TabsTrigger value="open">Open Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            {loading ? (
              <Typography className="text-center my-4">Loading tickets...</Typography>
            ) : error ? (
              <Typography className="text-center my-4 text-red-500">{error}</Typography>
            ) : tickets.length === 0 ? (
              <Typography className="text-center my-4">No tickets available.</Typography>
            ) : (
              <div className="overflow-x-auto">
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="w-14">No.</TableHead>
                      <TableHead className="w-15">Issue Image</TableHead>
                      <TableHead className="w-20">Issue Details</TableHead>
                      <TableHead className="w-13">Game ID</TableHead>
                      <TableHead className="w-13">Status</TableHead>
                      <TableHead className="w-13">Created At</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket, index) => (
                      <React.Fragment key={ticket.id}>
                        <TableRow className="hover:bg-gray-50">
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}
                            onClick={() => handleImageClick(ticket.image)}
                            >
                              <Avatar 
                                src={ticket.image} 
                                alt={`Ticket ${ticket.id} image`}
                                sx={{ width: 40, height: 40, cursor: 'pointer' }}
                                className="rounded-md hover:opacity-80 transition-opacity"
                              />
                              <span>Click</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              startIcon={<FileText size={16} />}
                              endIcon={expandedRow === ticket.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              onClick={() => handleExpandRow(ticket.id)}
                              className="text-xs py-1 px-2"
                            >
                              View Details
                            </Button>
                          </TableCell>
                          <TableCell>{ticket.gameId}</TableCell>
                          <TableCell>{ticket.status}</TableCell>
                          <TableCell>{ticket.createdAt}</TableCell>
                          <TableCell className="flex gap-2 justify-center">
                            <IconButton color="primary" size="small">
                              <MessageSquare size={18} />
                            </IconButton>
                            <IconButton color="secondary" size="small">
                              <Edit size={18} />
                            </IconButton>
                            <IconButton color="error" size="small" onClick={() => handleDelete(ticket.id)}>
                              <Trash2 size={18} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                            <Collapse in={expandedRow === ticket.id} timeout="auto" unmountOnExit>
                              <Box margin={2}>
                                <Paper className="p-4 bg-gray-50">
                                  <Typography variant="h6" className="mb-2 text-blue-700 font-semibold">
                                    Game Problem Details
                                  </Typography>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Typography className="font-medium">Game ID:</Typography>
                                      <Typography className="text-gray-700">{ticket.gameId}</Typography>
                                    </div>
                                    <div>
                                      <Typography className="font-medium">Status:</Typography>
                                      <Typography className="text-gray-700">{ticket.status}</Typography>
                                    </div>
                                    <div className="md:col-span-2">
                                      <Typography className="font-medium">Issue Description:</Typography>
                                      <Typography className="text-gray-700">{ticket.issue}</Typography>
                                    </div>
                                    <div>
                                      <Typography className="font-medium">Priority:</Typography>
                                      <Typography className="text-gray-700">{ticket.priority}</Typography>
                                    </div>
                                    <div>
                                      <Typography className="font-medium">Created At:</Typography>
                                      <Typography className="text-gray-700">{ticket.createdAt}</Typography>
                                    </div>
                                  </div>
                                </Paper>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 0 && (
              <Box display="flex" justifyContent="center" mt={2} gap={1}>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <Button 
                    key={page}
                    variant={pagination.page === page ? "contained" : "outline"} 
                    className={`rounded-full ${pagination.page === page ? 'bg-green-600 text-white' : 'text-green-600'}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            )}
          </TabsContent>
        </Tabs>

        {/* Image Modal */}
        <Modal
          open={openImageModal}
          onClose={handleCloseModal}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
              style: { backgroundColor: 'rgba(0, 0, 0, 0.75)' }
            },
          }}
        >
          <Fade in={openImageModal}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '90%',
              maxHeight: '90%',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 1,
              borderRadius: 2,
            }}>
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                }}
                onClick={handleCloseModal}
              >
                <X size={20} />
              </IconButton>
              <img
                src={selectedImage}
                alt="Enlarged ticket image"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: 'calc(90vh - 32px)',
                  display: 'block'
                }}
              />
            </Box>
          </Fade>
        </Modal>
      </Card>
    </Box>
  );
};

export default GameProblemTickets;