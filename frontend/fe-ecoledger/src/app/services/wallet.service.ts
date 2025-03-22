import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export enum WalletType {
  METAMASK = 'MetaMask',
  // Other wallet types can be added here in the future
  NONE = 'None'
}

export interface WalletInfo {
  address: string;
  type: WalletType;
  balance: string;
  connected: boolean;
  chainId?: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private walletSubject = new BehaviorSubject<WalletInfo | null>(null);
  public wallet$ = this.walletSubject.asObservable();

  constructor() {
    this.initFromLocalStorage();
    this.setupEventListeners();
  }

  private initFromLocalStorage(): void {
    try {
      const savedWallet = localStorage.getItem('connectedWallet');
      if (savedWallet) {
        const walletInfo = JSON.parse(savedWallet);
        // Don't automatically set as connected, require reconnection
        walletInfo.connected = false;
        this.walletSubject.next(walletInfo);
        console.info('Loaded wallet info from storage', { address: walletInfo.address, type: walletInfo.type });
      }
    } catch (error) {
      console.error('Error loading wallet from localStorage', error);
    }
  }

  private setupEventListeners(): void {
    if (typeof window !== 'undefined') {
      // Listen for account changes in MetaMask
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          console.info('MetaMask accounts changed', accounts);
          if (accounts.length === 0) {
            this.disconnectWallet();
          } else if (this.walletSubject.value?.type === WalletType.METAMASK) {
            this.connectMetaMask().subscribe();
          }
        });

        window.ethereum.on('chainChanged', (chainId: string) => {
          console.info('MetaMask chain changed', { chainId });
          if (this.walletSubject.value?.type === WalletType.METAMASK) {
            this.connectMetaMask().subscribe();
          }
        });
      }
    }
  }

  public connectWallet(type: WalletType): Observable<WalletInfo | null> {
    console.info('Connecting wallet', { type });
    
    switch (type) {
      case WalletType.METAMASK:
        return this.connectMetaMask();
      // Additional wallet types can be added here
      default:
        console.warn('Unknown wallet type', { type });
        return of(null);
    }
  }

  private connectMetaMask(): Observable<WalletInfo | null> {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.warn('MetaMask not available');
      return of(null);
    }

    return from(window.ethereum.request({ method: 'eth_requestAccounts' })).pipe(
      tap((accounts: string[]) => {
        if (accounts.length > 0) {
          const address = accounts[0];
          
          // Add null check before accessing window.ethereum
          if (window.ethereum) {
            // Get chain ID
            window.ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => {
              // Mock balance for demo purposes
              const balance = '1.234 ETH';
              
              const walletInfo: WalletInfo = {
                address,
                type: WalletType.METAMASK,
                balance,
                connected: true,
                chainId
              };
              
              this.walletSubject.next(walletInfo);
              localStorage.setItem('connectedWallet', JSON.stringify(walletInfo));
              console.info('MetaMask connected', { address, chainId });
            });
          }
        }
      }),
      map(() => this.walletSubject.value),
      catchError(error => {
        console.error('Error connecting to MetaMask', error);
        return of(null);
      })
    );
  }

  public disconnectWallet(): void {
    const currentWallet = this.walletSubject.value;
    if (!currentWallet) return;

    console.info('Disconnecting wallet', { type: currentWallet.type, address: currentWallet.address });
    
    // Update state
    localStorage.removeItem('connectedWallet');
    this.walletSubject.next(null);
  }

  public getWalletInfo(): WalletInfo | null {
    return this.walletSubject.value;
  }

  public isWalletConnected(): boolean {
    return !!this.walletSubject.value?.connected;
  }

  // Mock method to simulate token transfer
  public transferTokens(to: string, amount: number): Observable<boolean> {
    console.info('Transferring tokens', { to, amount });
    
    // Simulate network delay
    return new Observable(observer => {
      setTimeout(() => {
        // 90% success rate for demo
        const success = Math.random() < 0.9;
        
        if (success) {
          console.info('Token transfer successful', { to, amount });
          observer.next(true);
        } else {
          console.error('Token transfer failed', { to, amount });
          observer.next(false);
        }
        
        observer.complete();
      }, 2000);
    });
  }

  // Mock method to get token balance
  public getTokenBalance(): Observable<number> {
    return of(Math.floor(Math.random() * 1000));
  }
}