import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const formatVND = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

// ==================== Profile ====================
export const useProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

// ==================== Products (public) ====================
export const useProducts = () =>
  useQuery({
    queryKey: ["product_stock"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_stock").select("*");
      if (error) throw error;
      return data;
    },
  });

// ==================== Admin: Products CRUD ====================
export const useAdminProducts = () =>
  useQuery({
    queryKey: ["admin_products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_stock").select("*");
      if (error) throw error;
      return data;
    },
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: { name: string; category: string; price: number; description?: string; image?: string; accounts: string[] }) => {
      const { data: prod, error } = await supabase.from("products").insert({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description || null,
        image: product.image || "🎮",
      }).select().single();
      if (error) throw error;

      if (product.accounts.length > 0) {
        const accountRows = product.accounts.map((acc) => ({
          product_id: prod.id,
          account_data: acc,
        }));
        const { error: accErr } = await supabase.from("product_accounts").insert(accountRows);
        if (accErr) throw accErr;
      }
      return prod;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_products"] });
      qc.invalidateQueries({ queryKey: ["product_stock"] });
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_products"] });
      qc.invalidateQueries({ queryKey: ["product_stock"] });
    },
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; category?: string; price?: number; description?: string; image?: string }) => {
      const { error } = await supabase.from("products").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_products"] });
      qc.invalidateQueries({ queryKey: ["product_stock"] });
    },
  });
};

export const useAddAccounts = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, accounts }: { productId: string; accounts: string[] }) => {
      const rows = accounts.map((acc) => ({ product_id: productId, account_data: acc }));
      const { error } = await supabase.from("product_accounts").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_products"] });
      qc.invalidateQueries({ queryKey: ["product_stock"] });
    },
  });
};

// ==================== Purchase ====================
export const usePurchase = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data, error } = await supabase.rpc("purchase_product", { p_product_id: productId });
      if (error) throw error;
      return data as { success: boolean; error?: string; order_id?: string; account_data?: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["product_stock"] });
      qc.invalidateQueries({ queryKey: ["my_orders"] });
    },
  });
};

// ==================== User Orders ====================
export const useMyOrders = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my_orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

// ==================== Deposits ====================
export const useMyDeposits = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my_deposits", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateDeposit = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ amount, bankReference }: { amount: number; bankReference: string }) => {
      const { data, error } = await supabase.from("deposits").insert({
        user_id: user!.id,
        amount,
        bank_reference: bankReference,
        method: "bank_transfer",
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my_deposits"] });
    },
  });
};

// ==================== Admin Orders & Deposits ====================
export const useAdminOrders = () =>
  useQuery({
    queryKey: ["admin_orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useAdminDeposits = () =>
  useQuery({
    queryKey: ["admin_deposits"],
    queryFn: async () => {
      const { data, error } = await supabase.from("deposits").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useApproveDeposit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (depositId: string) => {
      const { data, error } = await supabase.rpc("approve_deposit", { p_deposit_id: depositId });
      if (error) throw error;
      return data as { success: boolean; error?: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_deposits"] });
      qc.invalidateQueries({ queryKey: ["admin_stats"] });
    },
  });
};

// ==================== Admin: User Roles ====================
export const useIsAdmin = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is_admin", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" });
      if (error) throw error;
      return data as boolean;
    },
    enabled: !!user,
  });
};

// ==================== Admin: Members ====================
export const useAdminMembers = () =>
  useQuery({
    queryKey: ["admin_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useAdminUpdateBalance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, balance }: { userId: string; balance: number }) => {
      const { error } = await supabase.from("profiles").update({ balance }).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_members"] });
    },
  });
};

export const useAdminSetRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "user" }) => {
      // Check if role exists
      const { data: existing } = await supabase.from("user_roles").select("*").eq("user_id", userId).eq("role", role);
      if (existing && existing.length > 0) return; // already has role
      // Remove old roles and set new one
      const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (delErr) throw delErr;
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_members"] });
    },
  });
};

export const useAdminMemberRoles = () =>
  useQuery({
    queryKey: ["admin_member_roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
  });

// ==================== Site Settings ====================
export const useSiteSettings = (key: string) =>
  useQuery({
    queryKey: ["site_settings", key],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("key", key).single();
      if (error) throw error;
      return data;
    },
  });

export const useUpdateSiteSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Record<string, unknown> }) => {
      const { error } = await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    },
  });
};

// ==================== Admin Stats ====================
export const useAdminStats = () =>
  useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const [ordersRes, productsRes, depositsRes] = await Promise.all([
        supabase.from("orders").select("price, created_at"),
        supabase.from("product_stock").select("*"),
        supabase.from("deposits").select("amount, status"),
      ]);
      
      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const deposits = depositsRes.data || [];
      
      const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const approvedDeposits = deposits.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.amount, 0);
      
      return { totalRevenue, totalOrders, totalProducts, approvedDeposits };
    },
  });
