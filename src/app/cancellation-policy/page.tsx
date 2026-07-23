import PublicLayout from "@/components/layout/PublicLayout";

export default function CancellationPolicyPage() {
  return (
    <PublicLayout>
      <div className="bg-deep-navy text-white pt-28 pb-16">
        <div className="max-w-[1000px] mx-auto px-5 lg:px-16">
          <h1 className="font-caslon text-display-md text-champagne-gold mb-4">Cancellation Policy</h1>
          <p className="font-jakarta text-white/70 text-sm">Last updated: July 2026</p>
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto px-5 lg:px-16 py-16 text-deep-navy font-jakarta space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">1. Cancellation Windows</h2>
          <p className="text-on-surface-variant text-sm">
            Customers may cancel travel reservations through their account dashboard or by submitting a written notice to our customer service desk.
          </p>
          <ul className="list-disc pl-6 text-sm text-on-surface-variant space-y-2">
            <td><strong>More than 14 days before trip:</strong> Free cancellation with minimal administrative processing fee.</td>
            <td><strong>7 to 14 days before trip:</strong> 30% cancellation penalty applied.</td>
            <td><strong>Less than 7 days before trip:</strong> Subject to individual hotel, airline, and partner non-refundable terms.</td>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">2. Force Majeure</h2>
          <p className="text-on-surface-variant text-sm">
            In events of natural disasters, travel bans, official government warnings, or political instability, Cairo Hangzhou works closely with international travel partners to issue full travel credits or fee waivers where possible.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}
