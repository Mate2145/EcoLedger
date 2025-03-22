export enum TransactionType {
    PURCHASE = 'purchase',
    SALE = 'sale',
    DEPOSIT = 'deposit',
    WITHDRAWAL = 'withdrawal'
  }
  
  export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
  }
  
  export interface CarbonTransaction {
    id: string;
    offerId?: string;
    userId: string;
    organizationId?: string;
    type: TransactionType;
    tokenAmount: number;
    pricePerToken: number;
    totalAmount: number;
    currency: string;
    status: TransactionStatus;
    txHash?: string;
    createdAt: Date;
    completedAt?: Date;
  }
  
  export interface TransactionSummary {
    id: string;
    type: TransactionType;
    tokenAmount: number;
    totalAmount: number;
    currency: string;
    status: TransactionStatus;
    date: Date;
    counterpartyName?: string;
  }