import { Campaign } from "@/types/campaign";

export const parseXMLToCampaigns = (xmlString: string): Campaign[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const campaigns: Campaign[] = [];

  const campaignNodes = xmlDoc.getElementsByTagName("campaign");
  
  for (let i = 0; i < campaignNodes.length; i++) {
    const node = campaignNodes[i];
    
    const getTextContent = (tagName: string): string => {
      const element = node.getElementsByTagName(tagName)[0];
      return element?.textContent || "";
    };

    const campaign: Campaign = {
      id: getTextContent("id"),
      name: getTextContent("name"),
      sampleTweet: getTextContent("sampleTweet"),
      numDevices: parseInt(getTextContent("numDevices")),
      startTime: new Date(getTextContent("startTime")),
      hashtags: getTextContent("hashtags").split(",").filter(Boolean),
      targetGeography: getTextContent("targetGeography") || undefined,
      frequencyPattern: getTextContent("frequencyPattern"),
      status: getTextContent("status") as 'scheduled' | 'running' | 'completed',
    };

    campaigns.push(campaign);
  }

  return campaigns;
};

export const campaignsToXML = (campaigns: Campaign[]): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<campaigns>\n';
  
  campaigns.forEach((campaign) => {
    xml += '  <campaign>\n';
    xml += `    <id>${campaign.id}</id>\n`;
    xml += `    <name>${campaign.name}</name>\n`;
    xml += `    <sampleTweet>${campaign.sampleTweet}</sampleTweet>\n`;
    xml += `    <numDevices>${campaign.numDevices}</numDevices>\n`;
    xml += `    <startTime>${campaign.startTime.toISOString()}</startTime>\n`;
    xml += `    <hashtags>${campaign.hashtags.join(',')}</hashtags>\n`;
    xml += `    <targetGeography>${campaign.targetGeography || ''}</targetGeography>\n`;
    xml += `    <frequencyPattern>${campaign.frequencyPattern}</frequencyPattern>\n`;
    xml += `    <status>${campaign.status}</status>\n`;
    xml += '  </campaign>\n';
  });
  
  xml += '</campaigns>';
  
  return xml;
};

export const downloadXML = (xmlString: string, filename: string = 'campaigns.xml') => {
  const blob = new Blob([xmlString], { type: 'text/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
