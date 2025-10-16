import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Package } from 'lucide-react';
import { SampleOrderDialog } from './SampleOrderDialog';
import { BulkOrderDialog } from './BulkOrderDialog';

interface ProductionCalculatorProps {
  productType?: string;
  designId?: string;
  designImageUrl?: string;
  productTemplateId?: string;
}

export const ProductionCalculator: React.FC<ProductionCalculatorProps> = ({
  productType = 'hoodie',
  designId,
  designImageUrl,
  productTemplateId,
}) => {
  const [quantity, setQuantity] = useState(100);
  const [printMethod, setPrintMethod] = useState('screen-print');
  const [colors, setColors] = useState(1);
  const [baseCost, setBaseCost] = useState(15.00);
  const [printCost, setPrintCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [unitCost, setUnitCost] = useState(0);
  const [suggestedRetail, setSuggestedRetail] = useState(0);

  const printMethodCosts: Record<string, { setup: number; perUnit: (qty: number) => number }> = {
    'screen-print': {
      setup: 50,
      perUnit: (qty) => qty < 50 ? 8 : qty < 100 ? 6 : qty < 500 ? 4 : 3,
    },
    'dtg': {
      setup: 0,
      perUnit: (qty) => 12,
    },
    'heat-transfer': {
      setup: 25,
      perUnit: (qty) => 5,
    },
    'embroidery': {
      setup: 75,
      perUnit: (qty) => qty < 50 ? 15 : qty < 100 ? 12 : qty < 500 ? 10 : 8,
    },
    'sublimation': {
      setup: 0,
      perUnit: (qty) => 10,
    },
  };

  useEffect(() => {
    const method = printMethodCosts[printMethod];
    const setupCost = method.setup;
    const perUnitPrint = method.perUnit(quantity);
    
    // Additional cost per color for screen printing
    const colorMultiplier = printMethod === 'screen-print' ? colors : 1;
    const adjustedSetup = setupCost * colorMultiplier;
    
    const totalPrintCost = adjustedSetup + (perUnitPrint * quantity);
    const totalProductCost = (baseCost * quantity) + totalPrintCost;
    const costPerUnit = totalProductCost / quantity;
    const retailPrice = costPerUnit * 2.5; // 2.5x markup

    setPrintCost(totalPrintCost);
    setTotalCost(totalProductCost);
    setUnitCost(costPerUnit);
    setSuggestedRetail(retailPrice);
  }, [quantity, printMethod, colors, baseCost]);

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Production Cost Calculator
        </CardTitle>
        <CardDescription className="text-white/70">
          Estimate manufacturing costs and pricing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white text-sm">Quantity</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">Print Method</Label>
            <Select value={printMethod} onValueChange={setPrintMethod}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="screen-print">Screen Printing</SelectItem>
                <SelectItem value="dtg">Direct-to-Garment</SelectItem>
                <SelectItem value="heat-transfer">Heat Transfer</SelectItem>
                <SelectItem value="embroidery">Embroidery</SelectItem>
                <SelectItem value="sublimation">Sublimation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">Number of Colors</Label>
            <Input
              type="number"
              value={colors}
              onChange={(e) => setColors(Number(e.target.value))}
              min={1}
              max={6}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">Base Product Cost ($)</Label>
            <Input
              type="number"
              value={baseCost}
              onChange={(e) => setBaseCost(Number(e.target.value))}
              min={0}
              step={0.01}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Package className="h-4 w-4" />
              Cost Breakdown
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/80">
                <span>Base Products ({quantity} units)</span>
                <span>${(baseCost * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Printing Costs</span>
                <span>${printCost.toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/20 my-2" />
              <div className="flex justify-between text-white font-semibold">
                <span>Total Production Cost</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-semibold">
                <span>Cost Per Unit</span>
                <span>${unitCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Pricing Recommendations */}
          <div className="bg-gradient-to-r from-studio-accent/20 to-purple-500/20 rounded-lg p-4 border border-studio-accent/30 space-y-3">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Pricing Recommendations
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/80">
                <span>Suggested Retail Price (2.5x)</span>
                <span className="text-white font-semibold">${suggestedRetail.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Profit Per Unit</span>
                <span className="text-green-400 font-semibold">
                  ${(suggestedRetail - unitCost).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Total Potential Profit</span>
                <span className="text-green-400 font-semibold text-lg">
                  ${((suggestedRetail - unitCost) * quantity).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Profit Margin</span>
                <span className="text-green-400 font-semibold">
                  {(((suggestedRetail - unitCost) / suggestedRetail) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <SampleOrderDialog
            designId={designId}
            designImageUrl={designImageUrl}
            productTemplateId={productTemplateId}
            productType={productType}
          />
          <BulkOrderDialog
            designImageUrl={designImageUrl}
            productTemplateId={productTemplateId}
          />
        </div>

        {/* Tips */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-white/70 text-xs">
            💡 <strong>Tip:</strong> Larger quantities typically reduce per-unit costs. 
            Screen printing is most cost-effective for 100+ units with 1-3 colors.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};