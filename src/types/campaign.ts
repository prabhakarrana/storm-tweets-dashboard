export interface Campaign {
  id: string;
  name: string;
  sampleTweet: string;
  numDevices: number;
  startTime: Date;
  hashtags: string[];
  targetGeography?: string;
  frequencyPattern: string;
  status: 'scheduled' | 'running' | 'completed';
  analytics?: CampaignAnalytics;
}

export interface CampaignAnalytics {
  totalTweets: number;
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
  engagement: number;
  hashtagPerformance: HashtagMetric[];
  sentiment: SentimentData;
}

export interface HashtagMetric {
  tag: string;
  impressions: number;
  engagement: number;
  trending: boolean;
  reach: number;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}
