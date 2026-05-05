// Stub — implementation pending (Task 3)
export function ReviewHighlightQuote({
  quote,
}: {
  quote: { quote: string; author: string; role: string };
}) {
  return (
    <div>
      <p>{quote.quote}</p>
      <span>{quote.author}</span>
      <span>{quote.role}</span>
    </div>
  );
}
