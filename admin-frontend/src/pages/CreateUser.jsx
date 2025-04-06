import { useState } from 'react';
import {
  Card,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useToast } from "../components/ui/use-toast";
import { apiCall } from '@/utils/api';
import { useEffect } from 'react';

const CreateUser = () => {
  const [dummyUserForm, setDummyUserForm] = useState({
    mobile:'' ,
    password: '',
  });

  const [roleUserForm, setRoleUserForm] = useState({ mobile: 0, password: '', noidaOffice: '' });

  const { toast } = useToast();

  // Sample data for the users list
  // const dummyUsers = [
  //   {
  //     mobile: '987654321',
  //     username: 'MEMBER3906D0J',
  //     noidaOffice: 'Restricted',
  //   },
  //   {
  //     mobile: '805266501',
  //     username: 'MEMBER81423JW',
  //     noidaOffice: 'Restricted',
  //   },
  //   {
  //     mobile: '888770280',
  //     username: 'MEMBER156050A',
  //     noidaOffice: 'Restricted',
  //   },
  // ];

  const [dummyUsers, setDummyUsers] = useState([]);
  const [roleUsers, setRoleUsers] = useState([]);
  const userInfo=localStorage.getItem('userInfo');
  // console.log("OLLLLA")
  // console.log(typeof userInfo);
  const userInfoObject=JSON.parse(userInfo);
  const {noidaOffice}=userInfoObject
  console.log(noidaOffice);
  useEffect(() => {
    fetchDummyUsers();
    fetchRoleUsers();
  }, []);

  const fetchDummyUsers = async () => {
    try {
      const response = await apiCall('/dummyusers');
      if (response.success) {
        setDummyUsers(response.dummyUsers);
      } else {
        console.error('API Error:', response.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchRoleUsers = async () => {
    try {
      const response = await apiCall('/filteredusers');
      if (response.success) {
        setRoleUsers(response.filteredUsers);
      } else {
        console.error('API Error:', response.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  // const handleDummyUserSubmit = (e) => {
  //   e.preventDefault();
  //   toast({
  //     title: "Success",
  //     description: "Dummy user created successfully",
  //   });
  //   setDummyUserForm({ mobile: '', password: '' });
  // };

  const handleDummyUserSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mobile number
    if (!dummyUserForm.mobile || dummyUserForm.mobile.length < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid mobile number",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const response = await apiCall('/registerdummyuser', {
        method: 'POST',
        body: JSON.stringify(dummyUserForm),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Dummy user created successfully",
        });
        setDummyUserForm({ mobile: '', password: '' });
        // Refresh the users list
        await fetchDummyUsers();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create dummy user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      console.error('Error creating dummy user:', error);
    }
  };



  const handleRoleUserSubmit = async (e) => {
    console.log(roleUserForm)
    e.preventDefault();
    try {
      const response = await apiCall('/fuckyou', {
        method: 'POST',
        body: JSON.stringify(roleUserForm),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response) {
        toast({
          title: "Success",
          description: "Role-specific user created successfully",
        });
        setRoleUserForm({ mobile: '', password: '', noidaOffice: '' });
      } else {
        toast({
          title: "Error",
          description: "Failed to create role-specific user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role-specific user",
        variant: "destructive",
      });
      console.error('Error creating role-specific user:', error);
    }
  };


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">
        User Management Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Create Dummy User Card */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-xl text-blue-500 mb-6">Create Dummy User</h2>
            <form onSubmit={handleDummyUserSubmit} className="space-y-4">
              <Input
                type="number"
                placeholder="Mobile Number *"
                value={dummyUserForm.mobile}
                onChange={(e) => setDummyUserForm(prev => ({ ...prev, mobile: e.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Password *"
                value={dummyUserForm.password}
                onChange={(e) => setDummyUserForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <Button 
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Create Dummy User
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Create Role-Specific User Card */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-xl text-blue-500 mb-6">Create Role-Specific User</h2>
            <form onSubmit={handleRoleUserSubmit} className="space-y-4">
              <Input
                type="number"
                placeholder="Mobile Number *"
                value={roleUserForm.mobile}
                onChange={(e) => setRoleUserForm(prev => ({ ...prev, mobile: e.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Password *"
                value={roleUserForm.password}
                onChange={(e) => setRoleUserForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <Select
                value={roleUserForm.noidaOffice}
                onValueChange={(value) => setRoleUserForm(prev => ({ ...prev, noidaOffice: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Account Type *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin" >Admin</SelectItem>
                  <SelectItem value="FinanceHead" >Finance Head</SelectItem>
                  <SelectItem value="GameHead" >Game Head</SelectItem>
                  <SelectItem value="SettingsHead">Settings Head</SelectItem>
                  <SelectItem value="AdditionalHead" >Additional Head</SelectItem>
                  <SelectItem value="SupportHead" >Support Head Head</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Create Role-Specific User
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Users List Section */}
      <Card className="shadow-md mt-8">
        <CardContent className="p-6">
          <Tabs defaultValue="dummy" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="dummy">DUMMY USERS</TabsTrigger>
              <TabsTrigger value="role">ROLE-SPECIFIC USERS</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dummy">
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mobile Number</TableHead>
          <TableHead>Password</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dummyUsers.map((user, index) => (
          <TableRow key={index}>
            <TableCell>{user.mobile}</TableCell>
            <TableCell>{user.plainPassword}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</TabsContent>

            <TabsContent value="role">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mobile Number</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Account Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roleUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>{user.plainPassword}</TableCell>
                        <TableCell>{user.noidaOffice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
export default CreateUser; 