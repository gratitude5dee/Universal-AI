-- Create orders table for merchandise
CREATE TABLE IF NOT EXISTS public.merchandise_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  design_id UUID REFERENCES public.designs(id) ON DELETE SET NULL,
  product_template_id UUID REFERENCES public.product_templates(id),
  order_type TEXT NOT NULL CHECK (order_type IN ('sample', 'bulk', 'custom')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'printing', 'shipped', 'delivered', 'cancelled')),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_cost NUMERIC(10, 2) NOT NULL,
  shipping_cost NUMERIC(10, 2) DEFAULT 0,
  tax_amount NUMERIC(10, 2) DEFAULT 0,
  fulfillment_provider TEXT CHECK (fulfillment_provider IN ('printful', 'printify', 'internal', 'custom')),
  external_order_id TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  shipping_address JSONB NOT NULL,
  product_details JSONB NOT NULL,
  mockup_urls TEXT[],
  notes TEXT,
  estimated_delivery DATE,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order items table for multiple items per order
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.merchandise_orders(id) ON DELETE CASCADE,
  design_id UUID REFERENCES public.designs(id),
  product_template_id UUID REFERENCES public.product_templates(id),
  size TEXT,
  color TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  customizations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order status history table
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.merchandise_orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.merchandise_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for merchandise_orders
CREATE POLICY "Users can view their own orders"
  ON public.merchandise_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.merchandise_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.merchandise_orders FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.merchandise_orders
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM public.merchandise_orders
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for order_status_history
CREATE POLICY "Users can view their own order history"
  ON public.order_status_history FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.merchandise_orders
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_merchandise_orders_user_id ON public.merchandise_orders(user_id);
CREATE INDEX idx_merchandise_orders_status ON public.merchandise_orders(status);
CREATE INDEX idx_merchandise_orders_created_at ON public.merchandise_orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_status_history_order_id ON public.order_status_history(order_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_merchandise_orders_updated_at
  BEFORE UPDATE ON public.merchandise_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create status history entries
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.order_status_history (order_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || OLD.status || ' to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER order_status_change_trigger
  AFTER UPDATE ON public.merchandise_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.log_order_status_change();