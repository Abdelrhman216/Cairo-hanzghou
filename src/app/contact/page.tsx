"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslation } from "@/components/layout/I18nProvider";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const { locale, dir } = useTranslation();
  const isRtl = dir === "rtl";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-deep-navy text-white pt-28 pb-16 lg:pt-36 lg:pb-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16 text-center">
          <p className="font-jakarta text-label-sm text-champagne-gold uppercase tracking-[0.2em] font-bold mb-3">
            {locale === "en" ? "Get in Touch" : "تواصل معنا"}
          </p>
          <h1 className="font-caslon text-display-md lg:text-display-lg text-white mb-4">
            {locale === "en" ? "Contact Cairo Hangzhou" : "اتصل بالقاهرة هانغتشو"}
          </h1>
          <p className="font-jakarta text-body-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            {locale === "en"
              ? "We are here to assist with all your travel arrangements, visa applications, and corporate travel needs in Egypt."
              : "نحن هنا لمساعدتك في جميع ترتيبات السفر، طلبات التأشيرات، وخدمات سفر الشركات في مصر."}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="font-caslon text-headline-lg text-deep-navy mb-6">
                  {locale === "en" ? "Egyptian Head Office" : "المقر الرئيسي في مصر"}
                </h2>
                <p className="font-jakarta text-body-md text-on-surface-variant leading-relaxed mb-8">
                  {locale === "en"
                    ? "Visit our agency office in Cairo or reach out via phone, WhatsApp, or email."
                    : "تفضل بزيارة مقر شركتنا في القاهرة أو تواصل معنا عبر الهاتف، الواتساب أو البريد الإلكتروني."}
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className={cn("p-5 bg-white rounded-xl shadow-luxury border border-outline-variant/20 flex items-start gap-4", isRtl && "flex-row-reverse text-right")}>
                  <div className="w-12 h-12 rounded-xl bg-sand-beige text-champagne-gold flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">location_on</span>
                  </div>
                  <div>
                    <h3 className="font-jakarta font-bold text-deep-navy text-sm mb-1">
                      {locale === "en" ? "Address" : "العنوان"}
                    </h3>
                    <p className="font-jakarta text-xs text-on-surface-variant leading-relaxed">
                      Cairo Hangzhou for Visa Consultancy &amp; Travel Services<br />
                      14 EL-AHRAR STREET, ELDOKKII, Cairo, Egypt
                    </p>
                  </div>
                </div>

                <div className={cn("p-5 bg-white rounded-xl shadow-luxury border border-outline-variant/20 flex items-start gap-4", isRtl && "flex-row-reverse text-right")}>
                  <div className="w-12 h-12 rounded-xl bg-sand-beige text-champagne-gold flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">call</span>
                  </div>
                  <div>
                    <h3 className="font-jakarta font-bold text-deep-navy text-sm mb-1">
                      {locale === "en" ? "Phone & WhatsApp" : "الهاتف والواتساب"}
                    </h3>
                    <p className="font-jakarta text-xs text-on-surface-variant leading-relaxed">
                      Mobile / Call: <a href="tel:+201149422491" className="text-champagne-gold font-bold hover:underline">+20 114 942 2491</a><br />
                      WhatsApp: <a href="https://wa.me/201149422491" target="_blank" className="text-green-600 font-bold hover:underline">+20 114 942 2491</a>
                    </p>
                  </div>
                </div>

                <div className={cn("p-5 bg-white rounded-xl shadow-luxury border border-outline-variant/20 flex items-start gap-4", isRtl && "flex-row-reverse text-right")}>
                  <div className="w-12 h-12 rounded-xl bg-sand-beige text-champagne-gold flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">mail</span>
                  </div>
                  <div>
                    <h3 className="font-jakarta font-bold text-deep-navy text-sm mb-1">
                      {locale === "en" ? "Email & Hours" : "البريد الإلكتروني وأوقات العمل"}
                    </h3>
                    <p className="font-jakarta text-xs text-on-surface-variant leading-relaxed">
                      Email: <a href="mailto:info@cairohangzhou.com" className="text-champagne-gold font-bold hover:underline">info@cairohangzhou.com</a><br />
                      Working Hours: Sun – Thu: 9:00 AM – 6:00 PM (EGY)
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <a
                href="https://wa.me/201149422491"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-jakarta font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-luxury duration-300"
              >
                <span className="material-symbols-outlined text-xl">chat</span>
                {locale === "en" ? "Chat on WhatsApp (+20 114 942 2491)" : "تحدث معنا عبر الواتساب (+20 114 942 2491)"}
              </a>
            </div>

            {/* Form & Map Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* Form */}
              <div className="bg-white rounded-2xl p-8 shadow-luxury-lg border border-outline-variant/20">
                <h2 className="font-caslon text-headline-md text-deep-navy mb-6">
                  {locale === "en" ? "Send Us a Message" : "أرسل لنا رسالة"}
                </h2>

                {submitted ? (
                  <div className="bg-green-50 text-green-800 p-8 rounded-xl text-center space-y-3">
                    <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                    <h3 className="font-caslon text-2xl font-bold">
                      {locale === "en" ? "Message Sent Successfully!" : "تم إرسال رسالتك بنجاح!"}
                    </h3>
                    <p className="font-jakarta text-sm">
                      {locale === "en"
                        ? "Thank you for contacting Cairo Hangzhou. One of our travel consultants will respond within 24 hours."
                        : "شكراً لتواصلك مع القاهرة هانغتشو. سيرد عليك أحد مستشاري السفر لدينا خلال 24 ساعة."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-jakarta text-xs font-semibold text-deep-navy mb-1.5">
                          {locale === "en" ? "Full Name *" : "الاسم الكامل *"}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ahmed Hassan"
                          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-sm font-jakarta focus:outline-none focus:border-champagne-gold"
                        />
                      </div>
                      <div>
                        <label className="block font-jakarta text-xs font-semibold text-deep-navy mb-1.5">
                          {locale === "en" ? "Email Address *" : "البريد الإلكتروني *"}
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-sm font-jakarta focus:outline-none focus:border-champagne-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-jakarta text-xs font-semibold text-deep-navy mb-1.5">
                          {locale === "en" ? "Mobile / Phone *" : "رقم الهاتف *"}
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+20 100 000 0000"
                          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-sm font-jakarta focus:outline-none focus:border-champagne-gold"
                        />
                      </div>
                      <div>
                        <label className="block font-jakarta text-xs font-semibold text-deep-navy mb-1.5">
                          {locale === "en" ? "Service Inquiry" : "نوع الخدمة المطلوبة"}
                        </label>
                        <select className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-sm font-jakarta focus:outline-none focus:border-champagne-gold">
                          <option>{locale === "en" ? "Visa Consultancy" : "استشارات التأشيرات"}</option>
                          <option>{locale === "en" ? "Tour Packages" : "البرامج السياحية"}</option>
                          <option>{locale === "en" ? "Flight Reservation" : "حجوزات الطيران"}</option>
                          <option>{locale === "en" ? "Hotel Booking" : "حجوزات الفنادق"}</option>
                          <option>{locale === "en" ? "Corporate & Other" : "خدمات الشركات والأخرى"}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-deep-navy mb-1.5">
                        {locale === "en" ? "Your Message *" : "رسالتك *"}
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder={locale === "en" ? "How can we assist you with your travel plans?" : "كيف يمكننا مساعدتك في ترتيبات سفرك؟"}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-sm font-jakarta focus:outline-none focus:border-champagne-gold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-deep-navy hover:bg-champagne-gold hover:text-deep-navy text-white font-jakarta font-bold py-4 rounded-xl transition-all duration-300 active:scale-95"
                    >
                      {loading ? (locale === "en" ? "Sending..." : "جاري الإرسال...") : (locale === "en" ? "Send Inquiry" : "إرسال الاستفسار")}
                    </button>
                  </form>
                )}
              </div>

              {/* Embedded Google Map */}
              <div className="bg-white rounded-2xl p-4 shadow-luxury-lg border border-outline-variant/20 overflow-hidden">
                <h3 className="font-caslon text-headline-sm text-deep-navy px-4 pt-2 mb-3">
                  {locale === "en" ? "Location Map" : "خريطة الموقع"}
                </h3>
                <div className="w-full h-72 rounded-xl overflow-hidden border border-outline-variant/30">
                  <iframe
                    title="Cairo Hangzhou Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.648202976868!2d31.2098679!3d30.0469032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458413155555555%3A0x1!2sDokki%2C%20Giza%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
