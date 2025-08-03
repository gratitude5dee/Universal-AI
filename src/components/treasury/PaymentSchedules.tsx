
import React from "react";
import { motion } from "framer-motion";
import { Clock, Scroll, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSchedules = () => {
  const upcomingPayments = [
    {
      id: "pay1",
      name: "Artist Royalties",
      amount: 3450,
      due: "July 15, 2023",
      status: "pending",
      recipient: "Creative Collective",
      chain: "Ethereum",
    },
    {
      id: "pay2",
      name: "Collaborator Fee",
      amount: 1200,
      due: "July 18, 2023",
      status: "pending",
      recipient: "Spell Weaver Studios",
      chain: "Polygon",
    },
    {
      id: "pay3",
      name: "Platform Subscription",
      amount: 99,
      due: "July 22, 2023",
      status: "scheduled",
      recipient: "Magical Canvas Pro",
      chain: "Ethereum",
    },
    {
      id: "pay4",
      name: "Domain Renewal",
      amount: 120,
      due: "August 5, 2023",
      status: "scheduled",
      recipient: "Realm Registry",
      chain: "Solana",
    },
  ];

  const completedPayments = [
    {
      id: "payd1",
      name: "Software License",
      amount: 850,
      date: "June 28, 2023",
      recipient: "Arcane Tools Inc.",
      chain: "Ethereum",
    },
    {
      id: "payd2",
      name: "Contract Deployment",
      amount: 120,
      date: "June 15, 2023",
      recipient: "Chain Wizards",
      chain: "Polygon",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="w-5 h-5 mr-2 text-studio-accent" />
            Upcoming Payments
          </h2>
          <Button variant="outline" size="sm">
            Schedule New Payment
          </Button>
        </div>

        <div className="space-y-4">
          {upcomingPayments.map((payment) => (
            <motion.div
              key={payment.id}
              className="glass-card rounded-xl p-4 hover:shadow-md transition-all border border-white/10 backdrop-blur-md"
              whileHover={{ y: -3 }}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{payment.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    To: {payment.recipient} via {payment.chain}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${payment.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Due: {payment.due}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    payment.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {payment.status === "pending" ? "Pending" : "Scheduled"}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    Edit
                  </Button>
                  <Button size="sm" className="h-8 px-2">
                    Pay Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Scroll className="w-5 h-5 mr-2 text-studio-accent" />
          Payment History
        </h2>

        <div className="space-y-4">
          {completedPayments.map((payment) => (
            <div
              key={payment.id}
              className="glass-card rounded-xl p-3 border border-white/10 backdrop-blur-md"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-sm">{payment.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    To: {payment.recipient}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${payment.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{payment.date}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Completed
                </span>
                <span className="text-xs ml-2 text-muted-foreground">
                  via {payment.chain}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button variant="outline" className="w-full justify-center" size="sm">
            View All Payment History
          </Button>
        </div>

        <div className="mt-6 bg-studio-highlight p-4 rounded-xl">
          <h3 className="font-medium mb-2 flex items-center">
            <PiggyBank className="w-4 h-4 mr-2 text-studio-accent" />
            Automated Payments
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Schedule recurring payments to your most frequent recipients
          </p>
          <Button size="sm" className="w-full">
            Set Up Automation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedules;
