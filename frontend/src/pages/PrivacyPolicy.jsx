import { Link } from "react-router-dom"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import PageHero from "@/components/PageHero"
import { usePageSeo } from "@/hooks/usePageSeo"

const PRIVACY_META = {
  title: "Privacy Policy | Salonyst",
  description: "How Salonyst collects, uses, and protects your data. Our commitment to privacy for salons, spas, and beauty businesses.",
}

const LAST_UPDATED = "January 25, 2025"

export default function PrivacyPolicy() {
  usePageSeo(PRIVACY_META.title, PRIVACY_META.description)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationHeader />
      <PageHero
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        title="Privacy Policy"
        description={`Last updated: ${LAST_UPDATED}. We take your privacy seriously.`}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-3xl">
        <article className="prose prose-gray max-w-none">
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Salonyst (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides software and services for salons, spas, barber shops, and other beauty and wellness businesses. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our platform, including our website, applications, and related services (collectively, the &quot;Service&quot;).
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using the Service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use the Service. We may update this policy from time to time; we will notify you of material changes by posting the updated policy on our website and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information that you provide directly, that we obtain automatically when you use the Service, and that we receive from third parties (for example, payment processors).
            </p>
            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">2.1 Account and business information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you sign up or manage a Salonyst account, we collect your name, email address, phone number, business name, business address, and similar contact and identification details. We also store configuration and settings you choose for your business (e.g. services, staff roles, tax settings).
            </p>
            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">2.2 Customer and client data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              As part of the Service, you may input or import information about your clients, such as names, phone numbers, email addresses, appointment history, service preferences, and notes. We process this data on your behalf to provide appointment scheduling, CRM, and related features. You are responsible for ensuring you have a lawful basis to provide such data to us and that your use of the Service complies with applicable privacy laws.
            </p>
            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">2.3 Staff and personnel data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect and process information about staff members you add to the Service, including names, contact details, roles, schedules, commissions, and performance-related data. This is used to deliver staff management, payroll, and reporting features.
            </p>
            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">2.4 Payment and transaction data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information necessary to process payments, including payment method details, transaction amounts, and billing history. Card and similar payment data are typically handled by our payment providers; we may receive limited transaction identifiers and status information. We do not store full card numbers on our systems.
            </p>
            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">2.5 Usage and technical data</h3>
            <p className="text-gray-700 leading-relaxed">
              We automatically collect usage data such as IP address, browser type, device information, log-in times, pages visited, and actions taken within the Service. We use this to operate, secure, and improve the Service, and to detect and prevent fraud or abuse.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Provide, maintain, and improve the Service, including appointment scheduling, POS, inventory, staff management, and reporting.</li>
              <li>Process payments and manage subscriptions and billing.</li>
              <li>Send you service-related communications, including account notifications, security alerts, and product updates.</li>
              <li>Respond to your requests, comments, or support inquiries.</li>
              <li>Monitor and analyze usage patterns to improve performance, fix bugs, and develop new features.</li>
              <li>Enforce our Terms of Service, detect and prevent fraud, and protect the security of our systems and users.</li>
              <li>Comply with applicable laws, regulations, or legal process.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We will not use your personal information for marketing unrelated to the Service without your consent. We may send you product-related or promotional emails where permitted by law; you can opt out at any time.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">4. Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Service providers:</strong> We use third-party vendors to host our systems, process payments, send emails, and provide analytics. They process data on our behalf and are contractually required to protect it and use it only for the purposes we specify.</li>
              <li><strong>Legal requirements:</strong> We may disclose information if required by law, court order, or government request, or to protect our rights, your safety, or the safety of others.</li>
              <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to this Privacy Policy.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We do not share your client or staff data with third parties for their own marketing purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">5. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide the Service. After you close your account, we may retain certain data for backup, legal compliance, dispute resolution, and enforcement of our agreements. We will delete or anonymize personal information when it is no longer necessary for these purposes, subject to applicable law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">6. Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These include encryption in transit and at rest, access controls, and regular security assessments. No system is completely secure; you are responsible for safeguarding your account credentials and for the accuracy of the data you provide.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal information, or to data portability. You may also have the right to object to certain processing or to withdraw consent where we rely on it. To exercise these rights, contact us at the details below. We will respond within a reasonable timeframe. You may also have the right to lodge a complaint with a supervisory authority.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you use the Service to process data about your own customers or staff, you are the data controller for that data. We act as a processor. You are responsible for handling their rights and any requests they make to you regarding that data.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">8. Cookies and Similar Technologies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to maintain your session, remember your preferences, and understand how you use our website and Service. You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of the Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">9. International Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be stored and processed in countries other than your own. We ensure appropriate safeguards (such as standard contractual clauses or equivalent mechanisms) are in place when we transfer data internationally, as required by applicable law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will post the updated policy on this page and update the &quot;Last updated&quot; date. For material changes, we may notify you by email or through a notice in the Service. Your continued use of the Service after changes become effective constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <ul className="list-none space-y-1 text-gray-700">
              <li><strong>Email:</strong> <a href="mailto:info@Mcgibsdigitalsolutions.com" className="text-[#ef4444] hover:underline">info@Mcgibsdigitalsolutions.com</a></li>
              <li><strong>Phone:</strong> <a href="tel:+254726899113" className="text-[#ef4444] hover:underline">+254 726 899 113</a></li>
              <li><strong>Address:</strong> Kasarani-Mwiki Nairobi, Team Plaza, Room 06</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-6">
              <Link to="/" className="text-[#ef4444] hover:underline font-medium">Return to homepage</Link>
            </p>
          </section>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
