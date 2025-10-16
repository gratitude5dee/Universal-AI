import { useState } from "react";
import { StatCard } from "../shared/StatCard";
import { TrendingUp, DollarSign, Image, Users, Lightbulb, Download } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockAnalytics } from "@/data/bridge/mockAnalytics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedReports } from "./AdvancedReports";
import { motion } from "framer-motion";

export const DistributionAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <Tabs defaultValue="overview" className="w-full space-y-6">
      <TabsList className="grid grid-cols-2 w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
        <TabsTrigger value="overview" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
          📊 Overview
        </TabsTrigger>
        <TabsTrigger value="reports" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
          📋 Reports
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white text-shadow-sm">Distribution Analytics</h2>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={`$${(mockAnalytics.totalRevenue / 1000).toFixed(1)}K`}
            trend={mockAnalytics.growthRate}
            trendLabel="vs last month"
          />
          <StatCard
            icon={Image}
            label="Mints"
            value={mockAnalytics.totalMints.toLocaleString()}
            trend={12}
            trendLabel="vs last month"
            iconColor="bg-[#F97316]/20"
          />
          <StatCard
            icon={Users}
            label="Owners"
            value={mockAnalytics.uniqueOwners.toLocaleString()}
            trend={8}
            trendLabel="vs last month"
            iconColor="bg-[#0EA5E9]/20"
          />
          <StatCard
            icon={TrendingUp}
            label="Growth"
            value={`${mockAnalytics.growthRate}%`}
            trend={mockAnalytics.growthRate}
            trendLabel="MoM"
            iconColor="bg-[#10B981]/20"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Platform */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
            <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Revenue by Platform</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalytics.revenueByPlatform} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis type="category" dataKey="platform" stroke="rgba(255,255,255,0.5)" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="revenue" fill="#9b87f5" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Chain */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
            <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Revenue by Chain</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalytics.revenueByChain} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis type="category" dataKey="chain" stroke="rgba(255,255,255,0.5)" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="revenue" fill="#F97316" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Over Time */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
          <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Sales Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAnalytics.salesOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#9b87f5" strokeWidth={3} dot={{ fill: "#9b87f5", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top NFTs & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing NFTs */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-card-glow">
            <h3 className="text-lg font-semibold text-white text-shadow-sm mb-4">Top Performing NFTs</h3>
            <div className="space-y-3">
              {mockAnalytics.topNFTs.map((nft, idx) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white/50">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-white text-shadow-sm">{nft.name}</p>
                      <p className="text-sm text-white/60">{nft.sales} sales</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#9b87f5]">${nft.revenue.toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="backdrop-blur-md bg-gradient-to-br from-[#9b87f5]/20 to-[#7E69AB]/20 border border-[#9b87f5]/30 rounded-xl p-6 shadow-card-glow">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-[#9b87f5]" />
              <h3 className="text-lg font-semibold text-white text-shadow-sm">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {mockAnalytics.insights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/10"
                >
                  <span className="text-[#9b87f5] mt-0.5">•</span>
                  <p className="text-white/90 text-shadow-sm text-sm">{insight}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="border-[#9b87f5]/50 text-white hover:bg-[#9b87f5]/20">
                View Full Report
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reports" className="pt-6">
        <AdvancedReports />
      </TabsContent>
    </Tabs>
  );
};
