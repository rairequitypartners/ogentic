
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Shield, Database } from "lucide-react";

interface OnboardingStep3Props {
  preferredModels: string[];
  biasPreference: string;
  datasetPreference: string;
  onPreferredModelsChange: (value: string[]) => void;
  onBiasPreferenceChange: (value: string) => void;
  onDatasetPreferenceChange: (value: string) => void;
}

const aiModels = [
  { id: "gpt-4", name: "GPT-4", description: "Advanced reasoning and creativity" },
  { id: "claude", name: "Claude", description: "Excellent for analysis and writing" },
  { id: "gemini", name: "Gemini", description: "Google's multimodal AI" },
  { id: "llama", name: "Llama", description: "Open-source and customizable" },
  { id: "mistral", name: "Mistral", description: "Fast and efficient" }
];

const biasOptions = [
  { value: "minimal", label: "Minimal bias - Prefer neutral, balanced responses" },
  { value: "transparent", label: "Transparent - Show me potential biases" },
  { value: "diverse", label: "Diverse perspectives - Include multiple viewpoints" }
];

const datasetOptions = [
  { value: "latest", label: "Latest data - Most recent information" },
  { value: "verified", label: "Verified sources - Fact-checked content only" },
  { value: "specialized", label: "Specialized - Domain-specific datasets" }
];

export const OnboardingStep3 = ({
  preferredModels,
  biasPreference,
  datasetPreference,
  onPreferredModelsChange,
  onBiasPreferenceChange,
  onDatasetPreferenceChange
}: OnboardingStep3Props) => {
  const handleModelToggle = (modelId: string) => {
    if (preferredModels.includes(modelId)) {
      onPreferredModelsChange(preferredModels.filter(id => id !== modelId));
    } else {
      onPreferredModelsChange([...preferredModels, modelId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">AI Model Preferences</h3>
        <p className="text-muted-foreground">
          Choose the AI models and data handling preferences that match your needs
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Preferred AI Models (select at least one)
          </Label>
          <div className="space-y-2">
            {aiModels.map((model) => (
              <div key={model.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                <Checkbox
                  id={model.id}
                  checked={preferredModels.includes(model.id)}
                  onCheckedChange={() => handleModelToggle(model.id)}
                />
                <div className="flex-1">
                  <label htmlFor={model.id} className="font-medium cursor-pointer">
                    {model.name}
                  </label>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Bias handling preference
          </Label>
          <Select value={biasPreference} onValueChange={onBiasPreferenceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select bias handling preference" />
            </SelectTrigger>
            <SelectContent>
              {biasOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Dataset preference
          </Label>
          <Select value={datasetPreference} onValueChange={onDatasetPreferenceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select dataset preference" />
            </SelectTrigger>
            <SelectContent>
              {datasetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
