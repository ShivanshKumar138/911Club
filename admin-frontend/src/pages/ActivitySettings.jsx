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
// import { Pencil, Trash2 } from 'lucide-react';

// const ActivitySettings = () => {
//   const [formData, setFormData] = useState({
//     minimumBettingAmount: '',
//     activityAward: '',
//   });
//   const { toast } = useToast();

//   // Sample data
//   const activities = [
//     {
//       slNo: 1,
//       minimumBettingAmount: 300,
//       activityAward: 10,
//     },
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validate form
//     if (!formData.minimumBettingAmount || !formData.activityAward) {
//       toast({
//         title: "Error",
//         description: "Please fill in all fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Handle form submission
//     toast({
//       title: "Success",
//       description: "Activity reward settings created successfully",
//       variant: "success",
//     });

//     // Reset form
//     setFormData({
//       minimumBettingAmount: '',
//       activityAward: '',
//     });
//   };

//   const handleEdit = (slNo) => {
//     const activity = activities.find(a => a.slNo === slNo);
//     if (activity) {
//       setFormData({
//         minimumBettingAmount: activity.minimumBettingAmount.toString(),
//         activityAward: activity.activityAward.toString(),
//       });
//     }
//   };

//   const handleDelete = (slNo) => {
//     // Handle delete
//     toast({
//       title: "Success",
//       description: "Activity reward setting deleted successfully",
//       variant: "success",
//     });
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <Card className="bg-card border-border">
//         <CardContent>
//           <div className="text-foreground">
//             <h1 className="text-2xl font-semibold text-blue-600">
//               Manage Activity Reward Settings
//             </h1>

//             <Card className="border-none shadow-sm">
//               <CardContent className="p-6">
//                 <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
//                   <Input
//                     placeholder="Minimum Betting Amount"
//                     value={formData.minimumBettingAmount}
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       minimumBettingAmount: e.target.value
//                     }))}
//                     className="flex-1"
//                   />
//                   <Input
//                     placeholder="Activity Award"
//                     value={formData.activityAward}
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       activityAward: e.target.value
//                     }))}
//                     className="flex-1"
//                   />
//                   <Button 
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-600 text-white"
//                   >
//                     CREATE
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>

//             <Card className="border-none shadow-sm">
//               <CardContent className="p-0">
//                 <div className="overflow-x-auto hide-scrollbar">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-gray-50/50">
//                         <TableHead className="font-semibold">Sl. No.</TableHead>
//                         <TableHead className="font-semibold">Minimum Betting Amount</TableHead>
//                         <TableHead className="font-semibold">Activity Award</TableHead>
//                         <TableHead className="font-semibold text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {activities.map((activity) => (
//                         <TableRow key={activity.slNo} className="hover:bg-gray-50/50">
//                           <TableCell>{activity.slNo}</TableCell>
//                           <TableCell>{activity.minimumBettingAmount}</TableCell>
//                           <TableCell>{activity.activityAward}</TableCell>
//                           <TableCell>
//                             <div className="flex justify-end gap-2">
//                               <Button
//                                 onClick={() => handleEdit(activity.slNo)}
//                                 variant="ghost"
//                                 size="sm"
//                                 className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
//                               >
//                                 <Pencil className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 onClick={() => handleDelete(activity.slNo)}
//                                 variant="ghost"
//                                 size="sm"
//                                 className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//           <div className="text-muted-foreground">
//             {/* ... secondary content ... */}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ActivitySettings; 




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
// import { Pencil, Trash2 } from 'lucide-react';

// const ActivitySettings = () => {
//   const [formData, setFormData] = useState({
//     minimumBettingAmount: '',
//     activityAward: '',
//   });
//   const { toast } = useToast();

//   // Sample data
//   const activities = [
//     {
//       slNo: 1,
//       minimumBettingAmount: 300,
//       activityAward: 10,
//     },
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validate form
//     if (!formData.minimumBettingAmount || !formData.activityAward) {
//       toast({
//         title: "Error",
//         description: "Please fill in all fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Handle form submission
//     toast({
//       title: "Success",
//       description: "Activity reward settings created successfully",
//       variant: "success",
//     });

//     // Reset form
//     setFormData({
//       minimumBettingAmount: '',
//       activityAward: '',
//     });
//   };

//   const handleEdit = (slNo) => {
//     const activity = activities.find(a => a.slNo === slNo);
//     if (activity) {
//       setFormData({
//         minimumBettingAmount: activity.minimumBettingAmount.toString(),
//         activityAward: activity.activityAward.toString(),
//       });
//     }
//   };

//   const handleDelete = (slNo) => {
//     // Handle delete
//     toast({
//       title: "Success",
//       description: "Activity reward setting deleted successfully",
//       variant: "success",
//     });
//   };

//   return (
//     <div className="p-6 space-y-6 flex flex-col items-center">
//       <Card className="bg-card border-border w-full max-w-2xl">
//         <CardContent>
//           <h1 className="text-2xl font-semibold text-blue-600 text-center">
//             Manage Activity Reward Settings
//           </h1>

//           {/* Centered Form */}
//           <div className="flex justify-center">
//             <Card className="border-none shadow-sm w-full max-w-lg">
//               <CardContent className="p-6">
//                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                   <Input
//                     placeholder="Minimum Betting Amount"
//                     value={formData.minimumBettingAmount}
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       minimumBettingAmount: e.target.value
//                     }))}
//                     className="w-full"
//                   />
//                   <Input
//                     placeholder="Activity Award"
//                     value={formData.activityAward}
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       activityAward: e.target.value
//                     }))}
//                     className="w-full"
//                   />
//                   <Button 
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-600 text-white w-full"
//                   >
//                     CREATE
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Centered Table */}
//           <div className="mt-6 flex justify-center w-full">
//             <Card className="border-none shadow-sm w-full max-w-2xl">
//               <CardContent className="p-0">
//                 <div className="overflow-x-auto hide-scrollbar">
//                   <Table className="w-full">
//                     <TableHeader>
//                       <TableRow className="bg-gray-50/50">
//                         <TableHead className="font-semibold">Sl. No.</TableHead>
//                         <TableHead className="font-semibold">Minimum Betting Amount</TableHead>
//                         <TableHead className="font-semibold">Activity Award</TableHead>
//                         <TableHead className="font-semibold text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {activities.map((activity) => (
//                         <TableRow key={activity.slNo} className="hover:bg-gray-50/50">
//                           <TableCell>{activity.slNo}</TableCell>
//                           <TableCell>{activity.minimumBettingAmount}</TableCell>
//                           <TableCell>{activity.activityAward}</TableCell>
//                           <TableCell>
//                             <div className="flex justify-end gap-2">
//                               <Button
//                                 onClick={() => handleEdit(activity.slNo)}
//                                 variant="ghost"
//                                 size="sm"
//                                 className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
//                               >
//                                 <Pencil className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 onClick={() => handleDelete(activity.slNo)}
//                                 variant="ghost"
//                                 size="sm"
//                                 className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ActivitySettings;


/*eslint-disable*/
import { useState } from 'react';
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
import { Pencil, Trash2 } from 'lucide-react';

const ActivitySettings = () => {
  const [formData, setFormData] = useState({
    minimumBettingAmount: '',
    activityAward: '',
  });
  const { toast } = useToast();

  const activities = [
    {
      slNo: 1,
      minimumBettingAmount: 300,
      activityAward: 10,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.minimumBettingAmount || !formData.activityAward) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Activity reward settings created successfully",
      variant: "success",
    });

    setFormData({
      minimumBettingAmount: '',
      activityAward: '',
    });
  };

  const handleEdit = (slNo) => {
    const activity = activities.find(a => a.slNo === slNo);
    if (activity) {
      setFormData({
        minimumBettingAmount: activity.minimumBettingAmount.toString(),
        activityAward: activity.activityAward.toString(),
      });
    }
  };

  const handleDelete = (slNo) => {
    toast({
      title: "Success",
      description: "Activity reward setting deleted successfully",
      variant: "success",
    });
  };

  return (
    <div className="p-6 space-y-6 flex flex-col items-center mt-[-20px]">
      <Card className="bg-card border-border w-full max-w-2xl">
        <CardContent>
          <h1 className="text-2xl font-semibold text-blue-600 text-center mb-4">
            Manage Activity Reward Settings
          </h1>

          {/* Centered Form */}
          <div className="flex justify-center">
            <Card className="border-none shadow-sm w-full max-w-lg">
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    placeholder="Minimum Betting Amount"
                    value={formData.minimumBettingAmount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      minimumBettingAmount: e.target.value
                    }))}
                    className="w-full"
                  />
                  <Input
                    placeholder="Activity Award"
                    value={formData.activityAward}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      activityAward: e.target.value
                    }))}
                    className="w-full"
                  />
                  <Button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                  >
                    CREATE
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Centered Table */}
          <div className="mt-4 flex justify-center w-full">
            <Card className="border-none shadow-sm w-full max-w-2xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto hide-scrollbar">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="font-semibold">Sl. No.</TableHead>
                        <TableHead className="font-semibold">Minimum Betting Amount</TableHead>
                        <TableHead className="font-semibold">Activity Award</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity.slNo} className="hover:bg-gray-50/50">
                          <TableCell>{activity.slNo}</TableCell>
                          <TableCell>{activity.minimumBettingAmount}</TableCell>
                          <TableCell>{activity.activityAward}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                onClick={() => handleEdit(activity.slNo)}
                                variant="ghost"
                                size="sm"
                                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(activity.slNo)}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitySettings;
