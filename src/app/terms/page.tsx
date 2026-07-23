import PublicLayout from "@/components/layout/PublicLayout";

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="bg-deep-navy text-white pt-28 pb-16">
        <div className="max-w-[1000px] mx-auto px-5 lg:px-16">
          <h1 className="font-caslon text-display-md text-champagne-gold mb-4">Terms &amp; Conditions</h1>
          <p className="font-jakarta text-white/70 text-sm">Last updated: July 2026</p>
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto px-5 lg:px-16 py-16 text-deep-navy font-jakarta space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">1. Service Agreement</h2>
          <p className="text-on-surface-variant text-sm">
            By accessing and booking services through Cairo Hangzhou, you agree to comply with these Terms &amp; Conditions. Our services include visa consultancy, tour package facilitation, flight bookings, and hotel reservations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">2. Pricing &amp; Payments in Egyptian Pounds (EGP)</h2>
          <p className="text-on-surface-variant text-sm">
            All prices listed on our website are explicitly denominated and billed in Egyptian Pounds (EGP) only. Payments are processed through secure Egyptian payment gateways. Any foreign transaction fees imposed by issuing banks are the responsibility of the cardholder.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">3. Visa Services Disclaimer</h2>
          <p className="text-on-surface-variant text-sm">
            Cairo Hangzhou acts as a specialized visa consultancy firm. The final decision to grant or deny a visa rests solely with the government and embassy of the respective destination country. Embassy government fees and consultancy processing fees are subject to embassy regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">4. User Responsibilities</h2>
          <p className="text-on-surface-variant text-sm">
            Applicants and travelers are responsible for providing authentic, complete, and accurate personal information and documents. Failure to supply accurate documentation may lead to delays or booking cancellations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">5. Applicable Law &amp; Jurisdiction</h2>
          <p className="text-on-surface-variant text-sm">
            These Terms &amp; Conditions are governed by and construed in accordance with the laws of the Arab Republic of Egypt. Any legal proceedings arising hereunder shall be subject to the exclusive jurisdiction of the Egyptian courts.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}
