
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, User } from "lucide-react";

interface OnboardingStep1Props {
  industry: string;
  experienceLevel: string;
  onIndustryChange: (value: string) => void;
  onExperienceLevelChange: (value: string) => void;
}

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "E-commerce",
  "Marketing", "Manufacturing", "Legal", "Entertainment", "Real Estate", "Other"
];

const experienceLevels = [
  "Beginner - New to AI",
  "Intermediate - Some AI experience", 
  "Advanced - Experienced with AI",
  "Expert - AI professional"
];

export const OnboardingStep1 = ({
  industry,
  experienceLevel,
  onIndustryChange,
  onExperienceLevelChange
}: OnboardingStep1Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Tell us about yourself</h3>
        <p className="text-muted-foreground">
          This helps us recommend the best AI agents for your needs
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="industry" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            What industry do you work in?
          </Label>
          <Select value={industry} onValueChange={onIndustryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind.toLowerCase()}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            What's your experience level with AI?
          </Label>
          <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level.toLowerCase()}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
