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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Plus } from 'lucide-react';
import { apiCall } from '../utils/api';

const VIPLevels = () => {
  const [vipLevels, setVipLevels] = useState([]);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formLevels, setFormLevels] = useState([]);
  const [newLevel, setNewLevel] = useState({
    minAmount: '',
    oneTimeBonus: '',
    awarded: '',
    monthlyBonus: '',
    rebatePercentage: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVipLevels();
  }, []);

  const fetchVipLevels = async () => {
    try {
      const response = await apiCall('/vip-levels');
      if (response.data) {
        setVipLevels(response.data || []);
      } else {
        console.error('API Error:', response.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch VIP levels",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (level) => {
    setFormLevels([{
      _id: level._id,
      minAmount: level.minAmount,
      oneTimeBonus: level.oneTimeBonus,
      awarded: level.awarded,
      monthlyBonus: level.monthlyBonus,
      rebatePercentage: level.rebatePercentage
    }]);
    setIsUpdateOpen(true);
  };

  const handleFormChange = (index, field, value) => {
    const newFormLevels = [...formLevels];
    newFormLevels[index][field] = value;
    setFormLevels(newFormLevels);
  };

  const handleNewLevelChange = (field, value) => {
    setNewLevel(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedLevels = vipLevels.map(level => {
        const modifiedLevel = formLevels.find(formLevel => formLevel._id === level._id);
        return modifiedLevel || level;
      });

      const response = await apiCall('/update-unlock-commission', {
        method: 'PUT',
        body: JSON.stringify({
          levels: updatedLevels.map((level) => ({
            _id: level._id,
            minAmount: level.minAmount,
            oneTimeBonus: level.oneTimeBonus,
            awarded: level.awarded,
            monthlyBonus: level.monthlyBonus,
            rebatePercentage: level.rebatePercentage,
          })),
        }),
      });

      if (response) {
        fetchVipLevels();
        setIsUpdateOpen(false);
        toast({
          title: "Success",
          description: "VIP levels updated successfully",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update VIP levels",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to update VIP levels",
        variant: "destructive",
      });
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const allLevels = [...vipLevels, newLevel];
      
      const response = await apiCall('/update-unlock-commission', {
        method: 'PUT',
        body: JSON.stringify({
          levels: allLevels.map((level) => ({
            _id: level._id,
            minAmount: level.minAmount,
            oneTimeBonus: level.oneTimeBonus,
            awarded: level.awarded,
            monthlyBonus: level.monthlyBonus,
            rebatePercentage: level.rebatePercentage,
          })),
        }),
      });

      if (response) {
        fetchVipLevels();
        setIsAddOpen(false);
        setNewLevel({
          minAmount: '',
          oneTimeBonus: '',
          awarded: '',
          monthlyBonus: '',
          rebatePercentage: ''
        });
        toast({
          title: "Success",
          description: "New VIP level added successfully",
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Add error:', error);
      toast({
        title: "Error",
        description: "Failed to add VIP level",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-500">VIP Levels</h1>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Min Amount</TableHead>
                  <TableHead>One Time Bonus</TableHead>
                  <TableHead>Awarded</TableHead>
                  <TableHead>Monthly Bonus</TableHead>
                  <TableHead>Rebate Percentage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vipLevels.map((level) => (
                  <TableRow key={level._id}>
                    <TableCell>{level.minAmount}</TableCell>
                    <TableCell>{level.oneTimeBonus}</TableCell>
                    <TableCell>{level.awarded}</TableCell>
                    <TableCell>{level.monthlyBonus}</TableCell>
                    <TableCell>{level.rebatePercentage}%</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(level)} className="mr-2">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update VIP Level</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formLevels.map((level, index) => (
              <div key={index} className="space-y-4">
                <Input
                  type="number"
                  placeholder="Min Amount"
                  value={level.minAmount}
                  onChange={(e) => handleFormChange(index, 'minAmount', e.target.value)}
                  required
                  className="p-2 border rounded-md"
                />
                <Input
                  type="number"
                  placeholder="One Time Bonus"
                  value={level.oneTimeBonus}
                  onChange={(e) => handleFormChange(index, 'oneTimeBonus', e.target.value)}
                  required
                  className="p-2 border rounded-md"
                />
                <Input
                  placeholder="Awarded"
                  value={level.awarded}
                  onChange={(e) => handleFormChange(index, 'awarded', e.target.value)}
                  required
                  className="p-2 border rounded-md"
                />
                <Input
                  type="number"
                  placeholder="Monthly Bonus"
                  value={level.monthlyBonus}
                  onChange={(e) => handleFormChange(index, 'monthlyBonus', e.target.value)}
                  required
                  className="p-2 border rounded-md"
                />
                <Input
                  type="number"
                  placeholder="Rebate Percentage"
                  value={level.rebatePercentage}
                  onChange={(e) => handleFormChange(index, 'rebatePercentage', e.target.value)}
                  required
                  className="p-2 border rounded-md"
                />
              </div>
            ))}
            <div className="flex justify-end gap-3">
             
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New VIP Level</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Min Amount"
                value={newLevel.minAmount}
                onChange={(e) => handleNewLevelChange('minAmount', e.target.value)}
                required
                className="p-2 border rounded-md"
              />
              <Input
                type="number"
                placeholder="One Time Bonus"
                value={newLevel.oneTimeBonus}
                onChange={(e) => handleNewLevelChange('oneTimeBonus', e.target.value)}
                required
                className="p-2 border rounded-md"
              />
              <Input
                placeholder="Awarded"
                value={newLevel.awarded}
                onChange={(e) => handleNewLevelChange('awarded', e.target.value)}
                required
                className="p-2 border rounded-md"
              />
              <Input
                type="number"
                placeholder="Monthly Bonus"
                value={newLevel.monthlyBonus}
                onChange={(e) => handleNewLevelChange('monthlyBonus', e.target.value)}
                required
                className="p-2 border rounded-md"
              />
              <Input
                type="number"
                placeholder="Rebate Percentage"
                value={newLevel.rebatePercentage}
                onChange={(e) => handleNewLevelChange('rebatePercentage', e.target.value)}
                required
                className="p-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end gap-3">
             
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Add Level
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button 
          onClick={() => setIsAddOpen(true)} 
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New VIP Level
        </Button>
      </div>
    </div>
  );
};

export default VIPLevels;