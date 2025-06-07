
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Settings } from "lucide-react";

interface OnboardingStep2Props {
  outputTone: string;
  uxComplexity: string;
  onOutputToneChange: (value: string) => void;
  onUxComplexityChange: (value: string) => void;
}

const outputTones = [
  { value: "professional", label: "Professional - Formal and business-like" },
  { value: "casual", label: "Casual - Friendly and conversational" },
  { value: "technical", label: "Technical - Detailed and precise" },
  { value: "creative", label: "Creative - Imaginative and engaging" }
];

const uxComplexities = [
  { value: "simple", label: "Simple - Clean and minimal interface" },
  { value: "standard", label: "Standard - Balanced features and simplicity" },
  { value: "advanced", label: "Advanced - Full-featured with customization" },
  { value: "expert", label: "Expert - Maximum control and options" }
];

export const OnboardingStep2 = ({
  outputTone,
  uxComplexity,
  onOutputToneChange,
  onUxComplexityChange
}: OnboardingStep2Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Customize your experience</h3>
        <p className="text-muted-foreground">
          How would you like AI agents to communicate and present information?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tone" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Preferred communication tone
          </Label>
          <Select value={outputTone} onValueChange={onOutputToneChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select communication tone" />
            </SelectTrigger>
            <SelectContent>
              {outputTones.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="complexity" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Interface complexity preference
          </Label>
          <Select value={uxComplexity} onValueChange={onUxComplexityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select interface complexity" />
            </SelectTrigger>
            <SelectContent>
              {uxComplexities.map((complexity) => (
                <SelectItem key={complexity.value} value={complexity.value}>
                  {complexity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
