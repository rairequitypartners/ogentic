
interface FirstChatTurn {
  id: string;
  category: string;
  message: string;
  followUp?: string;
}

const firstChatTurns: FirstChatTurn[] = [
  {
    id: 'meta-general',
    category: 'general',
    message: "Hey — I can help you build an AI stack that actually drives results — not just a list of random tools.\nTell me what you're trying to automate or improve — I'll recommend the best stack for your exact task.",
    followUp: "Once you tell me the task, I'll build the best stack and show you how to deploy it in minutes."
  },
  {
    id: 'outbound-sales',
    category: 'outbound',
    message: "Looking to accelerate outbound? I can help you build an AI stack to detect signals, draft personalized outreach, and automate your flow — saving hours and driving more leads.\n\nWhat part of your outbound process do you want to improve?",
    followUp: "Once you tell me the task, I'll build the best stack and show you how to deploy it in minutes."
  },
  {
    id: 'engineering-qa',
    category: 'engineering',
    message: "Trying to ship faster? I can help you build an AI stack to speed up engineering velocity and compress QA cycles.\n\nWhat part of your delivery pipeline feels slow or manual right now?",
    followUp: "Once you tell me the task, I'll build the best stack and show you how to deploy it in minutes."
  },
  {
    id: 'content-marketing',
    category: 'content',
    message: "Need to scale content creation? I can help you build an AI stack that generates high-quality marketing content — tuned for SEO and LLM visibility — in less time.\n\nWhat kind of content do you want to produce today?",
    followUp: "Once you tell me the task, I'll build the best stack and show you how to deploy it in minutes."
  },
  {
    id: 'support-ops',
    category: 'support',
    message: "Want to streamline your support workflows? I can help you build an AI stack to summarize tickets, draft replies, and improve first-response time.\n\nWhat part of your support or internal ops feels too manual right now?",
    followUp: "Once you tell me the task, I'll build the best stack and show you how to deploy it in minutes."
  },
  {
    id: 'lean-founder',
    category: 'founder',
    message: "As a founder, you've got too much on your plate. I can help you build an AI stack that takes real work off your hands — today.\n\nWhat's one task or workflow you wish was more automated this week?",
    followUp: "Once you tell me the task, I'll build the best stack and show you how to deploy it in minutes."
  }
];

const intentKeywords = {
  outbound: ['outbound', 'sales', 'email', 'leads', 'prospecting', 'crm', 'cold email', 'personalized', 'lead generation'],
  engineering: ['qa', 'engineering', 'code', 'review', 'testing', 'ci/cd', 'github', 'dev', 'development', 'ship', 'velocity'],
  content: ['content', 'blog', 'marketing', 'seo', 'linkedin', 'social', 'copywriting', 'cms', 'posts'],
  support: ['support', 'tickets', 'customer service', 'cs', 'help desk', 'ops', 'operations'],
  founder: ['founder', 'startup', 'solo', 'bootstrap', 'scale', 'automate', 'time', 'manual']
};

export const detectUserIntent = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  // Check for specific intent keywords
  for (const [category, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some(keyword => lowerInput.includes(keyword))) {
      return category;
    }
  }
  
  // Fallback logic based on common patterns
  if (lowerInput.includes('automate') || lowerInput.includes('workflow')) {
    return 'founder';
  }
  
  return 'general'; // default fallback
};

export const getFirstChatTurn = (intent?: string): FirstChatTurn => {
  // If no intent provided, pick randomly between general and founder
  if (!intent) {
    const randomChoice = Math.random() < 0.5 ? 'general' : 'founder';
    intent = randomChoice;
  }
  
  // Find matching turn or fallback to general
  const matchingTurn = firstChatTurns.find(turn => turn.category === intent);
  return matchingTurn || firstChatTurns[0]; // fallback to first (general)
};

export const getAllFirstChatTurns = (): FirstChatTurn[] => {
  return firstChatTurns;
};
