// /*eslint-disable*/
// import { useState } from 'react';
// import {
//   Card,
//   CardContent,
// } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";
// import { Info } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useToast } from "../../components/ui/use-toast";

// const FiveDDashboard = () => {
//   const [periodId, setPeriodId] = useState('202502130496');
//   const [timer, setTimer] = useState(37);
//   const [selectedNumbers, setSelectedNumbers] = useState({
//     sectionA: '',
//     sectionB: '',
//     sectionC: '',
//     sectionD: '',
//     sectionE: '',
//   });
//   const { toast } = useToast();

//   const sections = ['A', 'B', 'C', 'D', 'E'];
//   const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

//   const handleSetResult = () => {
//     const allSelected = Object.values(selectedNumbers).every(val => val !== '');
//     if (!allSelected) {
//       toast({
//         title: "Error",
//         description: "Please select numbers for all sections",
//         variant: "destructive",
//       });
//       return;
//     }

//     toast({
//       title: "Success",
//       description: "Result set successfully",
//       variant: "success",
//     });
//   };

//   const renderBettingTable = (section) => (
//     <div className="mt-6">
//       <h3 className="text-lg font-semibold mb-4">Section {section}</h3>
//       <div className="bg-card rounded-lg overflow-hidden">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-primary text-primary-foreground">
//               <th className="py-2 px-4 text-left">Numbers</th>
//               {numbers.slice(0, 5).map(num => (
//                 <th key={num} className="py-2 px-4 text-center">{num}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="py-2 px-4 border-t">Bets</td>
//               {numbers.slice(0, 5).map(num => (
//                 <td key={num} className="py-2 px-4 border-t text-center">0</td>
//               ))}
//             </tr>
//           </tbody>
//           <thead>
//             <tr className="bg-primary text-primary-foreground">
//               <th className="py-2 px-4 text-left">Numbers</th>
//               {numbers.slice(5).map(num => (
//                 <th key={num} className="py-2 px-4 text-center">{num}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="py-2 px-4 border-t">Bets</td>
//               {numbers.slice(5).map(num => (
//                 <td key={num} className="py-2 px-4 border-t text-center">0</td>
//               ))}
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <div className="mt-4 grid grid-cols-2 gap-4">
//         <div className="bg-card p-4 rounded-lg">
//           <h4 className="text-sm font-medium mb-2">Size</h4>
//           <div className="grid grid-cols-2 gap-2">
//             <div className="bg-muted p-2 rounded text-center">
//               <div className="text-sm text-muted-foreground">Small</div>
//               <div className="font-medium">0</div>
//             </div>
//             <div className="bg-muted p-2 rounded text-center">
//               <div className="text-sm text-muted-foreground">Big</div>
//               <div className="font-medium">0</div>
//             </div>
//           </div>
//         </div>
//         <div className="bg-card p-4 rounded-lg">
//           <h4 className="text-sm font-medium mb-2">Parity</h4>
//           <div className="grid grid-cols-2 gap-2">
//             <div className="bg-muted p-2 rounded text-center">
//               <div className="text-sm text-muted-foreground">Even</div>
//               <div className="font-medium">0</div>
//             </div>
//             <div className="bg-muted p-2 rounded text-center">
//               <div className="text-sm text-muted-foreground">Odd</div>
//               <div className="font-medium">0</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <h1 className="text-2xl font-semibold text-primary">5D Game Dashboard</h1>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-full"
//           >
//             <Info className="h-5 w-5" />
//           </Button>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="text-sm text-muted-foreground">
//             Current Period ID: {periodId}
//           </div>
//           <Select defaultValue="1">
//             <SelectTrigger className="w-[100px]">
//               <SelectValue placeholder="Timer" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="1">1 min</SelectItem>
//               <SelectItem value="3">3 min</SelectItem>
//               <SelectItem value="5">5 min</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Card className="bg-card">
//         <CardContent className="p-6">
//           <h2 className="text-xl font-semibold mb-6">Set 5D Result</h2>
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             {sections.map((section) => (
//               <Select
//                 key={section}
//                 value={selectedNumbers[`section${section}`]}
//                 onValueChange={(value) => 
//                   setSelectedNumbers(prev => ({ 
//                     ...prev, 
//                     [`section${section}`]: value 
//                   }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder={`Section ${section}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {numbers.map((num) => (
//                     <SelectItem key={num} value={num.toString()}>
//                       {num}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             ))}
//           </div>
//           <div className="mt-6 flex justify-end">
//             <Button
//               onClick={handleSetResult}
//               className="bg-primary hover:bg-primary/90"
//             >
//               SET RESULT
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className="bg-card">
//         <CardContent className="p-6">
//           <Tabs defaultValue="monitor">
//             <TabsList>
//               <TabsTrigger value="monitor">MONITOR BET DETAILS</TabsTrigger>
//               <TabsTrigger value="history">VIEW PREVIOUS BET HISTORIES</TabsTrigger>
//             </TabsList>
//             <TabsContent value="monitor">
//               <div className="space-y-8">
//                 {sections.map((section) => renderBettingTable(section))}
//               </div>
//             </TabsContent>
//             <TabsContent value="history">
//               {/* Add bet history table here */}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FiveDDashboard; 



// import { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
// } from "../../components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
// // import { Button } from "../../components/ui/button";
// import { apiCall } from '../../utils/api'; // Assuming you have an apiCall function

// const FiveDDashboard = () => {
//   const [betSums, setBetSums] = useState(null);
//   const [timer, setTimer] = useState('1min');
//   const sections = ['A', 'B', 'C', 'D', 'E'];

//   useEffect(() => {
//     const fetchBetSums = async () => {
//       try {
//         const response = await apiCall(`/latest-5d-bet-sums?timer=${timer}`);
//         setBetSums(response);
//       } catch (error) {
//         console.error('Failed to fetch bet sums:', error);
//       }
//     };

//     fetchBetSums();
//   }, [timer]);

//   const renderBettingTable = (section) => {
//     if (!betSums) return null;
//     const sectionData = betSums.totalBetSums[section];

//     return (
//       <div key={section}>
//         <h3>Section {section}</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Number</th>
//               <th>Bet Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(sectionData.numbers).map(([number, amount]) => (
//               <tr key={number}>
//                 <td>{number}</td>
//                 <td>{amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {/* Add similar tables for size and parity if needed */}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <Card className="bg-card">
//         <CardContent className="p-6">
//           <Tabs defaultValue="monitor">
//             <TabsList>
//               <TabsTrigger value="monitor">MONITOR BET DETAILS</TabsTrigger>
//               <TabsTrigger value="history">VIEW PREVIOUS BET HISTORIES</TabsTrigger>
//             </TabsList>
//             <TabsContent value="monitor">
//               <div className="space-y-8">
//                 {sections.map((section) => renderBettingTable(section))}
//               </div>
//             </TabsContent>
//             <TabsContent value="history">
//               {/* Add bet history table here */}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FiveDDashboard;


// import { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
// } from "../../components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
// import { apiCall } from '../../utils/api'; // Assuming you have an apiCall function

// const FiveDDashboard = () => {
//   const [betSums, setBetSums] = useState(null);
//   const [timer, setTimer] = useState('1min');
//   const sections = ['A', 'B', 'C', 'D', 'E'];

//   useEffect(() => {
//     const fetchBetSums = async () => {
//       try {
//         const response = await apiCall(`/latest-5d-bet-sums?timer=${timer}`);
//         setBetSums(response);
//       } catch (error) {
//         console.error('Failed to fetch bet sums:', error);
//       }
//     };

//     fetchBetSums();
//   }, [timer]);

//   const renderBettingTable = (section) => {
//     if (!betSums) return null;
//     const sectionData = betSums.totalBetSums[section];

//     return (
//       <div key={section} className="mb-8">
//         <h3 className="text-lg font-semibold mb-4">Section {section}</h3>
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="py-2 px-4 text-left">Number</th>
//               <th className="py-2 px-4 text-left">Bet Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(sectionData.numbers).map(([number, amount], index) => (
//               <tr key={number} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                 <td className="py-2 px-4 border-b">{number}</td>
//                 <td className="py-2 px-4 border-b">{amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {/* Add similar tables for size and parity if needed */}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <Card className="bg-card">
//         <CardContent className="p-6">
//           <Tabs defaultValue="monitor">
//             <TabsList>
//               <TabsTrigger value="monitor">MONITOR BET DETAILS</TabsTrigger>
//               {/* <TabsTrigger value="history">VIEW PREVIOUS BET HISTORIES</TabsTrigger> */}
//             </TabsList>
//             <TabsContent value="monitor">
//               <div className="space-y-8">
//                 {sections.map((section) => renderBettingTable(section))}
//               </div>
//             </TabsContent>
//             <TabsContent value="history">
//               {/* Add bet history table here */}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FiveDDashboard;



// import { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
// } from "../../components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
// import { apiCall } from '../../utils/api'; // Assuming you have an apiCall function

// const FiveDDashboard = () => {
//   const [betSums, setBetSums] = useState(null);
//   const [timer, setTimer] = useState('1min');
//   const sections = ['A', 'B', 'C', 'D', 'E'];

//   useEffect(() => {
//     const fetchBetSums = async () => {
//       try {
//         const response = await apiCall(`/latest-5d-bet-sums?timer=${timer}`);
//         setBetSums(response);
//       } catch (error) {
//         console.error('Failed to fetch bet sums:', error);
//       }
//     };

//     fetchBetSums();
//   }, [timer]);

//   const renderBettingTable = (section) => {
//     if (!betSums) return null;
//     const sectionData = betSums.totalBetSums[section];

//     return (
//       <div key={section} className="mb-8 animate-fadeIn">
//         <h3 className="text-lg font-semibold mb-4 text-gray-700">Section {section}</h3>
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="py-2 px-4 text-left">Number</th>
//               <th className="py-2 px-4 text-left">Bet Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(sectionData.numbers).map(([number, amount], index) => (
//               <tr key={number} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                 <td className="py-2 px-4 border-b">{number}</td>
//                 <td className="py-2 px-4 border-b">{amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {/* Add similar tables for size and parity if needed */}
//       </div>
//     );
//   };

//   return (
//     <div className="p-4">
//       <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
//         <CardContent className="p-6">
//           <Tabs defaultValue="monitor">
//             <TabsList className="flex space-x-4">
//               <TabsTrigger value="monitor" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">MONITOR BET DETAILS</TabsTrigger>
//               {/* <TabsTrigger value="history" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">VIEW PREVIOUS BET HISTORIES</TabsTrigger> */}
//             </TabsList>
//             <TabsContent value="monitor">
//               <div className="space-y-8">
//                 {sections.map((section) => renderBettingTable(section))}
//               </div>
//             </TabsContent>
//             <TabsContent value="history">
//               {/* Add bet history table here */}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FiveDDashboard;





// import { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
// } from "../../components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
// import { apiCall } from '../../utils/api'; // Assuming you have an apiCall function

// const FiveDDashboard = () => {
//   const [betSums, setBetSums] = useState(null);
//   const [timer, setTimer] = useState('1min');
//   const sections = ['A', 'B', 'C', 'D', 'E'];

//   useEffect(() => {
//     const fetchBetSums = async () => {
//       try {
//         const response = await apiCall(`/latest-5d-bet-sums?timer=${timer}`);
//         setBetSums(response);
//       } catch (error) {
//         console.error('Failed to fetch bet sums:', error);
//       }
//     };

//     fetchBetSums();
//   }, [timer]);

//   const renderBettingTable = (section) => {
//     if (!betSums) return null;
//     const sectionData = betSums.totalBetSums[section];

//     return (
//       <div key={section} className="mb-8 animate-fadeIn">
//         <h3 className="text-lg font-semibold mb-4 text-gray-700">Section {section}</h3>
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-4">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="py-2 px-4 text-left">Number</th>
//               <th className="py-2 px-4 text-left">Bet Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(sectionData.numbers).map(([number, amount], index) => (
//               <tr key={number} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                 <td className="py-2 px-4 border-b">{number}</td>
//                 <td className="py-2 px-4 border-b">{amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-4">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="py-2 px-4 text-left">Size</th>
//               <th className="py-2 px-4 text-left">Bet Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(sectionData.size).map(([size, amount], index) => (
//               <tr key={size} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                 <td className="py-2 px-4 border-b">{size}</td>
//                 <td className="py-2 px-4 border-b">{amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="py-2 px-4 text-left">Parity</th>
//               <th className="py-2 px-4 text-left">Bet Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(sectionData.parity).map(([parity, amount], index) => (
//               <tr key={parity} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                 <td className="py-2 px-4 border-b">{parity}</td>
//                 <td className="py-2 px-4 border-b">{amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div className="p-4">
//       <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
//         <CardContent className="p-6">
//           <Tabs defaultValue="monitor">
//             <TabsList className="flex space-x-4">
//               <TabsTrigger value="monitor" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">MONITOR BET DETAILS</TabsTrigger>
//               {/* <TabsTrigger value="history" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">VIEW PREVIOUS BET HISTORIES</TabsTrigger> */}
//             </TabsList>
//             <TabsContent value="monitor">
//               <div className="space-y-8">
//                 {sections.map((section) => renderBettingTable(section))}
//               </div>
//             </TabsContent>
//             <TabsContent value="history">
//               {/* Add bet history table here */}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FiveDDashboard;




// import { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
// } from "../../components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
// import { apiCall } from '../../utils/api'; // Assuming you have an apiCall function
// import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import { toast } from 'react-toastify';

// const FiveDDashboard = () => {
//   const [betSums, setBetSums] = useState(null);
//   const [timer, setTimer] = useState('1min');
//   const [formData, setFormData] = useState({
//     timerName: '1min',
//     periodId: '202502240380',
//     sectionOutcome: {
//       A: { number: 0, size: 'Small', parity: 'Even' },
//       B: { number: 1, size: 'Small', parity: 'Odd' },
//       C: { number: 2, size: 'Big', parity: 'Even' },
//       D: { number: 3, size: 'Big', parity: 'Odd' },
//       E: { number: 4, size: 'Small', parity: 'Even' },
//     },
//   });
//   const sections = ['A', 'B', 'C', 'D', 'E'];

//   useEffect(() => {
//     const fetchBetSums = async () => {
//       try {
//         const response = await apiCall(`/latest-5d-bet-sums?timer=${timer}`);
//         setBetSums(response);
//       } catch (error) {
//         console.error('Failed to fetch bet sums:', error);
//       }
//     };

//     fetchBetSums();
//   }, [timer]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('https://kwsdemo.fun/set-5d-result', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       console.log('Submit response:', data);

//       if (!response) {
//         throw new Error(data.message || 'Submission failed');
//       }

//       toast({
//         title: "Success",
//         description: "Submission successful",
//         variant: "success",
//         duration: 3000,
//       });
//     } catch (error) {
//       console.log(error);
//       toast({
//         title: "Error",
//         description: "An error occurred during submission",
//         variant: "destructive",
//         duration: 3000,
//       });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSectionChange = (section, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       sectionOutcome: {
//         ...prev.sectionOutcome,
//         [section]: {
//           ...prev.sectionOutcome[section],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   const renderBettingTable = (section) => {
//     if (!betSums) return null;
//     const sectionData = betSums.totalBetSums[section];

//     return (
//       <div key={section} className="mb-8 animate-fadeIn">
//         <h3 className="text-lg font-semibold mb-4 text-gray-700">Section {section}</h3>
//         <div className="flex space-x-4">
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-4">
//             <thead>
//               <tr className="bg-gray-100 border-b">
//                 <th className="py-2 px-4 text-left">Number</th>
//                 <th className="py-2 px-4 text-left">Bet Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(sectionData.numbers).map(([number, amount], index) => (
//                 <tr key={number} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-2 px-4 border-b">{number}</td>
//                   <td className="py-2 px-4 border-b">{amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-4">
//             <thead>
//               <tr className="bg-gray-100 border-b">
//                 <th className="py-2 px-4 text-left">Size</th>
//                 <th className="py-2 px-4 text-left">Bet Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(sectionData.size).map(([size, amount], index) => (
//                 <tr key={size} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-2 px-4 border-b">{size}</td>
//                   <td className="py-2 px-4 border-b">{amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105">
//             <thead>
//               <tr className="bg-gray-100 border-b">
//                 <th className="py-2 px-4 text-left">Parity</th>
//                 <th className="py-2 px-4 text-left">Bet Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(sectionData.parity).map(([parity, amount], index) => (
//                 <tr key={parity} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-2 px-4 border-b">{parity}</td>
//                   <td className="py-2 px-4 border-b">{amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-4">
//       <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
//         <CardContent className="p-6">
//           <Tabs defaultValue="monitor">
//             <TabsList className="flex space-x-4">
//               <TabsTrigger value="monitor" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">MONITOR BET DETAILS</TabsTrigger>
//               {/* <TabsTrigger value="history" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">VIEW PREVIOUS BET HISTORIES</TabsTrigger> */}
//             </TabsList>
//             <TabsContent value="monitor">
//               <div className="space-y-8">
//                 {sections.map((section) => renderBettingTable(section))}
//               </div>
//             </TabsContent>
//             <TabsContent value="history">
//               {/* Add bet history table here */}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//       <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
//         <FormControl fullWidth margin="normal">
//           <InputLabel id="timerName-label">Timer Name</InputLabel>
//           <Select
//             labelId="timerName-label"
//             id="timerName"
//             name="timerName"
//             value={formData.timerName}
//             onChange={handleChange}
//           >
//             <MenuItem value="1min">1min</MenuItem>
//             <MenuItem value="5min">5min</MenuItem>
//             <MenuItem value="10min">10min</MenuItem>
//           </Select>
//         </FormControl>
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="periodId"
//           label="Period ID"
//           name="periodId"
//           value={formData.periodId}
//           onChange={handleChange}
//         />
//         {['A', 'B', 'C', 'D', 'E'].map((section) => (
//           <Box key={section} sx={{ mb: 2 }}>
//             <h3>Section {section}</h3>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               label="Number"
//               type="number"
//               value={formData.sectionOutcome[section].number}
//               onChange={(e) => handleSectionChange(section, 'number', e.target.value)}
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel id={`${section}-size-label`}>Size</InputLabel>
//               <Select
//                 labelId={`${section}-size-label`}
//                 value={formData.sectionOutcome[section].size}
//                 onChange={(e) => handleSectionChange(section, 'size', e.target.value)}
//               >
//                 <MenuItem value="Small">Small</MenuItem>
//                 <MenuItem value="Big">Big</MenuItem>
//               </Select>
//             </FormControl>
//             <FormControl fullWidth margin="normal">
//               <InputLabel id={`${section}-parity-label`}>Parity</InputLabel>
//               <Select
//                 labelId={`${section}-parity-label`}
//                 value={formData.sectionOutcome[section].parity}
//                 onChange={(e) => handleSectionChange(section, 'parity', e.target.value)}
//               >
//                 <MenuItem value="Even">Even</MenuItem>
//                 <MenuItem value="Odd">Odd</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
//         ))}
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           color="primary"
//           sx={{ mt: 3, mb: 2 }}
//         >
//           Submit
//         </Button>
//       </Box>
//     </div>
//   );
// };

// export default FiveDDashboard;




// import { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
// } from "../../components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
// import { apiCall } from '../../utils/api'; // Assuming you have an apiCall function
// import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import { toast } from 'react-toastify';

// const FiveDDashboard = () => {
//   const [betSums, setBetSums] = useState(null);
//   const [timer, setTimer] = useState('1min');
//   const [formData, setFormData] = useState({
//     timerName: '1min',
//     periodId: '202502240380',
//     sectionOutcome: {
//       A: { number: 0, size: 'Small', parity: 'Even' },
//       B: { number: 1, size: 'Small', parity: 'Odd' },
//       C: { number: 2, size: 'Big', parity: 'Even' },
//       D: { number: 3, size: 'Big', parity: 'Odd' },
//       E: { number: 4, size: 'Small', parity: 'Even' },
//     },
//   });
//   const sections = ['A', 'B', 'C', 'D', 'E'];

//   useEffect(() => {
//     const fetchBetSums = async () => {
//       try {
//         const response = await apiCall(`/latest-5d-bet-sums?timer=${timer}`);
//         setBetSums(response);
//       } catch (error) {
//         console.error('Failed to fetch bet sums:', error);
//       }
//     };

//     fetchBetSums();
//   }, [timer]);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     const response = await fetch('https://kwsdemo.fun/set-5d-result', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         'Authorization': `Bearer ${token}`,
//   //       },
//   //       body: JSON.stringify(formData),
//   //     });

//   //     const data = await response.json();
//   //     console.log('Submit response:', data);

//   //     if (!response) {
//   //       throw new Error(data.message || 'Submission failed');
//   //     }

//   //     toast({
//   //       title: "Success",
//   //       description: "Submission successful",
//   //       variant: "success",
//   //       duration: 3000,
//   //     });
//   //   } catch (error) {
//   //     console.log(error);
//   //     toast({
//   //       title: "Error",
//   //       description: "An error occurred during submission",
//   //       variant: "destructive",
//   //       duration: 3000,
//   //     });
//   //   }
//   // };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await apiCall('/set-5d-result', {
//         method: 'POST',
//         body: JSON.stringify(formData),
//       });

//       console.log('Submit response:', response);

//       toast({
//         title: "Success",
//         description: "Submission successful",
//         variant: "success",
//         duration: 3000,
//       });
//     } catch (error) {
//       console.log(error);
//       toast({
//         title: "Error",
//         description: "An error occurred during submission",
//         variant: "destructive",
//         duration: 3000,
//       });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSectionChange = (section, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       sectionOutcome: {
//         ...prev.sectionOutcome,
//         [section]: {
//           ...prev.sectionOutcome[section],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   const renderBettingTable = (section) => {
//     if (!betSums) return null;
//     const sectionData = betSums.totalBetSums[section];

//     return (
//       <div key={section} className="mb-8 animate-fadeIn">
//         <h3 className="text-lg font-semibold mb-4 text-gray-700">Section {section}</h3>
//         <div className="flex space-x-4">
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-4">
//             <thead>
//               <tr className="bg-gray-100 border-b">
//                 <th className="py-2 px-4 text-left">Number</th>
//                 <th className="py-2 px-4 text-left">Bet Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(sectionData.numbers).map(([number, amount], index) => (
//                 <tr key={number} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-2 px-4 border-b">{number}</td>
//                   <td className="py-2 px-4 border-b">{amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-4">
//             <thead>
//               <tr className="bg-gray-100 border-b">
//                 <th className="py-2 px-4 text-left">Size</th>
//                 <th className="py-2 px-4 text-left">Bet Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(sectionData.size).map(([size, amount], index) => (
//                 <tr key={size} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-2 px-4 border-b">{size}</td>
//                   <td className="py-2 px-4 border-b">{amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105">
//             <thead>
//               <tr className="bg-gray-100 border-b">
//                 <th className="py-2 px-4 text-left">Parity</th>
//                 <th className="py-2 px-4 text-left">Bet Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(sectionData.parity).map(([parity, amount], index) => (
//                 <tr key={parity} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-2 px-4 border-b">{parity}</td>
//                   <td className="py-2 px-4 border-b">{amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-4">
//        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
//         <FormControl fullWidth margin="normal">
//           <InputLabel id="timerName-label">Timer Name</InputLabel>
//           <Select
//             labelId="timerName-label"
//             id="timerName"
//             name="timerName"
//             value={formData.timerName}
//             onChange={handleChange}
//           >
//             <MenuItem value="1min">1min</MenuItem>
//             <MenuItem value="5min">5min</MenuItem>
//             <MenuItem value="10min">10min</MenuItem>
//           </Select>
//         </FormControl>
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="periodId"
//           label="Period ID"
//           name="periodId"
//           value={formData.periodId}
//           onChange={handleChange}
//         />
//         {['A', 'B', 'C', 'D', 'E'].map((section) => (
//           <Box key={section} sx={{ mb: 2 }}>
//             <h3>Section {section}</h3>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               label="Number"
//               type="number"
//               value={formData.sectionOutcome[section].number}
//               onChange={(e) => handleSectionChange(section, 'number', e.target.value)}
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel id={`${section}-size-label`}>Size</InputLabel>
//               <Select
//                 labelId={`${section}-size-label`}
//                 value={formData.sectionOutcome[section].size}
//                 onChange={(e) => handleSectionChange(section, 'size', e.target.value)}
//               >
//                 <MenuItem value="Small">Small</MenuItem>
//                 <MenuItem value="Big">Big</MenuItem>
//               </Select>
//             </FormControl>
//             <FormControl fullWidth margin="normal">
//               <InputLabel id={`${section}-parity-label`}>Parity</InputLabel>
//               <Select
//                 labelId={`${section}-parity-label`}
//                 value={formData.sectionOutcome[section].parity}
//                 onChange={(e) => handleSectionChange(section, 'parity', e.target.value)}
//               >
//                 <MenuItem value="Even">Even</MenuItem>
//                 <MenuItem value="Odd">Odd</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
//         ))}
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           color="primary"
//           sx={{ mt: 3, mb: 2 }}
//         >
//           Submit
//         </Button>
//       </Box>
//       <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
//         <CardContent className="p-6">
//           <Tabs defaultValue="monitor">
//             <TabsList className="flex space-x-4">
//               <TabsTrigger value="monitor" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">MONITOR BET DETAILS</TabsTrigger>
//               {/* <TabsTrigger value="history" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">VIEW PREVIOUS BET HISTORIES</TabsTrigger> */}
//             </TabsList>
//             <TabsContent value="monitor">
//               <div className="space-y-8">
//                 {sections.map((section) => renderBettingTable(section))}
//               </div>
//             </TabsContent>
//             <TabsContent value="history">
//               {/* Add bet history table here */}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
     
//     </div>
//   );
// };

// export default FiveDDashboard;



// import { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
// } from "../../components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
// import { apiCall } from '../../utils/api'; // Assuming you have an apiCall function
// import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper } from '@mui/material';
// import { toast } from 'react-toastify';

// const FiveDDashboard = () => {
//   const [betSums, setBetSums] = useState(null);
//   const [timer, setTimer] = useState('1min');
//   const [formData, setFormData] = useState({
//     timerName: '1min',
//     periodId: '202502240380',
//     sectionOutcome: {
//       A: { number: 0, size: 'Small', parity: 'Even' },
//       B: { number: 1, size: 'Small', parity: 'Odd' },
//       C: { number: 2, size: 'Big', parity: 'Even' },
//       D: { number: 3, size: 'Big', parity: 'Odd' },
//       E: { number: 4, size: 'Small', parity: 'Even' },
//     },
//   });
//   const sections = ['A', 'B', 'C', 'D', 'E'];

//   useEffect(() => {
//     const fetchBetSums = async () => {
//       try {
//         const response = await apiCall(`/latest-5d-bet-sums?timer=${timer}`);
//         setBetSums(response);
//       } catch (error) {
//         console.error('Failed to fetch bet sums:', error);
//       }
//     };

//     fetchBetSums();
//   }, [timer]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await apiCall('/set-5d-result', {
//         method: 'POST',
//         body: JSON.stringify(formData),
//       });

//       console.log('Submit response:', response);

//       toast({
//         title: "Success",
//         description: "Submission successful",
//         variant: "success",
//         duration: 3000,
//       });
//     } catch (error) {
//       console.log(error);
//       toast({
//         title: "Error",
//         description: "An error occurred during submission",
//         variant: "destructive",
//         duration: 3000,
//       });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSectionChange = (section, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       sectionOutcome: {
//         ...prev.sectionOutcome,
//         [section]: {
//           ...prev.sectionOutcome[section],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   const renderSectionForm = (section) => (
//     <Paper key={section} elevation={3} sx={{ p: 2, mb: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Section {section}
//       </Typography>
//       <TextField
//         margin="normal"
//         required
//         fullWidth
//         label="Number"
//         type="number"
//         value={formData.sectionOutcome[section].number}
//         onChange={(e) => handleSectionChange(section, 'number', e.target.value)}
//       />
//       <FormControl fullWidth margin="normal">
//         <InputLabel id={`${section}-size-label`}>Size</InputLabel>
//         <Select
//           labelId={`${section}-size-label`}
//           value={formData.sectionOutcome[section].size}
//           onChange={(e) => handleSectionChange(section, 'size', e.target.value)}
//         >
//           <MenuItem value="Small">Small</MenuItem>
//           <MenuItem value="Big">Big</MenuItem>
//         </Select>
//       </FormControl>
//       <FormControl fullWidth margin="normal">
//         <InputLabel id={`${section}-parity-label`}>Parity</InputLabel>
//         <Select
//           labelId={`${section}-parity-label`}
//           value={formData.sectionOutcome[section].parity}
//           onChange={(e) => handleSectionChange(section, 'parity', e.target.value)}
//         >
//           <MenuItem value="Even">Even</MenuItem>
//           <MenuItem value="Odd">Odd</MenuItem>
//         </Select>
//       </FormControl>
//     </Paper>
//   );


//     const renderBettingTable = (section) => {
//     if (!betSums) return null;
//     const sectionData = betSums.totalBetSums[section];

//     return (
//       <div key={section} className="mb-8 animate-fadeIn">
//         <h3 className="text-lg font-semibold mb-4 text-gray-700">Section {section}</h3>
//         <div className="flex space-x-4">
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-4">
//             <thead>
//               <tr className="bg-gray-100 border-b">
//                 <th className="py-2 px-4 text-left">Number</th>
//                 <th className="py-2 px-4 text-left">Bet Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(sectionData.numbers).map(([number, amount], index) => (
//                 <tr key={number} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-2 px-4 border-b">{number}</td>
//                   <td className="py-2 px-4 border-b">{amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-4">
//             <thead>
//               <tr className="bg-gray-100 border-b">
//                 <th className="py-2 px-4 text-left">Size</th>
//                 <th className="py-2 px-4 text-left">Bet Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(sectionData.size).map(([size, amount], index) => (
//                 <tr key={size} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-2 px-4 border-b">{size}</td>
//                   <td className="py-2 px-4 border-b">{amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105">
//             <thead>
//               <tr className="bg-gray-100 border-b">
//                 <th className="py-2 px-4 text-left">Parity</th>
//                 <th className="py-2 px-4 text-left">Bet Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(sectionData.parity).map(([parity, amount], index) => (
//                 <tr key={parity} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-2 px-4 border-b">{parity}</td>
//                   <td className="py-2 px-4 border-b">{amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-4">
//       <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Set 5D Result
//         </Typography>
//         <FormControl fullWidth margin="normal">
//           <InputLabel id="timerName-label">Timer Name</InputLabel>
//           <Select
//             labelId="timerName-label"
//             id="timerName"
//             name="timerName"
//             value={formData.timerName}
//             onChange={handleChange}
//           >
//             <MenuItem value="1min">1min</MenuItem>
//             <MenuItem value="5min">5min</MenuItem>
//             <MenuItem value="10min">10min</MenuItem>
//           </Select>
//         </FormControl>
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="periodId"
//           label="Period ID"
//           name="periodId"
//           value={formData.periodId}
//           onChange={handleChange}
//         />
//         {sections.map((section) => renderSectionForm(section))}
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           color="primary"
//           sx={{ mt: 3, mb: 2 }}
//         >
//           Submit
//         </Button>
//       </Box>
//       <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
//         <CardContent className="p-6">
//           <Tabs defaultValue="monitor">
//             <TabsList className="flex space-x-4">
//               <TabsTrigger value="monitor" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">MONITOR BET DETAILS</TabsTrigger>
//               {/* <TabsTrigger value="history" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">VIEW PREVIOUS BET HISTORIES</TabsTrigger> */}
//             </TabsList>
//             <TabsContent value="monitor">
//               <div className="space-y-8">
//                 {sections.map((section) => renderBettingTable(section))}
//               </div>
//             </TabsContent>
//             <TabsContent value="history">
//               {/* Add bet history table here */}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FiveDDashboard;


/*eslint-disable*/
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { apiCall } from '../../utils/api'; // Assuming you have an apiCall function
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper, Grid } from '@mui/material';
import { toast } from 'react-toastify';

const FiveDDashboard = () => {
  const [betSums, setBetSums] = useState(null);
  const [timer, setTimer] = useState('1min');
  const [formData, setFormData] = useState({
    timerName: '1min',
    periodId: '202502240380',
    sectionOutcome: {
      A: { number: 0, size: 'Small', parity: 'Even' },
      B: { number: 1, size: 'Small', parity: 'Odd' },
      C: { number: 2, size: 'Big', parity: 'Even' },
      D: { number: 3, size: 'Big', parity: 'Odd' },
      E: { number: 4, size: 'Small', parity: 'Even' },
    },
  });
  const sections = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    const fetchBetSums = async () => {
      try {
        const response = await apiCall(`/latest-5d-bet-sums?timer=${timer}`);
        setBetSums(response);
      } catch (error) {
        console.error('Failed to fetch bet sums:', error);
      }
    };

    fetchBetSums();
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiCall('/set-5d-result', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      console.log('Submit response:', response);

      toast({
        title: "Success",
        description: "Submission successful",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred during submission",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSectionChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sectionOutcome: {
        ...prev.sectionOutcome,
        [section]: {
          ...prev.sectionOutcome[section],
          [field]: value,
        },
      },
    }));
  };

  const renderSectionForm = (section) => (
    <Grid item xs={12} md={6} key={section}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Section {section}
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Number"
          type="number"
          value={formData.sectionOutcome[section].number}
          onChange={(e) => handleSectionChange(section, 'number', e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id={`${section}-size-label`}>Size</InputLabel>
          <Select
            labelId={`${section}-size-label`}
            value={formData.sectionOutcome[section].size}
            onChange={(e) => handleSectionChange(section, 'size', e.target.value)}
          >
            <MenuItem value="Small">Small</MenuItem>
            <MenuItem value="Big">Big</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id={`${section}-parity-label`}>Parity</InputLabel>
          <Select
            labelId={`${section}-parity-label`}
            value={formData.sectionOutcome[section].parity}
            onChange={(e) => handleSectionChange(section, 'parity', e.target.value)}
          >
            <MenuItem value="Even">Even</MenuItem>
            <MenuItem value="Odd">Odd</MenuItem>
          </Select>
        </FormControl>
      </Paper>
    </Grid>
  );

//render Betting table  
const renderBettingTable = (section) => {
    if (!betSums) return null;
    const sectionData = betSums.totalBetSums[section];

    return (
      <div key={section} className="mb-8 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Section {section}</h3>
        <div className="flex space-x-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-4">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">Number</th>
                <th className="py-2 px-4 text-left">Bet Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sectionData.numbers).map(([number, amount], index) => (
                <tr key={number} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-4 border-b">{number}</td>
                  <td className="py-2 px-4 border-b">{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-4">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">Size</th>
                <th className="py-2 px-4 text-left">Bet Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sectionData.size).map(([size, amount], index) => (
                <tr key={size} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-4 border-b">{size}</td>
                  <td className="py-2 px-4 border-b">{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">Parity</th>
                <th className="py-2 px-4 text-left">Bet Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sectionData.parity).map(([parity, amount], index) => (
                <tr key={parity} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-4 border-b">{parity}</td>
                  <td className="py-2 px-4 border-b">{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Set 5D Result
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="timerName-label">Timer Name</InputLabel>
              <Select
                labelId="timerName-label"
                id="timerName"
                name="timerName"
                value={formData.timerName}
                onChange={handleChange}
              >
                <MenuItem value="1min">1min</MenuItem>
                <MenuItem value="5min">5min</MenuItem>
                <MenuItem value="10min">10min</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="periodId"
              label="Period ID"
              name="periodId"
              value={formData.periodId}
              onChange={handleChange}
            />
          </Grid>
          {sections.map((section) => renderSectionForm(section))}
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
      <Card className="bg-card shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <Tabs defaultValue="monitor">
            <TabsList className="flex space-x-4">
              <TabsTrigger value="monitor" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">MONITOR BET DETAILS</TabsTrigger>
              {/* <TabsTrigger value="history" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">VIEW PREVIOUS BET HISTORIES</TabsTrigger> */}
            </TabsList>
            <TabsContent value="monitor">
              <div className="space-y-8">
                {sections.map((section) => renderBettingTable(section))}
              </div>
            </TabsContent>
            <TabsContent value="history">
              {/* Add bet history table here */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FiveDDashboard;