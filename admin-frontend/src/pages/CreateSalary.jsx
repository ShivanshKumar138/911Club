// import { useState, useEffect } from "react";
// import { Card, CardContent } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
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
// import { apiCall } from "../utils/api";

// const CreateSalary = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [formData, setFormData] = useState({
//     uid: "",
//     salaryAmount: "",
//     salaryFrequency: "",
//     frequencyLimit: "",
//     remarks: "",
//   });
//   const [salaryRecords, setSalaryRecords] = useState([]);
//   const [selectedCondition, setSelectedCondition] = useState(null);
//   const [creditedSalaries, setCreditedSalaries] = useState([]);
//   const { toast } = useToast();
//   const [summaryData, setSummaryData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [eligibleData, setEligibleData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [filterDate, setFilterDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [addedUsers, setAddedUsers] = useState([]);

//   // Add these state variables after other useState declarations
//   const [isCustomSalaryDialogOpen, setIsCustomSalaryDialogOpen] =
//     useState(false);
//   const [customSalary, setCustomSalary] = useState("");
//   const [selectedUid, setSelectedUid] = useState("");
//   const [isEditMode, setIsEditMode] = useState(false); // Add this state

//   // Add these after other useState declarations
//   const [startDate, setStartDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [endDate, setEndDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const conditions = [
//     { referredUsersCount: 5, totalDepositAmount: 3000, salary: 300 },
//     { referredUsersCount: 10, totalDepositAmount: 7000, salary: 500 },
//     { referredUsersCount: 20, totalDepositAmount: 20000, salary: 1100 },
//     { referredUsersCount: 40, totalDepositAmount: 35000, salary: 2100 },
//     { referredUsersCount: 80, totalDepositAmount: 80000, salary: 4500 },
//     { referredUsersCount: 100, totalDepositAmount: 110000, salary: 5500 },
//     { referredUsersCount: 150, totalDepositAmount: 150000, salary: 8000 },
//     { referredUsersCount: 200, totalDepositAmount: 220000, salary: 12000 },
//     { referredUsersCount: 250, totalDepositAmount: 300000, salary: 15000 },
//     { referredUsersCount: 350, totalDepositAmount: 350000, salary: 20000 },
//     { referredUsersCount: 450, totalDepositAmount: 500000, salary: 30000 },
//     { referredUsersCount: 500, totalDepositAmount: 700000, salary: 40000 },
//   ];

//   useEffect(() => {
//     fetchSummaryData();
//     fetchAddedUsers();
//   }, []);

//   const handleEditSalary = (uid) => {
//     const currentSalary = getCurrentSalary(uid).toString();
//     setSelectedUid(uid);
//     setCustomSalary(currentSalary);
//     setIsEditMode(true);
//     setIsCustomSalaryDialogOpen(true);
//   };
//   const handleAddUser = (uid) => {
//     const condition = conditions.find((cond) =>
//       eligibleData.some(
//         (record) =>
//           record.uid === uid &&
//           record.referredUsersCount >= cond.referredUsersCount &&
//           record.totalDepositAmount >= cond.totalDepositAmount
//       )
//     );
//     const suggestedSalary = condition ? condition.salary : 0;

//     setSelectedUid(uid);
//     setCustomSalary(suggestedSalary.toString());
//     setIsEditMode(false); // Set to false for add mode
//     setIsCustomSalaryDialogOpen(true);
//   };
//   const fetchSummaryData = async () => {
//     try {
//       const response = await apiCall("/api/admin/subordinates-summary");
//       if (response) {
//         console.log("Summary data:", response.usersSummary);
//         const processedData = processSummaryData(response.usersSummary);
//         console.log("Processed data:", processedData);
//         setSummaryData(processedData);
//         setFilteredData(
//           processedData.filter((item) => item.date === filterDate)
//         );
//         setEligibleData(processedData.filter(isEligible));
//       } else {
//         console.error("API Error:", response.message);
//         showDefaultData();
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch summary data",
//         variant: "destructive",
//       });
//       showDefaultData();
//     }
//   };

//   // Add after other useEffect hooks
//   useEffect(() => {
//     fetchCreditedSalaries();
//   }, []);

//   const fetchCreditedSalaries = async () => {
//     try {
//       const response = await apiCall("/all-salaries");
//       if (response) {
//         // Store all salaries, not just active ones
//         setCreditedSalaries(response);
//       } else {
//         console.error("API Error:", response.message);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch credited salaries",
//         variant: "destructive",
//       });
//     }
//   };

//   const getCurrentSalary = (uid) => {
//     const salaryRecord = creditedSalaries.find((salary) => salary.uid === uid);
//     return salaryRecord ? salaryRecord.amount : 0;
//   };
//   const fetchAddedUsers = async () => {
//     try {
//       const response = await apiCall("/all-salaries");
//       if (response) {
//         console.log("Added users:", response);
//         setAddedUsers(response.map((user) => user.uid));
//       } else {
//         console.error("API Error:", response.message);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };

//   const showDefaultData = () => {
//     const today = new Date().toISOString().split("T")[0];
//     const defaultData = [
//       {
//         uid: "default",
//         date: today,
//         totalDeposits: 0,
//         totalDepositAmount: 0,
//         totalBetAmount: 0,
//         usersWhoBetCount: 0,
//         firstTimeDepositorsCount: 0,
//         totalFirstDepositAmount: 0,
//         referredUsersCount: 0,
//       },
//     ];
//     setSummaryData(defaultData);
//     setFilteredData(defaultData);
//     setEligibleData(defaultData.filter(isEligible));
//   };

//   const processSummaryData = (data) => {
//     const combinedData = {};

//     data.forEach((user) => {
//       if (user.depositsSummary.length > 0 || user.referredUsers.length > 0) {
//         user.depositsSummary.forEach((item) => {
//           const date = item.date.split(" ")[0];
//           const key = `${user.uid}-${date}`;
//           if (!combinedData[key]) {
//             combinedData[key] = {
//               uid: user.uid,
//               date,
//               totalDeposits: 0,
//               totalDepositAmount: 0,
//               totalBetAmount: 0,
//               usersWhoBetCount: 0,
//               firstTimeDepositorsCount: 0,
//               totalFirstDepositAmount: 0,
//               referredUsersCount: 0,
//               totalWithdrawals: 0,          // New field
//               totalWithdrawalAmount: 0      // New field
//             };
//           }
//           combinedData[key].totalDeposits += item.totalDeposits;
//           combinedData[key].totalDepositAmount += item.totalDepositAmount;
//           combinedData[key].totalBetAmount += item.totalBetAmount;
//           combinedData[key].usersWhoBetCount += item.usersWhoBetCount;
//           combinedData[key].firstTimeDepositorsCount += item.firstTimeDepositorsCount;
//           combinedData[key].totalFirstDepositAmount += item.totalFirstDepositAmount;
//           combinedData[key].totalWithdrawals += item.totalWithdrawals || 0;
//           combinedData[key].totalWithdrawalAmount += item.totalWithdrawalAmount || 0;
//         });
//         user.referredUsers.forEach((refUser) => {
//           const date = refUser.date.split(" ")[0];
//           const key = `${user.uid}-${date}`;
//           if (!combinedData[key]) {
//             combinedData[key] = {
//               uid: user.uid,
//               date,
//               totalDeposits: 0,
//               totalDepositAmount: 0,
//               totalBetAmount: 0,
//               usersWhoBetCount: 0,
//               firstTimeDepositorsCount: 0,
//               totalFirstDepositAmount: 0,
//               referredUsersCount: 0,
//             };
//           }
//           combinedData[key].referredUsersCount += 1;
//         });
//       }
//     });

//     return Object.values(combinedData);
//   };

//   const isEligible = (record) => {
//     return conditions.some(
//       (condition) =>
//         record.referredUsersCount >= condition.referredUsersCount &&
//         record.totalDepositAmount >= condition.totalDepositAmount
//     );
//   };

//   const handleFilterChange = (e) => {
//     const date = e.target.value;
//     setFilterDate(date);
//     filterData(date, searchQuery);
//   };

//   const handleSearchChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     filterData(filterDate, query);
//   };

//   // Replace the existing filterData function
//   const filterData = (date, query) => {
//     let filtered = summaryData;

//     // Filter by date range
//     filtered = filtered.filter((item) => {
//       const itemDate = new Date(item.date);
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       return itemDate >= start && itemDate <= end;
//     });

//     if (query) {
//       filtered = filtered.filter((item) => item.uid.includes(query));
//     }

//     setFilteredData(filtered);
//     setEligibleData(filtered.filter(isEligible));
//   };

//   // Add these after other handler functions
//   const handleStartDateChange = (e) => {
//     const date = e.target.value;
//     setStartDate(date);
//     filterData(filterDate, searchQuery);
//   };

//   const handleEndDateChange = (e) => {
//     const date = e.target.value;
//     setEndDate(date);
//     filterData(filterDate, searchQuery);
//   };
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//  // ...existing code...
// const handleConfirmCustomSalary = async () => {
//   try {
//     let endpoint = isEditMode ? "/update-user-salary" : "/create-user-salary";
//     const response = await apiCall(endpoint, {
//       method: "POST",
//       body: JSON.stringify({
//         uid: selectedUid,
//         amount: Number(customSalary),
//         isActive: false,
//       }),
//     });

//     if (response) {
//       toast({
//         title: "Success",
//         description: isEditMode ? "Salary updated successfully" : "User added to salary list",
//         variant: "success",
//       });

//       if (!isEditMode && !addedUsers.includes(selectedUid)) {
//         setAddedUsers([...addedUsers, selectedUid]);
//       }

//       // Refresh credited salaries to show updated values
//       fetchCreditedSalaries();
//     } else {
//       console.error("API Error:", response.message);
//     }
//   } catch (error) {
//     console.error("Fetch error:", error);
//     toast({
//       title: "Error",
//       description: isEditMode ? "Failed to update salary" : "Failed to add user to salary list",
//       variant: "destructive",
//     });
//   }
//   setIsCustomSalaryDialogOpen(false);
// };
// // ...existing code...

// // Replace the existing calculateProfitLoss function
// const calculateProfitLoss = (record, salary) => {
//   const totalDeposits = record.totalDepositAmount || 0;
//   const totalWithdrawals = record.totalWithdrawalAmount || 0;
//   const profitLoss = totalDeposits - totalWithdrawals;

//   return {
//     value: profitLoss,
//     isProfit: profitLoss >= 0,
//     displayValue: `${profitLoss >= 0 ? "+" : "-"}₹${Math.abs(profitLoss).toFixed(2)}`,
//     className: profitLoss >= 0
//       ? "text-emerald-600 font-semibold"
//       : "text-red-600 font-semibold",
//   };
// };
//   const handleSendSalaries = async () => {
//     try {
//       const response = await apiCall("/credit-salaries", {
//         method: "POST",
//       });
//       if (response) {
//         toast({
//           title: "Success",
//           description: "Salaries credited successfully",
//           variant: "success",
//         });
//       } else {
//         console.error("API Error:", response.message);
//         toast({
//           title: "Error",
//           description: "Failed to credit salaries",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       toast({
//         title: "Error",
//         description: "Failed to credit salaries",
//         variant: "destructive",
//       });
//     }
//   };
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const currentEligibleItems = eligibleData.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   const getCellStyle = (value) => {
//     if (value > 1000) return "text-green-500";
//     if (value < 0) return "text-red-500";
//     return "text-gray-700";
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-blue-500 mb-4 md:mb-0">
//           Summary Data
//         </h1>

//         <div className="flex space-x-4">
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-600">From:</span>
//             <Input
//               type="date"
//               value={startDate}
//               onChange={handleStartDateChange}
//               className="p-2 border rounded-md"
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-600">To:</span>
//             <Input
//               type="date"
//               value={endDate}
//               onChange={handleEndDateChange}
//               className="p-2 border rounded-md"
//             />
//           </div>
//           <Input
//             type="text"
//             placeholder="Search by UID"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="p-2 border rounded-md"
//           />
//           <Button
//             onClick={handleSendSalaries}
//             className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
//           >
//             Send Salary to All Eligible Users
//           </Button>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <Table className="min-w-full bg-white">
//           <TableHeader>
//             <TableRow>
//               <TableHead className="px-4 py-2">UID</TableHead>
//               <TableHead className="px-4 py-2">Date</TableHead>
//               <TableHead className="px-4 py-2">Total Deposits</TableHead>
//               <TableHead className="px-4 py-2">Total Deposit Amount</TableHead>
//               <TableHead className="px-4 py-2">Total Bet Amount</TableHead>
//               <TableHead className="px-4 py-2">Users Who Bet Count</TableHead>
//               <TableHead className="px-4 py-2">
//                 First Time Depositors Count
//               </TableHead>
//               <TableHead className="px-4 py-2">
//                 Total First Deposit Amount
//               </TableHead>
//               <TableHead className="px-4 py-2">Referred Users Count</TableHead>
//               <TableHead className="px-4 py-2">Total Withdrawals</TableHead>
//     <TableHead className="px-4 py-2">Total Withdrawal Amount</TableHead>
//   </TableRow>
// </TableHeader>
//           <TableBody>
//             {currentItems.map((record, index) => (
//               <TableRow key={index} className="bg-gray-100 border-b">
//                 <TableCell className="px-4 py-2">{record.uid}</TableCell>
//                 <TableCell className="px-4 py-2">{record.date}</TableCell>
//                 <TableCell
//                   className={`px-4 py-2 ${getCellStyle(record.totalDeposits)}`}
//                 >
//                   {record.totalDeposits}
//                 </TableCell>
//                 <TableCell
//                   className={`px-4 py-2 ${getCellStyle(
//                     record.totalDepositAmount
//                   )}`}
//                 >
//                   {record.totalDepositAmount}
//                 </TableCell>
//                 <TableCell
//                   className={`px-4 py-2 ${getCellStyle(record.totalBetAmount)}`}
//                 >
//                   {record.totalBetAmount}
//                 </TableCell>
//                 <TableCell
//                   className={`px-4 py-2 ${getCellStyle(
//                     record.usersWhoBetCount
//                   )}`}
//                 >
//                   {record.usersWhoBetCount}
//                 </TableCell>
//                 <TableCell
//                   className={`px-4 py-2 ${getCellStyle(
//                     record.firstTimeDepositorsCount
//                   )}`}
//                 >
//                   {record.firstTimeDepositorsCount}
//                 </TableCell>
//                 <TableCell
//                   className={`px-4 py-2 ${getCellStyle(
//                     record.totalFirstDepositAmount
//                   )}`}
//                 >
//                   {record.totalFirstDepositAmount}
//                 </TableCell>
//                 <TableCell
//                   className={`px-4 py-2 ${getCellStyle(
//                     record.referredUsersCount
//                   )}`}
//                 >
//                   {record.referredUsersCount}
//                 </TableCell>
//                 <TableCell className={`px-4 py-2 ${getCellStyle(record.totalWithdrawals)}`}>
//         {record.totalWithdrawals}
//       </TableCell>
//       <TableCell className={`px-4 py-2 ${getCellStyle(record.totalWithdrawalAmount)}`}>
//         {record.totalWithdrawalAmount}
//       </TableCell>
//               </TableRow>

//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex justify-center mt-4">
//         <Button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="mr-2"
//         >
//           Previous
//         </Button>
//         <Button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={indexOfLastItem >= filteredData.length}
//         >
//           Next
//         </Button>
//       </div>

//       <div className="mt-8">
//         <h2 className="text-xl font-bold text-blue-500 mb-4">Eligible Users</h2>
//         <div className="overflow-x-auto">
//           <Table className="min-w-full bg-white">
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="px-4 py-2">UID</TableHead>
//                 <TableHead className="px-4 py-2">Date</TableHead>
//                 <TableHead className="px-4 py-2">Total Deposits</TableHead>
//                 <TableHead className="px-4 py-2">
//                   Total Deposit Amount
//                 </TableHead>
//                 <TableHead className="px-4 py-2">Total Bet Amount</TableHead>
//                 <TableHead className="px-4 py-2">
//                   First Time Depositors Count
//                 </TableHead>
//                 <TableHead className="px-4 py-2">
//                   Total First Deposit Amount
//                 </TableHead>
//                 <TableHead className="px-4 py-2">
//                   Referred Users Count
//                 </TableHead>
//                 <TableHead className="px-4 py-2">Total Withdrawals</TableHead>
//     <TableHead className="px-4 py-2">Total Withdrawal Amount</TableHead>
//     <TableHead className="px-4 py-2">Current Salary</TableHead>
//     <TableHead className="px-4 py-2">Profit/Loss</TableHead>
//     <TableHead className="px-4 py-2">Action</TableHead>
//   </TableRow>
// </TableHeader>
//             <TableBody>
//               {currentEligibleItems.map((record, index) => (
//                 <TableRow key={index} className="bg-gray-100 border-b">
//                   <TableCell className="px-4 py-2">{record.uid}</TableCell>
//                   <TableCell className="px-4 py-2">{record.date}</TableCell>
//                   <TableCell
//                     className={`px-4 py-2 ${getCellStyle(
//                       record.totalDeposits
//                     )}`}
//                   >
//                     {record.totalDeposits}
//                   </TableCell>
//                   <TableCell
//                     className={`px-4 py-2 ${getCellStyle(
//                       record.totalDepositAmount
//                     )}`}
//                   >
//                     {record.totalDepositAmount}
//                   </TableCell>

//                   <TableCell
//                     className={`px-4 py-2 ${getCellStyle(
//                       record.usersWhoBetCount
//                     )}`}
//                   >
//                     {record.usersWhoBetCount}
//                   </TableCell>
//                   <TableCell
//                     className={`px-4 py-2 ${getCellStyle(
//                       record.firstTimeDepositorsCount
//                     )}`}
//                   >
//                     {record.firstTimeDepositorsCount}
//                   </TableCell>

//                   <TableCell
//                     className={`px-4 py-2 ${getCellStyle(
//                       record.totalFirstDepositAmount
//                     )}`}
//                   >
//                     {record.totalFirstDepositAmount}
//                   </TableCell>
//                   <TableCell
//                     className={`px-4 py-2 ${getCellStyle(
//                       record.referredUsersCount
//                     )}`}
//                   >
//                     {record.referredUsersCount}
//                   </TableCell>
//                   <TableCell className={`px-4 py-2 ${getCellStyle(record.totalWithdrawals)}`}>
//         {record.totalWithdrawals}
//       </TableCell>
//       <TableCell className={`px-4 py-2 ${getCellStyle(record.totalWithdrawalAmount)}`}>
//         {record.totalWithdrawalAmount}
//       </TableCell>
//                   <TableCell
//                     className={`px-4 py-2 ${getCellStyle(
//                       getCurrentSalary(record.uid)
//                     )}`}
//                   >
//                     {getCurrentSalary(record.uid)}
//                   </TableCell>
//                   <TableCell className="px-4 py-2">
//   {(() => {
//     const profitLoss = calculateProfitLoss(record, getCurrentSalary(record.uid));
//     return (
//       <span className={profitLoss.className}>
//         {profitLoss.displayValue}
//         <span className="text-xs ml-1">
//           ({profitLoss.isProfit ? 'Profit' : 'Loss'})
//         </span>
//       </span>
//     );
//   })()}
// </TableCell>
// <TableCell className="px-4 py-2">
//   <div className="flex space-x-2">
//     <Button
//       onClick={() => handleAddUser(record.uid)}
//       disabled={addedUsers.includes(record.uid)}
//     >
//       {addedUsers.includes(record.uid) ? "Added" : "Add"}
//     </Button>
//     {addedUsers.includes(record.uid) && (
//       <Button
//         onClick={() => handleEditSalary(record.uid)}
//         variant="outline"
//       >
//         Edit
//       </Button>
//     )}
//   </div>
// </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>

//         <div className="flex justify-center mt-4">
//           <Button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="mr-2"
//           >
//             Previous
//           </Button>
//           <Button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={indexOfLastItem >= eligibleData.length}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//       <div className="mt-8">
//         <h2 className="text-xl font-bold text-blue-500 mb-4">
//           Credited Salaries
//         </h2>
//         <div className="overflow-x-auto">
//           <Table className="min-w-full bg-white">
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="px-4 py-2">UID</TableHead>
//                 <TableHead className="px-4 py-2">Amount</TableHead>
//                 <TableHead className="px-4 py-2">Status</TableHead>
//                 <TableHead className="px-4 py-2">Created At</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {creditedSalaries.map((salary, index) => (
//                 <TableRow key={index} className="bg-gray-100 border-b">
//                   <TableCell className="px-4 py-2">{salary.uid}</TableCell>
//                   <TableCell
//                     className={`px-4 py-2 ${getCellStyle(salary.amount)}`}
//                   >
//                     {salary.amount}
//                   </TableCell>
//                   <TableCell className="px-4 py-2">
//                     <span className="text-green-500">Credited</span>
//                   </TableCell>
//                   <TableCell className="px-4 py-2">
//                     {new Date(salary.date).toLocaleString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//       <Dialog
//         open={isCustomSalaryDialogOpen}
//         onOpenChange={setIsCustomSalaryDialogOpen}
//       >
//         <DialogContent>
//         <DialogHeader>
//   <DialogTitle>{isEditMode ? "Edit Salary" : "Set Custom Salary"}</DialogTitle>
// </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="flex flex-col space-y-2">
//               <label htmlFor="customSalary" className="text-sm font-medium">
//                 Salary Amount
//               </label>
//               <Input
//                 id="customSalary"
//                 type="number"
//                 value={customSalary}
//                 onChange={(e) => setCustomSalary(e.target.value)}
//                 placeholder="Enter salary amount"
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsCustomSalaryDialogOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleConfirmCustomSalary}>Confirm</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default CreateSalary;

/*eslint-disable*/
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
import { apiCall } from "../utils/api";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const CreateSalary = () => {
  // Existing state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    uid: "",
    salaryAmount: "",
    salaryFrequency: "",
    frequencyLimit: "",
    remarks: "",
  });
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [creditedSalaries, setCreditedSalaries] = useState([]);
  const { toast } = useToast();
  const [summaryData, setSummaryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [eligibleData, setEligibleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [addedUsers, setAddedUsers] = useState([]);
  const [isCustomSalaryDialogOpen, setIsCustomSalaryDialogOpen] =
    useState(false);
  const [customSalary, setCustomSalary] = useState("");
  const [selectedUid, setSelectedUid] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Date filter states
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // New state for calendar popovers
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Filter type state (quick select vs custom date range)
  const [filterType, setFilterType] = useState("custom"); // 'today', 'yesterday', 'week', 'month', 'custom'

  const conditions = [
    { referredUsersCount: 5, totalDepositAmount: 3000, salary: 300 },
    { referredUsersCount: 10, totalDepositAmount: 7000, salary: 500 },
    { referredUsersCount: 20, totalDepositAmount: 20000, salary: 1100 },
    { referredUsersCount: 40, totalDepositAmount: 35000, salary: 2100 },
    { referredUsersCount: 80, totalDepositAmount: 80000, salary: 4500 },
    { referredUsersCount: 100, totalDepositAmount: 110000, salary: 5500 },
    { referredUsersCount: 150, totalDepositAmount: 150000, salary: 8000 },
    { referredUsersCount: 200, totalDepositAmount: 220000, salary: 12000 },
    { referredUsersCount: 250, totalDepositAmount: 300000, salary: 15000 },
    { referredUsersCount: 350, totalDepositAmount: 350000, salary: 20000 },
    { referredUsersCount: 450, totalDepositAmount: 500000, salary: 30000 },
    { referredUsersCount: 500, totalDepositAmount: 700000, salary: 40000 },
  ];

  useEffect(() => {
    fetchSummaryData();
    fetchAddedUsers();
    fetchCreditedSalaries();
  }, []);

  // Date filter helper functions
  const setToday = () => {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];
    setStartDate(dateStr);
    setEndDate(dateStr);
    setFilterType("today");
    filterData(dateStr, dateStr, searchQuery);
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];
    setStartDate(dateStr);
    setEndDate(dateStr);
    setFilterType("yesterday");
    filterData(dateStr, dateStr, searchQuery);
  };

  const setThisWeek = () => {
    const today = new Date();
    const firstDay = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    firstDay.setDate(diff);

    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    setFilterType("week");
    filterData(
      firstDay.toISOString().split("T")[0],
      today.toISOString().split("T")[0],
      searchQuery
    );
  };

  const setThisMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    setFilterType("month");
    filterData(
      firstDay.toISOString().split("T")[0],
      today.toISOString().split("T")[0],
      searchQuery
    );
  };

  // Handle date selection from calendar
  const handleStartDateSelect = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    setStartDate(dateStr);
    setStartDateOpen(false);
    setFilterType("custom");
    filterData(dateStr, endDate, searchQuery);
  };

  const handleEndDateSelect = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    setEndDate(dateStr);
    setEndDateOpen(false);
    setFilterType("custom");
    filterData(startDate, dateStr, searchQuery);
  };

  // Existing functions
  const handleEditSalary = (uid) => {
    const currentSalary = getCurrentSalary(uid).toString();
    setSelectedUid(uid);
    setCustomSalary(currentSalary);
    setIsEditMode(true);
    setIsCustomSalaryDialogOpen(true);
  };

  const handleAddUser = (uid) => {
    const condition = conditions.find((cond) =>
      eligibleData.some(
        (record) =>
          record.uid === uid &&
          record.referredUsersCount >= cond.referredUsersCount &&
          record.totalDepositAmount >= cond.totalDepositAmount
      )
    );
    const suggestedSalary = condition ? condition.salary : 0;

    setSelectedUid(uid);
    setCustomSalary(suggestedSalary.toString());
    setIsEditMode(false); // Set to false for add mode
    setIsCustomSalaryDialogOpen(true);
  };

  const fetchSummaryData = async () => {
    try {
      const response = await apiCall("/api/admin/subordinates-summary");
      if (response) {
        console.log("Summary data:", response.usersSummary);
        const processedData = processSummaryData(response.usersSummary);
        console.log("Processed data:", processedData);
        setSummaryData(processedData);
        setFilteredData(
          processedData.filter((item) => item.date === filterDate)
        );
        setEligibleData(processedData.filter(isEligible));
      } else {
        console.error("API Error:", response.message);
        showDefaultData();
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch summary data",
        variant: "destructive",
      });
      showDefaultData();
    }
  };

  const fetchCreditedSalaries = async () => {
    try {
      const response = await apiCall("/all-salaries");
      if (response) {
        // Store all salaries, not just active ones
        setCreditedSalaries(response);
      } else {
        console.error("API Error:", response.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch credited salaries",
        variant: "destructive",
      });
    }
  };

  const getCurrentSalary = (uid) => {
    const salaryRecord = creditedSalaries.find((salary) => salary.uid === uid);
    return salaryRecord ? salaryRecord.amount : 0;
  };

  const fetchAddedUsers = async () => {
    try {
      const response = await apiCall("/all-salaries");
      if (response) {
        console.log("Added users:", response);
        setAddedUsers(response.map((user) => user.uid));
      } else {
        console.error("API Error:", response.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const showDefaultData = () => {
    const today = new Date().toISOString().split("T")[0];
    const defaultData = [
      {
        uid: "default",
        date: today,
        totalDeposits: 0,
        totalDepositAmount: 0,
        totalBetAmount: 0,
        usersWhoBetCount: 0,
        firstTimeDepositorsCount: 0,
        totalFirstDepositAmount: 0,
        referredUsersCount: 0,
      },
    ];
    setSummaryData(defaultData);
    setFilteredData(defaultData);
    setEligibleData(defaultData.filter(isEligible));
  };

  const processSummaryData = (data) => {
    const combinedData = {};

    data.forEach((user) => {
      if (user.depositsSummary.length > 0 || user.referredUsers.length > 0) {
        user.depositsSummary.forEach((item) => {
          const date = item.date.split(" ")[0];
          const key = `${user.uid}-${date}`;
          if (!combinedData[key]) {
            combinedData[key] = {
              uid: user.uid,
              date,
              totalDeposits: 0,
              totalDepositAmount: 0,
              totalBetAmount: 0,
              usersWhoBetCount: 0,
              firstTimeDepositorsCount: 0,
              totalFirstDepositAmount: 0,
              referredUsersCount: 0,
              totalWithdrawals: 0,
              totalWithdrawalAmount: 0,
            };
          }
          combinedData[key].totalDeposits += item.totalDeposits;
          combinedData[key].totalDepositAmount += item.totalDepositAmount;
          combinedData[key].totalBetAmount += item.totalBetAmount;
          combinedData[key].usersWhoBetCount += item.usersWhoBetCount;
          combinedData[key].firstTimeDepositorsCount +=
            item.firstTimeDepositorsCount;
          combinedData[key].totalFirstDepositAmount +=
            item.totalFirstDepositAmount;
          combinedData[key].totalWithdrawals += item.totalWithdrawals || 0;
          combinedData[key].totalWithdrawalAmount +=
            item.totalWithdrawalAmount || 0;
        });
        user.referredUsers.forEach((refUser) => {
          const date = refUser.date.split(" ")[0];
          const key = `${user.uid}-${date}`;
          if (!combinedData[key]) {
            combinedData[key] = {
              uid: user.uid,
              date,
              totalDeposits: 0,
              totalDepositAmount: 0,
              totalBetAmount: 0,
              usersWhoBetCount: 0,
              firstTimeDepositorsCount: 0,
              totalFirstDepositAmount: 0,
              referredUsersCount: 0,
            };
          }
          combinedData[key].referredUsersCount += 1;
        });
      }
    });

    return Object.values(combinedData);
  };

  const isEligible = (record) => {
    return conditions.some(
      (condition) =>
        record.referredUsersCount >= condition.referredUsersCount &&
        record.totalDepositAmount >= condition.totalDepositAmount
    );
  };

  const handleFilterChange = (e) => {
    const date = e.target.value;
    setFilterDate(date);
    filterData(date, searchQuery);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterData(startDate, endDate, query);
  };

  // Updated filter function to take both start and end dates
  const filterData = (start, end, query) => {
    let filtered = summaryData;

    // Filter by date range
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.date);
      const startDateTime = new Date(start);
      const endDateTime = new Date(end);
      return itemDate >= startDateTime && itemDate <= endDateTime;
    });

    if (query) {
      filtered = filtered.filter((item) => item.uid.includes(query));
    }

    setFilteredData(filtered);
    setEligibleData(filtered.filter(isEligible));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleConfirmCustomSalary = async () => {
    try {
      let endpoint = isEditMode ? "/update-user-salary" : "/create-user-salary";
      const response = await apiCall(endpoint, {
        method: "POST",
        body: JSON.stringify({
          uid: selectedUid,
          amount: Number(customSalary),
          isActive: false,
        }),
      });

      if (response) {
        toast({
          title: "Success",
          description: isEditMode
            ? "Salary updated successfully"
            : "User added to salary list",
          variant: "success",
        });

        if (!isEditMode && !addedUsers.includes(selectedUid)) {
          setAddedUsers([...addedUsers, selectedUid]);
        }

        // Refresh credited salaries to show updated values
        fetchCreditedSalaries();
      } else {
        console.error("API Error:", response.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: isEditMode
          ? "Failed to update salary"
          : "Failed to add user to salary list",
        variant: "destructive",
      });
    }
    setIsCustomSalaryDialogOpen(false);
  };

  const calculateProfitLoss = (record, salary) => {
    const totalDeposits = record.totalDepositAmount || 0;
    const totalWithdrawals = record.totalWithdrawalAmount || 0;
    const profitLoss = totalDeposits - totalWithdrawals;

    return {
      value: profitLoss,
      isProfit: profitLoss >= 0,
      displayValue: `${profitLoss >= 0 ? "+" : "-"}₹${Math.abs(
        profitLoss
      ).toFixed(2)}`,
      className:
        profitLoss >= 0
          ? "text-emerald-600 font-semibold"
          : "text-red-600 font-semibold",
    };
  };

  const handleSendSalaries = async () => {
    try {
      const response = await apiCall("/credit-salaries", {
        method: "POST",
      });
      if (response) {
        toast({
          title: "Success",
          description: "Salaries credited successfully",
          variant: "success",
        });
      } else {
        console.error("API Error:", response.message);
        toast({
          title: "Error",
          description: "Failed to credit salaries",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to credit salaries",
        variant: "destructive",
      });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const currentEligibleItems = eligibleData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const getCellStyle = (value) => {
    if (value > 1000) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-gray-700";
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "PPP"); // "Jan 1, 2021"
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-500 mb-4 md:mb-0">
          Summary Data
        </h1>

        <Card className="w-full md:w-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Date Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quick filter buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterType === "today" ? "default" : "outline"}
                  size="sm"
                  onClick={setToday}
                >
                  Today
                </Button>
                <Button
                  variant={filterType === "yesterday" ? "default" : "outline"}
                  size="sm"
                  onClick={setYesterday}
                >
                  Yesterday
                </Button>
                <Button
                  variant={filterType === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={setThisWeek}
                >
                  This Week
                </Button>
                <Button
                  variant={filterType === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={setThisMonth}
                >
                  This Month
                </Button>
              </div>

              {/* Custom date range */}
              <div className="flex items-center space-x-2">
                <div className="grid gap-2">
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center justify-start w-40"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(startDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(startDate)}
                        onSelect={handleStartDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <span className="text-sm">to</span>
                <div className="grid gap-2">
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center justify-start w-40"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(endDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(endDate)}
                        onSelect={handleEndDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search by UID"
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1"
              />
              <Button
                onClick={handleSendSalaries}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Send Salary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rest of the component remains the same */}
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2">UID</TableHead>
              <TableHead className="px-4 py-2">Date</TableHead>
              <TableHead className="px-4 py-2">Total Deposits</TableHead>
              <TableHead className="px-4 py-2">Total Deposit Amount</TableHead>
              <TableHead className="px-4 py-2">Total Bet Amount</TableHead>
              <TableHead className="px-4 py-2">Users Who Bet Count</TableHead>
              <TableHead className="px-4 py-2">
                First Time Depositors Count
              </TableHead>
              <TableHead className="px-4 py-2">
                Total First Deposit Amount
              </TableHead>
              <TableHead className="px-4 py-2">Referred Users Count</TableHead>
              <TableHead className="px-4 py-2">Total Withdrawals</TableHead>
              <TableHead className="px-4 py-2">
                Total Withdrawal Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((record, index) => (
                <TableRow key={index} className="bg-gray-100 border-b">
                  <TableCell className="px-4 py-2">{record.uid}</TableCell>
                  <TableCell className="px-4 py-2">{record.date}</TableCell>
                  <TableCell
                    className={`px-4 py-2 ${getCellStyle(
                      record.totalDeposits
                    )}`}
                  >
                    {record.totalDeposits}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 ${getCellStyle(
                      record.totalDepositAmount
                    )}`}
                  >
                    {record.totalDepositAmount}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 ${getCellStyle(
                      record.totalBetAmount
                    )}`}
                  >
                    {record.totalBetAmount}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 ${getCellStyle(
                      record.usersWhoBetCount
                    )}`}
                  >
                    {record.usersWhoBetCount}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 ${getCellStyle(
                      record.firstTimeDepositorsCount
                    )}`}
                  >
                    {record.firstTimeDepositorsCount}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 ${getCellStyle(
                      record.totalFirstDepositAmount
                    )}`}
                  >
                    {record.totalFirstDepositAmount}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 ${getCellStyle(
                      record.referredUsersCount
                    )}`}
                  >
                    {record.referredUsersCount}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 ${getCellStyle(
                      record.totalWithdrawals
                    )}`}
                  >
                    {record.totalWithdrawals}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 ${getCellStyle(
                      record.totalWithdrawalAmount
                    )}`}
                  >
                    {record.totalWithdrawalAmount}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-4">
                  No data found for selected date range
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and the rest of the component remains the same */}
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2"
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastItem >= filteredData.length}
        >
          Next
        </Button>
      </div>

      {/* Dialog for custom salary */}
      <Dialog
        open={isCustomSalaryDialogOpen}
        onOpenChange={setIsCustomSalaryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Salary" : "Set Custom Salary"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="customSalary" className="text-sm font-medium">
                Salary Amount
              </label>
              <Input
                id="customSalary"
                type="number"
                value={customSalary}
                onChange={(e) => setCustomSalary(e.target.value)}
                placeholder="Enter salary amount"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCustomSalaryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmCustomSalary}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateSalary;
