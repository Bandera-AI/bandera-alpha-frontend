import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  Send,
  MessageSquare,
  User,
  Settings,
  RefreshCw,
  PanelLeft,
  Trash,
  History,
  Download,
  BrainCircuit,
  Plus,
  ChevronLeft,
  Menu,
  Search,
  Building,
  Inbox,
  ChevronDown,
  Mail,
  Linkedin,
  LucideTwitter
} from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "@/components/chat/ChatMessage";
import SidePanel from "@/components/chat/SidePanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSession, Message, CompanyData, JobData, InvestorData, CEOData } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { QuestionHint } from "@/components/chat/QuestionHint";
import { ChatHistoryModal } from "@/components/chat/ChatHistoryModal";
import { ThemeToggle } from "@/components/chat/ThemeToggle";

import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const DEFAULT_SYSTEM_MESSAGE = "You are a helpful, creative, and concise assistant. When asked about companies or CEOs, provide detailed information in a structured format.";

const SAMPLE_COMPANIES: CompanyData[] = [
  {
    id: "1",
    name: "TechVision Inc.",
    position: "CEO",
    ceo: "Sarah Johnson",
    website: "https://techvision.com",
    contact: { phone: "+12345678900", instagram: "https://instagram.com/techvision", x: "https://x.com/techvision", linkedin: "https://www.linkedin.com/in/techvision", whatsapp: "+1 (401) 477-2068" },
    industry: "Technology",
    location: "San Francisco, CA",
    workEmail: "info@techvision.com",
    salesEmail: "sales@techvision.com",
    leadScores: { engagement: 85, firmographicFit: 90, conversion: 75, rank: 83 },
    description: "TechVision is a leading provider of AI-powered business solutions, helping companies transform their operations through innovative technology."
  },
  {
    id: "2",
    name: "Green Energy Solutions",
    position: "Founder",
    ceo: "Michael Chen",
    website: "https://greenenergy.com",
    contact: { phone: "+12345678900", instagram: "https://instagram.com/greenenergy", x: "https://x.com/greenenergy", linkedin: "https://www.linkedin.com/in/greenenergy", whatsapp: "+1 (401) 477-2068"  },
    industry: "Renewable Energy",
    location: "Austin, TX",
    workEmail: "contact@greenenergy.com",
    salesEmail: "partnerships@greenenergy.com",
    leadScores: { engagement: 72, firmographicFit: 65, conversion: 68, rank: 70 },
    description: "Green Energy Solutions develops sustainable energy systems for residential and commercial applications."
  },
  {
    id: "3",
    name: "HealthPlus",
    position: "President",
    ceo: "Emily Rodriguez",
    website: "https://healthplus.com",
    contact: { phone: "+12345678900", instagram: "https://instagram.com/healthplus", x: "https://x.com/healthplus", linkedin: "https://www.linkedin.com/in/healthplus", whatsapp: "+1 (401) 477-2068"  },
    industry: "Healthcare",
    location: "Boston, MA",
    workEmail: "info@healthplus.com",
    salesEmail: "business@healthplus.com",
    leadScores: { engagement: 93, firmographicFit: 87, conversion: 90, rank: 91 },
    description: "HealthPlus is revolutionizing patient care through digital health platforms and telemedicine solutions."
  },
  {
    id: "4",
    name: "Global Finance Group",
    position: "Managing Director",
    ceo: "Robert Kiyosaki",
    website: "https://globalfinance.com",
    contact: { phone: "+12345678900", instagram: "https://instagram.com/globalfinance", x: "https://x.com/globalfinance", linkedin: "https://www.linkedin.com/in/globalfinance", whatsapp: "+1 (401) 477-2068"  },
    industry: "Financial Services",
    location: "New York, NY",
    workEmail: "contact@globalfinance.com",
    salesEmail: "clients@globalfinance.com",
    leadScores: { engagement: 65, firmographicFit: 80, conversion: 62, rank: 68 },
    description: "Global Finance Group provides comprehensive financial services to individuals and businesses worldwide."
  },
  {
    id: "5",
    name: "OceanBlue Logistics",
    position: "COO",
    ceo: "James Wilson",
    website: "https://oceanblue.com",
    contact: { phone: "+12345678900", instagram: "https://instagram.com/oceanblue", x: "https://x.com/oceanblue", linkedin: "https://www.linkedin.com/in/oceanblue", whatsapp: "+1 (401) 477-2068"  },
    industry: "Logistics & Transportation",
    location: "Miami, FL",
    workEmail: "info@oceanblue.com",
    salesEmail: "services@oceanblue.com",
    leadScores: { engagement: 78, firmographicFit: 73, conversion: 81, rank: 76 },
    description: "OceanBlue Logistics offers global shipping and supply chain management solutions for businesses of all sizes."
  }
];

const SAMPLE_HEALTHCARE_COMPANIES: CompanyData[] = [
  {
    id: "1",
    name: "LifeCare Solutions",
    position: "CEO",
    ceo: "Laura Smith",
    website: "https://lifecaresolutions.com",
    contact: {
      phone: "+12345678901",
      instagram: "https://instagram.com/lifecaresolutions",
      x: "https://x.com/lifecaresolutions",
      linkedin: "https://www.linkedin.com/in/lifecaresolutions", whatsapp: "+1 (401) 477-2068" 
    },
    industry: "Healthcare",
    location: "Los Angeles, CA",
    workEmail: "info@lifecaresolutions.com",
    salesEmail: "sales@lifecaresolutions.com",
    leadScores: { engagement: 88, firmographicFit: 92, conversion: 85, rank: 90 },
    description: "LifeCare Solutions provides innovative healthcare management platforms aimed at improving patient outcomes and operational efficiency."
  },
  {
    id: "2",
    name: "MediTech Innovations",
    position: "Founder",
    ceo: "Robert Garcia",
    website: "https://meditechinnovations.com",
    contact: {
      phone: "+12345678902",
      instagram: "https://instagram.com/meditechinnovations",
      x: "https://x.com/meditechinnovations",
      linkedin: "https://www.linkedin.com/in/meditechinnovations", whatsapp: "+1 (401) 477-2068" 
    },
    industry: "Healthcare",
    location: "Seattle, WA",
    workEmail: "contact@meditechinnovations.com",
    salesEmail: "business@meditechinnovations.com",
    leadScores: { engagement: 90, firmographicFit: 89, conversion: 94, rank: 93 },
    description: "MediTech Innovations develops cutting-edge medical devices aimed at enhancing patient care and treatment processes."
  },
  {
    id: "3",
    name: "WellnessCorp",
    position: "Chief Medical Officer",
    ceo: "Alice Johnson",
    website: "https://wellnesscorp.com",
    contact: {
      phone: "+12345678903",
      instagram: "https://instagram.com/wellnesscorp",
      x: "https://x.com/wellnesscorp",
      linkedin: "https://www.linkedin.com/in/wellnesscorp", whatsapp: "+1 (401) 477-2068" 
    },
    industry: "Healthcare",
    location: "Chicago, IL",
    workEmail: "info@wellnesscorp.com",
    salesEmail: "support@wellnesscorp.com",
    leadScores: { engagement: 75, firmographicFit: 80, conversion: 78, rank: 76 },
    description: "WellnessCorp offers comprehensive wellness programs and healthcare solutions designed to improve quality of life."
  },
  {
    id: "4",
    name: "PharmaCare",
    position: "VP of Operations",
    ceo: "David Lee",
    website: "https://pharmacare.com",
    contact: {
      phone: "+12345678904",
      instagram: "https://instagram.com/pharmacare",
      x: "https://x.com/pharmacare",
      linkedin: "https://www.linkedin.com/in/pharmacare", whatsapp: "+1 (401) 477-2068" 
    },
    industry: "Healthcare",
    location: "Houston, TX",
    workEmail: "info@pharmacare.com",
    salesEmail: "sales@pharmacare.com",
    leadScores: { engagement: 82, firmographicFit: 75, conversion: 79, rank: 80 },
    description: "PharmaCare specializes in the distribution of pharmaceutical products and offers consulting services in healthcare compliance."
  },
  {
    id: "5",
    name: "Nutrivibe",
    position: "Nutrition Specialist",
    ceo: "Sophia Martinez",
    website: "https://nutrivibe.com",
    contact: {
      phone: "+12345678905",
      instagram: "https://instagram.com/nutrivibe",
      x: "https://x.com/nutrivibe",
      linkedin: "https://www.linkedin.com/in/nutrivibe", whatsapp: "+1 (401) 477-2068" 
    },
    industry: "Healthcare",
    location: "Phoenix, AZ",
    workEmail: "info@nutrivibe.com",
    salesEmail: "business@nutrivibe.com",
    leadScores: { engagement: 87, firmographicFit: 85, conversion: 80, rank: 82 },
    description: "Nutrivibe focuses on nutraceutical products and dietary solutions to enhance health and wellness for individuals."
  }
];

const SAMPLE_AI_COMPANIES: CompanyData[] = [
  {
      id: "1",
      name: "NVIDIA",
      position: "CEO",
      ceo: "Jensen Huang",
      website: "https://www.nvidia.com",
      contact: {
          phone: "+1 408-486-2000",
          instagram: "https://www.instagram.com/nvidia/",
          x: "https://x.com/nvidia",
          linkedin: "https://www.linkedin.com/company/nvidia",
          whatsapp: "+1 (408) 486-2000"
      },
      industry: "Artificial Intelligence",
      location: "Santa Clara, CA",
      workEmail: "info@nvidia.com",
      salesEmail: "sales@nvidia.com",
      leadScores: { engagement: 95, firmographicFit: 98, conversion: 96, rank: 97 },
      description: "Nvidia is a leader in AI hardware and software development, providing solutions for deep learning and AI applications across industries."
  },
  {
      id: "2",
      name: "OpenAI",
      position: "CEO",
      ceo: "Sam Altman",
      website: "https://openai.com",
      contact: {
          phone: "+1 415-762-4000",
          instagram: "https://www.instagram.com/openai/",
          x: "https://x.com/openai",
          linkedin: "https://www.linkedin.com/company/openai",
          whatsapp: "+1 (415) 762-4000"
      },
      industry: "Artificial Intelligence",
      location: "San Francisco, CA",
      workEmail: "info@openai.com",
      salesEmail: "business@openai.com",
      leadScores: { engagement: 92, firmographicFit: 90, conversion: 94, rank: 93 },
      description: "OpenAI is a pioneer in AI research and development, known for models like GPT-3 and DALL-E, focusing on natural language processing and image generation."
  },
  {
      id: "3",
      name: "C3 AI",
      position: "CEO",
      ceo: "Thomas M. Siebel",
      website: "https://c3.ai",
      contact: {
          phone: "+1 650-503-2200",
          instagram: "https://www.instagram.com/c3.ai/",
          x: "https://x.com/c3.ai",
          linkedin: "https://www.linkedin.com/company/c3.ai",
          whatsapp: "+1 (650) 503-2200"
      },
      industry: "Artificial Intelligence",
      location: "Redwood City, CA",
      workEmail: "info@c3.ai",
      salesEmail: "sales@c3.ai",
      leadScores: { engagement: 85, firmographicFit: 88, conversion: 82, rank: 84 },
      description: "C3 AI provides enterprise AI software solutions to help organizations integrate AI into their operations and decision-making processes."
  },
  {
      id: "4",
      name: "Bandera AI Ventures",
      position: "CEO",
      ceo: "Ryan Alexander",
      website: "https://banderaai.com",
      contact: {
          phone: "+1 512-123-4567",
          instagram: "https://www.instagram.com/banderaai/",
          x: "https://x.com/banderaai",
          linkedin: "https://www.linkedin.com/company/banderaai",
          whatsapp: "+1 (512) 123-4567"
      },
      industry: "Artificial Intelligence",
      location: "Austin, TX",
      workEmail: "info@banderaai.com",
      salesEmail: "sales@banderaai.com",
      leadScores: { engagement: 80, firmographicFit: 82, conversion: 81, rank: 83 },
      description: "Bandera AI Ventures specializes in developing AI solutions for data analytics and machine learning applications, focusing on innovative AI technologies."
  },
  {
      id: "5",
      name: "Anthropic",
      position: "CEO",
      ceo: "Claire Wang",
      website: "https://www.anthropic.com",
      contact: {
          phone: "+1 415-762-4000",
          instagram: "https://www.instagram.com/anthropic/",
          x: "https://x.com/anthropic",
          linkedin: "https://www.linkedin.com/company/anthropic",
          whatsapp: "+1 (415) 762-4000"
      },
      industry: "Artificial Intelligence",
      location: "San Francisco, CA",
      workEmail: "info@anthropic.com",
      salesEmail: "business@anthropic.com",
      leadScores: { engagement: 88, firmographicFit: 85, conversion: 89, rank: 87 },
      description: "Anthropic is an AI safety and research company focused on developing general AI systems and large language models, emphasizing AI safety and ethical considerations."
  }
];

const SAMPLE_AI_POWER_COMPANIES: CompanyData[] = [
  {
      id: "1",
      name: "Bandera AI",
      position: "CEO",
      ceo: "Ryan Alexander",
      website: "https://banderaai.com",
      contact: {
          phone: "+1 512-123-4567",
          instagram: "https://www.instagram.com/banderaai/",
          x: "https://x.com/banderaai",
          linkedin: "https://www.linkedin.com/company/banderaai",
          whatsapp: "+1 (512) 123-4567"
      },
      industry: "Artificial Intelligence",
      location: "Austin, TX",
      workEmail: "info@banderaai.com",
      salesEmail: "sales@banderaai.com",
      leadScores: { engagement: 98, firmographicFit: 97, conversion: 99, rank: 98 },
      description: "Bandera AI specializes in cutting-edge AI solutions for data analytics and machine learning applications, focusing on innovative AI technologies for enterprise clients."
  },
  {
      id: "2",
      name: "Cyera",
      position: "Co-founder & CEO",
      ceo: "Yotam Segev",
      website: "https://www.cyera.io",
      contact: {
          phone: "+1 212-203-3900",
          instagram: "https://www.instagram.com/cyera_io/",
          x: "https://x.com/cyera_io",
          linkedin: "https://www.linkedin.com/company/cyera-io",
          whatsapp: "+1 (212) 203-3900"
      },
      industry: "Data Security",
      location: "New York, NY",
      workEmail: "info@cyera.io",
      salesEmail: "sales@cyera.io",
      leadScores: { engagement: 92, firmographicFit: 95, conversion: 90, rank: 93 },
      description: "Cyera is a data security company offering an AI-powered, agentless platform for instant data discovery, classification, and protection across multi-cloud and hybrid environments."
  },
  {
      id: "3",
      name: "Cresta",
      position: "Co-founder & CEO",
      ceo: "Zayd Enam",
      website: "https://cresta.com",
      contact: {
          phone: "+1 650-900-7116",
          instagram: "https://www.instagram.com/cresta_ai/",
          x: "https://x.com/cresta_ai",
          linkedin: "https://www.linkedin.com/company/cresta-ai",
          whatsapp: "+1 (650) 900-7116"
      },
      industry: "Artificial Intelligence",
      location: "Palo Alto, CA",
      workEmail: "info@cresta.com",
      salesEmail: "sales@cresta.com",
      leadScores: { engagement: 88, firmographicFit: 91, conversion: 89, rank: 90 },
      description: "Cresta is a leading contact center AI platform company, providing generative AI solutions to improve agent performance and customer experience in contact centers."
  },
  {
      id: "4",
      name: "Astranis",
      position: "Co-founder & CEO",
      ceo: "John Gedmark",
      website: "https://www.astranis.com",
      contact: {
          phone: "+1 415-305-0700",
          instagram: "https://www.instagram.com/astranis_space/",
          x: "https://x.com/astranis",
          linkedin: "https://www.linkedin.com/company/astranis",
          whatsapp: "+1 (415) 305-0700"
      },
      industry: "Satellite Communications",
      location: "San Francisco, CA",
      workEmail: "info@astranis.com",
      salesEmail: "sales@astranis.com",
      leadScores: { engagement: 85, firmographicFit: 87, conversion: 86, rank: 86 },
      description: "Astranis Space Technologies Corp. develops small geostationary communications satellites to provide affordable and reliable satellite internet connectivity to underserved regions worldwide."
  },
  {
      id: "5",
      name: "Ironclad",
      position: "Co-founder & CEO",
      ceo: "Jason Boehmig",
      website: "https://ironcladapp.com",
      contact: {
          phone: "+1 844-476-6258",
          instagram: "https://www.instagram.com/ironcladapp/",
          x: "https://x.com/ironcladapp",
          linkedin: "https://www.linkedin.com/company/ironclad-inc-",
          whatsapp: "+1 (844) 476-6258"
      },
      industry: "Legal Technology",
      location: "San Francisco, CA",
      workEmail: "info@ironcladapp.com",
      salesEmail: "sales@ironcladapp.com",
      leadScores: { engagement: 82, firmographicFit: 84, conversion: 83, rank: 83 },
      description: "Ironclad is a leading contract lifecycle management platform that helps businesses streamline the creation, negotiation, and management of contracts using AI and cloud-based technology."
  }
];

const SAMPLE_JOBS: JobData[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    companyName: "TechVision Inc.",
    salary: "$120,000 - $150,000",
    type: "Full-time",
    location: "San Francisco, CA",
    description: "We're looking for an experienced Frontend Developer to join our team.",
    postedDate: "2023-05-15"
  },
  {
    id: "2",
    title: "Product Manager",
    companyName: "TechVision Inc.",
    salary: "$130,000 - $160,000",
    type: "Full-time",
    location: "Remote",
    description: "Lead product development and strategy.",
    postedDate: "2023-05-10"
  },
  {
    id: "3",
    title: "UI/UX Designer",
    companyName: "Green Energy Solutions",
    salary: "$90,000 - $110,000",
    type: "Full-time",
    location: "Austin, TX",
    description: "Create beautiful and intuitive user experiences.",
    postedDate: "2023-05-05"
  },
  {
    id: "4",
    title: "DevOps Engineer",
    companyName: "HealthPlus",
    salary: "$115,000 - $140,000",
    type: "Full-time",
    location: "Boston, MA",
    description: "Manage and optimize our cloud infrastructure.",
    postedDate: "2023-05-01"
  },
  {
    id: "5",
    title: "Financial Analyst",
    companyName: "Global Finance Group",
    salary: "$85,000 - $105,000",
    type: "Full-time",
    location: "New York, NY",
    description: "Analyze financial data and create reports.",
    postedDate: "2023-04-28"
  }
];

const SAMPLE_INVESTORS: InvestorData[] = [
  {
    id: "1",
    name: "Sequoia Capital",
    email: "Sequoia@TechVision.com",
    companyName: "TechVision Inc.",
    country: "United States",
    funding: "$25M Series A",
    investmentStage: "Series A",
    portfolio: "Airbnb, Dropbox, Google",
    description: "Leading venture capital firm focused on technology investments."
  },
  {
    id: "2",
    name: "Andreessen Horowitz",
    email: "Andreessen@TechVision.com",
    companyName: "TechVision Inc.",
    country: "United States",
    funding: "$15M Seed",
    investmentStage: "Seed",
    portfolio: "Facebook, Twitter, GitHub",
    description: "Major venture capital firm specializing in technology startups."
  },
  {
    id: "3",
    name: "Kleiner Perkins",
    email: "Kleiner@Green.com",
    companyName: "Green Energy Solutions",
    country: "United States",
    funding: "$20M Series B",
    investmentStage: "Series B",
    portfolio: "Amazon, Google, Spotify",
    description: "Venture capital firm focusing on early-stage investments."
  },
  {
    id: "4",
    name: "Accel Partners",
    email: "Accel@HealthPlus.com",
    companyName: "HealthPlus",
    country: "United Kingdom",
    funding: "$30M Series C",
    investmentStage: "Series C",
    portfolio: "Facebook, Slack, Dropbox",
    description: "Global venture capital firm that invests in startups."
  },
  {
    id: "5",
    name: "SoftBank Vision Fund",
    email: "contact@GFG.com",
    companyName: "Global Finance Group",
    country: "Japan",
    funding: "$50M Late Stage",
    investmentStage: "Late Stage",
    portfolio: "Uber, WeWork, DoorDash",
    description: "Largest technology-focused investment fund."
  }
];

const Chat = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isChatHistoryModalOpen, setIsChatHistoryModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<ChatSession>({
    id: "default-session",
    title: "New Chat",
    messages: [],
    systemMessage: DEFAULT_SYSTEM_MESSAGE,
    model: "gpt-4o-mini",
    createdAt: new Date().toISOString(),
  });
  const [sessions, setSessions] = useState<ChatSession[]>([activeSession]);
  const [lastCompanyList, setLastCompanyList] = useState<CompanyData[]>([]);
  const [lastCEOList, setLastCEOList] = useState<CEOData[]>([]);
  const [lastJobList, setLastJobList] = useState<JobData[]>([]);
  const [lastInvestorList, setLastInvestorList] = useState<InvestorData[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobile) {
      setIsSidePanelOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [activeSession.messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuestionSelect = (question: string) => {
    sendMessage(question);
  };

  const findJobs = (companyName: string) => {
    const filteredMessages = activeSession.messages.filter(message => {
      const isJobSearch = message.role === "user" &&
        (message.content.toLowerCase().includes("find jobs") ||
          message.content.toLowerCase().includes("search jobs"));
      const isJobResult = message.role === "assistant" && message.jobs;
      const isInvestorSearch = message.role === "user" &&
        (message.content.toLowerCase().includes("find investors") ||
          message.content.toLowerCase().includes("search investors"));
      const isInvestorResult = message.role === "assistant" && message.investors;

      return !((isJobSearch || isJobResult) || (isInvestorSearch || isInvestorResult));
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Find Jobs in ${companyName}`,
      timestamp: new Date().toISOString(),
    };

    const updatedSession = {
      ...activeSession,
      messages: [...filteredMessages, userMessage],
    };

    setActiveSession(updatedSession);
    updateSessionInList(updatedSession);
    setIsLoading(true);

    const filteredJobs = SAMPLE_JOBS.filter(job =>
      job.companyName.toLowerCase().includes(companyName.toLowerCase())
    );

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Here are the job listings for ${companyName}:`,
        timestamp: new Date().toISOString(),
        jobs: filteredJobs
      };

      const finalUpdatedSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
      };

      setActiveSession(finalUpdatedSession);
      updateSessionInList(finalUpdatedSession);
      setLastJobList(filteredJobs);
      setIsLoading(false);
    }, 1000);
  };

  const findInvestors = (companyName: string) => {
    const filteredMessages = activeSession.messages.filter(message => {
      const isJobSearch = message.role === "user" &&
        (message.content.toLowerCase().includes("find jobs") ||
          message.content.toLowerCase().includes("search jobs"));
      const isJobResult = message.role === "assistant" && message.jobs;
      const isInvestorSearch = message.role === "user" &&
        (message.content.toLowerCase().includes("find investors") ||
          message.content.toLowerCase().includes("search investors"));
      const isInvestorResult = message.role === "assistant" && message.investors;

      return !((isJobSearch || isJobResult) || (isInvestorSearch || isInvestorResult));
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Find Investors in ${companyName}`,
      timestamp: new Date().toISOString(),
    };

    const updatedSession = {
      ...activeSession,
      messages: [...filteredMessages, userMessage],
    };

    setActiveSession(updatedSession);
    updateSessionInList(updatedSession);
    setIsLoading(true);

    const filteredInvestors = SAMPLE_INVESTORS.filter(investor =>
      investor.companyName.toLowerCase().includes(companyName.toLowerCase())
    );

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Here are the investors for ${companyName}:`,
        timestamp: new Date().toISOString(),
        investors: filteredInvestors
      };

      const finalUpdatedSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
      };

      setActiveSession(finalUpdatedSession);
      updateSessionInList(finalUpdatedSession);
      setLastInvestorList(filteredInvestors);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    sendMessage();
  };

  const sendMessage = async (content?: string) => {
    const messageContent = content || input;

    if ((!messageContent.trim() && !content) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent.trim(),
      timestamp: new Date().toISOString(),
    };

    let updatedMessages = [...activeSession.messages];
    const lowerCaseInput = messageContent.trim().toLowerCase();

    if (lowerCaseInput.includes("find jobs") || lowerCaseInput.includes("search jobs") ||
      lowerCaseInput.includes("find investors") || lowerCaseInput.includes("search investors")) {
      updatedMessages = updatedMessages.filter(message => {
        const isJobSearch = message.role === "user" &&
          (message.content.toLowerCase().includes("find jobs") ||
            message.content.toLowerCase().includes("search jobs"));
        const isJobResult = message.role === "assistant" && message.jobs;
        const isInvestorSearch = message.role === "user" &&
          (message.content.toLowerCase().includes("find investors") ||
            message.content.toLowerCase().includes("search investors"));
        const isInvestorResult = message.role === "assistant" && message.investors;

        return !((isJobSearch || isJobResult) || (isInvestorSearch || isInvestorResult));
      });
    }

    const updatedSession = {
      ...activeSession,
      messages: [...updatedMessages, userMessage],
    };

    setActiveSession(updatedSession);
    updateSessionInList(updatedSession);
    setInput("");
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let aiResponse: Message;

      const lowerCaseInput = messageContent.trim().toLowerCase();

      if (lowerCaseInput.includes("find companies in ai industry")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the companies matching your search criteria:",
          timestamp: new Date().toISOString(),
          companies: SAMPLE_AI_COMPANIES
        };
        setLastCompanyList(SAMPLE_AI_COMPANIES);
      } else if (lowerCaseInput.includes("find top booming ai")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the companies matching your search criteria:",
          timestamp: new Date().toISOString(),
          companies: SAMPLE_AI_POWER_COMPANIES
        };
        setLastCompanyList(SAMPLE_AI_POWER_COMPANIES);
      } else if (lowerCaseInput.includes("find companies in healthcare")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the companies matching your search criteria:",
          timestamp: new Date().toISOString(),
          companies: SAMPLE_HEALTHCARE_COMPANIES
        };
        setLastCompanyList(SAMPLE_HEALTHCARE_COMPANIES);
      } else if (lowerCaseInput.includes("find companies") || lowerCaseInput.includes("search companies")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the companies matching your search criteria:",
          timestamp: new Date().toISOString(),
          companies: SAMPLE_COMPANIES
        };
        setLastCompanyList(SAMPLE_COMPANIES);
      } else if ((lowerCaseInput.includes("find") && lowerCaseInput.includes("ceo"))||(lowerCaseInput.includes("find") && lowerCaseInput.includes("cto"))) {
        const ceoList = SAMPLE_COMPANIES.map(company => ({
          id: company.id,
          name: company.ceo,
          position: "CEO",
          company: company.name,
          website: company.website,
          industry: company.industry,
          location: company.location,
          leadScores: company.leadScores,
          contact: company.contact,
          workEmail: company.workEmail,
          salesEmail: company.salesEmail,
          description: company.description,
        }));

        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the CEOs you requested:",
          timestamp: new Date().toISOString(),
          ceos: ceoList
        };
        setLastCEOList(ceoList);
      } else if (lowerCaseInput.includes("find jobs") || lowerCaseInput.includes("search jobs")) {
        const companyNameMatch = messageContent.match(/find jobs in (.*)/i) || messageContent.match(/search jobs in (.*)/i);
        let filteredJobs = SAMPLE_JOBS;

        if (companyNameMatch && companyNameMatch[1]) {
          const companyName = companyNameMatch[1].trim();
          filteredJobs = SAMPLE_JOBS.filter(job =>
            job.companyName.toLowerCase().includes(companyName.toLowerCase())
          );
        }

        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the job listings matching your search criteria:",
          timestamp: new Date().toISOString(),
          jobs: filteredJobs
        };
        setLastJobList(filteredJobs);
      } else if (lowerCaseInput.includes("find investors") || lowerCaseInput.includes("search investors")) {
        const companyNameMatch = messageContent.match(/find investors in (.*)/i) || messageContent.match(/search investors in (.*)/i);
        let filteredInvestors = SAMPLE_INVESTORS;

        if (companyNameMatch && companyNameMatch[1]) {
          const companyName = companyNameMatch[1].trim();
          filteredInvestors = SAMPLE_INVESTORS.filter(investor =>
            investor.companyName.toLowerCase().includes(companyName.toLowerCase())
          );
        }

        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the investors matching your search criteria:",
          timestamp: new Date().toISOString(),
          investors: filteredInvestors
        };
        setLastInvestorList(filteredInvestors);
      } else if (lowerCaseInput.includes("download list")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm preparing the Excel file for download...",
          timestamp: new Date().toISOString(),
        };

        if (lastCompanyList.length > 0) {
          setTimeout(() => {
            downloadExcel(lastCompanyList);
          }, 500);
        } else if (lastCEOList.length > 0) {
          setTimeout(() => {
            const worksheet = XLSX.utils.json_to_sheet(lastJobList);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
            XLSX.writeFile(workbook, "job-list.xlsx");

            toast({
              title: "Download complete",
              description: "The Jobs Excel file has been downloaded successfully.",
            });
          }, 500);
        } else if (lastJobList.length > 0) {
          setTimeout(() => {
            const worksheet = XLSX.utils.json_to_sheet(lastJobList);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
            XLSX.writeFile(workbook, "job-list.xlsx");

            toast({
              title: "Download complete",
              description: "The Jobs Excel file has been downloaded successfully.",
            });
          }, 500);
        } else if (lastInvestorList.length > 0) {
          setTimeout(() => {
            const worksheet = XLSX.utils.json_to_sheet(lastInvestorList);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Investors");
            XLSX.writeFile(workbook, "investor-list.xlsx");

            toast({
              title: "Download complete",
              description: "The Investors Excel file has been downloaded successfully.",
            });
          }, 500);
        } else {
          aiResponse.content = "I don't have any list data to download. Please search for companies, jobs, or investors first.";
        }
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "This is a simulated response. In a real application, you would connect to an API like OpenAI here to get a proper response.",
          timestamp: new Date().toISOString(),
        };
      }

      const shouldUpdateTitle = updatedSession.messages.length === 1 && updatedSession.title === "New Chat";

      const finalUpdatedSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
        title: shouldUpdateTitle ? getSessionTitle(messageContent) : updatedSession.title,
      };

      setActiveSession(finalUpdatedSession);
      updateSessionInList(finalUpdatedSession);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const downloadExcel = (data: CompanyData[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
    XLSX.writeFile(workbook, "company-list.xlsx");

    toast({
      title: "Download complete",
      description: "The Excel file has been downloaded successfully.",
    });
  };

  const getSessionTitle = (message: string) => {
    return message.length > 30 ? `${message.substring(0, 30)}...` : message;
  };

  const updateSessionInList = (updatedSession: ChatSession) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === updatedSession.id ? updatedSession : session
      )
    );
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      systemMessage: DEFAULT_SYSTEM_MESSAGE,
      model: activeSession.model,
      createdAt: new Date().toISOString(),
    };

    setSessions([...sessions, newSession]);
    setActiveSession(newSession);
  };

  const switchSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      if (isMobile) {
        setIsSidePanelOpen(false);
      }
    }
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const deleteSession = (sessionId: string) => {
    if (sessions.length <= 1) {
      return;
    }

    const updatedSessions = sessions.filter(session => session.id !== sessionId);

    setSessions(updatedSessions);

    if (sessionId === activeSession.id) {
      setActiveSession(updatedSessions[updatedSessions.length - 1]);
    }
  };

  const clearSession = () => {
    const clearedSession = {
      ...activeSession,
      messages: [],
      title: "New Chat",
    };

    setActiveSession(clearedSession);
    updateSessionInList(clearedSession);

    toast({
      title: "Chat cleared",
      description: "The conversation has been cleared.",
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-slate-900">
      {isSidePanelOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={toggleSidePanel} />
      )}

      <SidePanel
        isOpen={isSidePanelOpen}
        sessions={sessions}
        activeSessionId={activeSession.id}
        onNewSession={createNewSession}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
      />

      <div className="flex flex-col flex-1 h-full overflow-hidden relative">
        {!isSidePanelOpen && (
          <div className="fixed top-20 left-4 z-20 md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidePanel}
              className="rounded-full shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 w-10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}

        <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 shadow-sm">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidePanel}
              className="mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:flex"
              aria-label={isSidePanelOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidePanelOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="flex items-center">
              <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                {activeSession.title}
              </h1>

            </div>
          </div>

          <div className="flex items-center space-x-2">

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 rounded-full px-4 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
                >
                  <Inbox className="h-4 w-4" />
                  Social Inbox
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
                <div className="flex flex-col gap-1">
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal"
                    onClick={() => navigate('/chat/inbox')}
                  >
                    <Inbox className="mr-2 h-4 w-4" />
                    All Inboxes
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal"
                    onClick={() => navigate('/chat/inbox/email')}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email Inbox
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal"
                    onClick={() => navigate('/chat/inbox/linkedin')}
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn Inbox
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal"
                    onClick={() => navigate('/chat/inbox/twitter')}
                  >
                    <FontAwesomeIcon icon={faXTwitter} />
                    Twitter Inbox
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start font-normal"
                    onClick={() => navigate('/chat/inbox/whatsapp')}
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                    WhatsApp Inbox
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <ThemeToggle />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearSession}
                    disabled={activeSession.messages.length === 0}
                    aria-label="Clear chat"
                    className="rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsChatHistoryModalOpen(true)}
                    aria-label="Chat history"
                    className="rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
                  >
                    <History className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage chat history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>


            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {}}
                    aria-label="Settings"
                    className="rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </div>
        </header>

        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-slate-900"
        >
          {activeSession.messages.length === 0 ? (
            <div className="flex flex-col items-center my-auto h-full text-center p-4">
              <div className="h-20 w-20 flex items-center justify-center mb-6 animate-pulse bg-transparent">
                {/* <BrainCircuit className="h-10 w-10 text-white" /> */}
                <img src="./Bandera AI.png" alt="Logo" />
              </div>

              <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                Bandera AI
              </h2>

              <p className="text-muted-foreground max-w-md mb-10 text-lg">
                Ask a question or explore one of our suggestions to start your conversation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
                <div
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer"
                  onClick={() => handleQuestionSelect("Find Companies in the technology sector")}
                >
                  <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg w-fit">
                    <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Find Companies</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover tech companies and explore their details
                  </p>
                </div>

                <div
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] hover:border-purple-200 dark:hover:border-purple-800 cursor-pointer"
                  onClick={() => handleQuestionSelect("Find Decision Maker, CEO, or CTO")}
                >
                  <div className="mb-3 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg w-fit">
                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Find Decision Maker, CEO, or CTO</h3>
                  <p className="text-sm text-muted-foreground">
                    List prominent Descision Maker, CEO, or CTO and their company information
                  </p>
                </div>

                <div
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] hover:border-green-200 dark:hover:border-green-800 cursor-pointer"
                  onClick={() => handleQuestionSelect("Download list")}
                >
                  <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/30 rounded-lg w-fit">
                    <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Download Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Export data into a downloadable Excel file
                  </p>
                </div>

                <div
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] hover:border-orange-200 dark:hover:border-orange-800 cursor-pointer"
                  onClick={() => handleQuestionSelect("Find Jobs in TechVision Inc.")}
                >
                  <div className="mb-3 p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg w-fit">
                    <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Find Jobs</h3>
                  <p className="text-sm text-muted-foreground">
                    Search for job opportunities in specific companies
                  </p>
                </div>
              </div>
            </div>
          ) : (
            activeSession.messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLastMessage={index === activeSession.messages.length - 1}
                onFindJobs={findJobs}
                onFindInvestors={findInvestors}
              />
            ))
          )}

          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-muted-foreground">Thinking...</span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto relative">
            <Tabs defaultValue="chat" className="w-full">
              <TabsContent value="chat" className="mt-0">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="min-h-[80px] resize-none pr-24 bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700 shadow-sm focus:border-blue-300 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <QuestionHint onSelectQuestion={handleQuestionSelect} />

                    <Button
                      className={cn(
                        "h-9 px-4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all",
                        (!input.trim() || isLoading) && "opacity-70"
                      )}
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <ChatHistoryModal
        isOpen={isChatHistoryModalOpen}
        onClose={() => setIsChatHistoryModalOpen(false)}
        sessions={sessions}
        activeSessionId={activeSession.id}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
      />
    </div>
  );
};

export default Chat;
