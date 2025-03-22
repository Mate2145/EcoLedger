export enum OfferStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled'
  }
  
  export interface CarbonOffer {
    id: string;
    organizationId: string;
    organizationName: string;
    tokenAmount: number;
    pricePerToken: number;
    totalPrice: number;
    currency: string;
    description: string;
    expirationDate: Date;
    status: OfferStatus;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CarbonOfferSummary {
    id: string;
    organizationName: string;
    tokenAmount: number;
    pricePerToken: number;
    totalPrice: number;
    currency: string;
    expirationDate: Date;
    status: OfferStatus;
  }