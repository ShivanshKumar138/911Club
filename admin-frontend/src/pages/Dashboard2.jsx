import { useState } from 'react';
import {
  Card,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { cn } from "../lib/utils";

const Dashboard2 = () => {
  // Sample data for the chart
  const data = [
    { date: '08/11', value: 25000 },
    { date: '09/11', value: 15000 },
    { date: '10/11', value: 35000 },
    { date: '11/11', value: 30000 },
    { date: '12/11', value: 15000 },
    { date: '13/11', value: 45000 },
    { date: '14/11', value: 40000 },
    { date: '15/11', value: 30000 },
    { date: '16/11', value: 25000 },
    { date: '17/11', value: 20000 },
  ];

  const portfolioStats = {
    myBalance: 42069.00,
    investment: 20619.00,
    totalGain: 8664.00,
    totalLoss: 1212.00,
    myPortfolio: 8089.00,
    balanceChange: '+24%',
    investmentChange: '+28%',
    gainChange: '+22%',
    lossChange: '-20%',
  };

  const stockInfo = {
    name: 'Origin Game Inc.',
    ticker: 'OREA',
    currentValue: 28089.00,
    valueChange: '+26%',
    prevClose: 17112.00,
    marketCap: '28 M USD',
    peRatio: '14.28%',
    shareHolder: 50,
    holderType: 'Promoter',
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Friday, 4 Nov 2022
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
            Withdraw
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Deposit +
          </Button>
        </div>
      </div>

      {/* Overall Portfolio */}
      <Card className="bg-card border-border mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-xl font-semibold">Overall Portfolio</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                My Balance
                <span className="text-success">{portfolioStats.balanceChange}</span>
              </div>
              <div className="text-3xl font-bold">${portfolioStats.myBalance.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                Investment
                <span className="text-success">{portfolioStats.investmentChange}</span>
              </div>
              <div className="text-3xl font-bold">${portfolioStats.investment.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                Total Gain
                <span className="text-success">{portfolioStats.gainChange}</span>
              </div>
              <div className="text-3xl font-bold">${portfolioStats.totalGain.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                Total Loss
                <span className="text-destructive">{portfolioStats.lossChange}</span>
              </div>
              <div className="text-3xl font-bold">${portfolioStats.totalLoss.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary"></div>
                    <div>
                      <h3 className="font-semibold">{stockInfo.name}</h3>
                      <div className="text-sm text-muted-foreground">{stockInfo.ticker}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${stockInfo.currentValue.toLocaleString()}</span>
                    <span className="text-success">{stockInfo.valueChange}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">1D</Button>
                  <Button variant="outline" size="sm">1W</Button>
                  <Button variant="outline" size="sm" className="bg-primary/20 text-primary border-primary">1M</Button>
                  <Button variant="outline" size="sm">1Y</Button>
                  <Button variant="outline" size="sm">MAX</Button>
                </div>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <XAxis 
                      dataKey="date" 
                      stroke="currentColor" 
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      stroke="currentColor"
                      className="text-muted-foreground"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                      }}
                      itemStyle={{
                        color: 'hsl(var(--foreground))',
                      }}
                      labelStyle={{
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-semibold">Share Holder</h3>
              <div className="text-3xl font-bold">{stockInfo.shareHolder}%</div>
            </div>

            {/* Circular Progress */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary"
                  strokeWidth="10"
                  strokeDasharray={`${stockInfo.shareHolder * 2.51} 251`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                {stockInfo.holderType}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Prev Close</span>
                <span>${stockInfo.prevClose.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Market Cap</span>
                <span>{stockInfo.marketCap}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">P/E Ratio</span>
                <span>{stockInfo.peRatio}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Buy Stock
              </Button>
              <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
                Sell Stock
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard2; 