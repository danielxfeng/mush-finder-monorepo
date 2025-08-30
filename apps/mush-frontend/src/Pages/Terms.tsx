const Terms = () => {
  return (
    <main className='my-4 flex w-full flex-1 flex-col items-center justify-center gap-10 lg:my-12'>
      <article className='prose flex w-full max-w-prose flex-col gap-4 px-4'>
        <h1 className='text-primary'>Terms, Conditions, and Privacy Policy</h1>
        <p>
          <strong>Last updated:</strong> August 30, 2025
        </p>

        <h2>Terms and Conditions</h2>
        <p>
          By accessing and using this website (the "Service"), you agree to be bound by the
          following terms. If you do not agree, please do not use the Service.
        </p>

        <h3>1. Disclaimer of Accuracy</h3>
        <p className='text-destructive'>
          <strong>Important Note:</strong> The identification results are for reference only. This
          tool may <strong>NOT</strong> be accurate enough for food safety decisions.
        </p>
        <p>
          ☠️ Consuming wild mushrooms based on this tool’s predictions can be extremely dangerous
          and potentially fatal. You are fully responsible for any decisions you make.
        </p>
        <p>
          NEVER consume a mushroom unless it has been confirmed as safe by a qualified expert, or
          unless you are 100% certain of its identity.
        </p>
        <p>
          📢 This tool is an <em>experimental machine learning project</em>. The training process
          may contain flaws or limitations that affect model performance. While the model achieved a
          certain validation accuracy under controlled conditions, this figure does not reflect real
          world performance.
        </p>
        <p>
          In actual use, factors such as lighting, camera angle, image quality, and unfamiliar
          species can significantly reduce prediction accuracy. Results should therefore be treated
          with caution and must not be relied upon for food safety decisions.
        </p>
        <p className='text-destructive'>
          This software is provided <em>“as is”</em>, without warranty of any kind, express or
          implied. The developer assumes no responsibility for any consequences arising from the use
          of this tool.
        </p>

        <h3>2. Service Availability</h3>
        <p>
          The Service may be unavailable at times due to maintenance or technical issues. We are not
          responsible for data loss or service interruptions.
        </p>

        <h3>3. Changes to Terms</h3>
        <p>
          We may update these Terms at any time. Continued use of the Service after changes implies
          your acceptance of the updated Terms.
        </p>

        <h2>Privacy Policy (GDPR)</h2>
        <p>
          This Privacy Policy describes how we process data in accordance with the General Data
          Protection Regulation (GDPR) (EU 2016/679).
        </p>

        <h3>1. Data We Handle</h3>
        <ul>
          <li>
            <strong>Uploaded Images:</strong> Images are processed solely for mushroom
            identification. They are anonymized and not linked to any personal identifiers.
          </li>
          <li>
            <strong>No Accounts:</strong> This service does not require registration or login. We do
            not collect names, emails, or passwords.
          </li>
          <li>
            <strong>Temporary Storage:</strong> Uploaded images are stored only briefly for
            processing and are periodically deleted.
          </li>
          <li>
            <strong>Analytics & Monitoring:</strong> We may use privacy-friendly tools (e.g., Umami
            for analytics, Sentry for error tracking) to improve site reliability. These do not
            collect personal identifiers.
          </li>
        </ul>

        <h3>2. Legal Basis</h3>
        <p>
          Data is processed under the legal basis of <em>legitimate interest</em> — to provide and
          improve the Service — while ensuring data minimization and anonymization.
        </p>

        <h3>3. Data Retention</h3>
        <p>
          Uploaded images are automatically deleted after processing. No data is retained
          permanently.
        </p>

        <h3>4. Your Rights</h3>
        <p>In accordance with GDPR, you have the right to:</p>
        <ul>
          <li>Request access to any personal data processed (if applicable).</li>
          <li>Request correction or deletion of your data.</li>
          <li>Restrict or object to processing where applicable.</li>
          <li>Lodge a complaint with your local Data Protection Authority (DPA).</li>
        </ul>

        <h3>5. Data Protection</h3>
        <p>
          We use appropriate technical and organizational measures to protect your data. We do not
          sell or share data with third parties.
        </p>

        <h3>6. Contact</h3>
        <p>
          If you have questions about this policy or wish to exercise your GDPR rights, please
          contact the developer.
        </p>
      </article>
    </main>
  );
};

export default Terms;
