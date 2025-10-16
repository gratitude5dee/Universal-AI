import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, TrendingUp, Users, FileText, Shield, AlertTriangle, Download, ExternalLink } from "lucide-react";
import { AssetTypeIcon } from "../shared/AssetTypeIcon";
import { YieldIndicator } from "../shared/YieldIndicator";
import { RiskRating } from "../shared/RiskRating";
import { InvestmentCalculator } from "./InvestmentCalculator";
import { BuyModal } from "./BuyModal";
import type { MarketplaceListing } from "@/types/rwa";

interface ListingDetailsProps {
  listing: MarketplaceListing;
  onClose: () => void;
}

export const ListingDetails = ({ listing, onClose }: ListingDetailsProps) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const isFullyFunded = listing.fundingProgress >= 100;

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-[#0F172A] border-white/10 text-white">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AssetTypeIcon assetType={listing.asset.assetType} size="lg" />
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {listing.asset.tokenName}
                  </DialogTitle>
                  <p className="text-sm text-white/50 mt-1">
                    {listing.asset.tokenSymbol} • {listing.asset.assetType.replace("-", " ")}
                  </p>
                </div>
              </div>
              {isFullyFunded ? (
                <Badge variant="outline" className="border-[#059669] text-[#059669] bg-[#059669]/10">
                  100% FILLED
                </Badge>
              ) : (
                <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                  ACTIVE
                </Badge>
              )}
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Main Content (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery Placeholder */}
              <div className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="h-16 w-16 text-white/30 mx-auto mb-2" />
                  <p className="text-white/50 text-sm">Image Gallery (24 photos + virtual tour)</p>
                </div>
              </div>

              {/* Offering Summary */}
              <div className="glass-card p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#D4AF37]" />
                  Offering Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/50">Property Value</p>
                    <p className="text-white font-semibold">${(listing.asset.valuation / 1_000_000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-white/50">Tokenized Amount</p>
                    <p className="text-white font-semibold">
                      ${((listing.asset.valuation * listing.asset.tokenizedPercentage) / 100 / 1_000_000).toFixed(1)}M ({listing.asset.tokenizedPercentage}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50">Token Price</p>
                    <p className="text-white font-semibold">${listing.pricePerToken}</p>
                  </div>
                  <div>
                    <p className="text-white/50">Min Investment</p>
                    <p className="text-white font-semibold">$1,000 (10 tokens)</p>
                  </div>
                </div>

                {listing.financialDetails && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-white/50">Target Yield</p>
                      <p className="text-2xl font-bold text-[#059669]">
                        {listing.financialDetails.currentYield.toFixed(1)}% APY
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-white/70">
                      <div>• Rental Income: 6.2%</div>
                      <div>• Appreciation: ~1.6% projected</div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/50">Offering Closes</p>
                    <p className="text-white font-semibold">{new Date(listing.closesAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-white/50">First Distribution</p>
                    <p className="text-white font-semibold">December 2025</p>
                  </div>
                </div>
              </div>

              {/* Detailed Tabs */}
              <Tabs defaultValue="property" className="w-full">
                <TabsList className="w-full bg-white/5">
                  <TabsTrigger value="property" className="flex-1 text-white/70 data-[state=active]:text-white">
                    Property
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="flex-1 text-white/70 data-[state=active]:text-white">
                    Financial
                  </TabsTrigger>
                  <TabsTrigger value="market" className="flex-1 text-white/70 data-[state=active]:text-white">
                    Market
                  </TabsTrigger>
                  <TabsTrigger value="legal" className="flex-1 text-white/70 data-[state=active]:text-white">
                    Legal
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="property" className="glass-card p-6 rounded-xl mt-4">
                  <h4 className="font-semibold text-white mb-4">Property Details</h4>
                  {listing.propertyDetails && (
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-white/50">Address</p>
                          <p className="text-white">{listing.propertyDetails.address}</p>
                        </div>
                        <div>
                          <p className="text-white/50">Type</p>
                          <p className="text-white capitalize">{listing.propertyDetails.propertyType}</p>
                        </div>
                        <div>
                          <p className="text-white/50">Square Footage</p>
                          <p className="text-white">{listing.propertyDetails.squareFootage.toLocaleString()} sq ft</p>
                        </div>
                        <div>
                          <p className="text-white/50">Year Built</p>
                          <p className="text-white">{listing.propertyDetails.yearBuilt}</p>
                        </div>
                        {listing.propertyDetails.bedrooms && (
                          <>
                            <div>
                              <p className="text-white/50">Bedrooms</p>
                              <p className="text-white">{listing.propertyDetails.bedrooms}</p>
                            </div>
                            <div>
                              <p className="text-white/50">Bathrooms</p>
                              <p className="text-white">{listing.propertyDetails.bathrooms}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-white/50 mb-2">Features</p>
                        <ul className="list-disc list-inside text-white/70 space-y-1">
                          <li>LEED Gold Certified</li>
                          <li>High-speed fiber internet</li>
                          <li>Modern HVAC and security</li>
                          <li>Rooftop terrace with city views</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="financial" className="glass-card p-6 rounded-xl mt-4">
                  <h4 className="font-semibold text-white mb-4">Financial Analysis</h4>
                  {listing.propertyDetails && (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-white/50">Monthly Rent</p>
                          <p className="text-white font-semibold">${listing.propertyDetails.monthlyRent?.toLocaleString()}/mo</p>
                        </div>
                        <div>
                          <p className="text-white/50">Occupancy Rate</p>
                          <p className="text-white font-semibold">{listing.propertyDetails.occupancyRate}%</p>
                        </div>
                        <div>
                          <p className="text-white/50">Net Operating Income</p>
                          <p className="text-white font-semibold">${listing.propertyDetails.noi?.toLocaleString()}/year</p>
                        </div>
                        <div>
                          <p className="text-white/50">Cap Rate</p>
                          <p className="text-white font-semibold">{listing.propertyDetails.capRate}%</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-white/50 mb-2">Investor Returns (40% tokenized)</p>
                        <ul className="space-y-1 text-white/70">
                          <li>• Annual Distributions: $71,578</li>
                          <li>• Per Token: $7.46/year (on $100 token)</li>
                          <li>• Distribution Yield: 7.46%</li>
                          <li>• Target Total Return: 7.8% (w/ appreciation)</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="market" className="glass-card p-6 rounded-xl mt-4">
                  <h4 className="font-semibold text-white mb-4">Market Analysis</h4>
                  <div className="space-y-3 text-sm text-white/70">
                    <div>
                      <p className="text-white/50 mb-1">Austin Office Market Overview</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Market Vacancy Rate: 12.3% (Q3 2025)</li>
                        <li>Downtown Vacancy: 8.1% (better than average)</li>
                        <li>Avg Rent (Downtown): $42/sqft/year</li>
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-white/50 mb-1">5-Year Outlook: Positive</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Tech hub growth continues</li>
                        <li>Limited new office supply</li>
                        <li>Projected appreciation: 1-2%/year</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="legal" className="glass-card p-6 rounded-xl mt-4">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#1E40AF]" />
                    Legal & Compliance
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/50">Legal Structure</p>
                        <p className="text-white">LLC (Austin Congress Properties LLC)</p>
                      </div>
                      <div>
                        <p className="text-white/50">Offering Type</p>
                        <p className="text-white">Regulation D (506c)</p>
                      </div>
                      <div>
                        <p className="text-white/50">Investor Type</p>
                        <p className="text-white">Accredited Only</p>
                      </div>
                      <div>
                        <p className="text-white/50">Token Standard</p>
                        <p className="text-white">ERC-3643 (T-REX)</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-white/50 mb-2">Audits & Reports</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">• Property Appraisal: CBRE (Aug 2025)</span>
                          <span className="text-[#059669]">✓</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">• Financial Audit: Deloitte (2024)</span>
                          <span className="text-[#059669]">✓</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">• Smart Contract Audit: CertiK</span>
                          <span className="text-[#059669]">✓</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                          <Download className="h-4 w-4 mr-2" />
                          Offering Memorandum
                        </Button>
                        <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Legal Documents
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Risks & Disclosures */}
              <div className="glass-card p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-[#EA580C]" />
                  Risks & Disclosures
                </h3>
                <p className="text-sm text-white/70">
                  All investments carry risk. Please review carefully:
                </p>
                <div className="space-y-3 text-sm">
                  <RiskRating level="low" size="sm" showLabel />
                  <div className="space-y-2 text-white/70">
                    <p><strong className="text-white">⚠️ Market Risk:</strong> Real estate values can decline. Austin office market may be affected by economic downturns.</p>
                    <p><strong className="text-white">⚠️ Liquidity Risk:</strong> While tokens are tradeable, secondary market may be illiquid.</p>
                    <p><strong className="text-white">⚠️ Tenant Risk:</strong> Tenants may default or not renew leases.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar (1/3) - Investment Calculator */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                <InvestmentCalculator listing={listing} onInvest={() => setShowBuyModal(true)} />

                {!isFullyFunded && (
                  <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                      <span>Funding Progress</span>
                      <span className="font-semibold">{listing.fundingProgress}%</span>
                    </div>
                    <Progress value={listing.fundingProgress} className="h-2 mb-2" />
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{listing.investorCount} investors</span>
                      </div>
                      <span>
                        Closes {new Date(listing.closesAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showBuyModal && (
        <BuyModal
          listing={listing}
          onClose={() => setShowBuyModal(false)}
        />
      )}
    </>
  );
};
