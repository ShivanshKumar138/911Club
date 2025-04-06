// import  { useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Box, Typography, IconButton } from "@mui/material";
// import { MessageSquare, Edit, Trash2 } from "lucide-react";

// const SupportTickets = () => {
//   const [activeTab, setActiveTab] = useState("open");
//   const [tickets, setTickets] = useState([
//     { id: 1, subject: "Delete Bank Account", status: "Open", priority: "High", createdAt: "23/02/2025, 10:34:30" },
//     { id: 2, subject: "IFSC Modification", status: "Open", priority: "Medium", createdAt: "22/02/2025, 02:06:47" },
//     { id: 3, subject: "Deposit Not Receive", status: "Open", priority: "High", createdAt: "20/02/2025, 22:59:09" },
//   ]);

//   const handleDelete = (id) => {
//     setTickets(tickets.filter(ticket => ticket.id !== id));
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//       <Card className="w-[90%] max-w-3xl p-6 shadow-md">
//         <Typography variant="h5" className="text-blue-600 font-bold mb-4">
//           Support Tickets
//         </Typography>

//         <Tabs defaultValue="open" value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="flex gap-4 border-b border-gray-200 pb-2">
//             <TabsTrigger value="open">Open Tickets</TabsTrigger>
//             <TabsTrigger value="reviewed">Reviewed Tickets</TabsTrigger>
//           </TabsList>

//           <TabsContent value="open">
//             <Table className="mt-4">
//               <TableHeader>
//                 <TableRow className="bg-gray-100">
//                   <TableHead className="w-12">No.</TableHead>
//                   <TableHead>Subject</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Priority</TableHead>
//                   <TableHead>Created At</TableHead>
//                   <TableHead className="text-center">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {tickets.map((ticket, index) => (
//                   <TableRow key={ticket.id} className="hover:bg-gray-50">
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{ticket.subject}</TableCell>
//                     <TableCell>{ticket.status}</TableCell>
//                     <TableCell>{ticket.priority}</TableCell>
//                     <TableCell>{ticket.createdAt}</TableCell>
//                     <TableCell className="flex gap-2 justify-center">
//                       <IconButton color="primary">
//                         <MessageSquare size={18} />
//                       </IconButton>
//                       <IconButton color="secondary">
//                         <Edit size={18} />
//                       </IconButton>
//                       <IconButton color="error" onClick={() => handleDelete(ticket.id)}>
//                         <Trash2 size={18} />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             <Box display="flex" justifyContent="center" mt={2}>
//               <Button variant="outline" className="rounded-full text-green-600">
//                 1
//               </Button>
//             </Box>
//           </TabsContent>

//           <TabsContent value="reviewed">
//             <Typography className="text-center mt-4">No reviewed tickets available.</Typography>
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </Box>
//   );
// };

// export default SupportTickets;



import { useNavigate } from "react-router-dom";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Box, Typography, IconButton, Avatar } from "@mui/material";
// import { MessageSquare, Edit, Trash2 } from "lucide-react";

// const SupportTickets = () => {
//   const [activeTab, setActiveTab] = useState("open");
//   const [tickets, setTickets] = useState([
//     { 
//       id: 1, 
//       subject: "Delete Bank Account", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "23/02/2025, 10:34:30",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 2, 
//       subject: "IFSC Modification", 
//       status: "Open", 
//       priority: "Medium", 
//       createdAt: "22/02/2025, 02:06:47",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 3, 
//       subject: "Deposit Not Receive", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "20/02/2025, 22:59:09",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//   ]);

//   const handleDelete = (id) => {
//     setTickets(tickets.filter(ticket => ticket.id !== id));
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//       <Card className="w-[90%] max-w-3xl p-6 shadow-md">
//         <Typography variant="h5" className="text-blue-600 font-bold mb-4">
//           Support Tickets
//         </Typography>

//         <Tabs defaultValue="open" value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="flex gap-4 border-b border-gray-200 pb-2">
//             <TabsTrigger value="open">Open Tickets</TabsTrigger>
//             <TabsTrigger value="reviewed">Reviewed Tickets</TabsTrigger>
//           </TabsList>

//           <TabsContent value="open">
//             <Table className="mt-4">
//               <TableHeader>
//                 <TableRow className="bg-gray-100">
//                   <TableHead className="w-12">No.</TableHead>
//                   <TableHead>Image</TableHead>
//                   <TableHead>Subject</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Priority</TableHead>
//                   <TableHead>Created At</TableHead>
//                   <TableHead className="text-center">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {tickets.map((ticket, index) => (
//                   <TableRow key={ticket.id} className="hover:bg-gray-50">
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>
//                       <Avatar 
//                         src={ticket.image} 
//                         alt={`Ticket ${ticket.id} image`}
//                         sx={{ width: 40, height: 40 }}
//                         className="rounded-md"
//                       />
//                     </TableCell>
//                     <TableCell>{ticket.subject}</TableCell>
//                     <TableCell>{ticket.status}</TableCell>
//                     <TableCell>{ticket.priority}</TableCell>
//                     <TableCell>{ticket.createdAt}</TableCell>
//                     <TableCell className="flex gap-2 justify-center">
//                       <IconButton color="primary">
//                         <MessageSquare size={18} />
//                       </IconButton>
//                       <IconButton color="secondary">
//                         <Edit size={18} />
//                       </IconButton>
//                       <IconButton color="error" onClick={() => handleDelete(ticket.id)}>
//                         <Trash2 size={18} />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             <Box display="flex" justifyContent="center" mt={2}>
//               <Button variant="outline" className="rounded-full text-green-600">
//                 1
//               </Button>
//             </Box>
//           </TabsContent>

//           <TabsContent value="reviewed">
//             <Typography className="text-center mt-4">No reviewed tickets available.</Typography>
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </Box>
//   );
// };

// export default SupportTickets;




// import { useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Box, Typography, IconButton, Avatar, Modal, Backdrop, Fade } from "@mui/material";
// import { MessageSquare, Edit, Trash2, X } from "lucide-react";

// const SupportTickets = () => {
//   const [activeTab, setActiveTab] = useState("open");
//   const [openImageModal, setOpenImageModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
  
//   const [tickets, setTickets] = useState([
//     { 
//       id: 1, 
//       subject: "Delete Bank Account", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "23/02/2025, 10:34:30",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 2, 
//       subject: "IFSC Modification", 
//       status: "Open", 
//       priority: "Medium", 
//       createdAt: "22/02/2025, 02:06:47",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 3, 
//       subject: "Deposit Not Receive", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "20/02/2025, 22:59:09",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 4, 
//       subject: "Deposit Not Receive", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "20/02/2025, 22:59:09",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 5, 
//       subject: "Deposit Not Receive", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "20/02/2025, 22:59:09",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 6, 
//       subject: "Deposit Not Receive", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "20/02/2025, 22:59:09",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 7, 
//       subject: "Deposit Not Receive", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "20/02/2025, 22:59:09",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 8, 
//       subject: "Deposit Not Receive", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "20/02/2025, 22:59:09",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 9, 
//       subject: "Deposit Not Receive", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "20/02/2025, 22:59:09",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 10, 
//       subject: "Deposit Not Receive", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: "20/02/2025, 22:59:09",
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//     { 
//       id: 11, 
//       subject: "Deposit Not Receive", 
//       status: "Open", 
//       priority: "High", 
//       createdAt: new Date().getDate(),
//       image: "https://media.istockphoto.com/id/640267784/photo/bank-building.jpg?s=612x612&w=0&k=20&c=UTtm4t6WR-MLwO6ATq5l6n3SoCc6HpaClEFZMxO1Nek="
//     },
//   ]);
//   const handleDelete = (id) => {
//     setTickets(tickets.filter(ticket => ticket.id !== id));
//   };

//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//     setOpenImageModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenImageModal(false);
//   };

//   return (
//     <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//       <Card className="w-[90%] max-w-3xl p-6 shadow-md">
//         <Typography variant="h5" className="text-blue-600 font-bold mb-4">
//           Support Tickets
//         </Typography>

//         <Tabs defaultValue="open" value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="flex gap-4 border-b border-gray-200 pb-2">
//             <TabsTrigger value="open">Open Tickets</TabsTrigger>
//             <TabsTrigger value="reviewed">Reviewed Tickets</TabsTrigger>
//           </TabsList>

//           <TabsContent value="open">
//             <Table className="mt-4">
//               <TableHeader>
//                 <TableRow className="bg-gray-100">
//                   <TableHead className="w-14">No.</TableHead>
//                   <TableHead className="w-15">Asset Uploaded</TableHead>
//                   <TableHead className="w-13">Subject</TableHead>
//                   <TableHead className="w-13">Status</TableHead>
//                   <TableHead className="w-13">Priority</TableHead>
//                   <TableHead className="w-13">Created At</TableHead>
//                   <TableHead className="text-center">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {tickets.map((ticket, index) => (
//                   <TableRow key={ticket.id} className="hover:bg-gray-50">
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>
//                       <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}
//                       onClick={() => handleImageClick(ticket.image)}
//                       >
//                         <Avatar 
//                         src={ticket.image} 
//                         alt={`Ticket ${ticket.id} image`}
//                         sx={{ width: 40, height: 40, cursor: 'pointer' }}
//                         className="rounded-md hover:opacity-80 transition-opacity"
                        
//                       />
//                       <span>Click</span>
//                       </div>
                      
//                     </TableCell>
//                     <TableCell>{ticket.subject}</TableCell>
//                     <TableCell>{ticket.status}</TableCell>
//                     <TableCell>{ticket.priority}</TableCell>
//                     <TableCell>{ticket.createdAt}</TableCell>
//                     <TableCell className="flex gap-2 justify-center">
//                       <IconButton color="primary">
//                         <MessageSquare size={18} />
//                       </IconButton>
//                       <IconButton color="secondary">
//                         <Edit size={18} />
//                       </IconButton>
//                       <IconButton color="error" onClick={() => handleDelete(ticket.id)}>
//                         <Trash2 size={18} />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             <Box display="flex" justifyContent="center" mt={2}>
//               <Button variant="outline" className="rounded-full text-green-600">
//                 1
//               </Button>
//             </Box>
//           </TabsContent>

//           <TabsContent value="reviewed">
//             <Typography className="text-center mt-4">No reviewed tickets available.</Typography>
//           </TabsContent>
//         </Tabs>

//         {/* Image Modal */}
//         <Modal
//           open={openImageModal}
//           onClose={handleCloseModal}
//           closeAfterTransition
//           slots={{ backdrop: Backdrop }}
//           slotProps={{
//             backdrop: {
//               timeout: 500,
//               style: { backgroundColor: 'rgba(0, 0, 0, 0.75)' }
//             },
//           }}
//         >
//           <Fade in={openImageModal}>
//             <Box sx={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               maxWidth: '90%',
//               maxHeight: '90%',
//               bgcolor: 'background.paper',
//               boxShadow: 24,
//               p: 1,
//               borderRadius: 2,
//             }}>
//               <IconButton 
//                 sx={{ 
//                   position: 'absolute', 
//                   top: 8, 
//                   right: 8, 
//                   bgcolor: 'rgba(255, 255, 255, 0.7)',
//                   '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
//                 }}
//                 onClick={handleCloseModal}
//               >
//                 <X size={20} />
//               </IconButton>
//               <img
//                 src={selectedImage}
//                 alt="Enlarged ticket image"
//                 style={{ 
//                   maxWidth: '100%', 
//                   maxHeight: 'calc(90vh - 32px)',
//                   display: 'block'
//                 }}
//               />
//             </Box>
//           </Fade>
//         </Modal>
//       </Card>
//     </Box>
//   );
// };
// //Done yaar

// export default SupportTickets;

const SupportTickets = () => {
  // In a real application, these would use React Router
  // or other navigation methods
  const navigate=useNavigate()
  const navigateToLoginRecovery = () => {
    // alert('Navigating to Login ID Recovery page');
    // In a real app: history.push('/login-recovery') or similar
    navigate("/retrive-login")
  };

  const navigateToGameSupport = () => {
    // alert('Navigating to Game Problem page');
    // In a real app: history.push('/game-support') or similar
    navigate("/game-problem")
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-5xl font-bold text-center mb-8 text-blue-600">
          Support Center
        </h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Retrieve Login ID Button */}
          <div 
            onClick={navigateToLoginRecovery}
            className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 hover:bg-blue-50"
          >
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 2a3 3 0 100 6 3 3 0 000-6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
              Retrieve Login ID
            </h2>
            <p className="text-center text-gray-600">
              Recover your forgotten login credentials
            </p>
          </div>
          
          {/* Game Problem Button */}
          <div 
            onClick={navigateToGameSupport}
            className="w-64 h-64 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 hover:bg-blue-50"
          >
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 1 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
              Game Problem
            </h2>
            <p className="text-center text-gray-600">
              Report issues with gameplay or technical problems
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;