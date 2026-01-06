import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { CampaignAnalytics } from "./pages/CampaignAnalytics";
import BiometricLogin from "./pages/BiometricLogin";
import NotFound from "./pages/NotFound";
import { Campaign } from "./types/campaign";
import { parseXMLToCampaigns, campaignsToXML, downloadXML } from "./utils/xmlParser";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCampaignsFromXML = async () => {
    try {
      const response = await fetch('/campaigns.xml');
      const xmlText = await response.text();
      const loadedCampaigns = parseXMLToCampaigns(xmlText);
      setCampaigns(loadedCampaigns);
      setLoading(false);
    } catch (error) {
      console.error('Error loading campaigns from XML:', error);
      toast.error('Failed to load campaigns from XML');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaignsFromXML();
  }, []);

  const handleCreateCampaign = (campaign: Campaign) => {
    const updatedCampaigns = [campaign, ...campaigns];
    setCampaigns(updatedCampaigns);
    
    // Generate and download updated XML file
    const xmlString = campaignsToXML(updatedCampaigns);
    downloadXML(xmlString);
    
    toast.success('Campaign created! Updated campaigns.xml downloaded. Replace the file in /public folder to persist changes.');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<BiometricLogin />} />
            <Route 
              path="/" 
              element={
                <Index 
                  campaigns={campaigns}
                  loading={loading}
                  onCreateCampaign={handleCreateCampaign}
                  onReloadCampaigns={loadCampaignsFromXML}
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
