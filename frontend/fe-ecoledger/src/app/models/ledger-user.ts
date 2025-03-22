export class LedgerUser {
    id: string;
    firstName: string;
    lastName: string;
    idNumber: string;
    phone: string;
    email: string;
    proofOfLand: string; // URL or file identifier for the uploaded certificate
  
    constructor(
      id: string = '',
      firstName: string = '',
      lastName: string = '',
      idNumber: string = '',
      phone: string = '',
      email: string = '',
      proofOfLand: string = ''
    ) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.idNumber = idNumber;
      this.phone = phone;
      this.email = email;
      this.proofOfLand = proofOfLand;
      
      console.debug('[LedgerUser] Created new user instance', this.getLogSafeUser());
    }
  
    /**
     * Returns a version of the user object safe for logging (without sensitive data)
     */
    getLogSafeUser(): any {
      return {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        hasProofOfLand: !!this.proofOfLand
      };
    }
  
    /**
     * Validates if the personal details are complete
     */
    isPersonalDetailsComplete(): boolean {
      const isComplete = !!(
        this.firstName &&
        this.lastName &&
        this.idNumber &&
        this.phone &&
        this.email
      );
      
      console.debug('[LedgerUser] Personal details complete:', isComplete);
      return isComplete;
    }
  
    /**
     * Validates if the registration is complete
     */
    isRegistrationComplete(): boolean {
      const isComplete = this.isPersonalDetailsComplete() && !!this.proofOfLand;
      console.debug('[LedgerUser] Registration complete:', isComplete);
      return isComplete;
    }
  
    /**
     * Checks if localStorage is available
     * @returns boolean indicating if localStorage is available
     */
    private static isLocalStorageAvailable(): boolean {
      try {
        return typeof window !== 'undefined' && !!window.localStorage;
      } catch (e) {
        return false;
      }
    }
  
    /**
     * Saves the user object to localStorage
     */
    saveToLocalStorage(): void {
      if (!LedgerUser.isLocalStorageAvailable()) {
        console.debug('[LedgerUser] localStorage not available, skipping save');
        return;
      }
      
      console.debug('[LedgerUser] Saving user to localStorage', this.getLogSafeUser());
      localStorage.setItem('currentUser', JSON.stringify(this));
    }
  
    /**
     * Retrieves the user object from localStorage
     * @returns LedgerUser object or null if not found
     */
    static getFromLocalStorage(): LedgerUser | null {
      if (!this.isLocalStorageAvailable()) {
        console.debug('[LedgerUser] localStorage not available, cannot retrieve user');
        return null;
      }
      
      const userData = localStorage.getItem('currentUser');
      if (!userData) {
        console.debug('[LedgerUser] No user found in localStorage');
        return null;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        console.debug('[LedgerUser] Retrieved user from localStorage', {
          id: parsedUser.id,
          email: parsedUser.email
        });
        
        return new LedgerUser(
          parsedUser.id,
          parsedUser.firstName,
          parsedUser.lastName,
          parsedUser.idNumber,
          parsedUser.phone,
          parsedUser.email,
          parsedUser.proofOfLand
        );
      } catch (error) {
        console.error('[LedgerUser] Error parsing user data from localStorage:', error);
        return null;
      }
    }
  
    /**
     * Removes the user object from localStorage
     */
    static removeFromLocalStorage(): void {
      if (!this.isLocalStorageAvailable()) {
        console.debug('[LedgerUser] localStorage not available, cannot remove user');
        return;
      }
      
      console.debug('[LedgerUser] Removing user from localStorage');
      localStorage.removeItem('currentUser');
    }
  
    /**
     * Checks if a user is currently logged in
     * @returns boolean indicating if a user is logged in
     */
    static isLoggedIn(): boolean {
      if (!this.isLocalStorageAvailable()) {
        console.debug('[LedgerUser] localStorage not available, user cannot be logged in');
        return false;
      }
      
      const isLoggedIn = !!localStorage.getItem('currentUser');
      console.debug('[LedgerUser] User is logged in:', isLoggedIn);
      return isLoggedIn;
    }
  }