export function getPersonalizedMessage(goalId?: string, challengeId?: string) {
  let headline = "You are not behind. You are missing a clear stage plan.";
  let body = "The difference is not talent. It is knowing which skill to practice, what to build, and how to present it with confidence.";

  if (goalId === 'home' && challengeId === 'start') {
    headline = "Working from anywhere starts with one confident first move.";
    body = "You do not need a perfect resume. You need a simple roadmap that tells you what to learn, what to make, and what to offer.";
  } else if (goalId === 'ai' && challengeId === 'skills') {
    headline = "AI can become your confidence multiplier.";
    body = "You do not need years of experience to begin. You need a guided way to turn AI into useful work businesses understand.";
  } else if (goalId === 'income') {
    headline = "A new income stream begins with a sellable skill.";
    body = "The goal is not random learning. The goal is building something useful enough that a real business can say yes.";
  } else if (challengeId === 'clients') {
    headline = "Finding clients feels easier when the offer is clear.";
    body = "Once you know what problem you solve, scripts, templates, and simple outreach become much less intimidating.";
  } else if (challengeId === 'stuck') {
    headline = "Momentum comes back when the next step is obvious.";
    body = "This flow is built to reduce overthinking and move you from scattered learning into guided action.";
  }

  return { headline, body };
}
