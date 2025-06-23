import { AgentResponse, AgentRecommendation } from '@/hooks/useAutonomousAgent';

interface StackRecommendation {
  category: string;
  variations: string[];
}

const stackRecommendations: Record<string, StackRecommendation> = {
  outbound: {
    category: "Outbound/Sales",
    variations: [
      "Recommended because it is used by top SaaS teams to drive 5–10x more qualified outbound — integrates with your CRM and email stack.",
      "Proven by founders automating outbound at scale — delivers highly personalized outreach with minimal manual work.",
      "Selected for best-fit with your stack — integrates with Zapier, CRM, and GPT-based personalization workflows."
    ]
  },
  engineering: {
    category: "Engineering/QA",
    variations: [
      "Used by fast-growing product teams to compress QA cycles by 50–70% — automates regression checks and edge case detection.",
      "Recommended based on success accelerating engineering migrations and code review — integrates with your dev stack (GitHub, CI/CD).",
      "Designed to help lean engineering teams ship faster — proven to save 10+ hours/week on QA and manual review."
    ]
  },
  content: {
    category: "Content/Marketing",
    variations: [
      "Chosen based on top-performing content workflows — automates SEO blog generation and LinkedIn post creation.",
      "Recommended because it produces high-quality marketing content tuned for LLM visibility — used by leading SaaS marketers.",
      "Proven to drive 2–5x faster content production — integrates with your CMS and existing content pipeline."
    ]
  },
  support: {
    category: "Support/Ops",
    variations: [
      "Selected to help teams automate ticket summarization and CS reply drafting — saves 5–10+ hours/week in support ops.",
      "Trusted by high-growth teams to streamline CS workflows — integrates with Zapier, Airtable, and support platforms.",
      "Proven to improve first-response time and support quality — optimized for handling your support ticket volume and tools."
    ]
  },
  meta: {
    category: "General",
    variations: [
      "Recommended because it is trusted by top founders for this task, integrates smoothly with your tools, and accelerates execution.",
      "Proven by teams doing exactly what you are — this stack saves time and drives better results in your workflow.",
      "Chosen for best performance on this type of task — optimized for fast deployment and easy integration with your stack.",
      "Selected based on your task and tool ecosystem — this is the stack used by leading operators to move faster and scale."
    ]
  }
};

const categoryKeywords = {
  outbound: ['outbound', 'sales', 'email', 'leads', 'prospecting', 'crm', 'cold email', 'personalized'],
  engineering: ['qa', 'engineering', 'code', 'review', 'testing', 'ci/cd', 'github', 'dev', 'development'],
  content: ['content', 'blog', 'marketing', 'seo', 'linkedin', 'social', 'copywriting', 'cms'],
  support: ['support', 'tickets', 'customer service', 'cs', 'help desk', 'ops', 'operations']
};

export const detectQueryCategory = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return category;
    }
  }
  
  return 'meta'; // fallback to general variations
};

export const getStackRecommendation = (query: string, toolIndex: number = 0): string => {
  const category = detectQueryCategory(query);
  const recommendations = stackRecommendations[category];
  
  // Rotate through variations based on tool index to add variety
  const variationIndex = toolIndex % recommendations.variations.length;
  return recommendations.variations[variationIndex];
};

// Export for use in components that might want to show the category
export const getRecommendationCategory = (query: string): string => {
  const category = detectQueryCategory(query);
  return stackRecommendations[category].category;
};

export const generateContextualRecommendations = (query: string, context: string, history: AgentResponse[]): AgentRecommendation[] => {
  const recommendations: AgentRecommendation[] = [];
  
  // ... existing code ...
  return recommendations;
};

export const generateFallbackResponse = (query: string, context: string): string => {
  const queryLower = query.toLowerCase();
  
  // Simple keyword-based responses for testing
  // ... existing code ...
  return "That's an interesting question about AI! I'm here to help you discover and implement AI solutions. Could you tell me a bit more about what you're trying to achieve? I'd love to provide some specific recommendations!";
};
