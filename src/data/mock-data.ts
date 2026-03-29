export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  image: string;
  description: string;
}

export interface Order {
  id: string;
  productName: string;
  accountInfo: string;
  price: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
}

export interface DepositHistory {
  id: string;
  amount: number;
  method: string;
  date: string;
  status: "success" | "pending" | "failed";
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  totalSpent: number;
  joinDate: string;
}

export const categories = ["Tất cả", "Netflix", "Spotify", "Game", "YouTube Premium", "Discord Nitro", "Canva Pro"];

export const products: Product[] = [
  { id: "1", name: "Netflix Premium 1 Tháng", category: "Netflix", price: 45000, stock: 128, sold: 1240, image: "🎬", description: "Tài khoản Netflix Premium UHD 4K" },
  { id: "2", name: "Spotify Premium 6 Tháng", category: "Spotify", price: 65000, stock: 85, sold: 890, image: "🎵", description: "Spotify Premium không quảng cáo" },
  { id: "3", name: "Valorant Account Lv30+", category: "Game", price: 120000, stock: 42, sold: 560, image: "🎮", description: "Tài khoản Valorant Level 30+ Full Agent" },
  { id: "4", name: "YouTube Premium 1 Năm", category: "YouTube Premium", price: 150000, stock: 63, sold: 420, image: "📺", description: "YouTube Premium không quảng cáo, có YouTube Music" },
  { id: "5", name: "Discord Nitro 3 Tháng", category: "Discord Nitro", price: 80000, stock: 95, sold: 730, image: "💬", description: "Discord Nitro full boost, emoji, upload" },
  { id: "6", name: "Canva Pro 1 Năm", category: "Canva Pro", price: 99000, stock: 55, sold: 380, image: "🎨", description: "Canva Pro đầy đủ tính năng thiết kế" },
  { id: "7", name: "PUBG Mobile UC Package", category: "Game", price: 200000, stock: 30, sold: 290, image: "🔫", description: "Gói UC PUBG Mobile giá rẻ" },
  { id: "8", name: "Netflix Standard 3 Tháng", category: "Netflix", price: 99000, stock: 70, sold: 650, image: "🎬", description: "Tài khoản Netflix Standard Full HD" },
  { id: "9", name: "Genshin Impact AR45+", category: "Game", price: 350000, stock: 15, sold: 180, image: "⚔️", description: "Tài khoản Genshin Impact AR45+ nhiều 5 sao" },
  { id: "10", name: "Spotify Premium 1 Năm", category: "Spotify", price: 110000, stock: 48, sold: 520, image: "🎵", description: "Spotify Premium 12 tháng liên tục" },
  { id: "11", name: "League of Legends Unranked", category: "Game", price: 75000, stock: 100, sold: 940, image: "🏆", description: "Tài khoản LOL Unranked sẵn rank" },
  { id: "12", name: "Discord Nitro 1 Năm", category: "Discord Nitro", price: 250000, stock: 22, sold: 150, image: "💬", description: "Discord Nitro 12 tháng full feature" },
];

export const orders: Order[] = [
  { id: "ORD-001", productName: "Netflix Premium 1 Tháng", accountInfo: "user***@gmail.com | pass: ****", price: 45000, date: "2024-03-28", status: "completed" },
  { id: "ORD-002", productName: "Spotify Premium 6 Tháng", accountInfo: "spot***@mail.com | pass: ****", price: 65000, date: "2024-03-27", status: "completed" },
  { id: "ORD-003", productName: "Valorant Account Lv30+", accountInfo: "val***@riot.com | pass: ****", price: 120000, date: "2024-03-26", status: "completed" },
  { id: "ORD-004", productName: "YouTube Premium 1 Năm", accountInfo: "Đang xử lý...", price: 150000, date: "2024-03-28", status: "pending" },
];

export const depositHistory: DepositHistory[] = [
  { id: "DEP-001", amount: 200000, method: "Momo", date: "2024-03-28", status: "success" },
  { id: "DEP-002", amount: 500000, method: "Ngân hàng", date: "2024-03-25", status: "success" },
  { id: "DEP-003", amount: 100000, method: "Thẻ cào", date: "2024-03-20", status: "success" },
  { id: "DEP-004", amount: 300000, method: "Momo", date: "2024-03-29", status: "pending" },
];

export const currentUser: User = {
  id: "USR-001",
  name: "CyberGamer",
  email: "cyber@gamer.vn",
  balance: 580000,
  totalSpent: 1250000,
  joinDate: "2024-01-15",
};

export const adminStats = {
  totalRevenue: 45680000,
  totalOrders: 3240,
  totalUsers: 1580,
  totalProducts: 48,
  revenueChart: [
    { month: "T1", revenue: 3200000 },
    { month: "T2", revenue: 4100000 },
    { month: "T3", revenue: 3800000 },
    { month: "T4", revenue: 5200000 },
    { month: "T5", revenue: 4900000 },
    { month: "T6", revenue: 6300000 },
    { month: "T7", revenue: 5800000 },
    { month: "T8", revenue: 7100000 },
    { month: "T9", revenue: 5280000 },
  ],
};

export const formatVND = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
