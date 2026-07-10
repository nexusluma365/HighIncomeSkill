export function getPersonalizedMessage(goalId?: string, challengeId?: string) {
  let headline = "You are not behind. You are standing at the beginning.";
  let body = "The next chapter does not require you to have everything figured out today. It starts with one clear step, then another, until momentum begins to feel possible again.";

  if (goalId === 'home' && challengeId === 'start') {
    headline = "Freedom starts with one clear first move.";
    body = "Wanting more flexibility makes sense. You do not need to see the whole road today. You need a simple place to begin and a path that tells you what comes next.";
  } else if (goalId === 'ai' && challengeId === 'skills') {
    headline = "Confidence grows when the tools stop feeling confusing.";
    body = "You do not need to be an expert before you start. You need a guided way to learn, practice, and see how modern tools fit into real opportunities.";
  } else if (goalId === 'income') {
    headline = "Another opportunity can begin with one useful skill.";
    body = "The goal is not random learning. The goal is building something meaningful enough that you can point to it and say, this is what I can do.";
  } else if (challengeId === 'clients') {
    headline = "Turning skills into an offer gets easier when the path is clear.";
    body = "You do not have to figure out every word alone. Once you understand what you can help with, the next step becomes less intimidating.";
  } else if (challengeId === 'stuck') {
    headline = "Momentum comes back when the next step is obvious.";
    body = "Starting and stopping does not mean you are not capable. It usually means the path has been too scattered. This roadmap is here to make the next step easier to see.";
  }

  return { headline, body };
}
