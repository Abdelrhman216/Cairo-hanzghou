import PublicLayout from "@/components/layout/PublicLayout";

export default function ShippingPolicyPage() {
  return (
    <PublicLayout>
      <div className="bg-deep-navy text-white pt-28 pb-16">
        <div className="max-w-[1000px] mx-auto px-5 lg:px-16">
          <h1 className="font-caslon text-display-md text-champagne-gold mb-4">Service &amp; Document Delivery Policy</h1>
          <p className="font-jakarta text-white/70 text-sm">Last updated: July 2026</p>
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto px-5 lg:px-16 py-16 text-deep-navy font-jakarta space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">1. Digital Delivery of Electronic Services</h2>
          <p className="text-on-surface-variant text-sm">
            All primary services offered by Cairo Hangzhou (e-visas, hotel confirmation vouchers, flight e-tickets, and travel itineraries) are delivered digitally via email and made available directly in your account profile.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">2. Electronic Delivery Timelines</h2>
          <ul className="list-disc pl-6 text-sm text-on-surface-variant space-y-2">
            <td><strong>Flight E-Tickets:</strong> Sent immediately upon payment confirmation (within 1-2 hours).</td>
            <td><strong>Hotel Reservations:</strong> Sent instantly to your email upon booking confirmation.</td>
            <td><strong>Visa Processing Documents:</strong> Submission confirmations provided within 24 hours; official visa approvals emailed upon embassy issuance (typically 3-5 business days).</td>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">3. Physical Passport &amp; Document Courier</h2>
          <p className="text-on-surface-variant text-sm">
            For visa services requiring physical passport submission to embassies in Cairo, physical documents are returned securely via licensed Egyptian courier services or made available for pickup at our physical office:
          </p>
          <div className="bg-sand-beige p-5 rounded-xl border border-outline-variant/30 text-sm text-deep-navy mt-2">
            <p><strong>Pickup Address:</strong> 14 EL-AHRAR STREET, ELDOKKII, Cairo, Egypt</p>
            <p><strong>Delivery Fee:</strong> Standard domestic courier rates inside Egypt apply for door-to-door delivery.</p>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
