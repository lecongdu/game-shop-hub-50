import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { orders, depositHistory, currentUser, formatVND } from "@/data/mock-data";
import { ShoppingBag, Wallet, User, Calendar } from "lucide-react";

const statusColors = {
  completed: "bg-neon-green/20 text-neon-green border-neon-green/30",
  success: "bg-neon-green/20 text-neon-green border-neon-green/30",
  pending: "bg-warning/20 text-warning border-warning/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
  failed: "bg-destructive/20 text-destructive border-destructive/30",
};

const statusLabels: Record<string, string> = {
  completed: "Hoàn thành",
  success: "Thành công",
  pending: "Đang xử lý",
  cancelled: "Đã hủy",
  failed: "Thất bại",
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* User info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="surface-card rounded-xl p-5 neon-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Tham gia: {currentUser.joinDate}
            </p>
          </div>
          <div className="surface-card rounded-xl p-5">
            <Wallet className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Số dư</p>
            <p className="font-display text-2xl font-bold text-primary">{formatVND(currentUser.balance)}</p>
          </div>
          <div className="surface-card rounded-xl p-5">
            <ShoppingBag className="h-5 w-5 text-neon-green mb-2" />
            <p className="text-xs text-muted-foreground">Đã chi tiêu</p>
            <p className="font-display text-2xl font-bold text-neon-green">{formatVND(currentUser.totalSpent)}</p>
          </div>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="bg-secondary">
            <TabsTrigger value="orders">Lịch sử mua hàng</TabsTrigger>
            <TabsTrigger value="deposits">Lịch sử nạp tiền</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <div className="surface-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Mã đơn</TableHead>
                    <TableHead className="text-muted-foreground">Sản phẩm</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Thông tin</TableHead>
                    <TableHead className="text-muted-foreground">Giá</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Ngày</TableHead>
                    <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-border">
                      <TableCell className="font-mono text-xs text-primary">{order.id}</TableCell>
                      <TableCell className="font-medium text-sm">{order.productName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden md:table-cell font-mono">{order.accountInfo}</TableCell>
                      <TableCell className="font-semibold text-sm">{formatVND(order.price)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{order.date}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="deposits" className="mt-4">
            <div className="surface-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Mã giao dịch</TableHead>
                    <TableHead className="text-muted-foreground">Số tiền</TableHead>
                    <TableHead className="text-muted-foreground">Phương thức</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Ngày</TableHead>
                    <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositHistory.map((dep) => (
                    <TableRow key={dep.id} className="border-border">
                      <TableCell className="font-mono text-xs text-primary">{dep.id}</TableCell>
                      <TableCell className="font-semibold text-sm text-neon-green">+{formatVND(dep.amount)}</TableCell>
                      <TableCell className="text-sm">{dep.method}</TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{dep.date}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColors[dep.status]}`}>
                          {statusLabels[dep.status]}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
