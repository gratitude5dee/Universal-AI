import { Calendar, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import InvoicesPanel from "@/components/touring/InvoicesPanel";

const Invoices = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Invoices</h1>
            <p className="mt-2 text-sm text-white/60">
              Billing, reminders, payment capture, and export history all resolve against the touring finance backend.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate("/event-toolkit/gigs")}>
              <Calendar className="mr-2 h-4 w-4" />
              Back to Gigs
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate("/touring?tab=invoices")}>
              <FileText className="mr-2 h-4 w-4" />
              Touring Hub
            </Button>
            <Button className="bg-studio-accent hover:bg-studio-accent/80" onClick={() => navigate("/event-toolkit/invoices/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </div>

        <InvoicesPanel />
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
