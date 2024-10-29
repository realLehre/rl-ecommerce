interface PaystackPopOptions {
  key?: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  callback?: (response: any) => void;
  onClose?: () => void;
  metadata?: any;
}

declare class PaystackPop {
  newTransaction(options: PaystackPopOptions): void;
}

declare const PaystackPop: {
  new (): PaystackPop;
};
