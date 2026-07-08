export interface ServicePackage {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  badge?: string;
  badgeColor?: string;
  features: string[];
  description: string;
  recommended?: boolean;
}

export interface Transaction {
  orderId: string;
  merchantOrderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerVillage: string;
  packageName: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "paid" | "failed" | "expired" | "pending_verification";
  proofOfPayment?: string; // base64 receipt
  reference?: string;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}
