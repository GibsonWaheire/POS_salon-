import { Link } from "react-router-dom"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import PageHero from "@/components/PageHero"
import { usePageSeo } from "@/hooks/usePageSeo"

const TERMS_META = {
  title: "Terms of Service | Salonyst",
  description: "Terms of Service governing your use of Salonyst's software and services for salons, spas, and beauty businesses.",
}

const LAST_UPDATED = "January 25, 2025"

export default function TermsOfService() {
  usePageSeo(TERMS_META.title, TERMS_META.description)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationHeader />
      <PageHero
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
        title="Terms of Service"
        description={`Last updated: ${LAST_UPDATED}. Please read these terms carefully.`}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-3xl">
        <article className="prose prose-gray max-w-none">
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms of Service (&quot;Terms&quot;) constitute a binding agreement between you (&quot;you,&quot; &quot;your,&quot; or &quot;Customer&quot;) and Salonyst (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) governing your access to and use of our software-as-a-service platform, including our website, applications, APIs, and related services (collectively, the &quot;Service&quot;). The Service is designed for salons, spas, barber shops, and other beauty and wellness businesses.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By creating an account, signing in, or otherwise using the Service, you agree to these Terms. If you are using the Service on behalf of a business, you represent that you have the authority to bind that business to these Terms. If you do not agree, you must not use the Service. Our <Link to="/privacy-policy" className="text-[#ef4444] hover:underline">Privacy Policy</Link> describes how we collect, use, and protect your information and is incorporated by reference.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">2. Accounts and Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update it as needed. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us promptly of any unauthorized use or breach of security.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years of age (or the age of majority in your jurisdiction) to use the Service. Accounts may not be shared with or transferred to third parties without our prior written consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">3. Use of the Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We grant you a limited, non-exclusive, non-transferable, revocable right to access and use the Service in accordance with these Terms and your subscription plan. You may use the Service only for lawful business purposes and in compliance with all applicable laws, rules, and regulations.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Use the Service in any way that violates applicable law or infringes the rights of others.</li>
              <li>Reverse engineer, decompile, disassemble, or attempt to derive source code from the Service, except to the extent permitted by law.</li>
              <li>Circumvent or disable any security or access controls, or use the Service to gain unauthorized access to our systems or third-party systems.</li>
              <li>Use the Service to transmit malware, spam, or other harmful or unlawful content.</li>
              <li>Resell, sublicense, or commercially exploit the Service (or any part of it) without our prior written consent.</li>
              <li>Use automated means (e.g. bots, scrapers) to access or use the Service in a manner that exceeds normal use or interferes with our operations.</li>
              <li>Use the Service to store or process data that you do not have the right to provide, or that is subject to restrictions you have not complied with.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We may suspend or terminate your access to the Service if we reasonably believe you have violated these Terms or engaged in fraudulent or abusive conduct. We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice, though we will use reasonable efforts to minimize disruption to paying customers.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">4. Subscription, Payment, and Billing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Access to the Service may require a paid subscription. Subscription fees, billing cycles, and payment terms are set forth in your plan or on our pricing page. By subscribing, you authorize us to charge your designated payment method on a recurring basis until you cancel. All fees are quoted in the currency specified at the time of purchase and are exclusive of applicable taxes, which you are responsible for paying where required.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Fees are generally non-refundable. We may offer refunds or credits at our discretion (for example, in connection with service outages or billing errors). If you dispute a charge, you must contact us within a reasonable period; we will work with you to resolve the dispute. Failure to pay undisputed fees when due may result in suspension or termination of your account.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We may change our pricing with reasonable notice. Continued use of the Service after a price increase constitutes acceptance of the new pricing. If you do not agree, you may cancel your subscription before the change takes effect.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">5. Your Data and Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain ownership of the data you upload or otherwise provide to the Service (&quot;Customer Data&quot;). You grant us a limited license to use, store, and process Customer Data solely to provide, maintain, and improve the Service, and as described in our Privacy Policy. You are responsible for the accuracy, legality, and adequacy of Customer Data and for ensuring that you have all necessary rights and consents to provide it to us.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We will handle Customer Data in accordance with our Privacy Policy and applicable data protection laws. You must comply with all applicable privacy laws in your use of the Service, including when collecting or processing data about your clients, staff, or other individuals.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service, including its software, design, text, graphics, logos, and other content (other than Customer Data), is owned by us or our licensors and is protected by copyright, trademark, and other intellectual property laws. These Terms do not grant you any right, title, or interest in the Service except the limited license to use it as described herein. You may not use our trademarks or branding without our prior written consent. Any feedback, suggestions, or ideas you provide regarding the Service may be used by us without obligation to you.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">7. Confidentiality</h2>
            <p className="text-gray-700 leading-relaxed">
              Each party agrees to keep confidential any non-public information disclosed by the other party that is designated as confidential or that reasonably should be understood to be confidential (&quot;Confidential Information&quot;). Confidential Information does not include information that is publicly available, independently developed, or rightfully obtained from a third party without breach of obligation. Neither party will use the other&apos;s Confidential Information except as necessary to perform under these Terms or as otherwise permitted in writing. Both parties will use reasonable care to protect Confidential Information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">8. Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. YOU USE THE SERVICE AT YOUR OWN RISK. WE ARE NOT RESPONSIBLE FOR THE ACTIONS OF YOUR CUSTOMERS, STAFF, OR OTHER USERS, OR FOR ANY LOSS OR DAMAGE ARISING FROM YOUR USE OF THIRD-PARTY PAYMENT PROCESSORS, INTEGRATIONS, OR EXTERNAL SERVICES.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL WE (OR OUR AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS) BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="text-gray-700 leading-relaxed">
              OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED UNITED STATES DOLLARS (USD 100). SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES; IN SUCH CASES, THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU, AND OUR LIABILITY WILL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Salonyst and its affiliates, officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or related to (a) your use of the Service, (b) your violation of these Terms or applicable law, (c) your Customer Data or your use of the Service to process data about others, or (d) any dispute between you and a third party in connection with the Service. We reserve the right to assume the exclusive defense and control of any matter subject to indemnification by you, at your expense.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may cancel your account or subscription at any time through the Service or by contacting us. We may suspend or terminate your access to the Service, or delete your account, for any reason, including breach of these Terms, with or without notice. Upon termination, your right to use the Service ceases immediately.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We will use commercially reasonable efforts to allow you to export your Customer Data prior to termination, subject to applicable law and our data retention practices. After a reasonable period, we may delete your Customer Data. Sections that by their nature survive termination (including confidentiality, disclaimers, limitation of liability, indemnification, and governing law) will survive.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">12. Disputes and Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of Kenya, without regard to conflict of laws principles. Any dispute arising out of or relating to these Terms or the Service will be resolved exclusively in the courts of Kenya, and you consent to the personal jurisdiction of such courts. Nothing in these Terms limits either party&apos;s right to seek injunctive or other equitable relief in any court of competent jurisdiction.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">13. General</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms, together with the Privacy Policy and any order forms or plan-specific terms, constitute the entire agreement between you and Salonyst regarding the Service and supersede any prior agreements. Our failure to enforce any right or provision is not a waiver of that right or provision. If any provision is held invalid or unenforceable, the remaining provisions will remain in effect. You may not assign these Terms without our prior written consent; we may assign them in connection with a merger, acquisition, or sale of assets. There are no third-party beneficiaries to these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We may modify these Terms from time to time. We will post the updated Terms on this page and update the &quot;Last updated&quot; date. Material changes may be communicated via email or a notice in the Service. Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms. If you do not agree, you must stop using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">14. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <ul className="list-none space-y-1 text-gray-700">
              <li><strong>Email:</strong> <a href="mailto:info@Mcgibsdigitalsolutions.com" className="text-[#ef4444] hover:underline">info@Mcgibsdigitalsolutions.com</a></li>
              <li><strong>Phone:</strong> <a href="tel:+254726899113" className="text-[#ef4444] hover:underline">+254 726 899 113</a></li>
              <li><strong>Address:</strong> Kasarani-Mwiki Nairobi, Team Plaza, Room 06</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-6">
              <Link to="/" className="text-[#ef4444] hover:underline font-medium">Return to homepage</Link> · <Link to="/privacy-policy" className="text-[#ef4444] hover:underline font-medium">Privacy Policy</Link>
            </p>
          </section>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
