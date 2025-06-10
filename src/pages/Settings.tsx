import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Filter,
  Save,
  X,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserPreferences {
  types: string[];
  sources: string[];
  complexity: string[];
  industries: string[];
  notifications: {
    email: boolean;
    push: boolean;
    stackUpdates: boolean;
    newFeatures: boolean;
  };
  privacy: {
    publicProfile: boolean;
    shareUsageData: boolean;
    allowAnalytics: boolean;
  };
  appearance: {
    theme: string;
    compactMode: boolean;
  };
}

const FILTER_OPTIONS = {
  types: [
    { id: "prompt", label: "Prompts" },
    { id: "tool", label: "Tools" },
    { id: "model", label: "Models" },
    { id: "agent", label: "Agents" }
  ],
  sources: [
    { id: "openai", label: "OpenAI" },
    { id: "anthropic", label: "Anthropic" },
    { id: "google", label: "Google" },
    { id: "microsoft", label: "Microsoft" },
    { id: "huggingface", label: "Hugging Face" },
    { id: "custom", label: "Custom" },
    { id: "community", label: "Community" }
  ],
  complexity: [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
    { id: "expert", label: "Expert" }
  ],
  industries: [
    { id: "healthcare", label: "Healthcare" },
    { id: "finance", label: "Finance" },
    { id: "education", label: "Education" },
    { id: "ecommerce", label: "E-commerce" },
    { id: "marketing", label: "Marketing" },
    { id: "technology", label: "Technology" },
    { id: "legal", label: "Legal" },
    { id: "manufacturing", label: "Manufacturing" }
  ]
};

export default function Settings() {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    types: [],
    sources: [],
    complexity: [],
    industries: [],
    notifications: {
      email: true,
      push: false,
      stackUpdates: true,
      newFeatures: true,
    },
    privacy: {
      publicProfile: false,
      shareUsageData: true,
      allowAnalytics: true,
    },
    appearance: {
      theme: "system",
      compactMode: false,
    }
  });

  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    bio: "",
    company: "",
    website: "",
  });

  // Mock billing data - in a real app, this would come from your payment provider
  const [billingData, setBillingData] = useState({
    subscription: {
      plan: "Pro",
      status: "active",
      nextBilling: "2024-07-10",
      amount: "$29.99"
    },
    paymentMethod: {
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: "12",
      expiryYear: "2026"
    }
  });

  useEffect(() => {
    if (preferences) {
      setUserPrefs(prev => ({
        ...prev,
        industries: preferences.industry ? [preferences.industry.toLowerCase()] : [],
        complexity: preferences.ux_complexity ? [preferences.ux_complexity.toLowerCase()] : [],
      }));
    }
  }, [preferences]);

  const handleFilterToggle = (category: keyof Pick<UserPreferences, 'types' | 'sources' | 'complexity' | 'industries'>, value: string) => {
    const currentFilters = userPrefs[category];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value];
    
    setUserPrefs(prev => ({
      ...prev,
      [category]: newFilters
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setUserPrefs(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setUserPrefs(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleAppearanceChange = (key: string, value: string | boolean) => {
    setUserPrefs(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // Here you would typically save to your backend
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const resetToDefaults = () => {
    setUserPrefs({
      types: [],
      sources: [],
      complexity: [],
      industries: [],
      notifications: {
        email: true,
        push: false,
        stackUpdates: true,
        newFeatures: true,
      },
      privacy: {
        publicProfile: false,
        shareUsageData: true,
        allowAnalytics: true,
      },
      appearance: {
        theme: "system",
        compactMode: false,
      }
    });
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    });
  };

  const handleSubscriptionAction = (action: string) => {
    // Mock actions - in a real app, these would integrate with your payment provider
    toast({
      title: `${action} initiated`,
      description: `Your ${action.toLowerCase()} request has been processed.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gradient">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="discovery" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Discovery
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              AI Preferences
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discovery Filters */}
          <TabsContent value="discovery">
            <Card>
              <CardHeader>
                <CardTitle>Discovery & Search Preferences</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure your default filters and preferences for AI tool discovery
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(FILTER_OPTIONS).map(([category, options]) => (
                  <Card key={category} className="p-4">
                    <h4 className="font-medium mb-3 capitalize">
                      {category === 'types' ? 'Preferred Component Types' : `Preferred ${category}`}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`discovery-${category}-${option.id}`}
                            checked={userPrefs[category as keyof Pick<UserPreferences, 'types' | 'sources' | 'complexity' | 'industries'>].includes(option.id)}
                            onCheckedChange={() => handleFilterToggle(category as keyof Pick<UserPreferences, 'types' | 'sources' | 'complexity' | 'industries'>, option.id)}
                          />
                          <Label htmlFor={`discovery-${category}-${option.id}`} className="text-sm cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Preferences */}
          <TabsContent value="preferences">
            <div className="space-y-6">
              {Object.entries(FILTER_OPTIONS).map(([category, options]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize">{category === 'types' ? 'Component Types' : category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${category}-${option.id}`}
                            checked={userPrefs[category as keyof Pick<UserPreferences, 'types' | 'sources' | 'complexity' | 'industries'>].includes(option.id)}
                            onCheckedChange={() => handleFilterToggle(category as keyof Pick<UserPreferences, 'types' | 'sources' | 'complexity' | 'industries'>, option.id)}
                          />
                          <Label htmlFor={`${category}-${option.id}`} className="text-sm cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing">
            <div className="space-y-6">
              {/* Current Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{billingData.subscription.plan} Plan</h4>
                      <p className="text-sm text-muted-foreground">
                        Status: <Badge variant={billingData.subscription.status === 'active' ? 'default' : 'secondary'}>
                          {billingData.subscription.status}
                        </Badge>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{billingData.subscription.amount}/month</p>
                      <p className="text-sm text-muted-foreground">
                        Next billing: {new Date(billingData.subscription.nextBilling).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleSubscriptionAction("Upgrade")}>
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" onClick={() => handleSubscriptionAction("Downgrade")}>
                      Change Plan
                    </Button>
                    <Button variant="outline" onClick={() => handleSubscriptionAction("Cancel")}>
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6" />
                      <div>
                        <p className="font-medium">
                          {billingData.paymentMethod.brand} •••• {billingData.paymentMethod.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires {billingData.paymentMethod.expiryMonth}/{billingData.paymentMethod.expiryYear}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => handleSubscriptionAction("Update Payment Method")}>
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "2024-06-10", amount: "$29.99", status: "Paid" },
                      { date: "2024-05-10", amount: "$29.99", status: "Paid" },
                      { date: "2024-04-10", amount: "$29.99", status: "Paid" },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">Monthly subscription</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{invoice.amount}</p>
                          <Badge variant="default" className="text-xs">
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <Button variant="outline" className="w-full">
                    View All Invoices
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={userPrefs.notifications.email}
                    onCheckedChange={(value) => handleNotificationChange('email', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={userPrefs.notifications.push}
                    onCheckedChange={(value) => handleNotificationChange('push', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Stack Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when your stacks are updated</p>
                  </div>
                  <Switch
                    checked={userPrefs.notifications.stackUpdates}
                    onCheckedChange={(value) => handleNotificationChange('stackUpdates', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Features</Label>
                    <p className="text-sm text-muted-foreground">Be the first to know about new features</p>
                  </div>
                  <Switch
                    checked={userPrefs.notifications.newFeatures}
                    onCheckedChange={(value) => handleNotificationChange('newFeatures', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                  </div>
                  <Switch
                    checked={userPrefs.privacy.publicProfile}
                    onCheckedChange={(value) => handlePrivacyChange('publicProfile', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Share Usage Data</Label>
                    <p className="text-sm text-muted-foreground">Help improve our service by sharing anonymous usage data</p>
                  </div>
                  <Switch
                    checked={userPrefs.privacy.shareUsageData}
                    onCheckedChange={(value) => handlePrivacyChange('shareUsageData', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">Allow analytics to help us understand how you use the app</p>
                  </div>
                  <Switch
                    checked={userPrefs.privacy.allowAnalytics}
                    onCheckedChange={(value) => handlePrivacyChange('allowAnalytics', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Theme</Label>
                  <Select
                    value={userPrefs.appearance.theme}
                    onValueChange={(value) => handleAppearanceChange('theme', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact layout with reduced spacing</p>
                  </div>
                  <Switch
                    checked={userPrefs.appearance.compactMode}
                    onCheckedChange={(value) => handleAppearanceChange('compactMode', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={saveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
