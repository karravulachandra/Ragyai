class PaymentService {
  constructor(provider = process.env.PAYMENT_PROVIDER || 'DEMO_MODE') {
    this.provider = provider;
  }

  async createPayment(orderId, amount) {
    if (this.provider === 'DEMO_MODE') {
      // Simulate creating a payment intent
      return {
        success: true,
        transactionId: `demo_txn_${Date.now()}`,
        clientSecret: 'demo_secret_key',
        status: 'PENDING'
      };
    }
    // Future Stripe/PayPal integration goes here
    throw new Error('Payment provider not implemented');
  }

  async verifyPayment(transactionId) {
    if (this.provider === 'DEMO_MODE') {
      return { status: 'PAID' }; // Simulate successful payment
    }
    throw new Error('Payment provider not implemented');
  }

  async handleWebhook(payload, signature) {
    if (this.provider === 'DEMO_MODE') {
      return { success: true, orderId: payload.orderId, status: 'PAID' };
    }
    throw new Error('Payment provider not implemented');
  }
}

module.exports = new PaymentService();
