import { Calendar, DollarSign, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import GigManagerDashboard from "@/components/touring/GigManagerDashboard";

const Gigs = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Gigs</h1>
            <p className="mt-2 text-sm text-white/60">
              Confirm bookings, generate invoices, and keep touring records synced to the backend workflow tables.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate("/event-toolkit/invoices")}>
              <DollarSign className="mr-2 h-4 w-4" />
              Open Invoices
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate("/touring?tab=calendar")}>
              <Calendar className="mr-2 h-4 w-4" />
              Open Calendar
            </Button>
            <Button className="bg-studio-accent hover:bg-studio-accent/80" onClick={() => navigate("/event-toolkit/gigs/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Gig
            </Button>
          </div>
        </div>

        <GigManagerDashboard />
      </div>
    </DashboardLayout>
  );
};

export default Gigs;
