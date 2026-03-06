import { Shield, Lock, Zap, Wifi, HelpCircle } from "lucide-react";

export type FaqItem = {
  id: string;
  icon: React.ElementType;
};

export const faqs: FaqItem[] = [
  {
    id: "dataSafety",
    icon: Shield,
  },
  {
    id: "clientSideExecution",
    icon: Lock,
  },
  {
    id: "randomNumbers",
    icon: Zap,
  },
  {
    id: "offlineUsage",
    icon: Wifi,
  },
  {
    id: "analyticsTracking",
    icon: Lock,
  },
  {
    id: "trust",
    icon: Shield,
  },
  {
    id: "productionUse",
    icon: Zap,
  },
  {
    id: "browserSupport",
    icon: HelpCircle,
  },
  {
    id: "contributeBugs",
    icon: HelpCircle,
  },
  {
    id: "whyCreateSite",
    icon: HelpCircle,
  },
];