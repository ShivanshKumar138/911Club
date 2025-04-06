// import  { useState } from "react";
// import { Box, Tab, Tabs, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
// import { Card, CardContent } from "@/components/ui/card";

// const depositsData = [
//   { id: 1, utr: "5013762600330736", uid: "274572", amount: 200, date: "2025-01-31 12:53:43", status: "completed" },
//   { id: 2, utr: "8282(33(38", uid: "274572", amount: 930, date: "2025-01-31 12:54:03", status: "completed" },
//   { id: 3, utr: "8302174523083108", uid: "960747", amount: 500, date: "2025-01-31 12:59:16", status: "completed" },
//   { id: 4, utr: "6028060805063176", uid: "960747", amount: 20000, date: "2025-01-31 12:59:39", status: "completed" },
//   { id: 5, utr: "7906677910603674", uid: "590651", amount: 500, date: "2025-02-03 11:07:13", status: "completed" },
//   { id: 6, utr: "5269766615235754", uid: "911810", amount: 200, date: "2025-02-04 09:01:42", status: "completed" },
//   { id: 7, utr: "8727896332288994", uid: "911810", amount: 200, date: "2025-02-04 09:06:07", status: "completed" },
//   { id: 8, utr: "8282727272", uid: "911810", amount: 930, date: "2025-02-04 09:06:22", status: "completed" },
//   { id: 9, utr: "183476330817702", uid: "590651", amount: 200, date: "2025-02-04 09:27:24", status: "completed" },
// ];

// const RechargeStatus = () => {
//   const [tab, setTab] = useState(0);
//   const [search, setSearch] = useState("");

//   const handleTabChange = (event, newValue) => {
//     setTab(newValue);
//   };

//   const filteredData = depositsData.filter((deposit) =>
//     deposit.uid.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//       <Card className="w-[80%] shadow-lg rounded-lg">
//         <CardContent>
//           <h2 className="text-2xl font-semibold text-blue-600 mb-4">Recharge Status</h2>
//           <Tabs value={tab} onChange={handleTabChange}>
//             <Tab label="Completed Deposits" />
//             <Tab label="Rejected Deposits" />
//           </Tabs>

//           <TextField
//             fullWidth
//             label="Search by UID"
//             variant="outlined"
//             sx={{ my: 2 }}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell><b>Sl No</b></TableCell>
//                   <TableCell><b>UTR</b></TableCell>
//                   <TableCell><b>UID</b></TableCell>
//                   <TableCell><b>Amount</b></TableCell>
//                   <TableCell><b>Date</b></TableCell>
//                   <TableCell><b>Status</b></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredData.map((row, index) => (
//                   <TableRow key={row.id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{row.utr}</TableCell>
//                     <TableCell>{row.uid}</TableCell>
//                     <TableCell>{row.amount}</TableCell>
//                     <TableCell>{row.date}</TableCell>
//                     <TableCell className="text-green-600 font-semibold">{row.status}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default RechargeStatus;




import  { useState, useEffect } from "react";
import { Box, Tab, Tabs, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
// import { apiCall } from "./api"; // Import your API request function
import { apiCall } from "@/utils/api";

const RechargeStatus = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await apiCall("/admin/deposit/history", { method: "GET" }); // Use apiCall
        setDeposits(response);
      } catch (error) {
        console.error("Error fetching deposits:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  const filteredData = deposits.filter((deposit) =>
    deposit.uid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Card className="w-[80%] shadow-lg rounded-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Recharge Status</h2>
          <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
            <Tab label="Completed Deposits" />
            <Tab label="Rejected Deposits" />
          </Tabs>

          <TextField
            fullWidth
            label="Search by UID"
            variant="outlined"
            sx={{ my: 2 }}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <div className="flex justify-center py-4">
              <CircularProgress />
            </div>
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Sl No</b></TableCell>
                    <TableCell><b>UTR</b></TableCell>
                    <TableCell><b>UID</b></TableCell>
                    <TableCell><b>Amount</b></TableCell>
                    <TableCell><b>Date</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell><b>Method</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row, index) => (
                    <TableRow key={row._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.depositId}</TableCell>
                      <TableCell>{row.uid}</TableCell>
                      <TableCell>{row.depositAmount}</TableCell>
                      <TableCell>{row.depositDate}</TableCell>
                      <TableCell className="text-green-600 font-semibold">{row.depositStatus}</TableCell>
                      <TableCell>{row.depositMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RechargeStatus;

