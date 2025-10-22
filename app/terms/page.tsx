export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-neutral-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-700 mb-4">
              By accessing and using Mentoblo ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">2. Description of Service</h2>
            <p className="text-neutral-700 mb-4">
              Mentoblo is an all-in-one platform for independent tutors that helps you win clients, automate admin, and teach smarter with AI. Our service includes:
            </p>
            <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
              <li>Student management and tracking</li>
              <li>Lesson scheduling and planning</li>
              <li>Invoice generation and payment tracking</li>
              <li>AI-powered lesson plan generation</li>
              <li>Parent report generation</li>
              <li>Dashboard analytics and insights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">3. User Accounts</h2>
            <p className="text-neutral-700 mb-4">
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">4. Acceptable Use</h2>
            <p className="text-neutral-700 mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Transmit harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use the Service for any unlawful or prohibited purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Payment Terms</h2>
            <p className="text-neutral-700 mb-4">
              If you choose to upgrade to a paid plan:
            </p>
            <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
              <li>Fees are charged in advance on a recurring basis</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>We reserve the right to change our pricing with 30 days notice</li>
              <li>You may cancel your subscription at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">6. Privacy and Data Protection</h2>
            <p className="text-neutral-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">7. Intellectual Property</h2>
            <p className="text-neutral-700 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Mentoblo and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-neutral-700 mb-4">
              In no event shall Mentoblo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">9. Termination</h2>
            <p className="text-neutral-700 mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">10. Changes to Terms</h2>
            <p className="text-neutral-700 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">11. Contact Information</h2>
            <p className="text-neutral-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <p className="text-neutral-700">
                <strong>Email:</strong> support@mentoblo.com<br />
                <strong>Website:</strong> https://mentoblo.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
