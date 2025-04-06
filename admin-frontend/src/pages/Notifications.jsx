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
// import { Trash2 } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Textarea } from "../components/ui/textarea";

// const Notifications = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     message: '',
//   });
//   const { toast } = useToast();

//   // Sample notifications data
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       serialNo: 1,
//       title: 'JOIN TELEGRAM',
//       message: 'MORE DEPOSIT MORE WIN 🎁',
//       type: 'Global',
//       date: '06/02/2025, 20:22:47',
//     },
//   ]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!formData.title || !formData.message) {
//       toast({
//         title: "Error",
//         description: "Please fill in all fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Add new notification
//     const newNotification = {
//       id: notifications.length + 1,
//       serialNo: notifications.length + 1,
//       title: formData.title,
//       message: formData.message,
//       type: 'Global',
//       date: new Date().toLocaleString(),
//     };

//     setNotifications(prev => [newNotification, ...prev]);
    
//     toast({
//       title: "Success",
//       description: "Notification created successfully",
//       variant: "success",
//     });

//     // Reset form
//     setFormData({
//       title: '',
//       message: '',
//     });
//   };

//   const handleDelete = (id) => {
//     setNotifications(prev => prev.filter(notification => notification.id !== id));
//     toast({
//       title: "Success",
//       description: "Notification deleted successfully",
//       variant: "success",
//     });
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <h1 className="text-2xl font-semibold text-primary mb-6">Create Notification</h1>

//         <Card className="bg-card border-border">
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <Input
//                   placeholder="Title *"
//                   value={formData.title}
//                   onChange={(e) => setFormData(prev => ({
//                     ...prev,
//                     title: e.target.value
//                   }))}
//                   className="flex-1 bg-background text-foreground"
//                   required
//                 />
//                 <Button 
//                   type="submit"
//                   className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
//                 >
//                   SUBMIT
//                 </Button>
//               </div>
//               <Textarea
//                 placeholder="Message *"
//                 value={formData.message}
//                 onChange={(e) => setFormData(prev => ({
//                   ...prev,
//                   message: e.target.value
//                 }))}
//                 className="bg-background text-foreground min-h-[100px]"
//                 required
//               />
//             </form>
//           </CardContent>
//         </Card>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//       >
//         <h2 className="text-2xl font-semibold text-primary mb-6">View Notifications</h2>
        
//         <Card className="bg-card border-border">
//           <CardContent className="p-0">
//             <div className="overflow-x-auto hide-scrollbar">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-muted hover:bg-muted/80">
//                     <TableHead className="text-foreground font-semibold">Serial No.</TableHead>
//                     <TableHead className="text-foreground font-semibold">Title</TableHead>
//                     <TableHead className="text-foreground font-semibold">Message</TableHead>
//                     <TableHead className="text-foreground font-semibold">Type</TableHead>
//                     <TableHead className="text-foreground font-semibold">Date</TableHead>
//                     <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <AnimatePresence mode="popLayout">
//                     {notifications.map((notification) => (
//                       <motion.tr
//                         key={notification.id}
//                         layout
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         className="hover:bg-muted/80"
//                       >
//                         <TableCell>{notification.serialNo}</TableCell>
//                         <TableCell>{notification.title}</TableCell>
//                         <TableCell>{notification.message}</TableCell>
//                         <TableCell>{notification.type}</TableCell>
//                         <TableCell>{notification.date}</TableCell>
//                         <TableCell>
//                           <div className="flex justify-end">
//                             <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                               <Button
//                                 onClick={() => handleDelete(notification.id)}
//                                 variant="ghost"
//                                 size="sm"
//                                 className="text-destructive hover:text-destructive/90 hover:bg-muted/80"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </motion.div>
//                           </div>
//                         </TableCell>
//                       </motion.tr>
//                     ))}
//                   </AnimatePresence>
//                   {notifications.length === 0 && (
//                     <motion.tr
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.2 }}
//                     >
//                       <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
//                         No notifications found
//                       </TableCell>
//                     </motion.tr>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };

// export default Notifications; 


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
// import { Trash2 } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Textarea } from "../components/ui/textarea";
// import { apiCall } from '../utils/api';

// const Notifications = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     message: '',
//   });
//   const { toast } = useToast();

//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await apiCall('/notifications', {
//           method: 'GET',
//         });
//         if (response.success) {
//           setNotifications(response.notifications);
//         } else {
//           console.error('Failed to fetch notifications:', response.message);
//         }
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!formData.title || !formData.message) {
//       toast({
//         title: "Error",
//         description: "Please fill in all fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Add new notification
//     const newNotification = {
//       id: notifications.length + 1,
//       serialNo: notifications.length + 1,
//       title: formData.title,
//       message: formData.message,
//       type: 'Global',
//       date: new Date().toLocaleString(),
//     };

//     setNotifications(prev => [newNotification, ...prev]);
    
//     toast({
//       title: "Success",
//       description: "Notification created successfully",
//       variant: "success",
//     });

//     // Reset form
//     setFormData({
//       title: '',
//       message: '',
//     });
//   };

//   const handleDelete = (id) => {
//     setNotifications(prev => prev.filter(notification => notification.id !== id));
//     toast({
//       title: "Success",
//       description: "Notification deleted successfully",
//       variant: "success",
//     });
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <h1 className="text-2xl font-semibold text-primary mb-6">Create Notification</h1>

//         <Card className="bg-card border-border">
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <Input
//                   placeholder="Title *"
//                   value={formData.title}
//                   onChange={(e) => setFormData(prev => ({
//                     ...prev,
//                     title: e.target.value
//                   }))}
//                   className="flex-1 bg-background text-foreground"
//                   required
//                 />
//                 <Button 
//                   type="submit"
//                   className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
//                 >
//                   SUBMIT
//                 </Button>
//               </div>
//               <Textarea
//                 placeholder="Message *"
//                 value={formData.message}
//                 onChange={(e) => setFormData(prev => ({
//                   ...prev,
//                   message: e.target.value
//                 }))}
//                 className="bg-background text-foreground min-h-[100px]"
//                 required
//               />
//             </form>
//           </CardContent>
//         </Card>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//       >
//         <h2 className="text-2xl font-semibold text-primary mb-6">View Notifications</h2>
        
//         <Card className="bg-card border-border">
//           <CardContent className="p-0">
//             <div className="overflow-x-auto hide-scrollbar">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-muted hover:bg-muted/80">
//                     <TableHead className="text-foreground font-semibold">Serial No.</TableHead>
//                     <TableHead className="text-foreground font-semibold">Title</TableHead>
//                     <TableHead className="text-foreground font-semibold">Message</TableHead>
//                     <TableHead className="text-foreground font-semibold">Type</TableHead>
//                     <TableHead className="text-foreground font-semibold">Date</TableHead>
//                     <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <AnimatePresence mode="popLayout">
//                     {notifications.map((notification,index) => (
//                       <motion.tr
//                         key={notification._id}
//                         layout
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         className="hover:bg-muted/80"
//                       >
//                         <TableCell>{index+1}</TableCell>
//                         <TableCell>{notification.title}</TableCell>
//                         <TableCell>{notification.message}</TableCell>
//                         <TableCell>{notification.type}</TableCell>
//                         <TableCell>{new Date(notification.date).toLocaleString()}</TableCell>
//                         <TableCell>
//                           <div className="flex justify-end">
//                             <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//                               <Button
//                                 onClick={() => handleDelete(notification._id)}
//                                 variant="ghost"
//                                 size="sm"
//                                 className="text-destructive hover:text-destructive/90 hover:bg-muted/80"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </motion.div>
//                           </div>
//                         </TableCell>
//                       </motion.tr>
//                     ))}
//                   </AnimatePresence>
//                   {notifications.length === 0 && (
//                     <motion.tr
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.2 }}
//                     >
//                       <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
//                         No notifications found
//                       </TableCell>
//                     </motion.tr>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };

// export default Notifications;



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
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from "../components/ui/textarea";
import { apiCall } from '../utils/api';

const Notifications = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });
  const { toast } = useToast();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiCall('/notifications', {
          method: 'GET',
        });
        if (response.success) {
          setNotifications(response.notifications);
        } else {
          console.error('Failed to fetch notifications:', response.message);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiCall('/createNotification', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          message: formData.message,
        }),
      });
        
        toast({
          title: "Success",
          description: "Notification created successfully",
          variant: "success",
        });

        // Reset form
        setFormData({
          title: '',
          message: '',
        });

        window.location.reload();
      }
     catch (error) {
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive",
      });
      console.error('Error creating notification:', error);
    }
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(notification => notification._id !== id));
    toast({
      title: "Success",
      description: "Notification deleted successfully",
      variant: "success",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold text-primary mb-6">Create Notification</h1>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  className="flex-1 bg-background text-foreground"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                >
                  SUBMIT
                </Button>
              </div>
              <Textarea
                placeholder="Message *"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  message: e.target.value
                }))}
                className="bg-background text-foreground min-h-[100px]"
                required
              />
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-primary mb-6">View Notifications</h2>
        
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto hide-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted/80">
                    <TableHead className="text-foreground font-semibold">Serial No.</TableHead>
                    <TableHead className="text-foreground font-semibold">Title</TableHead>
                    <TableHead className="text-foreground font-semibold">Message</TableHead>
                    <TableHead className="text-foreground font-semibold">Type</TableHead>
                    <TableHead className="text-foreground font-semibold">Date</TableHead>
                    <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {notifications.map((notification, index) => (
                      <motion.tr
                        key={notification._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="hover:bg-muted/80"
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{notification.title}</TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell>{notification.type}</TableCell>
                        <TableCell>{new Date(notification.date).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                onClick={() => handleDelete(notification._id)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive/90 hover:bg-muted/80"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {notifications.length === 0 && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No notifications found
                      </TableCell>
                    </motion.tr>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Notifications;