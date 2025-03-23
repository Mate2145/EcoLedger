/**
 * Utility functions for token amount conversions
 */

/**
 * Convert a human-readable token amount to wei (with 18 decimals)
 * @param amount - Amount in tokens (e.g., 15 CAR)
 * @returns The amount in wei as a BigInt
 */
export function toWei(amount: number | string): bigint {
  // Convert string to number if needed
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid inputs
  if (isNaN(numAmount)) {
    throw new Error('Invalid amount');
  }
  
  // Convert to wei (18 decimals)
  return BigInt(Math.floor(numAmount * 10**18));
}

/**
 * Convert a wei amount to human-readable tokens
 * @param amount - Amount in wei (BigInt)
 * @returns The amount in tokens as a number
 */
export function fromWei(amount: bigint): number {
  return Number(amount) / 10**18;
}

/**
 * Format a token amount for display
 * @param amount - Amount in wei (BigInt)
 * @returns Formatted string for display
 */
export function formatTokenAmount(amount: bigint): string {
  if (!amount) return "0";
  
  const fullAmount = fromWei(amount);
  
  // Format based on the size of the number
  if (fullAmount < 0.001) {
    return fullAmount.toExponential(6);
  }
  
  return fullAmount.toFixed(
    fullAmount < 1 ? 6 : 2
  );
} 