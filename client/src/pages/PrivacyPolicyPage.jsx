import { useAppContext } from '../context/AppContext'

function PrivacyPolicyPage() {
  const { appData } = useAppContext()
  const businessName = appData?.businessInfo?.name || "Suggula's Kitchen"

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="mt-8 space-y-6 text-slate-700">
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">1. Information We Collect</h2>
          <p className="mt-2">
            When you place an order with {businessName}, we collect personal information necessary to process and fulfill your request. This includes:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Your Name</li>
            <li>Your Phone Number</li>
            <li>Your Delivery Address</li>
            <li>Details of the food items you order</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">2. How We Use Your Information</h2>
          <p className="mt-2">We use the collected information strictly for the following purposes:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>To prepare your food order.</li>
            <li>To communicate with you regarding your order via WhatsApp or phone.</li>
            <li>To deliver the order to your specified address.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">3. Data Sharing and Protection</h2>
          <p className="mt-2">
            We respect your privacy. <strong>We do not sell, rent, or share your personal information</strong> with any third parties for marketing purposes. Your data is stored securely and is only accessible to authorized {businessName} staff involved in processing your order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">4. Your Consent</h2>
          <p className="mt-2">
            By checking the consent box during checkout and proceeding to place an order via WhatsApp, you explicitly agree to the collection and use of your personal information as outlined in this policy, in accordance with the Digital Personal Data Protection Act 2023.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-900">5. Contact Us</h2>
          <p className="mt-2">
            If you have any questions or concerns about this Privacy Policy or your data, please contact us at:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {appData?.businessInfo?.email && <li>Email: {appData.businessInfo.email}</li>}
            {appData?.businessInfo?.phone && <li>Phone: {appData.businessInfo.phone}</li>}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
