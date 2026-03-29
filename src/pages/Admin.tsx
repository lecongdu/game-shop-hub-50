import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useAdminProducts, useCreateProduct, useDeleteProduct,
  useAdminOrders, useAdminDeposits, useApproveDeposit,
  useAdminStats, useIsAdmin, formatVND
} from "@/hooks/use-shop-data";
import {
  BarChart3, Package, ShoppingCart, DollarSign,
  Plus, Trash2, Save, Loader2, CheckCircle, XCircle, CreditCard
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Admin = () => {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: products, isLoading: productsLoading } = useAdminProducts();
  const { data: orders } = useAdminOrders();
  const { data: deposits } = useAdminDeposits();
  const { data: stats } = useAdminStats();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const approveDeposit = useApproveDeposit();

  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: "", description: "", image: "🎮", accounts: "" });

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <XCircle className="h-16 w-16 text-destructive mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Không có quyền truy cập</h1>
          <p className="text-muted-foreground">Bạn cần quyền Admin để truy cập trang này.</p>
        </div>
      </div>
    );
  }

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      toast.error("Vui lòng điền đủ thông tin");
      return;
    }
    const accounts = newProduct.accounts.split("\n").map(a => a.trim()).filter(Boolean);
    try {
      await createProduct.mutateAsync({
        name: newProduct.name,
        category: newProduct.category,
        price: parseInt(newProduct.price),
        description: newProduct.description || undefined,
        image: newProduct.image || "🎮",
        accounts,
      });
      toast.success("Thêm sản phẩm thành công!");
      setNewProduct({ name: "", category: "", price: "", description: "", image: "🎮", accounts: "" });
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: string | null) => {
    if (!id) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Đã xóa sản phẩm");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleApproveDeposit = async (id: string) => {
    try {
      const result = await approveDeposit.mutateAsync(id);
      if (result.success) {
        toast.success("Đã duyệt nạp tiền!");
      } else {
        toast.error(result.error || "Có lỗi");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const overviewCards = [
    { label: "Tổng doanh thu", value: formatVND(stats?.totalRevenue ?? 0), icon: DollarSign, color: "text-primary" },
    { label: "Tổng đơn hàng", value: (stats?.totalOrders ?? 0).toString(), icon: ShoppingCart, color: "text-neon-green" },
    { label: "Nạp tiền đã duyệt", value: formatVND(stats?.approvedDeposits ?? 0), icon: CreditCard, color: "text-warning" },
    { label: "Sản phẩm", value: (stats?.totalProducts ?? 0).toString(), icon: Package, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="bg-secondary flex-wrap h-auto gap-1">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="deposits">Nạp tiền</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {overviewCards.map((card) => (
                <div key={card.label} className="surface-card rounded-xl p-4">
                  <card.icon className={`h-5 w-5 ${card.color} mb-2`} />
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className={`font-display text-xl font-bold ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">Quản lý sản phẩm</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="neon" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" /> Thêm sản phẩm
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-display text-foreground">Thêm sản phẩm mới</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Tên sản phẩm</Label>
                      <Input className="mt-1 bg-secondary border-border" placeholder="VD: Netflix Premium 1 Tháng" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Danh mục</Label>
                        <Input className="mt-1 bg-secondary border-border" placeholder="Netflix" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Giá (VNĐ)</Label>
                        <Input className="mt-1 bg-secondary border-border" type="number" placeholder="45000" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Mô tả</Label>
                        <Input className="mt-1 bg-secondary border-border" placeholder="Mô tả ngắn..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Emoji icon</Label>
                        <Input className="mt-1 bg-secondary border-border" placeholder="🎮" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Kho hàng (mỗi tài khoản 1 dòng)</Label>
                      <Textarea
                        className="mt-1 bg-secondary border-border font-mono text-xs min-h-[120px]"
                        placeholder={"email1@gmail.com|password1\nemail2@gmail.com|password2"}
                        value={newProduct.accounts}
                        onChange={(e) => setNewProduct({ ...newProduct, accounts: e.target.value })}
                      />
                    </div>
                    <Button variant="neon" className="w-full gap-1" onClick={handleCreateProduct} disabled={createProduct.isPending}>
                      <Save className="h-4 w-4" /> {createProduct.isPending ? "Đang lưu..." : "Lưu sản phẩm"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="surface-card rounded-xl overflow-hidden">
              {productsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Sản phẩm</TableHead>
                      <TableHead className="text-muted-foreground hidden sm:table-cell">Danh mục</TableHead>
                      <TableHead className="text-muted-foreground">Giá</TableHead>
                      <TableHead className="text-muted-foreground hidden md:table-cell">Kho</TableHead>
                      <TableHead className="text-muted-foreground hidden md:table-cell">Đã bán</TableHead>
                      <TableHead className="text-muted-foreground text-right">Xóa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(products || []).map((product) => (
                      <TableRow key={product.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{product.image}</span>
                            <span className="font-medium text-sm text-foreground">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">{product.category}</span>
                        </TableCell>
                        <TableCell className="font-semibold text-sm">{formatVND(product.price ?? 0)}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{product.stock ?? 0}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{product.sold ?? 0}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders" className="mt-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Quản lý đơn hàng</h3>
            <div className="surface-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Mã đơn</TableHead>
                    <TableHead className="text-muted-foreground">Sản phẩm</TableHead>
                    <TableHead className="text-muted-foreground">Giá</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Ngày</TableHead>
                    <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(orders || []).map((order) => (
                    <TableRow key={order.id} className="border-border">
                      <TableCell className="font-mono text-xs text-primary">{order.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium text-sm">{order.product_name}</TableCell>
                      <TableCell className="font-semibold text-sm">{formatVND(order.price)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{new Date(order.created_at).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium bg-neon-green/20 text-neon-green border-neon-green/30">
                          Hoàn thành
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(orders || []).length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">Chưa có đơn hàng</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Deposits */}
          <TabsContent value="deposits" className="mt-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Quản lý nạp tiền</h3>
            <div className="surface-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">User ID</TableHead>
                    <TableHead className="text-muted-foreground">Số tiền</TableHead>
                    <TableHead className="text-muted-foreground">Mã GD</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Ngày</TableHead>
                    <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                    <TableHead className="text-muted-foreground text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(deposits || []).map((dep) => (
                    <TableRow key={dep.id} className="border-border">
                      <TableCell className="font-mono text-xs">{dep.user_id.slice(0, 8)}</TableCell>
                      <TableCell className="font-semibold text-sm text-neon-green">{formatVND(dep.amount)}</TableCell>
                      <TableCell className="font-mono text-xs">{dep.bank_reference || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{new Date(dep.created_at).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          dep.status === "approved" ? "bg-neon-green/20 text-neon-green border-neon-green/30" :
                          dep.status === "pending" ? "bg-warning/20 text-warning border-warning/30" :
                          "bg-destructive/20 text-destructive border-destructive/30"
                        }`}>
                          {dep.status === "approved" ? "Đã duyệt" : dep.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {dep.status === "pending" && (
                          <Button variant="neon" size="sm" className="gap-1 text-xs" onClick={() => handleApproveDeposit(dep.id)} disabled={approveDeposit.isPending}>
                            <CheckCircle className="h-3.5 w-3.5" /> Duyệt
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(deposits || []).length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">Chưa có yêu cầu nạp tiền</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
