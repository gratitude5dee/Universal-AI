import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TouringStatsSnapshot } from "@/lib/touring";

export interface TouringGigRow {
  id: string;
  title: string;
  date: string;
  status: string | null;
  venue_id?: string | null;
  guarantee_amount: number | null;
  capacity: number | null;
  contract_url: string | null;
  notes: string | null;
  venue?: {
    name?: string | null;
    city?: string | null;
    state?: string | null;
    contact_email?: string | null;
  } | null;
}

export interface TouringInvoiceRow {
  id: string;
  invoice_number: string | null;
  amount: number;
  balance_due: number | null;
  currency: string | null;
  due_date: string | null;
  status: string | null;
  paid_at: string | null;
  created_at: string | null;
  gig?: {
    id?: string;
    title?: string | null;
    date?: string | null;
    venue?: {
      name?: string | null;
      city?: string | null;
      state?: string | null;
      contact_email?: string | null;
    } | null;
  } | null;
}

export interface TourRouteRow {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
}

export interface TouringCalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "show" | "route";
  status: string;
  venue: string;
  city: string;
}

export function useTouringStats() {
  return useQuery({
    queryKey: ["touring", "stats"],
    queryFn: async (): Promise<TouringStatsSnapshot> => {
      const { data, error } = await supabase.rpc("get_touring_stats_v2");
      if (error) {
        throw error;
      }

      const snapshot = (data ?? {}) as Record<string, unknown>;
      return {
        upcomingGigs: Number(snapshot.upcomingGigs ?? 0),
        monthlyRevenue: Number(snapshot.monthlyRevenue ?? 0),
        pendingInvoices: Number(snapshot.pendingInvoices ?? 0),
        overdueInvoices: Number(snapshot.overdueInvoices ?? 0),
      };
    },
  });
}

export function useTouringGigs() {
  return useQuery({
    queryKey: ["gigs"],
    queryFn: async (): Promise<TouringGigRow[]> => {
      const { data, error } = await supabase
        .from("gigs")
        .select(`
          id,
          title,
          date,
          status,
          venue_id,
          guarantee_amount,
          capacity,
          contract_url,
          notes,
          venue:venues(name, city, state, contact_email)
        `)
        .order("date", { ascending: true });

      if (error) {
        throw error;
      }

      return (data ?? []) as TouringGigRow[];
    },
  });
}

export function useTouringInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async (): Promise<TouringInvoiceRow[]> => {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          id,
          invoice_number,
          amount,
          balance_due,
          currency,
          due_date,
          status,
          paid_at,
          created_at,
          gig:gigs(
            id,
            title,
            date,
            venue:venues(name, city, state, contact_email)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []) as TouringInvoiceRow[];
    },
  });
}

export function useTourRoutes() {
  return useQuery({
    queryKey: ["touring", "routes"],
    queryFn: async (): Promise<TourRouteRow[]> => {
      const { data, error } = await supabase
        .from("tour_routes")
        .select("id, name, start_date, end_date, notes")
        .order("start_date", { ascending: true });

      if (error) {
        throw error;
      }

      return (data ?? []) as TourRouteRow[];
    },
  });
}

export function useTouringCalendarEvents() {
  const gigsQuery = useTouringGigs();
  const routesQuery = useTourRoutes();

  const events: TouringCalendarEvent[] = [
    ...(gigsQuery.data ?? []).map((gig) => ({
      id: gig.id,
      title: gig.title,
      date: gig.date,
      type: "show" as const,
      status: gig.status ?? "pending",
      venue: gig.venue?.name ?? "Venue TBD",
      city: [gig.venue?.city, gig.venue?.state].filter(Boolean).join(", ") || "TBD",
    })),
    ...(routesQuery.data ?? [])
      .filter((route) => route.start_date)
      .map((route) => ({
        id: route.id,
        title: route.name,
        date: route.start_date as string,
        type: "route" as const,
        status: "planned",
        venue: "Tour route",
        city: route.notes ?? "Multi-city itinerary",
      })),
  ].sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());

  return {
    data: events,
    isLoading: gigsQuery.isLoading || routesQuery.isLoading,
    error: gigsQuery.error ?? routesQuery.error,
  };
}
