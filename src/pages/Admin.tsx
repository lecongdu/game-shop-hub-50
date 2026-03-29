import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { products, orders, adminStats, formatVND } from "@/data/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  BarChart3, Package, ShoppingCart, Users, DollarSign,
  Plus, Pencil, Trash2, Settings, Save, Upload
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

const Admin = () => {
  const [siteName, setSiteName] = useState("ACCSHOP");
  const [announcement, setAnnouncement] = useState("🔥 Khuyến mãi mùa hè - Giảm 20% tất cả tài khoản Netflix!");

  const overviewCards = [
    { label: "Tổng doanh thu", value: formatVND(adminStats.totalRevenue), icon: DollarSign, color: "text-primary" },
    { label: "Tổng đơn hàng", value: adminStats.totalOrders.toLocaleString(), icon: ShoppingCart, color: "text-neon-green" },
    { label: "Người dùng", value: adminStats.totalUsers.toLocaleString(), icon: Users, color: "text-warning" },
    { label: "Sản phẩm", value: adminStats.totalProducts.toString(), icon: Package, color: "text-primary" },
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
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
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

            <div className="surface-card rounded-xl p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Doanh thu theo tháng</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adminStats.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
                  <XAxis dataKey="month" stroke="hsl(215 15% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215 15% 55%)" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(220 18% 10%)",
                      border: "1px solid hsl(220 15% 18%)",
                      borderRadius: "8px",
                      color: "hsl(210 20% 92%)",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [formatVND(value), "Doanh thu"]}
                  />
                  <Bar dataKey="revenue" fill="hsl(185 100% 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
                      <Input className="mt-1 bg-secondary border-border" placeholder="VD: Netflix Premium 1 Tháng" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Danh mục</Label>
                        <Input className="mt-1 bg-secondary border-border" placeholder="Netflix" />
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Giá (VNĐ)</Label>
                        <Input className="mt-1 bg-secondary border-border" type="number" placeholder="45000" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Mô tả</Label>
                      <Input className="mt-1 bg-secondary border-border" placeholder="Mô tả ngắn..." />
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Kho hàng (mỗi tài khoản 1 dòng)</Label>
                      <Textarea
                        className="mt-1 bg-secondary border-border font-mono text-xs min-h-[120px]"
                        placeholder={"email1@gmail.com|password1\nemail2@gmail.com|password2\nemail3@gmail.com|password3"}
                      />
                    </div>
                    <Button variant="neon" className="w-full gap-1">
                      <Save className="h-4 w-4" /> Lưu sản phẩm
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="surface-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Sản phẩm</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Danh mục</TableHead>
                    <TableHead className="text-muted-foreground">Giá</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Kho</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Đã bán</TableHead>
                    <TableHead className="text-muted-foreground text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
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
                      <TableCell className="font-semibold text-sm">{formatVND(product.price)}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{product.stock}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{product.sold}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                    <TableHead className="text-muted-foreground text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-border">
                      <TableCell className="font-mono text-xs text-primary">{order.id}</TableCell>
                      <TableCell className="font-medium text-sm">{order.productName}</TableCell>
                      <TableCell className="font-semibold text-sm">{formatVND(order.price)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{order.date}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          order.status === "completed" ? "bg-neon-green/20 text-neon-green border-neon-green/30" :
                          order.status === "pending" ? "bg-warning/20 text-warning border-warning/30" :
                          "bg-destructive/20 text-destructive border-destructive/30"
                        }`}>
                          {order.status === "completed" ? "Hoàn thành" : order.status === "pending" ? "Đang xử lý" : "Đã hủy"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="mt-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Cấu hình hệ thống</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="surface-card rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Thông tin website</h4>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tên website</Label>
                  <Input
                    className="mt-1 bg-secondary border-border"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Logo</Label>
                  <div className="mt-1 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center font-display text-sm font-bold text-primary-foreground">
                      AC
                    </div>
                    <Button variant="neon-outline" size="sm" className="gap-1">
                      <Upload className="h-3.5 w-3.5" /> Đổi logo
                    </Button>
                  </div>
                </div>
                <Button variant="neon" className="w-full gap-1">
                  <Save className="h-4 w-4" /> Lưu thay đổi
                </Button>
              </div>

              <div className="surface-card rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-5 w-5 text-warning" />
                  <h4 className="font-semibold text-foreground">Thông báo toàn trang</h4>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nội dung thông báo</Label>
                  <Textarea
                    className="mt-1 bg-secondary border-border min-h-[80px]"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                  />
                </div>
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm text-primary">
                  Xem trước: {announcement}
                </div>
                <Button variant="neon" className="w-full gap-1">
                  <Save className="h-4 w-4" /> Cập nhật thông báo
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
