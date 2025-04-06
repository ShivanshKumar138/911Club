/*eslint-disable*/
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useToast } from "../../components/ui/use-toast";
import { motion } from 'framer-motion';
import { Dice1, Dice2, Dice3, Info } from 'lucide-react';
import { apiCall } from '../../utils/api'; // Import the apiCall function

const K3Dashboard = () => {
  const [periodId, setPeriodId] = useState('202502130490');
  const [timer, setTimer] = useState('1min');
  const [remainingTime, setRemainingTime] = useState('00:00');
  const [selectedDice, setSelectedDice] = useState({
    dice1: '',
    dice2: '',
    dice3: '',
  });
  const [totals, setTotals] = useState({
    totalSum: 0,
    twoSameOneDifferent: 0,
    threeSame: 0,
    threeDifferentNumbers: 0,
  });
  const [gameHistory, setGameHistory] = useState([]);
  const { toast } = useToast();

  const handleSetResult = () => {
    if (!selectedDice.dice1 || !selectedDice.dice2 || !selectedDice.dice3) {
      toast({
        title: "Error",
        description: "Please select all dice values",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Result set successfully",
      variant: "success",
    });
  };

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const data = await apiCall(`/latest-k3-bet-sums?timer=${timer}`);
        setPeriodId(data.periodId);
        setTotals(data.totals);
      } catch (error) {
        console.error("Failed to fetch totals:", error);
      }
    };

    const fetchGameHistory = async () => {
      try {
        const data = await apiCall(`/k3gameresult?selectedTimer=${timer}`);
        setGameHistory(data.results.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch game history:", error);
      }
    };

    fetchTotals();
    fetchGameHistory();

    const socket = new WebSocket("wss://api.747lottery.fun");
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.timers && data.timers[timer]) {
        setRemainingTime(data.timers[timer].remainingTime);
        setPeriodId(data.timers[timer].periodId);
      } else {
        console.error("Unexpected data structure", data);
      }
    };
    return () => socket.close();
  }, [timer]);

  const handleTimerChange = (value) => {
    setTimer(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-primary">K3 Games Dashboard</h1>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="1min" onValueChange={handleTimerChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Timer" />
            </SelectTrigger>
            <SelectContent>

              <SelectItem value="1min">1 min</SelectItem>
              <SelectItem value="3min">3 min</SelectItem>
              <SelectItem value="5min">5 min</SelectItem>
              <SelectItem value="10min">10 min</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-lg font-medium">{remainingTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-4">Current Period ID</h3>
            <p className="text-2xl font-bold text-primary">{periodId}</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-4">Total</h3>
            <div className="text-4xl font-bold">{totals.totalSum}</div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-4">2 Same</h3>
            <div className="text-4xl font-bold">{totals.twoSameOneDifferent}</div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-4">3 Same</h3>
            <div className="text-4xl font-bold">{totals.threeSame}</div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-4">3 Different</h3>
            <div className="text-4xl font-bold">{totals.threeDifferentNumbers}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Set Manual Result</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              value={selectedDice.dice1}
              onValueChange={(value) => setSelectedDice(prev => ({ ...prev, dice1: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dice 1" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDice.dice2}
              onValueChange={(value) => setSelectedDice(prev => ({ ...prev, dice2: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dice 2" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDice.dice3}
              onValueChange={(value) => setSelectedDice(prev => ({ ...prev, dice3: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dice 3" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground mr-4">Size: N/A</span>
              <span className="text-sm text-muted-foreground">Parity: N/A</span>
            </div>
            <Button
              onClick={handleSetResult}
              className="bg-primary hover:bg-primary/90"
            >
              SET RESULT
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted/80">
                <TableHead className="text-foreground font-semibold">Period ID</TableHead>
                <TableHead className="text-foreground font-semibold">Total Sum</TableHead>
                <TableHead className="text-foreground font-semibold">Size</TableHead>
                <TableHead className="text-foreground font-semibold">Odd/Even</TableHead>
                <TableHead className="text-foreground font-semibold">Dice Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gameHistory.map((game) => (
                <TableRow key={game.periodId} className="hover:bg-muted/80">
                  <TableCell>{game.periodId}</TableCell>
                  <TableCell>{game.totalSum}</TableCell>
                  <TableCell>{game.size}</TableCell>
                  <TableCell>{game.parity}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {game.diceOutcome.map((dice, index) => (
                        <div 
                          key={index}
                          className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-sm"
                        >
                          {dice}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default K3Dashboard;