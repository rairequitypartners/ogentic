
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3";
import { OnboardingStep4 } from "@/components/onboarding/OnboardingStep4";

interface OnboardingData {
  industry: string;
  outputTone: string;
  preferredModels: string[];
  biasPreference: string;
  datasetPreference: string;
  uxComplexity: string;
  useCases: string[];
  experienceLevel: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { saveOnboardingData, saving } = useUserPreferences();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    industry: '',
    outputTone: '',
    preferredModels: [],
    biasPreference: '',
    datasetPreference: '',
    uxComplexity: '',
    useCases: [],
    experienceLevel: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    const success = await saveOnboardingData(formData);
    if (success) {
      navigate("/");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.industry && formData.experienceLevel;
      case 2:
        return formData.outputTone && formData.uxComplexity;
      case 3:
        return formData.preferredModels.length > 0;
      case 4:
        return formData.useCases.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            industry={formData.industry}
            experienceLevel={formData.experienceLevel}
            onIndustryChange={(value) => updateFormData('industry', value)}
            onExperienceLevelChange={(value) => updateFormData('experienceLevel', value)}
          />
        );
      case 2:
        return (
          <OnboardingStep2
            outputTone={formData.outputTone}
            uxComplexity={formData.uxComplexity}
            onOutputToneChange={(value) => updateFormData('outputTone', value)}
            onUxComplexityChange={(value) => updateFormData('uxComplexity', value)}
          />
        );
      case 3:
        return (
          <OnboardingStep3
            preferredModels={formData.preferredModels}
            biasPreference={formData.biasPreference}
            datasetPreference={formData.datasetPreference}
            onPreferredModelsChange={(value) => updateFormData('preferredModels', value)}
            onBiasPreferenceChange={(value) => updateFormData('biasPreference', value)}
            onDatasetPreferenceChange={(value) => updateFormData('datasetPreference', value)}
          />
        );
      case 4:
        return (
          <OnboardingStep4
            useCases={formData.useCases}
            onUseCasesChange={(value) => updateFormData('useCases', value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-gradient">
            Welcome to Ogentic
          </CardTitle>
          <p className="text-muted-foreground">
            Let's personalize your AI experience
          </p>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
              <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button 
                onClick={nextStep}
                disabled={!canProceed()}
                className="button-glow"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleFinish}
                disabled={!canProceed() || saving}
                className="button-glow"
              >
                {saving ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
