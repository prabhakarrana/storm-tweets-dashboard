import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Heart, Repeat2, MessageCircle, Eye } from "lucide-react";
import { Campaign } from "@/types/campaign";

interface CampaignAnalyticsProps {
  campaigns: Campaign[];
}

export const CampaignAnalytics = ({ campaigns }: CampaignAnalyticsProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
          <Button onClick={() => navigate("/")}>Go Back</Button>
        </div>
      </div>
    );
  }

  const mockAnalytics = {
    totalTweets: campaign.numDevices * 12,
    likes: Math.floor(Math.random() * 5000) + 1000,
    retweets: Math.floor(Math.random() * 2000) + 500,
    replies: Math.floor(Math.random() * 1000) + 200,
    impressions: Math.floor(Math.random() * 50000) + 10000,
    engagement: 4.8,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{campaign.name}</h1>
              <p className="text-muted-foreground">{campaign.sampleTweet}</p>
            </div>
            <Badge 
              className={
                campaign.status === 'running' 
                  ? 'bg-success/20 text-success border-success/30' 
                  : campaign.status === 'scheduled'
                  ? 'bg-warning/20 text-warning border-warning/30'
                  : 'bg-muted/50 text-muted-foreground'
              }
            >
              {campaign.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Started: {new Date(campaign.startTime).toLocaleString()}</span>
            <span>•</span>
            <span>{campaign.numDevices} devices</span>
            <span>•</span>
            <span>{campaign.frequencyPattern} pattern</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Total Tweets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockAnalytics.totalTweets}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="w-4 h-4 text-destructive" />
                Likes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockAnalytics.likes.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Repeat2 className="w-4 h-4 text-success" />
                Retweets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockAnalytics.retweets.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-info" />
                Replies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockAnalytics.replies.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Impressions & Engagement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Total Impressions</span>
                  <span className="font-bold">{mockAnalytics.impressions.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Engagement Rate</span>
                  <span className="font-bold text-success">{mockAnalytics.engagement}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success" style={{ width: `${mockAnalytics.engagement * 10}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Hashtag Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaign.hashtags.map((tag) => (
                  <div key={tag} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        #{tag}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {(Math.random() * 10000).toFixed(0)} impressions
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {Math.random() > 0.5 ? 'Trending' : 'Active'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Live Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="p-4 bg-muted/30 rounded-lg border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <p className="text-sm mb-2">{campaign.sampleTweet}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Device {i}</span>
                    <span>•</span>
                    <span>{new Date(Date.now() - i * 60000).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
