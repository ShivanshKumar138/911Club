// // import  { useEffect, useState } from "react";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // // import { apiCall } from "@/utils/apiCall";
// // import { apiCall } from "@/utils/api";

// // const WithdrawalHistory = () => {
// //   const [withdrawals, setWithdrawals] = useState([]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await apiCall("/all-withdraw-history-admin_only", { method: "GET" });
// //         if (response.success) {
// //             console.log("Inside");
// //             console.log(response);
// //           setWithdrawals(response.userWithdrawals);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching withdrawal history:", error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const handleAction = async (id, status) => {
// //     try {
// //       const response = await apiCall("/update-withdraw-status-admin_only", {
// //         method: "POST",
// //         body: JSON.stringify({ withdrawId: id, status }),
// //       });

// //       if (response.success) {
// //         setWithdrawals((prev) =>
// //           prev.map((withdrawal) =>
// //             withdrawal._id === id ? { ...withdrawal, status } : withdrawal
// //           )
// //         );
// //       }
// //     } catch (error) {
// //       console.error(`Error updating status to ${status}:`, error);
// //     }
// //   };

// //   return (
// //     <Card className="p-4">
// //       <CardContent>
// //         <h2 className="text-xl font-semibold mb-4">Withdrawal History</h2>
// //         <Table>
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead>User</TableHead>
// //               <TableHead>Account No</TableHead>
// //               <TableHead>IFSC</TableHead>
// //               <TableHead>Amount</TableHead>
// //               <TableHead>Method</TableHead>
// //               <TableHead>Status</TableHead>
// //               <TableHead>Action</TableHead>
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {withdrawals.map((withdrawal) => {
// //               const bank = withdrawal.userId.bankDetails[0] || {}; // Ensure bank details exist

// //               return (
// //                 <TableRow key={withdrawal._id}>
// //                   <TableCell>{bank.name || "N/A"}</TableCell>
// //                   <TableCell>{bank.accountNo || "N/A"}</TableCell>
// //                   <TableCell>{bank.ifscCode || "N/A"}</TableCell>
// //                   <TableCell>₹{withdrawal.balance}</TableCell>
// //                   <TableCell>{withdrawal.withdrawMethod}</TableCell>
// //                   <TableCell>
// //                     <Badge
// //                       variant={
// //                         withdrawal.status === "Completed"
// //                           ? "success"
// //                           : withdrawal.status === "Rejected"
// //                           ? "destructive"
// //                           : "warning"
// //                       }
// //                     >
// //                       {withdrawal.status}
// //                     </Badge>
// //                   </TableCell>
// //                   <TableCell>
// //                     {withdrawal.status === "Pending" && (
// //                       <div className="flex gap-2">
// //                         <Button size="sm" variant="success" onClick={() => handleAction(withdrawal._id, "Completed")}>
// //                           Approve
// //                         </Button>
// //                         <Button size="sm" variant="destructive" onClick={() => handleAction(withdrawal._id, "Rejected")}>
// //                           Reject
// //                         </Button>
// //                       </div>
// //                     )}
// //                   </TableCell>
// //                 </TableRow>
// //               );
// //             })}
// //           </TableBody>
// //         </Table>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default WithdrawalHistory;

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// // import { apiCall } from "@/utils/apiCall";
// import { apiCall } from "@/utils/api";

// const WithdrawalHistory = () => {
//   const [withdrawals, setWithdrawals] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await apiCall("/all-withdraw-history-admin_only", { method: "GET" });
//         if (response.success) {
//           console.log("Inside");
//           console.log("User Resp:",response);
//           // Filter withdrawals to only include those with status "Completed"
//           const completedWithdrawals = response.userWithdrawals.filter(
//             withdrawal => withdrawal.status === "Completed"
//           );
//           setWithdrawals(completedWithdrawals);
//         }
//       } catch (error) {
//         console.error("Error fetching withdrawal history:", error);
//       }
//     };

//     fetchData();
//   }, []);
//   console.log(withdrawals)
//   return (
//     <Card className="p-4">
//       <CardContent>
//         <h2 className="text-xl font-semibold mb-4">Completed Withdrawals</h2>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>User</TableHead>
//               <TableHead>Account No</TableHead>
//               <TableHead>IFSC</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Method</TableHead>
//               <TableHead>Status</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {withdrawals.map((withdrawal) => {
//               const bank = withdrawal.userId.bankDetails[0] || {}; // Ensure bank details exist

//               return (
//                 <TableRow key={withdrawal._id}>
//                   <TableCell>{bank.name || "N/A"}</TableCell>
//                   <TableCell>{bank.accountNo || "N/A"}</TableCell>
//                   <TableCell>{bank.ifscCode || "N/A"}</TableCell>
//                   <TableCell>₹{withdrawal.balance}</TableCell>
//                   <TableCell>{withdrawal.withdrawMethod}</TableCell>
//                   <TableCell>
//                     <Badge variant="success">
//                       {withdrawal.status}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// export default WithdrawalHistory;

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// import { apiCall } from "@/utils/apiCall";
import { apiCall } from "@/utils/api";

const WithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiCall("/all-withdraw-history-admin_only", {
          method: "GET",
        });
        if (response.success) {
          console.log("Inside");
          console.log("User Resp:", response);
          // Filter withdrawals to only include those with status "Completed"
          const completedWithdrawals = response.userWithdrawals.filter(
            (withdrawal) => withdrawal.status === "Completed"
          );
          setWithdrawals(completedWithdrawals);
        }
      } catch (error) {
        console.error("Error fetching withdrawal history:", error);
      }
    };

    fetchData();
  }, []);
  console.log(withdrawals);
  return (
    <Card className="p-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Completed Withdrawals</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UID</TableHead>
              <TableHead>Order Number</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Account No</TableHead>
              <TableHead>IFSC</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.map((withdrawal) => {
              const bank = withdrawal.userId.bankDetails[0] || {}; // Ensure bank details exist

              return (
                <TableRow key={withdrawal._id}>
                  <TableCell>{withdrawal.uid || "N/A"}</TableCell>
                  <TableCell>
                    {withdrawal.orderNumber || withdrawal._id}
                  </TableCell>
                  <TableCell>{bank.name || "N/A"}</TableCell>
                  <TableCell>{bank.accountNo || "N/A"}</TableCell>
                  <TableCell>{bank.ifscCode || "N/A"}</TableCell>
                  <TableCell>₹{withdrawal.balance}</TableCell>
                  <TableCell>{withdrawal.withdrawMethod}</TableCell>
                  <TableCell>
                    <Badge variant="success">{withdrawal.status}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WithdrawalHistory;
