/*eslint-disable*/
import  { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react"; // Importing icons
import { apiCall } from "@/utils/api";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Backdrop
  } from "@mui/material";
import { elements } from "chart.js";
const ActivityRewardSettings = () => {
//   const [bettingAmount, setBettingAmount] = useState("");
//   const [activityAward, setActivityAward] = useState("");
  const [rewards, setRewards] = useState([]);
  const [error,setError]=useState("");
  const [loading, setLoading] = useState(true);
  const [minimumBettingAmount,setMinimumBettingAmount]=useState("");
  const [activityAward,setActivityAward]=useState();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleOpen = (id) => {
    setSelectedId(id);  // Store the ID
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleCreate = async (e) =>{
    e.preventDefault();
   try {
    const response=await apiCall("/api/activity-reward-settings", {
        method: "POST",
        body: JSON.stringify({ minimumBettingAmount,activityAward }),
      });
    if(response){
        alert("Successfuly added!");
        window.location.reload();
    }
    else{
        alert("Error check console");
    }
   } catch (error) {
    console.log(error);
    console.log(error.message);
   }
  };
  const fetchRewards=async()=>{
    try {
            setLoading(true);
            const response = await apiCall("/api/activity-reward-settings", { method: "GET" });
            console.log(response);
            setRewards(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
  };
  useEffect(()=>{
    fetchRewards();
  }, []);

  const handleDelete = async (id) => {
    // setRewards(rewards.filter((reward) => reward.id !== id));
    try {
        const response=await apiCall("/api/activity-reward-settings/"+id,{method:"DELETE"});
        if(response)
        {
            alert("Deleted Successfuly");
            window.location.reload();
        }
        else{
            alert("Error check console");
        }
    } catch (error) {
        console.log(error);
        console.log(error.message);
    }
  };
  const handleUpdate = async (e, id) => {
    e.preventDefault(); // Prevent page reload

    try {
        const response = await apiCall(`/api/activity-reward-settings/${id}`, {
            method: "PUT",
            body: JSON.stringify({ minimumBettingAmount, activityAward }),
        });

        if (response) {
            alert("Updated Successfully!");
            handleClose(); // Close the modal
            fetchRewards(); // Refresh the data without reloading
        } else {
            alert("Error: Check console");
        }
    } catch (error) {
        console.error("Update Error:", error);
    }
};
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl text-blue-600 font-bold mb-4">
          Manage Activity Reward Settings
        </h2>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="Minimum Betting Amount"
            className="border p-2 rounded w-full"
            value={minimumBettingAmount}
            onChange={(e) => setMinimumBettingAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Activity Award"
            className="border p-2 rounded w-full"
            value={activityAward}
            onChange={(e) => setActivityAward(e.target.value)}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            CREATE
          </button>
        </div>

        <div className="overflow-hidden border rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">Sl. No.</th>
                <th className="p-3 text-left">Minimum Betting Amount</th>
                <th className="p-3 text-left">Activity Award</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward, index) => (
                <tr key={reward.id} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{reward.minimumBettingAmount}</td>
                  <td className="p-3">{reward.activityAward}</td>
                  <td className="p-3 flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => handleOpen(reward._id)}>

                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(reward._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Backdrop open={open} style={{ zIndex: 1 }} onClick={handleClose} />

{/* Dialog (Popup) */}
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Popup Form</DialogTitle>
  <DialogContent>
    <form onSubmit={(e)=>{handleUpdate(e,selectedId)}}>
    <input
            type="number"
            placeholder="Minimum Betting Amount"
            className="border p-2 rounded w-full"
            value={minimumBettingAmount}
            onChange={(e) => setMinimumBettingAmount(e.target.value)}
    />
    <input
        type="number"
        placeholder="Activity Award"
        className="border p-2 rounded w-full"
        value={activityAward}
        onChange={(e) => setActivityAward(e.target.value)}
    />
      
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </form>
  </DialogContent>
</Dialog>
      </div>
    </div>
  );
};

export default ActivityRewardSettings;

//Redundant code below 

// import  { useState, useEffect } from "react";
// import { Pencil, Trash } from "lucide-react";
// // import { apiCall } from "./api"; // Import API call function
// import { apiCall } from "@/utils/api";

// const ActivityRewardSettings = () => {
//   const [rewards, setRewards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchRewards();
//   }, []);

//   const fetchRewards = async () => {
//     try {
//       setLoading(true);
//       const response = await apiCall("/activity-reward-settings", { method: "GET" });
//       console.log(response);
//       setRewards(response.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
//         <h2 className="text-2xl text-blue-600 font-bold mb-4">
//           Manage Activity Reward Settings
//         </h2>

//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <div className="overflow-hidden border rounded-lg">
//             <table className="w-full border-collapse">
//               <thead className="bg-gray-200 text-gray-700">
//                 <tr>
//                   <th className="p-3 text-left">Sl. No.</th>
//                   <th className="p-3 text-left">Minimum Betting Amount</th>
//                   <th className="p-3 text-left">Activity Award</th>
//                   <th className="p-3 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rewards.map((reward, index) => (
//                   <tr key={reward._id} className="border-t">
//                     <td className="p-3">{index + 1}</td>
//                     <td className="p-3">{reward.minimumBettingAmount}</td>
//                     <td className="p-3">{reward.activityAward}</td>
//                     <td className="p-3 flex gap-2">
//                       <button className="text-blue-500 hover:text-blue-700">
//                         <Pencil size={18} />
//                       </button>
//                       <button className="text-red-500 hover:text-red-700">
//                         <Trash size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ActivityRewardSettings;


//explanation for future dev to work on

// Yes, in most cases, the event (`e`) is automatically passed to the event handler. However, when you use an **arrow function** inside the `onSubmit` attribute, you need to explicitly pass `e`.  

// ---

// ### **Why Do We Need to Pass `e` Explicitly?**
// When you write:
// ```jsx
// <form onSubmit={handleUpdate}>
// ```
// 👉 The event object (`e`) is automatically passed by React when the form is submitted. No need to pass it manually.

// But when you write:
// ```jsx
// <form onSubmit={(e) => handleUpdate(e, selectedId)}>
// ```
// 👉 Now, **you are using an arrow function**, which does **not** automatically pass `e`.  
// You must explicitly pass `e` as the first argument:  
// ```js
// (e) => handleUpdate(e, selectedId)
// ```

// ---

// ### **Final Fix (Best Practice)**
// #### ✅ **Option 1: Directly Pass the Function (No Need to Pass `e`)**
// ```jsx
// <form onSubmit={handleUpdate}>
// ```
// Modify the function:
// ```js
// const handleUpdate = async (e) => {
//     e.preventDefault(); // Prevent page reload
//     try {
//         const response = await apiCall(`/api/activity-reward-settings/${selectedId}`, {
//             method: "PUT",
//             body: JSON.stringify({ minimumBettingAmount, activityAward }),
//         });

//         if (response) {
//             alert("Updated Successfully!");
//             handleClose();
//             fetchRewards(); 
//         } else {
//             alert("Error: Check console");
//         }
//     } catch (error) {
//         console.error("Update Error:", error);
//     }
// };
// ```
// 👉 Here, `e` is automatically passed by React.

// ---

// #### ✅ **Option 2: Use an Arrow Function (Explicitly Pass `e`)**
// ```jsx
// <form onSubmit={(e) => handleUpdate(e, selectedId)}>
// ```
// Modify the function:
// ```js
// const handleUpdate = async (e, id) => {
//     e.preventDefault();
//     try {
//         const response = await apiCall(`/api/activity-reward-settings/${id}`, {
//             method: "PUT",
//             body: JSON.stringify({ minimumBettingAmount, activityAward }),
//         });

//         if (response) {
//             alert("Updated Successfully!");
//             handleClose();
//             fetchRewards(); 
//         } else {
//             alert("Error: Check console");
//         }
//     } catch (error) {
//         console.error("Update Error:", error);
//     }
// };
// ```
// 👉 Here, we explicitly pass `e` because we're using an arrow function inside `onSubmit`.

// ---

// ### **Conclusion**
// 🔹 If you pass `handleUpdate` **directly**, React automatically passes `e`.  
// 🔹 If you use an **arrow function**, you must explicitly pass `e`.  

// 🚀 **Best Approach?** ✅ **Use `onSubmit={handleUpdate}` and let React handle `e` automatically.**


// This will get the most out of it