// import React, { useState } from "react";
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";

// const data = [
//   { id: 266660, illegalCount: 2, progress: 2, games: "Wingo: 2, TRX: 0, K3: 0", lastUpdated: "14/02/2025, 16:19:40" },
//   { id: 438654, illegalCount: 1, progress: 1, games: "Wingo: 1", lastUpdated: "14/02/2025, 11:12:44" },
//   { id: 274572, illegalCount: 0, progress: 0, games: "Wingo: 0", lastUpdated: "12/02/2025, 02:40:41" },
//   { id: 911810, illegalCount: 0, progress: 0, games: "Wingo: 0", lastUpdated: "04/02/2025, 15:01:07" },
//   { id: 590651, illegalCount: 0, progress: 0, games: "Wingo: 0", lastUpdated: "04/02/2025, 20:28:45" },
// ];

// const ITEMS_PER_PAGE = 5;

// export default function IllegalBets() {
//   const [page, setPage] = useState(0);
//   const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

//   const handleNext = () => {
//     if (page < totalPages - 1) setPage(page + 1);
//   };

//   const handlePrev = () => {
//     if (page > 0) setPage(page - 1);
//   };

//   return (
//     <div className="p-4 w-full max-w-4xl mx-auto">
//       <TableContainer component={Paper} className="shadow-lg rounded-xl">
//         <Table>
//           <TableHead className="bg-gray-100">
//             <TableRow>
//               <TableCell><b>User ID</b></TableCell>
//               <TableCell><b>Total Illegal Count</b></TableCell>
//               {/* <TableCell><b>Progress (Max: 10)</b></TableCell> */}
//               <TableCell><b>Games</b></TableCell>
//               <TableCell><b>Last Updated</b></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE).map((row) => (
//               <TableRow key={row.id}>
//                 <TableCell>{row.id}</TableCell>
//                 <TableCell>{row.illegalCount}</TableCell>
//                 <TableCell>
//                   <Progress value={(row.progress / 10) * 100} className="w-40" />
//                   {row.progress}/10
//                 </TableCell>
//                 <TableCell>{row.games}</TableCell>
//                 <TableCell>{row.lastUpdated}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       <div className="flex justify-between items-center mt-4">
//         <Button onClick={handlePrev} disabled={page === 0} variant="outline">PREVIOUS</Button>
//         <span>Page {page + 1} of {totalPages}</span>
//         <Button onClick={handleNext} disabled={page === totalPages - 1} variant="outline">NEXT</Button>
//       </div>
//     </div>
//   );
// }
// import { useState, useEffect } from 'react';
// import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';
// // import { apiCall } from '../../utils/api'; // Assuming you have an apiCall function
// import { apiCall } from '@/utils/api';
// const ITEMS_PER_PAGE = 10;

// const IllegalBets = () => {
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await apiCall('/illegal-bets');
//         console.log(response);
//         setData(response);
//         setTotalPages(Math.ceil(response.length / ITEMS_PER_PAGE));
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleNext = () => {
//     if (page < totalPages - 1) setPage(page + 1);
//   };

//   const handlePrev = () => {
//     if (page > 0) setPage(page - 1);
//   };

//   return (
//     <div className="p-4 w-full max-w-4xl mx-auto">
//       <TableContainer component={Paper} className="shadow-lg rounded-xl">
//         <Table>
//           <TableHead className="bg-gray-100">
//             <TableRow>
//               <TableCell><b>UID</b></TableCell>
//               <TableCell><b>Mobile</b></TableCell>
//               <TableCell><b>Total Illegal Count</b></TableCell>
//               <TableCell><b>Games</b></TableCell>
//               <TableCell><b>Last Updated</b></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE).map((row) => (
//               <TableRow key={row.userId}>
//                 <TableCell>{row.userId}</TableCell>
//                 <TableCell>{row.mobile}</TableCell>
//                 <TableCell>{row.totalIllegalCount}</TableCell>
//                 <TableCell>
//                   {Object.keys(row.games).map((game) => (
//                     <div key={game}>
//                       <b>{game}</b>: {row.games[game].totalIllegalCount}
//                     </div>
//                   ))}
//                 </TableCell>
//                 <TableCell>{new Date(row.lastUpdated).toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       <div className="flex justify-between items-center mt-4">
//         <Button onClick={handlePrev} disabled={page === 0} variant="outlined">PREVIOUS</Button>
//         <span>Page {page + 1} of {totalPages}</span>
//         <Button onClick={handleNext} disabled={page === totalPages - 1} variant="outlined">NEXT</Button>
//       </div>
//     </div>
//   );
// };

// export default IllegalBets;


import { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { apiCall } from '@/utils/api';

const ITEMS_PER_PAGE = 10;

const IllegalBets = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiCall('/illegal-bets');
        console.log(response);
        setData(response);
        setFilteredData(response);
        setTotalPages(Math.ceil(response.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on search term
    const results = data.filter(item => 
      item.userId.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
    setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
    setPage(0); // Reset to first page when search changes
  }, [searchTerm, data]);

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by User ID"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <TableContainer component={Paper} className="shadow-lg rounded-xl">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell><b>UID</b></TableCell>
              <TableCell><b>Mobile</b></TableCell>
              <TableCell><b>Total Illegal Count</b></TableCell>
              <TableCell><b>Games</b></TableCell>
              <TableCell><b>Last Updated</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData
                .slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
                .map((row) => (
                  <TableRow key={row.userId}>
                    <TableCell>{row.userId}</TableCell>
                    <TableCell>{row.mobile}</TableCell>
                    <TableCell>{row.totalIllegalCount}</TableCell>
                    <TableCell>
                      {Object.keys(row.games).map((game) => (
                        <div key={game}>
                          <b>{game}</b>: {row.games[game].totalIllegalCount}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{new Date(row.lastUpdated).toLocaleString()}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePrev} disabled={page === 0} variant="outlined">PREVIOUS</Button>
        <span>Page {page + 1} of {totalPages || 1}</span>
        <Button onClick={handleNext} disabled={page === totalPages - 1 || totalPages === 0} variant="outlined">NEXT</Button>
      </div>
    </div>
  );
};

export default IllegalBets;