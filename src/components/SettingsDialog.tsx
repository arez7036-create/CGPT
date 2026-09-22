import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChat } from "@/context/ChatContext";
import { getDefaultSettings } from "@/lib/utils";

export function SettingsDialog() {
  const { settings, updateSettings } = useChat();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="model" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="model">Model</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="model" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select
                value={settings.provider}
                onValueChange={(provider) => updateSettings({ provider: provider as typeof settings.provider })}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ollama">Ollama (Local)</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={settings.model}
                onValueChange={(model) => updateSettings({ model })}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {settings.provider === 'ollama' && (
                    <>
                      <SelectItem value="llama3.2">Llama 3.2 (3B)</SelectItem>
                      <SelectItem value="llama3.1">Llama 3.1 (8B)</SelectItem>
                      <SelectItem value="gemma3">Gemma 3</SelectItem>
                    </>
                  )}
                  {settings.provider === 'openai' && (
                    <>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </>
                  )}
                  {settings.provider === 'anthropic' && (
                    <>
                      <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                    </>
                  )}
                  {settings.provider === 'groq' && (
                    <>
                      <SelectItem value="llama-3.1-70b-versatile">Llama 3.1 70B</SelectItem>
                      <SelectItem value="deepseek-r1-distill-llama-70b">Deepseek 70B</SelectItem>
                    </>
                  )}
                  {settings.provider === 'google' && (
                    <>
                      <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                      <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="temperature">Temperature: {settings.temperature.toFixed(1)}</Label>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[settings.temperature]}
                onValueChange={([temp]) => updateSettings({ temperature: temp })}
              />
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select
                value={settings.template}
                onValueChange={(template) => updateSettings({ template: template as typeof settings.template })}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="streaming">Streaming Responses</Label>
                <p className="text-sm text-muted-foreground">Stream output token by token</p>
              </div>
              <Switch
                id="streaming"
                checked={settings.streamEnabled}
                onCheckedChange={(checked) => updateSettings({ streamEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="web-search">Web Search</Label>
                <p className="text-sm text-muted-foreground">Enable web search for current info</p>
              </div>
              <Switch
                id="web-search"
                checked={settings.webSearchEnabled}
                onCheckedChange={(checked) => updateSettings({ webSearchEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="audio-response">Audio Responses</Label>
                <p className="text-sm text-muted-foreground">Auto-play AI voice responses</p>
              </div>
              <Switch
                id="audio-response"
                checked={settings.audioResponseEnabled}
                onCheckedChange={(checked) => updateSettings({ audioResponseEnabled: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="context-window">Context Window Size ({settings.contextWindowSize} {settings.contextWindowSize === 1 ? 'message' : 'messages'})</Label>
              <Slider
                id="context-window"
                min={1}
                max={20}
                step={1}
                value={[settings.contextWindowSize]}
                onValueChange={([size]) => updateSettings({ contextWindowSize: size })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                value={settings.systemPrompt}
                onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
                placeholder="Enter a system prompt to guide the AI's behavior..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reasoning-format">Reasoning Format</Label>
              <Select
                value={settings.reasoningFormat}
                onValueChange={(reasoningFormat) => updateSettings({ reasoningFormat })}
              >
                <SelectTrigger id="reasoning-format">
                  <SelectValue placeholder="Select reasoning format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parsed">Parsed (default)</SelectItem>
                  <SelectItem value="raw">Raw</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              const defaults = getDefaultSettings();
              updateSettings(defaults);
            }}
          >
            Reset to Defaults
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
