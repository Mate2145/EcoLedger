export interface TokenBalance {
    symbol: string;
    name: string;
    amount: number;
    usdValue: number;
    icon?: string;
  }
  
  export interface WalletBalance {
    address: string;
    carbonTokens: TokenBalance;
    usdcBalance: TokenBalance;
    otherTokens?: TokenBalance[];
    totalUsdValue: number;
    lastUpdated: Date;
  }