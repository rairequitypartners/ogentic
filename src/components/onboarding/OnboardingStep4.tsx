
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Target } from "lucide-react";

interface OnboardingStep4Props {
  useCases: string[];
  onUseCasesChange: (value: string[]) => void;
}

const useCaseOptions = [
  { id: "content-creation", name: "Content Creation", description: "Writing, blogging, marketing copy" },
  { id: "data-analysis", name: "Data Analysis", description: "Reports, insights, data interpretation" },
  { id: "customer-support", name: "Customer Support", description: "Chatbots, help desk, FAQ automation" },
  { id: "research", name: "Research & Development", description: "Literature review, trend analysis" },
  { id: "automation", name: "Process Automation", description: "Workflow optimization, task automation" },
  { id: "education", name: "Education & Training", description: "Learning materials, tutoring, explanations" },
  { id: "coding", name: "Software Development", description: "Code generation, debugging, documentation" },
  { id: "creative", name: "Creative Projects", description: "Design ideas, brainstorming, creative writing" },
  { id: "business-strategy", name: "Business Strategy", description: "Planning, decision support, analysis" },
  { id: "personal-assistant", name: "Personal Assistant", description: "Scheduling, reminders, organization" }
];

export const OnboardingStep4 = ({
  useCases,
  onUseCasesChange
}: OnboardingStep4Props) => {
  const handleUseCaseToggle = (useCaseId: string) => {
    if (useCases.includes(useCaseId)) {
      onUseCasesChange(useCases.filter(id => id !== useCaseId));
    } else {
      onUseCasesChange([...useCases, useCaseId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">How will you use AI?</h3>
        <p className="text-muted-foreground">
          Select all the ways you plan to use AI agents (select at least one)
        </p>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Primary use cases
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {useCaseOptions.map((useCase) => (
            <div key={useCase.id} className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id={useCase.id}
                checked={useCases.includes(useCase.id)}
                onCheckedChange={() => handleUseCaseToggle(useCase.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor={useCase.id} className="font-medium cursor-pointer block">
                  {useCase.name}
                </label>
                <p className="text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
