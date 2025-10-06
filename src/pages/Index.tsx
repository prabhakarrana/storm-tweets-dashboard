import { Campaign } from "@/types/campaign";
import { CampaignCard } from "@/components/CampaignCard";
import { CreateCampaignDialog } from "@/components/CreateCampaignDialog";
import { Zap } from "lucide-react";
import heroImage from "@/assets/twitter-blaster-hero.png";

interface IndexProps {
  campaigns: Campaign[];
  onCreateCampaign: (campaign: Campaign) => void;
}

const Index = ({ campaigns, onCreateCampaign }: IndexProps) => {

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative overflow-hidden border-b border-border/50"
        style={{
          background: 'linear-gradient(135deg, hsl(222 47% 11%) 0%, hsl(222 47% 16%) 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <img 
            src={heroImage} 
            alt="Twitter Blaster" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-12 h-12 text-primary animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Twitter Blaster
            </h1>
          </div>
          <p className="text-center text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Orchestrate powerful Twitter campaigns across multiple devices. Create, analyze, and optimize your social media storms with real-time analytics.
          </p>
          <div className="flex justify-center">
            <CreateCampaignDialog onCreateCampaign={onCreateCampaign} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Recent Campaigns</h2>
          <p className="text-muted-foreground">Manage and track your Twitter storm campaigns</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        
        {campaigns.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No campaigns yet. Create your first Twitter storm to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
