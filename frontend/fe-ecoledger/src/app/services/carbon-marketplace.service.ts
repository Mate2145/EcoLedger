import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { CarbonOffer, OfferStatus, CarbonOfferSummary } from '../models/carbon-offer.model';
import { CarbonTransaction, TransactionStatus, TransactionType, TransactionSummary } from '../models/carbon-transaction.model';
import { WalletBalance, TokenBalance } from '../models/wallet-balance.model';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class CarbonMarketplaceService {
  private mockOffers: CarbonOffer[] = [];
  private mockTransactions: CarbonTransaction[] = [];
  private mockWalletBalance: WalletBalance | null = null;

  constructor(
    private authService: AuthService,
    private logger: LoggerService
  ) {
    this.initializeMockData();
  }

  /**
   * Get all active offers
   */
  getActiveOffers(): Observable<CarbonOfferSummary[]> {
    this.logger.debug('Fetching active offers');
    
    return of(this.mockOffers.filter(offer => offer.status === OfferStatus.ACTIVE))
      .pipe(
        delay(800),
        map(offers => offers.map(offer => this.mapToOfferSummary(offer))),
        tap(offers => this.logger.debug(`Retrieved ${offers.length} active offers`))
      );
  }

  /**
   * Get offer details by ID
   */
  getOfferById(offerId: string): Observable<CarbonOffer | null> {
    this.logger.debug(`Fetching offer details for ID: ${offerId}`);
    
    const offer = this.mockOffers.find(o => o.id === offerId);
    
    if (!offer) {
      this.logger.warn(`Offer with ID ${offerId} not found`);
      return throwError(() => new Error('Offer not found'));
    }
    
    return of(offer).pipe(
      delay(500),
      tap(offer => this.logger.debug('Retrieved offer details', { offerId: offer.id }))
    );
  }

  /**
   * Get user's transaction history
   */
  getUserTransactions(): Observable<TransactionSummary[]> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.logger.warn('Cannot fetch transactions: No user logged in');
      return throwError(() => new Error('User not authenticated'));
    }
    
    this.logger.debug(`Fetching transactions for user: ${currentUser.id}`);
    
    const userTransactions = this.mockTransactions.filter(tx => tx.userId === currentUser.id);
    
    return of(userTransactions).pipe(
      delay(800),
      map(transactions => transactions.map(tx => this.mapToTransactionSummary(tx))),
      tap(transactions => this.logger.debug(`Retrieved ${transactions.length} transactions for user`))
    );
  }

  /**
   * Get transaction details by ID
   */
  getTransactionById(transactionId: string): Observable<CarbonTransaction | null> {
    this.logger.debug(`Fetching transaction details for ID: ${transactionId}`);
    
    const transaction = this.mockTransactions.find(tx => tx.id === transactionId);
    
    if (!transaction) {
      this.logger.warn(`Transaction with ID ${transactionId} not found`);
      return throwError(() => new Error('Transaction not found'));
    }
    
    return of(transaction).pipe(
      delay(500),
      tap(tx => this.logger.debug('Retrieved transaction details', { transactionId: tx.id }))
    );
  }

  /**
   * Get user's wallet balance
   */
  getWalletBalance(): Observable<WalletBalance | null> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.logger.warn('Cannot fetch wallet balance: No user logged in');
      return throwError(() => new Error('User not authenticated'));
    }
    
    this.logger.debug(`Fetching wallet balance for user: ${currentUser.id}`);
    
    // In a real app, you would fetch the balance from the blockchain
    return of(this.mockWalletBalance).pipe(
      delay(600),
      tap(balance => {
        if (balance) {
          this.logger.debug('Retrieved wallet balance', { 
            carbonTokens: balance.carbonTokens.amount,
            usdcBalance: balance.usdcBalance.amount
          });
        }
      })
    );
  }

  /**
   * Accept an offer and exchange tokens
   */
  acceptOffer(offerId: string, amount: number): Observable<TransactionSummary> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.logger.warn('Cannot accept offer: No user logged in');
      return throwError(() => new Error('User not authenticated'));
    }
    
    this.logger.debug(`User ${currentUser.id} accepting offer ${offerId} for ${amount} tokens`);
    
    const offer = this.mockOffers.find(o => o.id === offerId);
    
    if (!offer) {
      this.logger.warn(`Offer with ID ${offerId} not found`);
      return throwError(() => new Error('Offer not found'));
    }
    
    if (offer.status !== OfferStatus.ACTIVE) {
      this.logger.warn(`Cannot accept offer ${offerId}: Offer is not active`);
      return throwError(() => new Error('Offer is not active'));
    }
    
    if (amount > offer.tokenAmount) {
      this.logger.warn(`Cannot accept offer ${offerId}: Requested amount exceeds available tokens`);
      return throwError(() => new Error('Requested amount exceeds available tokens'));
    }
    
    if (!this.mockWalletBalance || this.mockWalletBalance.carbonTokens.amount < amount) {
      this.logger.warn(`Cannot accept offer ${offerId}: Insufficient token balance`);
      return throwError(() => new Error('Insufficient token balance'));
    }
    
    // Create a new transaction
    const transaction: CarbonTransaction = {
      id: `tx_${Math.random().toString(36).substring(2, 11)}`,
      offerId: offer.id,
      userId: currentUser.id,
      organizationId: offer.organizationId,
      type: TransactionType.SALE,
      tokenAmount: amount,
      pricePerToken: offer.pricePerToken,
      totalAmount: amount * offer.pricePerToken,
      currency: offer.currency,
      status: TransactionStatus.COMPLETED,
      txHash: `0x${Math.random().toString(36).substring(2, 34)}`,
      createdAt: new Date(),
      completedAt: new Date()
    };
    
    // Update the offer
    if (amount === offer.tokenAmount) {
      offer.status = OfferStatus.COMPLETED;
    } else {
      offer.tokenAmount -= amount;
      offer.totalPrice = offer.tokenAmount * offer.pricePerToken;
    }
    
    // Update the wallet balance
    if (this.mockWalletBalance) {
      this.mockWalletBalance.carbonTokens.amount -= amount;
      this.mockWalletBalance.usdcBalance.amount += transaction.totalAmount;
      this.mockWalletBalance.totalUsdValue = 
        this.mockWalletBalance.carbonTokens.amount * this.mockWalletBalance.carbonTokens.usdValue +
        this.mockWalletBalance.usdcBalance.amount;
      this.mockWalletBalance.lastUpdated = new Date();
    }
    
    // Add the transaction to the mock data
    this.mockTransactions.push(transaction);
    
    this.logger.info('Offer accepted successfully', {
      offerId: offer.id,
      transactionId: transaction.id,
      amount,
      totalValue: transaction.totalAmount
    });
    
    return of(this.mapToTransactionSummary(transaction)).pipe(
      delay(1500),
      tap(tx => this.logger.debug('Transaction completed', { transactionId: tx.id }))
    );
  }

  /**
   * Initialize mock data for development
   */
  private initializeMockData(): void {
    // Create mock offers
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    this.mockOffers = [
      {
        id: 'offer_1',
        organizationId: 'org_1',
        organizationName: 'EcoTech Solutions',
        tokenAmount: 200,
        pricePerToken: 10,
        totalPrice: 2000,
        currency: 'USDC',
        description: 'We are looking to purchase carbon credits to offset our annual emissions. Our goal is to achieve carbon neutrality by the end of the fiscal year.',
        expirationDate: oneWeekLater,
        status: OfferStatus.ACTIVE,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'offer_2',
        organizationId: 'org_2',
        organizationName: 'Green Future Inc.',
        tokenAmount: 500,
        pricePerToken: 12,
        totalPrice: 6000,
        currency: 'USDC',
        description: 'As part of our sustainability initiative, we are seeking to purchase carbon credits from verified sources. These credits will help us meet our ESG goals for the quarter.',
        expirationDate: twoWeeksLater,
        status: OfferStatus.ACTIVE,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'offer_3',
        organizationId: 'org_3',
        organizationName: 'Sustainable Ventures',
        tokenAmount: 100,
        pricePerToken: 15,
        totalPrice: 1500,
        currency: 'USDC',
        description: 'We are committed to reducing our carbon footprint and are looking to purchase carbon credits to offset our operations. We value transparency and sustainability in our partnerships.',
        expirationDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        status: OfferStatus.ACTIVE,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      }
    ];
    
    // Create mock transactions
    this.mockTransactions = [
      {
        id: 'tx_1',
        userId: 'user_1',
        type: TransactionType.DEPOSIT,
        tokenAmount: 300,
        pricePerToken: 0,
        totalAmount: 0,
        currency: 'CARBON',
        status: TransactionStatus.COMPLETED,
        txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'tx_2',
        offerId: 'offer_past_1',
        userId: 'user_1',
        organizationId: 'org_4',
        type: TransactionType.SALE,
        tokenAmount: 50,
        pricePerToken: 8,
        totalAmount: 400,
        currency: 'USDC',
        status: TransactionStatus.COMPLETED,
        txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
      }
    ];
    
    // Create mock wallet balance
    this.mockWalletBalance = {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      carbonTokens: {
        symbol: 'CARBON',
        name: 'Carbon Credits',
        amount: 250,
        usdValue: 10,
        icon: 'assets/icons/carbon-token.svg'
      },
      usdcBalance: {
        symbol: 'USDC',
        name: 'USD Coin',
        amount: 400,
        usdValue: 1,
        icon: 'assets/icons/usdc.svg'
      },
      totalUsdValue: 2900, // 250 * 10 + 400 * 1
      lastUpdated: new Date()
    };
  }

  /**
   * Map a CarbonOffer to a CarbonOfferSummary
   */
  private mapToOfferSummary(offer: CarbonOffer): CarbonOfferSummary {
    return {
      id: offer.id,
      organizationName: offer.organizationName,
      tokenAmount: offer.tokenAmount,
      pricePerToken: offer.pricePerToken,
      totalPrice: offer.totalPrice,
      currency: offer.currency,
      expirationDate: offer.expirationDate,
      status: offer.status
    };
  }

  /**
   * Map a CarbonTransaction to a TransactionSummary
   */
  private mapToTransactionSummary(transaction: CarbonTransaction): TransactionSummary {
    const offer = transaction.offerId 
      ? this.mockOffers.find(o => o.id === transaction.offerId) 
      : null;
    
    return {
      id: transaction.id,
      type: transaction.type,
      tokenAmount: transaction.tokenAmount,
      totalAmount: transaction.totalAmount,
      currency: transaction.currency,
      status: transaction.status,
      date: transaction.completedAt || transaction.createdAt,
      counterpartyName: offer?.organizationName
    };
  }
}