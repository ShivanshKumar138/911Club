import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
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
import { apiCall } from "../utils/api";
import { ClipboardCopy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";

const CreateGiftCode = () => {
  const [formData, setFormData] = useState({
    code: "",
    bonusAmount: "",
    redemptionLimit: "",
    amount: "", // Minimum spend
    validity: "", // Validity date
    couponType: "regular",
  });

  const [bulkData, setBulkData] = useState({
    bonusAmount: "",
    count: "",
    amount: "", // Minimum spend
    validity: "", // Validity date
    couponType: "regular",
  });

  const [giftCodes, setGiftCodes] = useState([]);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [isBulkCreating, setIsBulkCreating] = useState(false);
  const [bulkCreatedCodes, setBulkCreatedCodes] = useState([]);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [activeTab, setActiveTab] = useState("all");

  // Get tomorrow's date in YYYY-MM-DD format for default validity
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchGiftCodes();
  }, [activeTab]);

  const fetchGiftCodes = async () => {
    try {
      let endpoint = "/coupons-list";
      if (activeTab === "firstDeposit") {
        endpoint = "/first-deposit-coupons";
      }

      const response = await apiCall(endpoint);
      if (response) {
        setGiftCodes((response || []).reverse());
        console.log("Gift codes:", response);
      } else {
        console.error("API Error:", response.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch gift codes",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        formData.couponType === "firstDeposit"
          ? "/create-first-deposit-coupon"
          : "/create-coupon";

      const response = await apiCall(endpoint, {
        method: "POST",
        body: JSON.stringify({
          code: formData.code,
          bonusAmount: formData.bonusAmount,
          redemptionLimit: formData.redemptionLimit,
          amount: formData.amount, // Minimum spend
          validity: new Date(formData.validity), // Validity date
        }),
      });

      if (typeof response === "string") {
        fetchGiftCodes();
        setFormData({
          code: "",
          bonusAmount: "",
          redemptionLimit: "",
          amount: "",
          validity: "",
          couponType: "regular",
        });
        toast({
          title: "Success",
          description: response,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create coupon",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create coupon",
        variant: "destructive",
      });
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setIsBulkCreating(true);
    setBulkProgress(0);
    setBulkCreatedCodes([]);
    const { bonusAmount, count, couponType, amount, validity } = bulkData;
    const endpoint =
      couponType === "firstDeposit"
        ? "/create-first-deposit-coupon"
        : "/create-coupon";

    const createdCodes = [];
    for (let i = 0; i < count; i++) {
      try {
        const response = await apiCall(endpoint, {
          method: "POST",
          body: JSON.stringify({
            code: `CODE${Date.now()}${i}`,
            bonusAmount,
            redemptionLimit: 1,
            amount, // Minimum spend
            validity: new Date(validity), // Validity date
          }),
        });

        if (typeof response === "string") {
          createdCodes.push(`CODE${Date.now()}${i}`);
          setBulkProgress((prev) => prev + 1);
          fetchGiftCodes();
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to create coupon",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to create coupon",
          variant: "destructive",
        });
      }
    }
    setBulkCreatedCodes(createdCodes);
    setIsBulkCreating(false);
    setBulkData({
      bonusAmount: "",
      count: "",
      amount: "",
      validity: "",
      couponType: "regular",
    });
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to check if a coupon is expired
  const isExpired = (validityDate) => {
    return new Date(validityDate) < new Date();
  };

  // Function to copy code to clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast({
          title: "Copied!",
          description: `Code "${code}" copied to clipboard.`,
          variant: "default",
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Failed to copy code.",
          variant: "destructive",
        });
      });
  };

  // Function to copy all bulk created codes to clipboard
  const copyAllBulkCodes = () => {
    const allCodes = bulkCreatedCodes.join("\n");
    navigator.clipboard
      .writeText(allCodes)
      .then(() => {
        toast({
          title: "Copied!",
          description: "All bulk created codes copied to clipboard.",
          variant: "default",
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Failed to copy codes.",
          variant: "destructive",
        });
      });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = giftCodes.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(giftCodes.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-500">Create Gift Code</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
            className="p-2 border rounded-md"
          />
          <Input
            type="number"
            placeholder="Bonus Amount"
            value={formData.bonusAmount}
            onChange={(e) =>
              setFormData({ ...formData, bonusAmount: e.target.value })
            }
            required
            className="p-2 border rounded-md"
          />
          <Input
            type="number"
            placeholder="Redemption Limit"
            value={formData.redemptionLimit}
            onChange={(e) =>
              setFormData({ ...formData, redemptionLimit: e.target.value })
            }
            required
            className="p-2 border rounded-md"
          />
          <Input
            type="number"
            placeholder="Minimum Amount Required (₹)"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="p-2 border rounded-md"
          />
          <Input
            type="date"
            placeholder="Valid Until"
            value={formData.validity}
            onChange={(e) =>
              setFormData({ ...formData, validity: e.target.value })
            }
            min={getTomorrowDate()}
            className="p-2 border rounded-md"
          />
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="couponType">Coupon Type</label>
            <Select
              value={formData.couponType}
              onValueChange={(value) =>
                setFormData({ ...formData, couponType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select coupon type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular Coupon</SelectItem>
                <SelectItem value="firstDeposit">
                  First Deposit Coupon
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 mt-4">
          Create Coupon
        </Button>
      </form>

      <form
        onSubmit={handleBulkSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold text-blue-500">
          Create Bulk Gift Codes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            placeholder="Bonus Amount"
            value={bulkData.bonusAmount}
            onChange={(e) =>
              setBulkData({ ...bulkData, bonusAmount: e.target.value })
            }
            required
            className="p-2 border rounded-md"
          />
          <Input
            type="number"
            placeholder="Number of Codes"
            value={bulkData.count}
            onChange={(e) =>
              setBulkData({ ...bulkData, count: e.target.value })
            }
            required
            className="p-2 border rounded-md"
          />
          <Input
            type="number"
            placeholder="Minimum Amount Required (₹)"
            value={bulkData.amount}
            onChange={(e) =>
              setBulkData({ ...bulkData, amount: e.target.value })
            }
            required
            className="p-2 border rounded-md"
          />
          <Input
            type="date"
            placeholder="Valid Until"
            value={bulkData.validity}
            onChange={(e) =>
              setBulkData({ ...bulkData, validity: e.target.value })
            }
            required
            min={getTomorrowDate()}
            className="p-2 border rounded-md"
          />
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="bulkCouponType">Coupon Type</label>
            <Select
              value={bulkData.couponType}
              onValueChange={(value) =>
                setBulkData({ ...bulkData, couponType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select coupon type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular Coupon</SelectItem>
                <SelectItem value="firstDeposit">
                  First Deposit Coupon
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 mt-4"
          disabled={isBulkCreating}
        >
          {isBulkCreating
            ? `Creating... (${bulkProgress}/${bulkData.count})`
            : "Create Bulk Coupons"}
        </Button>
      </form>

      {bulkCreatedCodes.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-500">
            Bulk Creation Complete
          </h2>
          <Button
            onClick={copyAllBulkCodes}
            className="bg-primary hover:bg-primary/90 mt-4"
          >
            Copy All Bulk Codes
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Coupons</TabsTrigger>
              <TabsTrigger value="firstDeposit">
                First Deposit Coupons
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Bonus Amount</TableHead>
                      <TableHead>Min. Required</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Redemption Limit</TableHead>
                      <TableHead>Redemption Count</TableHead>
                      <TableHead>Coupon Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Redeemed By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRecords.map((code) => (
                      <TableRow key={code._id}>
                        <TableCell style={{ color: "red", fontWeight: "bold" }}>
                          {code.code}
                        </TableCell>
                        <TableCell
                          style={{ color: "orange", fontWeight: "bold" }}
                        >
                          ₹{code.bonusAmount}
                        </TableCell>
                        <TableCell>₹{code.amount}</TableCell>
                        <TableCell>{formatDate(code.validity)}</TableCell>
                        <TableCell>{code.redemptionLimit}</TableCell>
                        <TableCell>{code.redemptionCount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              code.couponType === "firstDeposit"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {code.couponType === "firstDeposit"
                              ? "First Deposit"
                              : "Regular"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              isExpired(code.validity)
                                ? "destructive"
                                : "success"
                            }
                          >
                            {isExpired(code.validity) ? "Expired" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {code.redeemedBy.map((user) => user.uid).join(", ")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(code.code)}
                            className="flex items-center gap-1"
                          >
                            <ClipboardCopy size={16} />
                            Copy
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="firstDeposit">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Bonus Amount</TableHead>
                      <TableHead>Min. Required</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Redemption Limit</TableHead>
                      <TableHead>Redemption Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Redeemed By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRecords.map((code) => (
                      <TableRow key={code._id}>
                        <TableCell style={{ color: "red", fontWeight: "bold" }}>
                          {code.code}
                        </TableCell>
                        <TableCell
                          style={{ color: "orange", fontWeight: "bold" }}
                        >
                          ₹{code.bonusAmount}
                        </TableCell>
                        <TableCell>₹{code.amount}</TableCell>
                        <TableCell>{formatDate(code.validity)}</TableCell>
                        <TableCell>{code.redemptionLimit}</TableCell>
                        <TableCell>{code.redemptionCount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              isExpired(code.validity)
                                ? "destructive"
                                : "success"
                            }
                          >
                            {isExpired(code.validity) ? "Expired" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {code.redeemedBy.map((user) => user.uid).join(", ")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(code.code)}
                            className="flex items-center gap-1"
                          >
                            <ClipboardCopy size={16} />
                            Copy
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-4">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-primary hover:bg-primary/90"
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-primary hover:bg-primary/90"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGiftCode;
