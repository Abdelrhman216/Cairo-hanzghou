import PublicLayout from "@/components/layout/PublicLayout";

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="bg-deep-navy text-white pt-28 pb-16">
        <div className="max-w-[1000px] mx-auto px-5 lg:px-16">
          <h1 className="font-caslon text-display-md text-champagne-gold mb-4">Privacy Policy</h1>
          <p className="font-jakarta text-white/70 text-sm">Last updated: July 2026</p>
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto px-5 lg:px-16 py-16 text-deep-navy font-jakarta space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">1. Introduction</h2>
          <p className="text-on-surface-variant text-sm">
            Cairo Hangzhou ("we", "our", or "us") operates the travel services and visa consultancy platform. We respect your privacy and are committed to protecting your personal data in accordance with the Egyptian Data Protection Law (Law No. 151 of 2020) and international security standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">2. Information We Collect</h2>
          <p className="text-on-surface-variant text-sm">
            We collect personal information necessary to deliver travel and visa services, including:
          </p>
          <ul className="list-disc pl-6 text-sm text-on-surface-variant space-y-2">
            <td><strong>Personal Identification:</strong> Full name, passport details, nationality, date of birth.</td>
            <td><strong>Contact Details:</strong> Email address, mobile phone number, WhatsApp number, physical address in Egypt.</td>
            <td><strong>Travel Details:</strong> Flight preferences, hotel bookings, visa application documents.</td>
            <td><strong>Payment Data:</strong> Payment transaction details processed securely via Egyptian payment providers in Egyptian Pounds (EGP). We do not store full credit/debit card numbers on our servers.</td>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">3. How We Use Your Information</h2>
          <p className="text-on-surface-variant text-sm">
            Your data is used strictly for fulfilling travel requests, processing visa applications with respective embassies, processing EGP payments, providing support, and updating you regarding your bookings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">4. Payment & Data Security</h2>
          <p className="text-on-surface-variant text-sm">
            All online transactions on our website are conducted over HTTPS with 256-bit SSL encryption. All card payments are processed securely via PCI-DSS compliant Egyptian payment gateways. Card details are transmitted directly to the payment gateway and are never retained by Cairo Hangzhou.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-caslon text-2xl text-deep-navy font-bold">5. Contact Us</h2>
          <p className="text-on-surface-variant text-sm">
            If you have questions regarding our Privacy Policy or your personal data:
          </p>
          <div className="bg-sand-beige p-6 rounded-xl border border-outline-variant/30 text-sm space-y-2 text-deep-navy">
            <p><strong>Company Name:</strong> Cairo Hangzhou for Visa Consultancy &amp; Travel Services</p>
            <p><strong>Address:</strong> 14 EL-AHRAR STREET, ELDOKKII, Cairo, Egypt</p>
            <p><strong>Phone / WhatsApp:</strong> +20 114 942 2491</p>
            <p><strong>Support Email:</strong> info@cairohangzhou.com</p>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
