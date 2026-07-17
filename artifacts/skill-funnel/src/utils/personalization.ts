const goalCopy: Record<string, { label: string; hope: string; bridge: string }> = {
  money: {
    label: 'more money',
    hope:
      'more money starts with more value. Meet the right people, find a real problem, then package a useful digital solution.',
    bridge:
      'The ebook helps you start better conversations. The Work From Anywhere Bundle helps you turn those conversations into valuable offers.',
  },
  freedom: {
    label: 'more freedom',
    hope:
      'freedom grows when your value can travel with you. Start with relationships, add a useful skill, then build a digital solution.',
    bridge:
      'The ebook helps you build trust. The Work From Anywhere Bundle helps you turn those conversations into valuable offers.',
  },
  relationships: {
    label: 'better relationships',
    hope:
      'better relationships put you closer to better conversations, better opportunities, and problems worth solving.',
    bridge:
      'The ebook helps you become valuable in the room. The Work From Anywhere Bundle helps you turn those conversations into valuable offers.',
  },
  direction: {
    label: 'clear direction',
    hope:
      'direction comes from a simple order: build relationships, listen for expensive problems, choose a skill, then create a solution.',
    bridge:
      'The ebook gives you the relationship foundation. The Work From Anywhere Bundle helps you turn those conversations into valuable offers.',
  },
};

const challengeCopy: Record<string, { label: string; reframe: string }> = {
  skill: {
    label: 'the right skill',
    reframe:
      'You only need one useful skill connected to a problem someone wants solved.',
  },
  people: {
    label: 'the right people',
    reframe:
      'You need better conversations with people who have goals, pressure or problems.',
  },
  problem: {
    label: 'an expensive problem',
    reframe:
      'Listen for a problem that costs people time, money, attention or opportunity.',
  },
  plan: {
    label: 'a clear roadmap',
    reframe:
      'You need a sequence that shows what to focus on first, second and third.',
  },
};

const defaultGoal = goalCopy.direction;
const defaultChallenge = challengeCopy.plan;

export function getPersonalizedPath(goalId?: string, challengeId?: string) {
  const goal = goalId ? goalCopy[goalId] || defaultGoal : defaultGoal;
  const challenge = challengeId
    ? challengeCopy[challengeId] || defaultChallenge
    : defaultChallenge;

  return {
    eyebrow: `You chose ${goal.label}`,
    headline: `Your path starts with ${goal.label}.`,
    body: `That makes sense. ${goal.hope} Your obstacle is ${challenge.label}. ${challenge.reframe}`,
    bridge: goal.bridge,
    points: [
      'Use Rich Relationships to start better conversations.',
      'Listen for expensive problems those people already want solved.',
      'Use the digital roadmap to build the solution.',
    ],
  };
}

export function getPersonalizedMessage(goalId?: string, challengeId?: string) {
  const path = getPersonalizedPath(goalId, challengeId);

  return {
    headline: path.headline,
    body: `${path.body} ${path.bridge}`,
  };
}
