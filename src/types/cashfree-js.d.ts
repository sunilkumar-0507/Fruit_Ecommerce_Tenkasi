// Minimal ambient types for the official (untyped) Cashfree JS SDK.
// See https://www.cashfree.com/docs/payments/online/element/sdks
declare module '@cashfreepayments/cashfree-js' {
  export interface CashfreeCheckoutOptions {
    paymentSessionId: string
    /** '_modal' keeps checkout on-site; '_self' does a full-page redirect. */
    redirectTarget?: '_self' | '_blank' | '_top' | '_modal' | (string & {})
    returnUrl?: string
  }

  export interface CashfreeCheckoutResult {
    error?: { message?: string; code?: string }
    redirect?: boolean
    paymentDetails?: { paymentMessage?: string; [key: string]: unknown }
  }

  export interface Cashfree {
    checkout(options: CashfreeCheckoutOptions): Promise<CashfreeCheckoutResult>
  }

  export function load(options: { mode: 'sandbox' | 'production' }): Promise<Cashfree | null>
}
