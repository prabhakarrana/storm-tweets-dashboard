import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { CampaignAnalytics } from "./pages/CampaignAnalytics";
import NotFound from "./pages/NotFound";
import { Campaign } from "./types/campaign";

const queryClient = new QueryClient();

const App = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Summer Product Launch',
      sampleTweet: 'Excited to announce our new product line! 🚀 #Innovation #Tech #Launch',
      numDevices: 25,
      startTime: new Date('2025-06-15T09:00:00'),
      hashtags: ['Innovation', 'Tech', 'Launch'],
      targetGeography: 'North America',
      frequencyPattern: 'burst',
      status: 'completed',
    },
    {
      id: '2',
      name: 'Weekend Flash Sale',
      sampleTweet: '⚡ FLASH SALE! Limited time only - grab yours now! #Sale #Shopping',
      numDevices: 15,
      startTime: new Date('2025-10-10T08:00:00'),
      hashtags: ['Sale', 'Shopping', 'Deals'],
      targetGeography: 'Global',
      frequencyPattern: 'staggered',
      status: 'running',
    },
    {
      id: '3',
      name: 'Product Demo Series',
      sampleTweet: 'Join us for live demos every hour! See our product in action. #Demo #Live',
      numDevices: 30,
      startTime: new Date('2025-10-20T10:00:00'),
      hashtags: ['Demo', 'Live', 'Tutorial'],
      targetGeography: 'Europe',
      frequencyPattern: 'repeating',
      status: 'scheduled',
    },
  ]);

  const handleCreateCampaign = (campaign: Campaign) => {
    setCampaigns([campaign, ...campaigns]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <Index 
                  campaigns={campaigns} 
                  onCreateCampaign={handleCreateCampaign} 
                />
              } 
            />
            <Route path="/campaign/:id" element={<CampaignAnalytics campaigns={campaigns} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
