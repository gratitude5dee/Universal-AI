import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, DollarSign, Bot, Music, Sparkles, AlertTriangle, Receipt } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GigManagerDashboard from "@/components/touring/GigManagerDashboard";
import AIBookingAssistant from "@/components/touring/AIBookingAssistant";
import TourCalendar from "@/components/touring/TourCalendar";
import InvoicesPanel from "@/components/touring/InvoicesPanel";
import ContactsDirectory from "@/components/touring/ContactsDirectory";
import { Card } from "@/components/ui/card";
import { useTouringStats } from "@/hooks/useTouringWorkspace";
import { formatMoney } from "@/lib/touring";

const Touring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("gigs");
  const { data: stats } = useTouringStats();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const tabData = [
    {
      value: "gigs",
      label: "Gig Manager",
      description: "Bookings, contracts, and settlements",
      icon: Calendar,
      component: <GigManagerDashboard />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      value: "ai-booking",
      label: "AI Booking",
      description: "Automation workspace",
      icon: Bot,
      component: <AIBookingAssistant />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500/20 to-purple-600/20",
    },
    {
      value: "calendar",
      label: "Tour Calendar",
      description: "Routes and confirmed dates",
      icon: Calendar,
      component: <TourCalendar />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      gradient: "from-green-500/20 to-green-600/20",
    },
    {
      value: "invoices",
      label: "Invoices",
      description: "Billing, reminders, and collections",
      icon: DollarSign,
      component: <InvoicesPanel />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      gradient: "from-orange-500/20 to-orange-600/20",
    },
    {
      value: "contacts",
      label: "Contacts",
      description: "Promoters and venue partners",
      icon: Users,
      component: <ContactsDirectory />,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      gradient: "from-pink-500/20 to-pink-600/20",
    },
  ];

  const overviewCards = [
    {
      label: "Upcoming Gigs",
      value: stats?.upcomingGigs ?? 0,
      icon: Calendar,
      accent: "text-green-400",
      panel: "bg-green-500/10",
    },
    {
      label: "Monthly Revenue",
      value: formatMoney(stats?.monthlyRevenue ?? 0),
      icon: DollarSign,
      accent: "text-blue-400",
      panel: "bg-blue-500/10",
    },
    {
      label: "Pending Invoices",
      value: stats?.pendingInvoices ?? 0,
      icon: Receipt,
      accent: "text-yellow-400",
      panel: "bg-yellow-500/10",
    },
    {
      label: "Overdue Invoices",
      value: stats?.overdueInvoices ?? 0,
      icon: AlertTriangle,
      accent: "text-red-400",
      panel: "bg-red-500/10",
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/touring?tab=${value}`, { replace: true });
  };

  return (
    <DashboardLayout>
      <motion.div className="space-y-8" initial="hidden" animate="show">
        <motion.div variants={itemAnimation} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-primary/10 p-4">
              <Music className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-foreground">
                Touring Central
                <Sparkles className="h-6 w-6 text-primary" />
              </h1>
              <p className="text-lg text-muted-foreground">
                Real-time touring operations backed by gigs, bookings, invoices, payments, and export jobs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label} className="glass-card border border-white/10 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">{card.label}</p>
                      <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
                    </div>
                    <div className={`rounded-xl p-3 ${card.panel}`}>
                      <Icon className={`h-5 w-5 ${card.accent}`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={itemAnimation} className="space-y-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="mb-8 flex w-full justify-center">
              <div className="glass-card w-full max-w-4xl p-3">
                <TabsList className="grid h-auto w-full grid-cols-2 gap-3 bg-transparent p-0 md:grid-cols-5">
                  {tabData.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.value;

                    return (
                      <motion.div key={tab.value} variants={itemAnimation} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                        <TabsTrigger
                          value={tab.value}
                          className={`group relative flex w-full flex-col items-center gap-2 overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-card-glow ${
                            isActive
                              ? `${tab.bgColor} ${tab.color} shadow-lg`
                              : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                          }`}
                        >
                          <div className={`rounded-lg p-2 transition-transform group-hover:scale-110 ${isActive ? "bg-white/20" : "bg-background/50"}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium leading-tight">{tab.label}</p>
                            <p className="mt-1 text-xs opacity-75">{tab.description}</p>
                          </div>

                          {isActive && (
                            <motion.div
                              layoutId="touring-active-tab"
                              className={`absolute inset-0 rounded-xl bg-gradient-to-br ${tab.gradient} opacity-20`}
                              initial={false}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                        </TabsTrigger>
                      </motion.div>
                    );
                  })}
                </TabsList>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {tabData.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="glass-card min-h-[600px] p-8 transition-all duration-300 hover:shadow-card-glow">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="mb-6"
                      >
                        <div className="mb-2 flex items-center gap-3">
                          <div className={`rounded-lg p-2 ${tab.bgColor}`}>
                            <tab.icon className={`h-5 w-5 ${tab.color}`} />
                          </div>
                          <h2 className="text-2xl font-semibold text-foreground">{tab.label}</h2>
                        </div>
                        <p className="text-muted-foreground">{tab.description}</p>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
                        {tab.component}
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Touring;
