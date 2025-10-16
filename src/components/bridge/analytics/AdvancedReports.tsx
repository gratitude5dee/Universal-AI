import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Mail, Calendar, Share2, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAnalytics } from "@/data/bridge/mockAnalytics";
import { mockNFTs } from "@/data/bridge/mockNFTs";

export const AdvancedReports = () => {
  const [reportType, setReportType] = useState("revenue");
  const [timeRange, setTimeRange] = useState("30d");

  const reports = {
    revenue: {
      title: "Revenue Report",
      summary: {
        total: "$45,247",
        growth: "+23%",
        platforms: 6,
        avgPerNFT: "$24.50"
      },
      breakdown: [
        { label: "Primary Sales", value: "$38,450", percentage: 85 },
        { label: "Royalties", value: "$6,797", percentage: 15 }
      ]
    },
    collectors: {
      title: "Collector Analysis",
      summary: {
        total: "1,256",
        new: "+89",
        returning: "67%",
        avgPurchase: "$36.02"
      },
      breakdown: [
        { label: "First-time Buyers", value: "423", percentage: 34 },
        { label: "Repeat Collectors", value: "833", percentage: 66 }
      ]
    },
    performance: {
      title: "Performance Metrics",
      summary: {
        views: "45,892",
        conversionRate: "2.7%",
        avgTimeToSale: "4.2 days",
        successRate: "98.5%"
      },
      breakdown: [
        { label: "Successful Listings", value: "1,847", percentage: 98.5 },
        { label: "Failed Listings", value: "28", percentage: 1.5 }
      ]
    }
  };

  const currentReport = reports[reportType as keyof typeof reports];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white text-shadow-sm">Advanced Reports</h3>
          <p className="text-white/70 text-shadow-sm text-sm">Export and analyze your distribution data</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Report Type Selection */}
      <Tabs value={reportType} onValueChange={setReportType} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-card-glow">
          <TabsTrigger value="revenue" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="collectors" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
            Collectors
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value={reportType} className="pt-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(currentReport.summary).map(([key, value]) => (
              <Card key={key} className="backdrop-blur-md bg-white/10 border border-white/20 p-4">
                <p className="text-sm text-white/60 text-shadow-sm capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-2xl font-bold text-white text-shadow-sm">{value}</p>
              </Card>
            ))}
          </div>

          {/* Detailed Breakdown */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
            <h4 className="font-semibold text-white text-shadow-sm mb-4">Breakdown</h4>
            <div className="space-y-3">
              {currentReport.breakdown.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">{item.label}</span>
                    <span className="text-white font-medium">{item.value} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Export Options */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-card-glow">
            <h4 className="font-semibold text-white text-shadow-sm mb-4">Export Options</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Email Report
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Report
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
