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
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import { apiCall } from '../utils/api';

// const BankDetails = () => {
//   const [searchMobile, setSearchMobile] = useState('');
//   const [searchUID, setSearchUID] = useState('');
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isUpdateBankOpen, setIsUpdateBankOpen] = useState(false);
//   const [isUpdateTRXOpen, setIsUpdateTRXOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [bankForm, setBankForm] = useState({
//     name: '',
//     accountNo: '',
//     ifscCode: '',
//     mobile: '',
//     bankName: ''
//   });
//   const [trxAddress, setTrxAddress] = useState('');
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await apiCall('/fetchuserdetails');
//       console.log('API Response:', response); // Debugging line
//       if (response) {
//         console.log('Users data:', response.users); // Debugging line
//         setUsers(response.users || []);
//       } else {
//         console.error('API Error:', response.message); // Debugging line
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch user data",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateBank = (user) => {
//     setSelectedUser(user);
//     if (user.bankDetails && user.bankDetails.length > 0) {
//       setBankForm(user.bankDetails[0]);
//     } else {
//       setBankForm({
//         name: '',
//         accountNo: '',
//         ifscCode: '',
//         mobile: '',
//         bankName: ''
//       });
//     }
//     setIsUpdateBankOpen(true);
//   };

//   const handleUpdateTRX = (user) => {
//     setSelectedUser(user);
//     if (user.TRXAddress && user.TRXAddress.length > 0) {
//       setTrxAddress(user.TRXAddress[0]);
//     } else {
//       setTrxAddress('');
//     }
//     setIsUpdateTRXOpen(true);
//   };

//   const handleSaveBank = async () => {
//     try {
//       const response = await apiCall('/update-bank-details', {
//         method: 'POST',
//         body: JSON.stringify({
//           userId: selectedUser._id,
//           ...bankForm
//         })
//       });

//       if (response.success) {
//         toast({
//           title: "Success",
//           description: "Bank details updated successfully",
//           variant: "success",
//         });
//         setIsUpdateBankOpen(false);
//         fetchUsers();
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update bank details",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleSaveTRX = async () => {
//     try {
//       const response = await apiCall('/update-trx-address', {
//         method: 'POST',
//         body: JSON.stringify({
//           userId: selectedUser._id,
//           trxAddress
//         })
//       });

//       if (response.success) {
//         toast({
//           title: "Success",
//           description: "TRX address updated successfully",
//           variant: "success",
//         });
//         setIsUpdateTRXOpen(false);
//         fetchUsers();
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update TRX address",
//         variant: "destructive",
//       });
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     const matchMobile = user.mobile.toString().includes(searchMobile);
//     const matchUID = user.uid.includes(searchUID);
//     return searchMobile ? matchMobile : searchUID ? matchUID : true;
//   });

//   console.log('Filtered Users:', filteredUsers); // Debugging line

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold text-blue-500">Bank & TRX Details</h1>

//       {/* Search Section */}
//       <div className="flex gap-4">
//         <Input
//           placeholder="Search by Mobile"
//           value={searchMobile}
//           onChange={(e) => setSearchMobile(e.target.value)}
//           className="max-w-xs"
//         />
//         <Input
//           placeholder="Search by UID"
//           value={searchUID}
//           onChange={(e) => setSearchUID(e.target.value)}
//           className="max-w-xs"
//         />
//       </div>

//       {/* Data Table */}
//       <Card>
//         <CardContent>
//           {loading ? (
//             <div className="text-center py-4">Loading...</div>
//           ) : users.length === 0 ? (
//             <div className="text-center py-4">No users found</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>UID</TableHead>
//                     <TableHead>Username</TableHead>
//                     <TableHead>Mobile</TableHead>
//                     <TableHead>Bank Details</TableHead>
//                     <TableHead>TRX Address</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {users.map((user) => (
//                     <TableRow key={user._id}>
//                       <TableCell>{user.uid}</TableCell>
//                       <TableCell>{user.username}</TableCell>
//                       <TableCell>{user.mobile}</TableCell>
//                       <TableCell>
//                         {user.bankDetails && user.bankDetails.length > 0 ? (
//                           <div className="space-y-1">
//                             <div className="text-sm">
//                               <span className="font-medium">Name:</span> {user.bankDetails[0].name}
//                             </div>
//                             <div className="text-sm">
//                               <span className="font-medium">Account:</span> {user.bankDetails[0].accountNo}
//                             </div>
//                             <div className="text-sm">
//                               <span className="font-medium">IFSC:</span> {user.bankDetails[0].ifscCode}
//                             </div>
//                             <div className="text-sm">
//                               <span className="font-medium">Bank:</span> {user.bankDetails[0].bankName}
//                             </div>
//                           </div>
//                         ) : (
//                           <span className="text-gray-500">No bank details</span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         {Array.isArray(user.TRXAddress) && user.TRXAddress.length > 0 ? (
//                           <span className="font-mono text-sm">{user.TRXAddress[0]}</span>
//                         ) : (
//                           <span className="text-gray-500">No TRX address</span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Button
//                             onClick={() => handleUpdateBank(user)}
//                             className="bg-blue-500 hover:bg-blue-600 text-white"
//                             size="sm"
//                           >
//                             Update Bank
//                           </Button>
//                           <Button
//                             onClick={() => handleUpdateTRX(user)}
//                             className="bg-purple-500 hover:bg-purple-600 text-white"
//                             size="sm"
//                           >
//                             Update TRX
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Bank Details Dialog */}
//       <Dialog open={isUpdateBankOpen} onOpenChange={setIsUpdateBankOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Update Bank Details</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <Input
//               placeholder="Account Holder Name"
//               value={bankForm.name}
//               onChange={(e) => setBankForm(prev => ({ ...prev, name: e.target.value }))}
//             />
//             <Input
//               placeholder="Account Number"
//               value={bankForm.accountNo}
//               onChange={(e) => setBankForm(prev => ({ ...prev, accountNo: e.target.value }))}
//             />
//             <Input
//               placeholder="IFSC Code"
//               value={bankForm.ifscCode}
//               onChange={(e) => setBankForm(prev => ({ ...prev, ifscCode: e.target.value }))}
//             />
//             <Input
//               placeholder="Mobile Number"
//               value={bankForm.mobile}
//               onChange={(e) => setBankForm(prev => ({ ...prev, mobile: e.target.value }))}
//             />
//             <Input
//               placeholder="Bank Name"
//               value={bankForm.bankName}
//               onChange={(e) => setBankForm(prev => ({ ...prev, bankName: e.target.value }))}
//             />
//           </div>
//           <div className="flex justify-end gap-3">
//             <Button variant="outline" onClick={() => setIsUpdateBankOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveBank} className="bg-blue-500 hover:bg-blue-600">
//               Save Changes
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* TRX Dialog */}
//       <Dialog open={isUpdateTRXOpen} onOpenChange={setIsUpdateTRXOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Update TRX Address</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <Input
//               placeholder="Enter TRX address"
//               value={trxAddress}
//               onChange={(e) => setTrxAddress(e.target.value)}
//             />
//           </div>
//           <div className="flex justify-end gap-3">
//             <Button variant="outline" onClick={() => setIsUpdateTRXOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveTRX} className="bg-purple-500 hover:bg-purple-600">
//               Save Changes
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default BankDetails;


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
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import { apiCall } from '../utils/api';

// const BankDetails = () => {
//   const [searchMobile, setSearchMobile] = useState('');
//   const [searchUID, setSearchUID] = useState('');
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isUpdateBankOpen, setIsUpdateBankOpen] = useState(false);
//   const [isUpdateTRXOpen, setIsUpdateTRXOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [bankForm, setBankForm] = useState({
//     name: '',
//     accountNo: '',
//     ifscCode: '',
//     mobile: '',
//     bankName: ''
//   });
//   const [trxAddress, setTrxAddress] = useState('');
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await apiCall('/fetchuserdetails');
//       console.log('API Response:', response); // Debugging line
//       if (response) {
//         console.log('Users data:', response.users); // Debugging line
//         setUsers(response.users || []);
//       } else {
//         console.error('API Error:', response.message); // Debugging line
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch user data",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateBank = (user) => {
//     setSelectedUser(user);
//     if (user.bankDetails && user.bankDetails.length > 0) {
//       setBankForm(user.bankDetails[0]);
//     } else {
//       setBankForm({
//         name: '',
//         accountNo: '',
//         ifscCode: '',
//         mobile: '',
//         bankName: ''
//       });
//     }
//     setIsUpdateBankOpen(true);
//   };

//   const handleUpdateTRX = (user) => {
//     setSelectedUser(user);
//     if (user.TRXAddress && user.TRXAddress.length > 0) {
//       setTrxAddress(user.TRXAddress[0]);
//     } else {
//       setTrxAddress('');
//     }
//     setIsUpdateTRXOpen(true);
//   };

//   const handleSaveBank = async () => {
//     console.log(bankForm);
//     try {
//       const response = await apiCall(`/users/${selectedUser._id}/update-details`, {
//         method: 'PUT',
//         body: JSON.stringify({
//           bankDetails: [
//             {
//               accountNo: bankForm.accountNo,
//               ifscCode: bankForm.ifscCode,
//               bankName: bankForm.bankName,
//               name: bankForm.name
//             }
//           ]
//         })
//       });

//       if (response) {
//         toast({
//           title: "Success",
//           description: "Bank details updated successfully",
//           variant: "success",
//         });
//         setIsUpdateBankOpen(false);
//         fetchUsers();
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update bank details",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleSaveTRX = async () => {
//     try {
//       const response = await apiCall('/update-trx-address', {
//         method: 'POST',
//         body: JSON.stringify({
//           userId: selectedUser._id,
//           trxAddress
//         })
//       });

//       if (response.success) {
//         toast({
//           title: "Success",
//           description: "TRX address updated successfully",
//           variant: "success",
//         });
//         setIsUpdateTRXOpen(false);
//         fetchUsers();
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update TRX address",
//         variant: "destructive",
//       });
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     const matchMobile = user.mobile.toString().includes(searchMobile);
//     const matchUID = user.uid.includes(searchUID);
//     return searchMobile ? matchMobile : searchUID ? matchUID : true;
//   });

//   console.log('Filtered Users:', filteredUsers); // Debugging line

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold text-blue-500">Bank & TRX Details</h1>

//       {/* Search Section */}
//       <div className="flex gap-4">
//         <Input
//           placeholder="Search by Mobile"
//           value={searchMobile}
//           onChange={(e) => setSearchMobile(e.target.value)}
//           className="max-w-xs"
//         />
//         <Input
//           placeholder="Search by UID"
//           value={searchUID}
//           onChange={(e) => setSearchUID(e.target.value)}
//           className="max-w-xs"
//         />
//       </div>

//       {/* Data Table */}
//       <Card>
//         <CardContent>
//           {loading ? (
//             <div className="text-center py-4">Loading...</div>
//           ) : users.length === 0 ? (
//             <div className="text-center py-4">No users found</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>UID</TableHead>
//                     <TableHead>Username</TableHead>
//                     <TableHead>Mobile</TableHead>
//                     <TableHead>Bank Details</TableHead>
//                     <TableHead>TRX Address</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredUsers.map((user) => (
//                     <TableRow key={user._id}>
//                       <TableCell>{user.uid}</TableCell>
//                       <TableCell>{user.username}</TableCell>
//                       <TableCell>{user.mobile}</TableCell>
//                       <TableCell>
//                         {user.bankDetails && user.bankDetails.length > 0 ? (
//                           <div className="space-y-1">
//                             <div className="text-sm">
//                               <span className="font-medium">Name:</span> {user.bankDetails[0].name}
//                             </div>
//                             <div className="text-sm">
//                               <span className="font-medium">Account:</span> {user.bankDetails[0].accountNo}
//                             </div>
//                             <div className="text-sm">
//                               <span className="font-medium">IFSC:</span> {user.bankDetails[0].ifscCode}
//                             </div>
//                             <div className="text-sm">
//                               <span className="font-medium">Bank:</span> {user.bankDetails[0].bankName}
//                             </div>
//                           </div>
//                         ) : (
//                           <span className="text-gray-500">No bank details</span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         {Array.isArray(user.TRXAddress) && user.TRXAddress.length > 0 ? (
//                           <span className="font-mono text-sm">{user.TRXAddress[0]}</span>
//                         ) : (
//                           <span className="text-gray-500">No TRX address</span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Button
//                             onClick={() => handleUpdateBank(user)}
//                             className="bg-blue-500 hover:bg-blue-600 text-white"
//                             size="sm"
//                           >
//                             Update Bank
//                           </Button>
//                           <Button
//                             onClick={() => handleUpdateTRX(user)}
//                             className="bg-purple-500 hover:bg-purple-600 text-white"
//                             size="sm"
//                           >
//                             Update TRX
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Bank Details Dialog */}
//       <Dialog open={isUpdateBankOpen} onOpenChange={setIsUpdateBankOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Update Bank Details</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <Input
//               placeholder="Account Holder Name"
//               value={bankForm.name}
//               onChange={(e) => setBankForm(prev => ({ ...prev, name: e.target.value }))}
//             />
//             <Input
//               placeholder="Account Number"
//               value={bankForm.accountNo}
//               onChange={(e) => setBankForm(prev => ({ ...prev, accountNo: e.target.value }))}
//             />
//             <Input
//               placeholder="IFSC Code"
//               value={bankForm.ifscCode}
//               onChange={(e) => setBankForm(prev => ({ ...prev, ifscCode: e.target.value }))}
//             />
//             <Input
//               placeholder="Mobile Number"
//               value={bankForm.mobile}
//               onChange={(e) => setBankForm(prev => ({ ...prev, mobile: e.target.value }))}
//             />
//             <Input
//               placeholder="Bank Name"
//               value={bankForm.bankName}
//               onChange={(e) => setBankForm(prev => ({ ...prev, bankName: e.target.value }))}
//             />
//           </div>
//           <div className="flex justify-end gap-3">
//             <Button variant="outline" onClick={() => setIsUpdateBankOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveBank} className="bg-blue-500 hover:bg-blue-600">
//               Save Changes
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* TRX Dialog */}
//       <Dialog open={isUpdateTRXOpen} onOpenChange={setIsUpdateTRXOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Update TRX Address</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <Input
//               placeholder="Enter TRX address"
//               value={trxAddress}
//               onChange={(e) => setTrxAddress(e.target.value)}
//             />
//           </div>
//           <div className="flex justify-end gap-3">
//             <Button variant="outline" onClick={() => setIsUpdateTRXOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveTRX} className="bg-purple-500 hover:bg-purple-600">
//               Save Changes
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default BankDetails;

//Update wallet and Update Trx
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from "../components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { apiCall } from '../utils/api';

const BankDetails = () => {
  const [searchMobile, setSearchMobile] = useState('');
  const [searchUID, setSearchUID] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateBankOpen, setIsUpdateBankOpen] = useState(false);
  const [isUpdateTRXOpen, setIsUpdateTRXOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bankForm, setBankForm] = useState({
    name: '',
    accountNo: '',
    ifscCode: '',
    mobile: '',
    bankName: ''
  });
  const [trxAddress, setTrxAddress] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiCall('/fetchuserdetails');
      console.log('API Response:', response); // Debugging line
      if (response) {
        console.log('Users data:', response.users); // Debugging line
        setUsers(response.users || []);
      } else {
        console.error('API Error:', response.message); // Debugging line
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBank = (user) => {
    setSelectedUser(user);
    if (user.bankDetails && user.bankDetails.length > 0) {
      setBankForm(user.bankDetails[0]);
    } else {
      setBankForm({
        name: '',
        accountNo: '',
        ifscCode: '',
        mobile: '',
        bankName: ''
      });
    }
    setIsUpdateBankOpen(true);
  };

  const handleUpdateTRX = (user) => {
    setSelectedUser(user);
    if (user.TRXAddress && user.TRXAddress.length > 0) {
      setTrxAddress(user.TRXAddress[0].address);
    } else {
      setTrxAddress('');
    }
    setIsUpdateTRXOpen(true);
  };

  const handleSaveBank = async () => {
    console.log(bankForm);
    try {
      const response = await apiCall(`/users/${selectedUser._id}/update-details`, {
        method: 'PUT',
        body: JSON.stringify({
          bankDetails: [
            {
              accountNo: bankForm.accountNo,
              ifscCode: bankForm.ifscCode,
              bankName: bankForm.bankName,
              name: bankForm.name
            }
          ]
        })
      });

      if (response) {
        toast({
          title: "Success",
          description: "Bank details updated successfully",
          variant: "success",
        });
        setIsUpdateBankOpen(false);
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update bank details",
        variant: "destructive",
      });
    }
  };

  const handleSaveTRX = async () => {
    try {
      const response = await apiCall(`/users/${selectedUser._id}/update-details`, {
        method: 'PUT',
        body: JSON.stringify({
          TRXAddress: [
            {
              address: trxAddress
            }
          ]
        })
      });

      if (response) {
        toast({
          title: "Success",
          description: "TRX address updated successfully",
          variant: "success",
        });
        setIsUpdateTRXOpen(false);
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update TRX address",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchMobile = user.mobile.toString().includes(searchMobile);
    const matchUID = user.uid.includes(searchUID);
    return searchMobile ? matchMobile : searchUID ? matchUID : true;
  });

  console.log('Filtered Users:', filteredUsers); // Debugging line

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-500">Bank & TRX Details</h1>

      {/* Search Section */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by Mobile"
          value={searchMobile}
          onChange={(e) => setSearchMobile(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Search by UID"
          value={searchUID}
          onChange={(e) => setSearchUID(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Data Table */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>UID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Bank Details</TableHead>
                    <TableHead>TRX Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.uid}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>
                        {user.bankDetails && user.bankDetails.length > 0 ? (
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">Name:</span> {user.bankDetails[0].name}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Account:</span> {user.bankDetails[0].accountNo}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">IFSC:</span> {user.bankDetails[0].ifscCode}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Bank:</span> {user.bankDetails[0].bankName}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">No bank details</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(user.TRXAddress) && user.TRXAddress.length > 0 ? (
                          <span className="font-mono text-sm">{user.TRXAddress[0].address}</span>
                        ) : (
                          <span className="text-gray-500">No TRX address</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleUpdateBank(user)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            size="sm"
                          >
                            Update Bank
                          </Button>
                          <Button
                            onClick={() => handleUpdateTRX(user)}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                            size="sm"
                          >
                            Update TRX
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bank Details Dialog */}
      <Dialog open={isUpdateBankOpen} onOpenChange={setIsUpdateBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Bank Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Account Holder Name"
              value={bankForm.name}
              onChange={(e) => setBankForm(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Account Number"
              value={bankForm.accountNo}
              onChange={(e) => setBankForm(prev => ({ ...prev, accountNo: e.target.value }))}
            />
            <Input
              placeholder="IFSC Code"
              value={bankForm.ifscCode}
              onChange={(e) => setBankForm(prev => ({ ...prev, ifscCode: e.target.value }))}
            />
            <Input
              placeholder="Mobile Number"
              value={bankForm.mobile}
              onChange={(e) => setBankForm(prev => ({ ...prev, mobile: e.target.value }))}
            />
            <Input
              placeholder="Bank Name"
              value={bankForm.bankName}
              onChange={(e) => setBankForm(prev => ({ ...prev, bankName: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsUpdateBankOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBank} className="bg-blue-500 hover:bg-blue-600">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* TRX Dialog */}
      <Dialog open={isUpdateTRXOpen} onOpenChange={setIsUpdateTRXOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update TRX Address</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter TRX address"
              value={trxAddress}
              onChange={(e) => setTrxAddress(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsUpdateTRXOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTRX} className="bg-purple-500 hover:bg-purple-600">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankDetails;