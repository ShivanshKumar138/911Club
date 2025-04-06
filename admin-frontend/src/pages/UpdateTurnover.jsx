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
import { apiCall } from '../utils/api';

const UpdateTurnover = () => {
  const [searchUID, setSearchUID] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdjustments, setNewAdjustments] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiCall('/admin/users-remaining-bets');
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (userId) => {
    const newAdjustment = newAdjustments[userId];
    if (!newAdjustment) {
      toast({
        title: "Error",
        description: "Please enter an adjustment amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiCall('/admin/adjust-bet', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          adjustmentAmount: parseFloat(newAdjustment)
        })
      });

      if (response.success) {
        toast({
          title: "Success",
          description: `Turnover updated successfully`,
          variant: "success",
        });
        
        // Refresh data after update
        await fetchUsers();
        
        // Clear the adjustment input
        setNewAdjustments(prev => ({
          ...prev,
          [userId]: ''
        }));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update turnover",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setSearchUID('');
  };

  const filteredUsers = users.filter(user => 
    searchUID ? user.uid.includes(searchUID) : true
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-500">Update User Turnover</h1>

      {/* Search Section */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by UID"
          value={searchUID}
          onChange={(e) => setSearchUID(e.target.value)}
          className="max-w-xs"
        />
        <Button 
          variant="outline" 
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Total Deposit</TableHead>
                  <TableHead>Total Bet</TableHead>
                  <TableHead>Required Bet Amount</TableHead>
                  <TableHead>Current Manual Adjustment</TableHead>
                  <TableHead>New Adjustment</TableHead>
                  <TableHead className="bg-gray-100">Remaining Bet</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.uid}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.totalDeposit}</TableCell>
                    <TableCell>{user.totalBet}</TableCell>
                    <TableCell>{user.requiredBetAmount}</TableCell>
                    <TableCell>{user.manualBetAdjustment}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={newAdjustments[user.userId] || ''}
                        onChange={(e) => setNewAdjustments(prev => ({
                          ...prev,
                          [user.userId]: e.target.value
                        }))}
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      {user.remainingBetAmount}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleUpdate(user.userId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        UPDATE
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

export default UpdateTurnover; 