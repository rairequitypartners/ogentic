
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSettings } from '@/contexts/SettingsContext';

export const SettingsPanel: React.FC = () => {
  const { clarifyingQuestionsEnabled, setClarifyingQuestionsEnabled } = useSettings();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Chat Settings</h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="clarifying-questions">
                Clarifying Questions
              </Label>
              <p className="text-sm text-muted-foreground">
                AI will ask follow-up questions to better understand your needs
              </p>
            </div>
            <Switch
              id="clarifying-questions"
              checked={clarifyingQuestionsEnabled}
              onCheckedChange={setClarifyingQuestionsEnabled}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
