export function ControllerConfirmationView({ title, message, detail, stepId }) {
  const isEmailPreview = stepId === "email_preview";
  const isUpdateFlow = stepId === "update_complete";
  const confirmationKicker = isEmailPreview ? "Status preview" : isUpdateFlow ? "Update status" : "Status";
  const showMessage = Boolean(message) && message !== title && !isEmailPreview;

  return (
    <section className="ps5-controller-confirmation-view" aria-live="polite">
      <p className="confirmation-kicker">{confirmationKicker}</p>
      <h4>{title}</h4>
      {showMessage ? <p>{message}</p> : null}
      {detail ? <p className="confirmation-detail">{detail}</p> : null}
      {isEmailPreview ? (
        <article className="status-preview-card">
          <p className="status-preview-label">Email preview</p>
          <p className="status-preview-title">{message}</p>
          <p className="status-preview-subtitle">{detail}</p>
        </article>
      ) : null}
    </section>
  );
}
