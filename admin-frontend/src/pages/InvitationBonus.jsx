// import { useState } from 'react';
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
// import { Users, DollarSign, TrendingUp, Gift, Plus, ArrowUpDown, ChevronUp, ChevronDown, Search, Pencil, Trash2, AlertCircle } from 'lucide-react';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "../components/ui/alert-dialog";

// const InvitationBonus = () => {
//   const [formData, setFormData] = useState({
//     minSubordinates: '',
//     minDeposit: '',
//     bonusAmount: '',
//   });
//   const { toast } = useToast();
//   const [sorting, setSorting] = useState({
//     column: 'srNo',
//     direction: 'asc'
//   });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [editingRule, setEditingRule] = useState(null);
//   const [deleteRule, setDeleteRule] = useState(null);

//   // Sample data
//   const rules = [
//     {
//       srNo: 1,
//       minSubordinates: 1,
//       minDeposit: 198,
//       bonusAmount: 50,
//     },
//     {
//       srNo: 2,
//       minSubordinates: 2,
//       minDeposit: 1600,
//       bonusAmount: 100,
//     },
//     {
//       srNo: 3,
//       minSubordinates: 3,
//       minDeposit: 300,
//       bonusAmount: 300,
//     },
//   ];

//   // Calculate dashboard stats
//   const stats = {
//     totalRules: rules.length,
//     highestBonus: Math.max(...rules.map(r => r.bonusAmount)),
//     avgDepositReq: Math.round(rules.reduce((acc, r) => acc + r.minDeposit, 0) / rules.length),
//     totalBonusTypes: rules.length,
//   };

//   // Sort function
//   const sortData = (data, column, direction) => {
//     return [...data].sort((a, b) => {
//       let compareA = a[column];
//       let compareB = b[column];

//       if (typeof compareA === 'number') {
//         return direction === 'asc' ? compareA - compareB : compareB - compareA;
//       }

//       compareA = compareA.toString().toLowerCase();
//       compareB = compareB.toString().toLowerCase();
      
//       if (compareA < compareB) return direction === 'asc' ? -1 : 1;
//       if (compareA > compareB) return direction === 'asc' ? 1 : -1;
//       return 0;
//     });
//   };

//   // Handle sort click
//   const handleSort = (column) => {
//     setSorting(prev => ({
//       column,
//       direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   // Sort icon component
//   const SortIcon = ({ column }) => {
//     if (sorting.column !== column) {
//       return <ArrowUpDown className="h-4 w-4 ml-1" />;
//     }
//     return sorting.direction === 'asc' ? (
//       <ChevronUp className="h-4 w-4 ml-1" />
//     ) : (
//       <ChevronDown className="h-4 w-4 ml-1" />
//     );
//   };

//   // Get sorted data
//   const getSortedData = () => {
//     return sortData(rules, sorting.column, sorting.direction);
//   };

//   // Filter and sort data
//   const getFilteredAndSortedData = () => {
//     let filteredData = rules;
    
//     // Apply search filter
//     if (searchQuery) {
//       filteredData = rules.filter(rule => 
//         rule.srNo.toString().includes(searchQuery) ||
//         rule.minSubordinates.toString().includes(searchQuery) ||
//         rule.minDeposit.toString().includes(searchQuery) ||
//         rule.bonusAmount.toString().includes(searchQuery)
//       );
//     }

//     // Apply sorting
//     return sortData(filteredData, sorting.column, sorting.direction);
//   };

//   // Update stats based on filtered data
//   const getFilteredStats = () => {
//     const filteredData = getFilteredAndSortedData();
//     return {
//       totalRules: filteredData.length,
//       highestBonus: Math.max(...filteredData.map(r => r.bonusAmount)),
//       avgDepositReq: Math.round(filteredData.reduce((acc, r) => acc + r.minDeposit, 0) / filteredData.length),
//       totalBonusTypes: filteredData.length,
//     };
//   };

//   // Handle edit click
//   const handleEdit = (rule) => {
//     setEditingRule(rule);
//     setFormData({
//       minSubordinates: rule.minSubordinates.toString(),
//       minDeposit: rule.minDeposit.toString(),
//       bonusAmount: rule.bonusAmount.toString(),
//     });
//     document.getElementById('newRuleForm').scrollIntoView({ behavior: 'smooth' });
//   };

//   // Handle delete click
//   const handleDelete = (rule) => {
//     setDeleteRule(rule);
//   };

//   // Confirm delete
//   const confirmDelete = () => {
//     // Handle delete logic here
//     toast({
//       title: "Success",
//       description: `Rule #${deleteRule.srNo} deleted successfully`,
//       variant: "success",
//     });
//     setDeleteRule(null);
//   };

//   // Update submit handler
//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     const errors = validateForm();
//     if (errors.length > 0) {
//       toast({
//         title: "Validation Error",
//         description: errors.join('\n'),
//         variant: "destructive",
//       });
//       return;
//     }

//     if (editingRule) {
//       // Handle update
//       toast({
//         title: "Success",
//         description: `Rule #${editingRule.srNo} updated successfully`,
//         variant: "success",
//       });
//       setEditingRule(null);
//     } else {
//       // Handle create
//       toast({
//         title: "Success",
//         description: "New bonus rule created successfully",
//         variant: "success",
//       });
//     }

//     // Reset form
//     setFormData({
//       minSubordinates: '',
//       minDeposit: '',
//       bonusAmount: '',
//     });
//   };

//   return (
//     <div className="p-6 space-y-8">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Invitation Bonus Dashboard</h1>
//         <Button 
//           className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
//           onClick={() => document.getElementById('newRuleForm').scrollIntoView({ behavior: 'smooth' })}
//         >
//           <Plus className="h-4 w-4" />
//           ADD NEW RULE
//         </Button>
//       </div>

//       {/* Stats Cards with filtered data */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="bg-white">
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <Users className="h-6 w-6 text-blue-500" />
//               </div>
//               <div>
//                 <p className="text-3xl font-bold">{getFilteredStats().totalRules}</p>
//                 <p className="text-sm text-gray-500">Total Rules</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white">
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-green-100 p-3 rounded-full">
//                 <DollarSign className="h-6 w-6 text-green-500" />
//               </div>
//               <div>
//                 <p className="text-3xl font-bold">₹{getFilteredStats().highestBonus}</p>
//                 <p className="text-sm text-gray-500">Highest Bonus</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white">
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-purple-100 p-3 rounded-full">
//                 <TrendingUp className="h-6 w-6 text-purple-500" />
//               </div>
//               <div>
//                 <p className="text-3xl font-bold">₹{getFilteredStats().avgDepositReq}</p>
//                 <p className="text-sm text-gray-500">Avg Deposit Req</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white">
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="bg-orange-100 p-3 rounded-full">
//                 <Gift className="h-6 w-6 text-orange-500" />
//               </div>
//               <div>
//                 <p className="text-3xl font-bold">{getFilteredStats().totalBonusTypes}</p>
//                 <p className="text-sm text-gray-500">Total Bonus Types</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Add New Rule Form */}
//       <Card className="border-none shadow-sm mt-8" id="newRuleForm">
//         <CardContent className="p-6">
//           <h2 className="text-xl font-semibold mb-4">
//             {editingRule ? `Edit Rule #${editingRule.srNo}` : 'Add New Bonus Rule'}
//           </h2>
//           <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Input
//                 placeholder="Minimum Subordinates"
//                 value={formData.minSubordinates}
//                 onChange={(e) => setFormData(prev => ({
//                   ...prev,
//                   minSubordinates: e.target.value
//                 }))}
//                 type="number"
//                 min="1"
//                 className="pl-10"
//               />
//               <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             </div>
//             <div className="relative flex-1">
//               <Input
//                 placeholder="Minimum Deposit Amount"
//                 value={formData.minDeposit}
//                 onChange={(e) => setFormData(prev => ({
//                   ...prev,
//                   minDeposit: e.target.value
//                 }))}
//                 type="number"
//                 min="0"
//                 className="pl-10"
//               />
//               <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             </div>
//             <div className="relative flex-1">
//               <Input
//                 placeholder="Bonus Amount"
//                 value={formData.bonusAmount}
//                 onChange={(e) => setFormData(prev => ({
//                   ...prev,
//                   bonusAmount: e.target.value
//                 }))}
//                 type="number"
//                 min="0"
//                 className="pl-10"
//               />
//               <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             </div>
//             <div className="flex gap-2">
//               <Button 
//                 type="submit"
//                 className="bg-blue-500 hover:bg-blue-600 text-white"
//               >
//                 {editingRule ? 'UPDATE' : 'CREATE'}
//               </Button>
//               {editingRule && (
//                 <Button 
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     setEditingRule(null);
//                     setFormData({
//                       minSubordinates: '',
//                       minDeposit: '',
//                       bonusAmount: '',
//                     });
//                   }}
//                 >
//                   CANCEL
//                 </Button>
//               )}
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Existing Rules Table with Search */}
//       <Card className="border-none shadow-sm mt-8">
//         <CardContent className="p-0">
//           {/* Add Search Bar */}
//           <div className="p-4 border-b">
//             <div className="relative max-w-md">
//               <Input
//                 placeholder="Search rules..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             </div>
//           </div>

//           <div className="overflow-x-auto hide-scrollbar">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gray-50/50">
//                   <TableHead 
//                     className="font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => handleSort('srNo')}
//                   >
//                     <div className="flex items-center">
//                       Sr No
//                       <SortIcon column="srNo" />
//                     </div>
//                   </TableHead>
//                   <TableHead 
//                     className="font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => handleSort('minSubordinates')}
//                   >
//                     <div className="flex items-center">
//                       Min Subordinates
//                       <SortIcon column="minSubordinates" />
//                     </div>
//                   </TableHead>
//                   <TableHead 
//                     className="font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => handleSort('minDeposit')}
//                   >
//                     <div className="flex items-center">
//                       Min Deposit
//                       <SortIcon column="minDeposit" />
//                     </div>
//                   </TableHead>
//                   <TableHead 
//                     className="font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
//                     onClick={() => handleSort('bonusAmount')}
//                   >
//                     <div className="flex items-center">
//                       Bonus Amount
//                       <SortIcon column="bonusAmount" />
//                     </div>
//                   </TableHead>
//                   <TableHead className="font-semibold text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {getFilteredAndSortedData().map((rule) => (
//                   <TableRow key={rule.srNo} className="hover:bg-gray-50/50">
//                     <TableCell>{rule.srNo}</TableCell>
//                     <TableCell>{rule.minSubordinates}</TableCell>
//                     <TableCell>₹{rule.minDeposit}</TableCell>
//                     <TableCell>₹{rule.bonusAmount}</TableCell>
//                     <TableCell>
//                       <div className="flex justify-end gap-2">
//                         <Button
//                           onClick={() => handleEdit(rule)}
//                           variant="ghost"
//                           size="sm"
//                           className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
//                         >
//                           <Pencil className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           onClick={() => handleDelete(rule)}
//                           variant="ghost"
//                           size="sm"
//                           className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 {getFilteredAndSortedData().length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={4} className="text-center py-8 text-gray-500">
//                       No rules found matching your search
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Add Search Results Summary */}
//           <div className="p-4 border-t bg-gray-50/50 text-sm text-gray-500">
//             {searchQuery ? (
//               <p>
//                 Found {getFilteredAndSortedData().length} rule{getFilteredAndSortedData().length !== 1 ? 's' : ''} matching "{searchQuery}"
//               </p>
//             ) : (
//               <p>Showing all {rules.length} rules</p>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={!!deleteRule} onOpenChange={() => setDeleteRule(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-red-500" />
//               Confirm Delete
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete rule #{deleteRule?.srNo}? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmDelete}
//               className="bg-red-500 hover:bg-red-600 text-white"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default InvitationBonus; 



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
// import { Users, DollarSign, TrendingUp, Gift, Plus, ArrowUpDown, ChevronUp, ChevronDown, Search, Pencil, Trash2, AlertCircle } from 'lucide-react';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "../components/ui/alert-dialog";
// import { apiCall } from '../utils/api';

// const InvitationBonus = () => {
//   const [formData, setFormData] = useState({
//     minSubordinates: '',
//     minDepositAmount: '',
//     bonusAmount: '',
//   });
//   const [invitationBonuses, setInvitationBonuses] = useState([]);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchInvitationBonuses();
//   }, []);

//   const fetchInvitationBonuses = async () => {
//     try {
//       const response = await apiCall('/invitation-bonus');
//       console.log('API Response:', response); // Debugging line
//       if (response.data) {
//         console.log('Invitation Bonuses:', response.data); // Debugging line
//         setInvitationBonuses(response.data || []);
//       } else {
//         console.error('API Error:', response.message); // Debugging line
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch invitation bonuses",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold text-blue-500">Invitation Bonus</h1>

//       <Card>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Min Subordinates</TableHead>
//                   <TableHead>Min Deposit Amount</TableHead>
//                   <TableHead>Bonus Amount</TableHead>
//                   <TableHead>Achieved By</TableHead>
//                   <TableHead>Created At</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {invitationBonuses.map((bonus) => (
//                   <TableRow key={bonus._id}>
//                     <TableCell>{bonus.minSubordinates}</TableCell>
//                     <TableCell>{bonus.minDepositAmount || 'N/A'}</TableCell>
//                     <TableCell>{bonus.bonusAmount}</TableCell>
//                     <TableCell>{bonus.achievedBy.map((achiever) => achiever.userId).join(', ') || 'None'}</TableCell>
//                     <TableCell>{new Date(bonus.createdAt).toLocaleDateString()}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default InvitationBonus;



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
// import { Users, DollarSign, TrendingUp, Gift, Plus, ArrowUpDown, ChevronUp, ChevronDown, Search, Pencil, Trash2, AlertCircle } from 'lucide-react';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "../components/ui/alert-dialog";
// import { apiCall } from '../utils/api';

// const InvitationBonus = () => {
//   const [formData, setFormData] = useState({
//     minSubordinates: '',
//     minDepositAmount: '',
//     bonusAmount: '',
//   });
//   const [invitationBonuses, setInvitationBonuses] = useState([]);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchInvitationBonuses();
//   }, []);

//   const fetchInvitationBonuses = async () => {
//     try {
//       const response = await apiCall('/invitation-bonus');
//       console.log('API Response:', response); // Debugging line
//       if (response.data) {
//         console.log('Invitation Bonuses:', response.data); // Debugging line
//         setInvitationBonuses(response.data || []);
//       } else {
//         console.error('API Error:', response.message); // Debugging line
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch invitation bonuses",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold text-blue-500">Invitation Bonus</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="flex items-center justify-between">
//             <div>
//               <Users className="h-8 w-8 text-blue-500" />
//               <p className="text-sm text-gray-500">Total Users</p>
//               <p className="text-lg font-bold">1,234</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="flex items-center justify-between">
//             <div>
//               <DollarSign className="h-8 w-8 text-green-500" />
//               <p className="text-sm text-gray-500">Total Deposits</p>
//               <p className="text-lg font-bold">$12,345</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="flex items-center justify-between">
//             <div>
//               <TrendingUp className="h-8 w-8 text-red-500" />
//               <p className="text-sm text-gray-500">Total Bonuses</p>
//               <p className="text-lg font-bold">$1,234</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="flex items-center justify-between">
//             <div>
//               <Gift className="h-8 w-8 text-yellow-500" />
//               <p className="text-sm text-gray-500">Active Promotions</p>
//               <p className="text-lg font-bold">5</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Min Subordinates</TableHead>
//                   <TableHead>Min Deposit Amount</TableHead>
//                   <TableHead>Bonus Amount</TableHead>
//                   <TableHead>Achieved By</TableHead>
//                   <TableHead>Created At</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {invitationBonuses.map((bonus) => (
//                   <TableRow key={bonus._id}>
//                     <TableCell>{bonus.minSubordinates}</TableCell>
//                     <TableCell>{bonus.minDepositAmount || 'N/A'}</TableCell>
//                     <TableCell>{bonus.bonusAmount}</TableCell>
//                     <TableCell>{bonus.achievedBy.map((achiever) => achiever.userId).join(', ') || 'None'}</TableCell>
//                     <TableCell>{new Date(bonus.createdAt).toLocaleDateString()}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default InvitationBonus;



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
// import { Users, DollarSign, TrendingUp, Gift } from 'lucide-react';
// import { apiCall } from '../utils/api';

// const InvitationBonus = () => {
//   const [formData, setFormData] = useState({
//     minSubordinates: '',
//     minDepositAmount: '',
//     bonusAmount: '',
//   });
//   const [invitationBonuses, setInvitationBonuses] = useState([]);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchInvitationBonuses();
//   }, []);

//   const fetchInvitationBonuses = async () => {
//     try {
//       const response = await apiCall('/invitation-bonus');
//       console.log('API Response:', response); // Debugging line
//       if (response.data) {
//         console.log('Invitation Bonuses:', response.data); // Debugging line
//         setInvitationBonuses(response.data || []);
//       } else {
//         console.error('API Error:', response.message); // Debugging line
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch invitation bonuses",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold text-blue-500">Invitation Bonus</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg">
//           <CardContent className="flex items-center justify-between p-4">
//             <div>
//               <Users className="h-8 w-8" />
//               <p className="text-sm">Total Users</p>
//               <p className="text-lg font-bold">1,234</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg">
//           <CardContent className="flex items-center justify-between p-4">
//             <div>
//               <DollarSign className="h-8 w-8" />
//               <p className="text-sm">Total Deposits</p>
//               <p className="text-lg font-bold">$12,345</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg">
//           <CardContent className="flex items-center justify-between p-4">
//             <div>
//               <TrendingUp className="h-8 w-8" />
//               <p className="text-sm">Total Bonuses</p>
//               <p className="text-lg font-bold">$1,234</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white shadow-lg">
//           <CardContent className="flex items-center justify-between p-4">
//             <div>
//               <Gift className="h-8 w-8" />
//               <p className="text-sm">Active Promotions</p>
//               <p className="text-lg font-bold">5</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Min Subordinates</TableHead>
//                   <TableHead>Min Deposit Amount</TableHead>
//                   <TableHead>Bonus Amount</TableHead>
//                   <TableHead>Achieved By</TableHead>
//                   <TableHead>Created At</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {invitationBonuses.map((bonus) => (
//                   <TableRow key={bonus._id}>
//                     <TableCell>{bonus.minSubordinates}</TableCell>
//                     <TableCell>{bonus.minDepositAmount || 'N/A'}</TableCell>
//                     <TableCell>{bonus.bonusAmount}</TableCell>
//                     <TableCell>{bonus.achievedBy.map((achiever) => achiever.userId).join(', ') || 'None'}</TableCell>
//                     <TableCell>{new Date(bonus.createdAt).toLocaleDateString()}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default InvitationBonus;


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
import { Users, DollarSign, TrendingUp, Gift, Trash2 } from 'lucide-react';
import { apiCall } from '../utils/api';

const InvitationBonus = () => {
  const [formData, setFormData] = useState({
    minSubordinates: '',
    minDepositAmount: '',
    bonusAmount: '',
  });
  const [invitationBonuses, setInvitationBonuses] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvitationBonuses();
  }, []);

  const fetchInvitationBonuses = async () => {
    try {
      const response = await apiCall('/invitation-bonus');
      console.log('API Response:', response); // Debugging line
      if (response.data) {
        console.log('Invitation Bonuses:', response.data); // Debugging line
        setInvitationBonuses(response.data || []);
      } else {
        console.error('API Error:', response.message); // Debugging line
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch invitation bonuses",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCall('/invitation-bonus', {
        method: 'POST',
        body: JSON.stringify({
          minSubordinates: formData.minSubordinates,
          minDepositAmount: formData.minDepositAmount,
          bonusAmount: formData.bonusAmount,
        }),
      });

      if (response) {
        fetchInvitationBonuses();
        setFormData({
          minSubordinates: '',
          minDepositAmount: '',
          bonusAmount: '',
        });
        toast({
          title: "Success",
          description: "Invitation bonus created successfully",
          variant: "success",
        });
      } else {
        console.error('API Error:', response.message); // Debugging line
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to create invitation bonus",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (minSubordinates) => {
    if (isDeleting) return; // Prevent multiple clicks
    
    setIsDeleting(true);
    try {
      const response = await apiCall(`/invitation-bonus/${minSubordinates}`, {
        method: 'DELETE',
      });

      if (response) {
        // Remove the deleted bonus from the state
        setInvitationBonuses(invitationBonuses.filter(
          bonus => bonus.minSubordinates !== minSubordinates
        ));
        
        toast({
          title: "Success",
          description: "Invitation bonus deleted successfully",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete invitation bonus",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete invitation bonus",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-500">Invitation Bonus</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <Users className="h-8 w-8" />
              <p className="text-sm">Total Users</p>
              <p className="text-lg font-bold">1,234</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <DollarSign className="h-8 w-8" />
              <p className="text-sm">Total Deposits</p>
              <p className="text-lg font-bold">$12,345</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <TrendingUp className="h-8 w-8" />
              <p className="text-sm">Total Bonuses</p>
              <p className="text-lg font-bold">$1,234</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white shadow-lg">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <Gift className="h-8 w-8" />
              <p className="text-sm">Active Promotions</p>
              <p className="text-lg font-bold">5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            placeholder="Min Subordinates"
            value={formData.minSubordinates}
            onChange={(e) => setFormData({ ...formData, minSubordinates: e.target.value })}
            required
            className="p-2 border rounded-md"
          />
          <Input
            type="number"
            placeholder="Min Deposit Amount"
            value={formData.minDepositAmount}
            onChange={(e) => setFormData({ ...formData, minDepositAmount: e.target.value })}
            required
            className="p-2 border rounded-md"
          />
          <Input
            type="number"
            placeholder="Bonus Amount"
            value={formData.bonusAmount}
            onChange={(e) => setFormData({ ...formData, bonusAmount: e.target.value })}
            required
            className="p-2 border rounded-md"
          />
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 mt-4">
          Create Invitation Bonus
        </Button>
      </form>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Min Subordinates</TableHead>
                  <TableHead>Min Deposit Amount</TableHead>
                  <TableHead>Bonus Amount</TableHead>
                  <TableHead>Achieved By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitationBonuses.map((bonus) => (
                  <TableRow key={bonus._id}>
                    <TableCell>{bonus.minSubordinates}</TableCell>
                    <TableCell>{bonus.minDepositAmount || 'N/A'}</TableCell>
                    <TableCell>{bonus.bonusAmount}</TableCell>
                    <TableCell>{bonus.achievedBy.map((achiever) => achiever.userId).join(', ') || 'None'}</TableCell>
                    <TableCell>{new Date(bonus.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(bonus.minSubordinates)}
                        disabled={isDeleting}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationBonus;