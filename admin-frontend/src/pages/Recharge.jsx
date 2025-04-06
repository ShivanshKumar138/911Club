// import { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Typography,
//   Chip,
//   IconButton,
//   TextField,
//   InputAdornment,
//   Button,
//   Stack,
// } from '@mui/material';
// import { 
//   Search as SearchIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIcon 
// } from '@mui/icons-material';
// import { apiCall } from '../utils/api';
// import { useToast } from "../components/ui/use-toast";

// const Recharge = () => {
//   const [recharges, setRecharges] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchRecharges();
//   }, []);

//   const fetchRecharges = async () => {
//     try {
//       const response = await apiCall('/admin/deposit/history');
//       setRecharges(response);
//     } catch (error) {
//       console.error('Failed to fetch recharges:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'completed':
//         return 'success';
//       case 'failed':
//         return 'error';
//       default:
//         return 'default';
//     }
//   };

//   const filteredRecharges = recharges.filter((recharge) =>
//     Object.values(recharge).some(
//       value => 
//         value && 
//         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const displayedRecharges = filteredRecharges
//     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   const handleRechargeAction = async (rechargeId, action, recharge) => {
//     try {
//       if (action === 'accept') {
//         console.log('Accepting recharge:', recharge);
//         const response = await apiCall('/wallet-manual', {
//           method: 'POST',
//           body: JSON.stringify({
//             userId: recharge.userId,
//             amount: recharge.depositAmount,
//             depositId: recharge._id
//           })
//         });
        
//         console.log('API Response:', response);
        
//         if (response) {
//           setRecharges(recharges.map(item => 
//             item._id === rechargeId 
//               ? { ...item, depositStatus: 'completed' }
//               : item
//           ));

//           toast({
//             title: "Success",
//             description: "Recharge accepted successfully",
//             variant: "success",
//           });
//         }
//       } else {
//         // Call reject API endpoint
//         console.log('Rejecting recharge:', recharge);
//         const response = await apiCall('/rejectDeposit', {
//           method: 'POST',
//           body: JSON.stringify({
//             userId: recharge.userId,
//             depositId: recharge._id
//           })
//         });

//         console.log('Reject API Response:', response);

//         if (response) {
//           setRecharges(recharges.map(item => 
//             item._id === rechargeId 
//               ? { ...item, depositStatus: 'failed' }
//               : item
//           ));

//           toast({
//             title: "Success",
//             description: "Recharge rejected successfully",
//             variant: "success",
//           });
//         }
//       }
//     } catch (error) {
//       console.error(`Failed to ${action} recharge:`, error);
//       toast({
//         title: "Error",
//         description: `Failed to ${action} recharge. Please try again.`,
//         variant: "destructive",
//       });
//     }
//   };

//   const renderActionButtons = (recharge) => {
//     if (recharge.depositStatus.toLowerCase() === 'pending') {
//       return (
//         <Stack direction="row" spacing={1}>
//           <Button
//             variant="contained"
//             color="success"
//             size="small"
//             startIcon={<CheckCircleIcon />}
//             onClick={() => handleRechargeAction(recharge._id, 'accept', recharge)}
//             sx={{ minWidth: 'auto' }}
//           >
//             Accept
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             size="small"
//             startIcon={<CancelIcon />}
//             onClick={() => handleRechargeAction(recharge._id, 'reject', recharge)}
//             sx={{ minWidth: 'auto' }}
//           >
//             Reject
//           </Button>
//         </Stack>
//       );
//     }
//     return null;
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Paper sx={{ width: '100%', mb: 2 }}>
//         <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h5" component="h2">
//             Recharge History
//           </Typography>
//           <TextField
//             size="small"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ width: 300 }}
//           />
//         </Box>
//         <TableContainer>
//           <Table sx={{ minWidth: 750 }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell>User ID</TableCell>
//                 <TableCell>Mobile</TableCell>
//                 <TableCell>Amount</TableCell>
//                 <TableCell>Method</TableCell>
//                 <TableCell>Transaction ID</TableCell>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {displayedRecharges.map((recharge) => (
//                 <TableRow key={recharge._id}>
//                   <TableCell>{recharge.uid}</TableCell>
//                   <TableCell>{recharge.mobile}</TableCell>
//                   <TableCell>₹{recharge.depositAmount.toLocaleString()}</TableCell>
//                   <TableCell>{recharge.depositMethod}</TableCell>
//                   <TableCell>{recharge.depositId}</TableCell>
//                   <TableCell>{new Date(recharge.depositDate).toLocaleString()}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={recharge.depositStatus}
//                       color={getStatusColor(recharge.depositStatus)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {renderActionButtons(recharge)}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={filteredRecharges.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     </Box>
//   );
// };

// export default Recharge;

/*eslint-disable*/
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Stack,
} from '@mui/material';
import { 
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon 
} from '@mui/icons-material';
import { apiCall } from '../utils/api';
import { useToast } from "../components/ui/use-toast";

const Recharge = () => {
  const [recharges, setRecharges] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecharges();
  }, []);

  const fetchRecharges = async () => {
    try {
      const response = await apiCall('/admin/deposit/history');
      // Filter to only include pending recharges
      const pendingRecharges = response.filter(
        recharge => recharge.depositStatus.toLowerCase() === 'pending'
      );
      console.log('Pending recharges:', pendingRecharges);
      setRecharges(pendingRecharges);
    } catch (error) {
      console.error('Failed to fetch recharges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredRecharges = recharges.filter((recharge) =>
    Object.values(recharge).some(
      value => 
        value && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const displayedRecharges = filteredRecharges
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleRechargeAction = async (rechargeId, action, recharge) => {
    try {
      if (action === 'accept') {
        console.log('Accepting recharge:', recharge);
        const response = await apiCall('/wallet-manual', {
          method: 'POST',
          body: JSON.stringify({
            userId: recharge.userId,
            amount: recharge.depositAmount,
            depositId: recharge._id
          })
        });
        
        console.log('API Response:', response);
        
        if (response) {
          // Remove the accepted recharge from the list
          setRecharges(recharges.filter(item => item._id !== rechargeId));

          toast({
            title: "Success",
            description: "Recharge accepted successfully",
            variant: "success",
          });
        }
      } else {
        // Call reject API endpoint
        console.log('Rejecting recharge:', recharge);
        const response = await apiCall('/rejectDeposit', {
          method: 'POST',
          body: JSON.stringify({
            userId: recharge.userId,
            depositId: recharge._id
          })
        });

        console.log('Reject API Response:', response);

        if (response) {
          // Remove the rejected recharge from the list
          setRecharges(recharges.filter(item => item._id !== rechargeId));

          toast({
            title: "Success",
            description: "Recharge rejected successfully",
            variant: "success",
          });
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} recharge:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} recharge. Please try again.`,
        variant: "destructive",
      });
    }
  };
  const shouldShowActions = (paymentMethod) => {
    const method = paymentMethod.toLowerCase();
    return method !== 'btcash' && method !== 'rupee';
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">
            Pending Recharges
          </Typography>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRecharges.length > 0 ? (
                displayedRecharges.map((recharge) => (
                  <TableRow key={recharge._id}>
                    <TableCell>{recharge.uid}</TableCell>
                    <TableCell>{recharge.mobile}</TableCell>
                    <TableCell>₹{recharge.depositAmount.toLocaleString()}</TableCell>
                    <TableCell>{recharge.depositMethod}</TableCell>
                    <TableCell>{recharge.depositId}</TableCell>
                    <TableCell>{new Date(recharge.depositDate).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={recharge.depositStatus}
                        color={getStatusColor(recharge.depositStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
  {shouldShowActions(recharge.depositMethod) && (
    <Stack direction="row" spacing={1}>
      <Button
        variant="contained"
        color="success"
        size="small"
        startIcon={<CheckCircleIcon />}
        onClick={() => handleRechargeAction(recharge._id, 'accept', recharge)}
        sx={{ minWidth: 'auto' }}
      >
        Accept
      </Button>
      <Button
        variant="contained"
        color="error"
        size="small"
        startIcon={<CancelIcon />}
        onClick={() => handleRechargeAction(recharge._id, 'reject', recharge)}
        sx={{ minWidth: 'auto' }}
      >
        Reject
      </Button>
    </Stack>
  )}
</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No pending recharges found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRecharges.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Recharge;