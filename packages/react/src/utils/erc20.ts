/**
 * ERC-20 approve calldata encoder. Zero dependencies — just hex math.
 *
 * Encodes: approve(address spender, uint256 amount)
 */

// bytes4(keccak256("approve(address,uint256)"))
const APPROVE_SELECTOR = "0x095ea7b3";

function padAddress(address: string): string {
  // Remove 0x prefix, lowercase, pad to 32 bytes (64 hex chars)
  return address.slice(2).toLowerCase().padStart(64, "0");
}

function padUint256(value: string): string {
  // Convert decimal string to hex, pad to 32 bytes (64 hex chars)
  const hex = BigInt(value).toString(16);
  return hex.padStart(64, "0");
}

/**
 * Builds calldata for `approve(spender, amount)`.
 * Approves only the exact amount needed for the transaction.
 * Returns a transaction-ready object `{ to, data, value }`.
 */
export function encodeApproveCalldata(
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
): { to: string; data: string; value: string } {
  const data = APPROVE_SELECTOR + padAddress(spenderAddress) + padUint256(amount);
  return { to: tokenAddress, data, value: "0" };
}
