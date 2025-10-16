import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { tradingStrategies } from '@/data/on-chain/tradingStrategies';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentConfig {
  strategy: string;
  name: string;
  capital: number;
  stopLoss: number;
  takeProfit: number;
  maxDrawdown: number;
}

export const AgentDeployWizard = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<AgentConfig>({
    strategy: '',
    name: '',
    capital: 1000,
    stopLoss: 5,
    takeProfit: 10,
    maxDrawdown: 15,
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'border-green-400 hover:bg-green-400/10';
      case 'medium': return 'border-yellow-400 hover:bg-yellow-400/10';
      case 'high': return 'border-red-400 hover:bg-red-400/10';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {step} of 5
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Strategy Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Select Trading Strategy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {tradingStrategies.map((strategy) => (
                <Card
                  key={strategy.id}
                  className={`glass-card p-5 cursor-pointer transition-all ${
                    config.strategy === strategy.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-accent/5'
                  } ${getRiskColor(strategy.risk)}`}
                  onClick={() => setConfig({ ...config, strategy: strategy.id })}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{strategy.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{strategy.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">{strategy.risk.toUpperCase()} RISK</Badge>
                        <Badge variant="outline" className="text-xs">{strategy.complexity.toUpperCase()}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Best for: {strategy.bestFor}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Agent Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Agent Configuration</h2>
            <Card className="glass-card p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <Label>Agent Name</Label>
                  <Input
                    placeholder="e.g., My DCA Bot"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Capital Allocation</Label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={config.capital}
                    onChange={(e) => setConfig({ ...config, capital: parseFloat(e.target.value) })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">Amount in USD to allocate to this agent</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Risk Management */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Risk Management</h2>
            <Card className="glass-card p-6 mb-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Stop Loss</Label>
                    <span className="text-sm font-semibold">{config.stopLoss}%</span>
                  </div>
                  <Slider
                    value={[config.stopLoss]}
                    onValueChange={(v) => setConfig({ ...config, stopLoss: v[0] })}
                    min={1}
                    max={20}
                    step={0.5}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Exit position if loss exceeds this percentage</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Take Profit</Label>
                    <span className="text-sm font-semibold">{config.takeProfit}%</span>
                  </div>
                  <Slider
                    value={[config.takeProfit]}
                    onValueChange={(v) => setConfig({ ...config, takeProfit: v[0] })}
                    min={5}
                    max={50}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Take profit when gain reaches this percentage</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Max Drawdown</Label>
                    <span className="text-sm font-semibold">{config.maxDrawdown}%</span>
                  </div>
                  <Slider
                    value={[config.maxDrawdown]}
                    onValueChange={(v) => setConfig({ ...config, maxDrawdown: v[0] })}
                    min={10}
                    max={50}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Pause agent if portfolio drops by this much</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Backtest */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Backtest Results</h2>
            <Card className="glass-card p-6 mb-6">
              <div className="h-64 flex items-center justify-center bg-background/20 rounded-lg border border-border/50 mb-6">
                <p className="text-muted-foreground">Chart: Strategy performance vs buy-and-hold</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Return</p>
                  <p className="text-xl font-bold text-green-400">+42.5%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-xl font-bold">73.4%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Drawdown</p>
                  <p className="text-xl font-bold text-red-400">-12.3%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-xl font-bold">1.87</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 5: Review & Deploy */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Review & Deploy</h2>
            <Card className="glass-card p-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Strategy</span>
                  <span className="font-semibold">{tradingStrategies.find(s => s.id === config.strategy)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent Name</span>
                  <span className="font-semibold">{config.name || 'Unnamed Agent'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capital</span>
                  <span className="font-semibold">${config.capital.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stop Loss</span>
                  <span className="font-semibold">{config.stopLoss}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Take Profit</span>
                  <span className="font-semibold">{config.takeProfit}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Monthly Fees</span>
                  <span className="font-semibold">~$15</span>
                </div>
              </div>
            </Card>
            <div className="flex items-start gap-2 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">AI Analysis</p>
                <p className="text-muted-foreground">
                  Based on backtesting, this configuration shows strong potential with a 73.4% win rate
                  and acceptable risk parameters. The agent will start trading automatically once deployed.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {step < 5 ? (
          <Button
            onClick={handleNext}
            disabled={step === 1 && !config.strategy}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={onComplete}>
            Deploy Agent
          </Button>
        )}
      </div>
    </div>
  );
};
