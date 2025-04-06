import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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

const FirstDepositBonus = () => {
  const [formData, setFormData] = useState({
    minimumDeposit: '',
    bonus: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [depositBonuses, setDepositBonuses] = useState([]);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDepositBonuses();
  }, []);

  const fetchDepositBonuses = async () => {
    try {
      const response = await apiCall('/all-deposit-bonuses');
      console.log('API Response:', response); // Debugging line
      if (response) {
        console.log('Deposit Bonuses:', response); // Debugging line
        setDepositBonuses(response || []);
      } else {
        console.error('API Error:', response.message); // Debugging line
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleEdit = (bonus) => {
    setEditingId(bonus._id);
    setFormData({
      minimumDeposit: bonus.minimumDeposit,
      bonus: bonus.bonus,
    });
    setIsUpdateOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCall(`/admin/update-deposit-bonus`, {
        method: 'PUT',
        body: JSON.stringify({
          minimumDeposit: formData.minimumDeposit,
          bonus: formData.bonus,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response) {
        fetchDepositBonuses();
        setFormData({
          minimumDeposit: '',
          bonus: '',
        });
        setEditingId(null);
        setIsUpdateOpen(false);
        toast({
          title: "Success",
          description: "Deposit bonus updated successfully",
          variant: "success",
        });
      } else {
        console.error('API Error:', response.message); // Debugging line
        toast({
          title: "Error",
          description: response.message || "Failed to update deposit bonus",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update deposit bonus",
        variant: "destructive",
      });
    }
  };

  const handleAddBonus = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCall('/admin/update-deposit-bonus', {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response) {
        fetchDepositBonuses();
        setFormData({
          minimumDeposit: '',
          bonus: '',
        });
        toast({
          title: "Success",
          description: "Deposit bonus added successfully",
          variant: "success",
        });
      } else {
        console.error('API Error:', response.message); // Debugging line
        toast({
          title: "Error",
          description: response.message || "Failed to add deposit bonus",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add deposit bonus",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (minimumDeposit) => {
    try {
      const response = await apiCall('/deposit-bonus', {
        method: 'DELETE',
        body: JSON.stringify({
          minimumDeposit: minimumDeposit
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  console.log('API Response:', response); // Debugging line
      if (response) {
        // Fetch fresh data from server to ensure sync
        await fetchDepositBonuses();
        
        toast({
          title: "Success",
          description: "Deposit bonus deleted successfully",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete deposit bonus",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete deposit bonus",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-500">First Deposit Bonus</h1>

      {/* Add New Bonus Form */}
      <form onSubmit={handleAddBonus} className="space-y-4">
        <Input
          type="number"
          placeholder="Minimum Deposit"
          value={formData.minimumDeposit}
          onChange={(e) => setFormData({ ...formData, minimumDeposit: e.target.value })}
          min="10"
          required
        />
        <Input
          type="number"
          placeholder="Bonus"
          value={formData.bonus}
          onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
          required
        />
        <div className="flex gap-2">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
            >
              ADD BONUS
            </Button>
          </motion.div>
        </div>
      </form>

      <div className="overflow-x-auto" >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Minimum Deposit</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {depositBonuses.map((bonus) => (
    <TableRow key={bonus._id}>
      <TableCell>{bonus.minimumDeposit}</TableCell>
      <TableCell>{bonus.bonus}</TableCell>
      <TableCell>
        <div className="flex gap-2">
         
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(bonus.minimumDeposit)}
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))}
          </TableBody>
        </Table>
      </div>

      {/* Update Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Deposit Bonus</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              placeholder="Minimum Deposit"
              value={formData.minimumDeposit}
              onChange={(e) => setFormData({ ...formData, minimumDeposit: e.target.value })}
              min="10"
              max="50000"
              required
            />
            <Input
              type="number"
              placeholder="Bonus"
              value={formData.bonus}
              onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
              required
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FirstDepositBonus;