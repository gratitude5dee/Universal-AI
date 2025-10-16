import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Play, Search, Filter, Settings, BarChart3, FileText, CheckCircle2, XCircle } from "lucide-react";

export const EvalsFramework = () => {
  const evalSuites = [
    {
      title: "IT Ticket Categorization",
      tests: 156,
      passRate: 98.5,
      lastRun: "2h ago",
      agent: "Support Classifier",
      criteria: [
        'String match: "{{ output }}" == "{{ label }}"',
        "Confidence threshold: > 0.85"
      ],
      recentRuns: [
        { run: 145, passed: "154/156" },
        { run: 144, passed: "153/156" },
        { run: 143, passed: "156/156" }
      ]
    },
    {
      title: "Creative Asset Quality",
      tests: 89,
      passRate: 95.2,
      lastRun: "4h ago",
      agent: "Design Studio",
      criteria: [
        'Model grader: "Is design aesthetically pleasing?"',
        "Resolution check: >= 300 DPI",
        "Color space: CMYK valid"
      ],
      recentRuns: [
        { run: 78, passed: "85/89" },
        { run: 77, passed: "84/89" },
        { run: 76, passed: "87/89" }
      ]
    },
    {
      title: "Invoice Accuracy Check",
      tests: 234,
      passRate: 100,
      lastRun: "1d ago",
      agent: "Invoice Generator",
      criteria: [
        "Math validation: Total = Sum(line_items)",
        "Tax calculation: Correct for jurisdiction",
        "Date format: ISO 8601 compliant"
      ],
      recentRuns: [
        { run: 92, passed: "234/234" },
        { run: 91, passed: "234/234" },
        { run: 90, passed: "233/234" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <Button className="gap-2 bg-gradient-to-r from-studio-accent to-creative-primary hover:opacity-90">
          <Plus className="w-4 h-4" />
          Create New Eval
        </Button>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Test Data
        </Button>
        <Button variant="outline" className="gap-2">
          <Play className="w-4 h-4" />
          Run Suite
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 w-64" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Eval Suites */}
      <div className="space-y-4">
        {evalSuites.map((suite, idx) => (
          <Card key={idx} className="glassmorphism p-6 hover:shadow-card-glow transition-all">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">📋 {suite.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Tests: {suite.tests}</span>
                    <span>•</span>
                    <span className={suite.passRate >= 95 ? "text-success" : "text-amber-500"}>
                      Pass Rate: {suite.passRate}%
                    </span>
                    <span>•</span>
                    <span>Last Run: {suite.lastRun}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Agent: {suite.agent}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  suite.passRate >= 95 
                    ? "bg-success/10 text-success" 
                    : "bg-amber-500/10 text-amber-500"
                }`}>
                  {suite.passRate >= 95 ? "✓ Passing" : "⚠ Needs Attention"}
                </div>
              </div>

              {/* Criteria */}
              <div>
                <p className="text-sm font-medium mb-2">Testing Criteria:</p>
                <ul className="space-y-1">
                  {suite.criteria.map((criterion, cidx) => (
                    <li key={cidx} className="text-sm text-muted-foreground pl-4">
                      • {criterion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Activity */}
              <div>
                <p className="text-sm font-medium mb-2">Recent Activity:</p>
                <div className="space-y-1">
                  {suite.recentRuns.map((run, ridx) => (
                    <div key={ridx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <span>Run #{run.run}: {run.passed} passed</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                <Button size="sm" className="gap-1">
                  <Play className="w-3 h-3" />
                  Run Now
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <BarChart3 className="w-3 h-3" />
                  View Report
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <Settings className="w-3 h-3" />
                  Configure
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <FileText className="w-3 h-3" />
                  Logs
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State Hint */}
      <Card className="glassmorphism p-8 text-center">
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-studio-accent/10 flex items-center justify-center mx-auto">
            <Plus className="w-8 h-8 text-studio-accent" />
          </div>
          <h3 className="text-lg font-semibold">Create Your First Eval</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Get started by creating an evaluation suite to test and improve your AI agent outputs continuously
          </p>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Eval
          </Button>
        </div>
      </Card>
    </div>
  );
};
