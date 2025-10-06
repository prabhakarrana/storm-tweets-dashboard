import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Campaign } from "@/types/campaign";
import { toast } from "sonner";

interface CreateCampaignDialogProps {
  onCreateCampaign: (campaign: Campaign) => void;
}

export const CreateCampaignDialog = ({ onCreateCampaign }: CreateCampaignDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sampleTweet: "",
    numDevices: 1,
    startTime: "",
    hashtags: "",
    targetGeography: "",
    frequencyPattern: "burst",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      sampleTweet: formData.sampleTweet,
      numDevices: formData.numDevices,
      startTime: new Date(formData.startTime),
      hashtags: formData.hashtags.split(",").map((tag) => tag.trim()).filter(Boolean),
      targetGeography: formData.targetGeography || undefined,
      frequencyPattern: formData.frequencyPattern,
      status: 'scheduled',
    };

    onCreateCampaign(newCampaign);
    toast.success("Campaign created successfully!");
    setOpen(false);
    setFormData({
      name: "",
      sampleTweet: "",
      numDevices: 1,
      startTime: "",
      hashtags: "",
      targetGeography: "",
      frequencyPattern: "burst",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all">
          <Plus className="w-5 h-5 mr-2" />
          New Twitter Storm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Twitter Storm</DialogTitle>
          <DialogDescription>
            Set up a new campaign to blast tweets across multiple devices
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Summer Product Launch"
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tweet">Sample Tweet</Label>
            <Textarea
              id="tweet"
              required
              value={formData.sampleTweet}
              onChange={(e) => setFormData({ ...formData, sampleTweet: e.target.value })}
              placeholder="Check out our new product! #Launch #Innovation"
              className="min-h-[100px] bg-input border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="devices">Number of Devices</Label>
              <Input
                id="devices"
                type="number"
                min="1"
                required
                value={formData.numDevices}
                onChange={(e) => setFormData({ ...formData, numDevices: parseInt(e.target.value) })}
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags (comma-separated)</Label>
            <Input
              id="hashtags"
              value={formData.hashtags}
              onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
              placeholder="Launch, Innovation, Tech"
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="geography">Target Geography (Optional)</Label>
            <Input
              id="geography"
              value={formData.targetGeography}
              onChange={(e) => setFormData({ ...formData, targetGeography: e.target.value })}
              placeholder="North America, Europe, etc."
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency Pattern</Label>
            <Select
              value={formData.frequencyPattern}
              onValueChange={(value) => setFormData({ ...formData, frequencyPattern: value })}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="burst">Burst - All at once</SelectItem>
                <SelectItem value="staggered">Staggered - Spread over time</SelectItem>
                <SelectItem value="repeating">Repeating - Every 5 mins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-gradient-primary hover:shadow-glow">
            Create Campaign
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
