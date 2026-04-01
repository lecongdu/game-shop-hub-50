import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useMyOrders, useMyDeposits, useCreateDeposit, formatVND, useSiteSettings } from "@/hooks/use-shop-data";
import { ShoppingBag, Wallet, User, Calendar, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

const statusColors: Record<string, string> = {
  completed: "bg-neon-green/20 text-neon-green border-neon-green/30",
  approved: "bg-neon-green/20 text-neon-green border-neon-green/30",
  pending: "bg-warning/20 text-warning border-warning/30",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
};

const statusLabels: Record<string, string> = {
  completed: "Hoàn thành",
  approved: "Đã duyệt",
  pending: "Chờ duyệt",
  rejected: "Từ chối",
};

const Dashboard = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: orders, isLoading: ordersLoading } = useMyOrders();
  const { data: deposits, isLoading: depositsLoading } = useMyDeposits();
  const createDeposit = useCreateDeposit();
  const { data: depositConfig } = useSiteSettings("deposit_config");
  const depCfg = depositConfig?.value as Record<string, unknown> | undefined;

  const [depositAmount, setDepositAmount] = useState("");
  const [bankRef, setBankRef] = useState("");

  const handleDeposit = async () => {
    const amount = parseInt(depositAmount);
    if (!amount || amount < 10000) {
      toast.error("Số tiền nạp tối thiểu 10,000 VNĐ");
      return;
    }
    if (!bankRef.trim()) {
      toast.error("Vui lòng nhập mã giao dịch ngân hàng");
      return;
    }
    try {
      await createDeposit.mutateAsync({ amount, bankReference: bankRef.trim() });
      toast.success("Yêu cầu nạp tiền đã được gửi! Chờ admin duyệt.");
      setDepositAmount("");
      setBankRef("");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const totalSpent = (orders || []).reduce((sum, o) => sum + o.price, 0);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="surface-card rounded-xl p-5 neon-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{profile?.display_name || "User"}</p>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Tham gia: {profile ? new Date(profile.created_at).toLocaleDateString("vi-VN") : ""}
            </p>
          </div>
          <div className="surface-card rounded-xl p-5">
            <Wallet className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Số dư</p>
            <p className="font-display text-2xl font-bold text-primary">{formatVND(profile?.balance ?? 0)}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="neon" size="sm" className="mt-2 gap-1 w-full">
                  <CreditCard className="h-4 w-4" /> Nạp tiền
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-display text-foreground">Nạp tiền qua ngân hàng</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm space-y-1">
                    <p className="text-primary font-semibold">Thông tin chuyển khoản:</p>
                    <p className="text-muted-foreground">Ngân hàng: <span className="text-foreground">Vietcombank</span></p>
                    <p className="text-muted-foreground">STK: <span className="text-foreground font-mono">1234567890</span></p>
                    <p className="text-muted-foreground">Chủ TK: <span className="text-foreground">ACCSHOP</span></p>
                    <p className="text-muted-foreground">Nội dung: <span className="text-foreground font-mono">NAP {user?.id?.slice(0, 8)}</span></p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Số tiền nạp (VNĐ)</Label>
                    <Input className="mt-1 bg-secondary border-border" type="number" placeholder="50000" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Mã giao dịch ngân hàng</Label>
                    <Input className="mt-1 bg-secondary border-border" placeholder="VD: FT24123456789" value={bankRef} onChange={(e) => setBankRef(e.target.value)} />
                  </div>
                  <Button variant="neon" className="w-full" onClick={handleDeposit} disabled={createDeposit.isPending}>
                    {createDeposit.isPending ? "Đang gửi..." : "Gửi yêu cầu nạp tiền"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="surface-card rounded-xl p-5">
            <ShoppingBag className="h-5 w-5 text-neon-green mb-2" />
            <p className="text-xs text-muted-foreground">Đã chi tiêu</p>
            <p className="font-display text-2xl font-bold text-neon-green">{formatVND(totalSpent)}</p>
          </div>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="bg-secondary">
            <TabsTrigger value="orders">Lịch sử mua hàng</TabsTrigger>
            <TabsTrigger value="deposits">Lịch sử nạp tiền</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <div className="surface-card rounded-xl overflow-hidden">
              {ordersLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (orders || []).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Chưa có đơn hàng nào</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Sản phẩm</TableHead>
                      <TableHead className="text-muted-foreground hidden md:table-cell">Thông tin</TableHead>
                      <TableHead className="text-muted-foreground">Giá</TableHead>
                      <TableHead className="text-muted-foreground hidden sm:table-cell">Ngày</TableHead>
                      <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(orders || []).map((order) => (
                      <TableRow key={order.id} className="border-border">
                        <TableCell className="font-medium text-sm">{order.product_name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden md:table-cell font-mono">{order.account_data || "—"}</TableCell>
                        <TableCell className="font-semibold text-sm">{formatVND(order.price)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{new Date(order.created_at).toLocaleDateString("vi-VN")}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColors[order.status] || ""}`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="deposits" className="mt-4">
            <div className="surface-card rounded-xl overflow-hidden">
              {depositsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (deposits || []).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Chưa có lịch sử nạp tiền</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Số tiền</TableHead>
                      <TableHead className="text-muted-foreground">Mã GD</TableHead>
                      <TableHead className="text-muted-foreground hidden sm:table-cell">Ngày</TableHead>
                      <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(deposits || []).map((dep) => (
                      <TableRow key={dep.id} className="border-border">
                        <TableCell className="font-semibold text-sm text-neon-green">+{formatVND(dep.amount)}</TableCell>
                        <TableCell className="font-mono text-xs">{dep.bank_reference || "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{new Date(dep.created_at).toLocaleDateString("vi-VN")}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColors[dep.status] || ""}`}>
                            {statusLabels[dep.status] || dep.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
