import { Campaign } from "@/types/campaign";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Smartphone, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const navigate = useNavigate();
  
  const statusColors = {
    scheduled: "bg-warning/20 text-warning border-warning/30",
    running: "bg-success/20 text-success border-success/30",
    completed: "bg-muted/50 text-muted-foreground border-muted",
  };

  return (
    <Card 
      className="group cursor-pointer transition-all hover:shadow-glow hover:scale-[1.02] bg-gradient-card border-border/50"
      onClick={() => navigate(`/campaign/${campaign.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
            {campaign.name}
          </CardTitle>
          <Badge className={statusColors[campaign.status]}>
            {campaign.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {campaign.sampleTweet}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-primary" />
            <span>{campaign.numDevices} devices</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(campaign.startTime).toLocaleDateString()}</span>
          </div>
        </div>
        {campaign.hashtags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <TrendingUp className="w-4 h-4 text-primary" />
            {campaign.hashtags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {campaign.hashtags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{campaign.hashtags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
