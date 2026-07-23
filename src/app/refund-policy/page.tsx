import PublicLayout from "@/components/layout/PublicLayout";

export default function RefundPolicyPage() {
  return (
    <PublicLayout>
      <div className="bg-deep-navy text-white pt-28 pb-16">
        <div className="max-w-[1000px] mx-auto px-5 lg:px-16">
          <h1 className="font-caslon text-display-md text-champagne-gold mb-4">Refund Policy</h1>
          <p className="font-jakarta text-white/70 text-sm">Last updated: July 2026</p>
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto px-5 lg:px-16 py-16 text-deep-navy font-jakarta space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">1. Overview</h2>
          <p className="text-on-surface-variant text-sm">
            At Cairo Hangzhou, customer satisfaction is paramount. This policy details the eligibility and process for requesting refunds for services booked on our platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">2. Service Refund Terms</h2>
          <div className="space-y-4 text-sm text-on-surface-variant">
            <div className="bg-surface p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-bold text-deep-navy mb-1">Tour Packages &amp; Stays</h3>
              <p>Refund requests submitted 14+ days prior to scheduled departure are eligible for a full refund minus provider processing charges. Requests made within 7-13 days are subject to a 30% fee. Cancellations under 7 days may incur supplier non-refundable costs.</p>
            </div>
            <div className="bg-surface p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-bold text-deep-navy mb-1">Flight Tickets</h3>
              <p>Flight refunds are governed by airline fare rules (refundable vs. non-refundable tickets). Approved refunds will be returned according to the airline's reimbursement timeline.</p>
            </div>
            <div className="bg-surface p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-bold text-deep-navy mb-1">Visa Consultancy Services</h3>
              <p>Government embassy fees paid directly to foreign consulates are non-refundable once submitted. Cairo Hangzhou consultancy fees may be partially refunded if document processing has not commenced.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">3. Refund Processing &amp; Currency</h2>
          <p className="text-on-surface-variant text-sm">
            All approved refunds are credited back in <strong>Egyptian Pounds (EGP)</strong> using the original payment method (credit card, debit card, or Fawry). Refunds typically take 7 to 14 business days to reflect in your account depending on your issuing bank.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">4. How to Request a Refund</h2>
          <p className="text-on-surface-variant text-sm">
            To request a refund, please contact our support team at <a href="mailto:info@cairohangzhou.com" className="text-champagne-gold underline font-semibold">info@cairohangzhou.com</a> or via WhatsApp at <strong>+20 114 942 2491</strong> with your Booking reference number.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}
