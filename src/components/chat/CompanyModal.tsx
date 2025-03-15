import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CompanyData } from "@/types/chat";
import { Contact } from "@/types/inbox";
import { useToast } from "@/components/ui/use-toast";
import {
  Building,
  User,
  Globe,
  MapPin,
  Mail,
  BarChart3,
  Percent,
  Star,
  TrendingUp,
  Award,
  Send,
  X,
  Phone,
  Instagram,
  Twitter,
  Linkedin,
  Check,
  Briefcase,
  DollarSign,
  Wand2,
  PlusCircle
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { LeadScorePolygon } from "./LeadScorePolygon";

interface CompanyModalProps {
  company: CompanyData;
  isOpen: boolean;
  onClose: () => void;
  onFindJobs?: (companyName: string) => void;
  onFindInvestors?: (companyName: string) => void;
}

export const CompanyModal = ({
  company,
  isOpen,
  onClose,
  onFindJobs,
  onFindInvestors,
}: CompanyModalProps) => {
  const [ceoEmailModalOpen, setCeoEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState(`Regarding ${company.name}`);
  const [emailMessage, setEmailMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [addingContact, setAddingContact] = useState<{
    email: boolean;
    linkedin: boolean;
    twitter: boolean;
    whatsapp: boolean;
  }>({
    email: false,
    linkedin: false,
    twitter: false,
    whatsapp: false,
  });
  const { toast } = useToast();

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const handleCeoClick = () => {
    setCeoEmailModalOpen(true);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setEmailMessage(suggestion);
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);

    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate a more specific, personalized message based on company info
      const generatedMessage = 
        `Hello ${company.ceo.split(' ')[0]}, 

I recently learned about ${company.name}'s impressive achievements in the ${company.industry} sector. Your approach to innovation and growth has caught my attention, and I believe there could be potential synergies between our organizations.

Would you be open to a brief conversation next week to explore how we might collaborate? I'd love to learn more about your current priorities and share how our expertise could support your goals.

Looking forward to your response,
[Your Name]`;

      setEmailMessage(generatedMessage);

      toast({
        title: "AI message generated",
        description:
          "The message has been generated and inserted into the editor.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to generate message",
        description:
          "There was an error generating the AI message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const emailSuggestionTriggers = {
    hello: `Hello ${company.ceo.split(" ")[0]}, I came across ${
      company.name
    } and wanted to connect.`,
    hi: `Hi ${
      company.ceo.split(" ")[0]
    }, saw that you guys are hiring Software Engineer, we are specializing in placing top engineer talents across the globe, mind to a quick chat? `,
    "I'm reach": `I'm reaching out regarding ${company.name}'s innovative work in the ${company.industry} sector.`,
    "would you": `Would you be available for a 15-minute call next week to discuss how ${company.name} and our company could collaborate?`,
    "I'm follow": `I'm following up on our previous conversation about ${company.name}'s products.`,
    "I'd like": `I'd like to explore potential partnership opportunities between our organizations in the ${company.industry} market.`,
    "I'm interest": `I'm interested in your approach to ${company.industry} and would love to learn more.`,
  };

  const handleSendEmail = async () => {
    if (!emailMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would integrate with an email service here
      // For demo purposes, we'll just show a success toast

      toast({
        title: "Email sent successfully",
        description: `Your message has been sent to ${company.ceo}`,
        variant: "default",
      });

      setEmailMessage("");
      setCeoEmailModalOpen(false);
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "There was an error sending your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFindJobs = () => {
    onClose(); // Close the modal first
    if (onFindJobs) {
      onFindJobs(company.name);
    }
  };

  const handleFindInvestors = () => {
    onClose(); // Close the modal first
    if (onFindInvestors) {
      onFindInvestors(company.name);
    }
  };
  const handleAddContact = (platform: 'email' | 'linkedin' | 'twitter' | 'whatsapp') => {
    setAddingContact(prev => ({ ...prev, [platform]: true }));
    
    // Create a new contact object
    const newContact: Contact = {
      id: `${platform}-${Date.now()}`,
      name: company.ceo,
      platform: platform,
      company: company.name,
      position: "CEO",
      ...(platform === 'email' && { email: company.workEmail || `${company.ceo.split(' ')[0].toLowerCase()}@${company.website.replace(/(^\w+:|^)\/\//, "").split('/')[0]}` }),
      ...(platform === 'linkedin' && { handle: company.ceo.split(' ')[0].toLowerCase() }),
      ...(platform === 'twitter' && { handle: company.ceo.split(' ')[0].toLowerCase() }),
      ...(platform === 'whatsapp' && { handle: company.ceo.split(' ')[0].toLowerCase() }),
    };
    
    // Get existing contacts from localStorage
    const existingContactsString = localStorage.getItem(`${platform}Contacts`);
    const existingContacts: Contact[] = existingContactsString 
      ? JSON.parse(existingContactsString) 
      : [];
    
    // Check if contact already exists
    const contactExists = existingContacts.some(
      contact => contact.name === newContact.name && contact.platform === platform
    );
    
    if (!contactExists) {
      // Add new contact
      const updatedContacts = [...existingContacts, newContact];
      localStorage.setItem(`${platform}Contacts`, JSON.stringify(updatedContacts));
      
      toast({
        title: "Contact Added",
        description: `${company.ceo} has been added to your ${platform} contacts.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Contact Exists",
        description: `${company.ceo} is already in your ${platform} contacts.`,
        variant: "default",
      });
    }
    
    setTimeout(() => {
      setAddingContact(prev => ({ ...prev, [platform]: false }));
    }, 1500);
  };


  const sentenceTemplates = [
    "Hello, how are you?",
    "What is your name?",
    "I am from New York.",
  ];

  useEffect(()=>{
    setEmailMessage("");
    setEmailSubject(`Regarding ${company.name}`);
  }, [ceoEmailModalOpen, company])
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Building className="h-5 w-5" />
              {company.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {company.industry} • {company.location}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Company Information
                </h3>
                <div className="space-y-0">
                  <div
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                    onClick={handleCeoClick}
                  >
                    <User className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">CEO:</span> {company.ceo}
                    <Mail className="h-6 w-6 text-blue-500 ml-auto" />
                  </div>
                  <div className="flex p-2 items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Website:</span>{" "}
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website.replace(/(^\w+:|^)\/\//, "")}
                    </a>
                  </div>
                  <div className="flex p-2 items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span>{" "}
                    {company.location}
                  </div>
                </div>
              </div>
              <hr className="bg-primary-foreground text-foreground" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Contact Information
                </h3>
                <div className="space-y-0">
                  {company.workEmail && (
                    <div className="flex items-center p-2 gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium w-10">Work:</span>{" "}
                      <a
                        href={`mailto:${company.workEmail}`}
                        className="text-blue-600"
                      >
                        {company.workEmail}
                      </a>
                    </div>
                  )}
                  {company.salesEmail && (
                    <div className="flex items-center p-2 gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium w-10">Sales:</span>{" "}
                      <a
                        href={`mailto:${company.salesEmail}`}
                        className="text-blue-600"
                      >
                        {company.salesEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Add to Inbox
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleAddContact('email')}
                    disabled={addingContact.email}
                  >
                    {addingContact.email ? (
                      <>
                        <div className="animate-spin h-3 w-3 mr-1 border-2 border-b-transparent border-current rounded-full" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Mail className="h-3 w-3 mr-1 text-blue-600" />
                        Email
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleAddContact('linkedin')}
                    disabled={addingContact.linkedin}
                  >
                    {addingContact.linkedin ? (
                      <>
                        <div className="animate-spin h-3 w-3 mr-1 border-2 border-b-transparent border-current rounded-full" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Linkedin className="h-3 w-3 mr-1 text-blue-600" />
                        LinkedIn
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleAddContact('twitter')}
                    disabled={addingContact.twitter}
                  >
                    {addingContact.twitter ? (
                      <>
                        <div className="animate-spin h-3 w-3 mr-1 border-2 border-b-transparent border-current rounded-full" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faXTwitter} className="h-3 w-3 mr-1 text-blue-600" />
                        Twitter
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleAddContact('whatsapp')}
                    disabled={addingContact.whatsapp}
                  >
                    {addingContact.whatsapp ? (
                      <>
                        <div className="animate-spin h-3 w-3 mr-1 border-2 border-b-transparent border-current rounded-full" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faWhatsapp} />
                        WhatsApp
                      </>
                    )}
                  </Button>
                </div>
              </div>

            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-10 gap-4 flex items-end -translate-y-2">
                Lead Scores
                <span
                      className={`${scoreColor(
                        company.leadScores.rank
                      )} font-medium text-xl`}
                    >
                      {company.leadScores.rank}
                </span>
              </h3>
              <div className="space-y-4">
                <LeadScorePolygon scores={{
                  engagement: company.leadScores.engagement,
                  firmographicFit: company.leadScores.firmographicFit,
                  conversion: company.leadScores.conversion
                }} />

              </div>
              <div className="space-y-3 mt-10 mr-2 ">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Contact Links
                </h3>
                <div className="flex gap-4 h-8 items-center ">
                {company.contact.phone && (
                  <a href={company.contact.phone}>
                    <Phone className="h-6 w-6 text-green-600" />
                  </a>
                )}
                {company.contact.instagram && (
                  <a href={company.contact.instagram}>
                    <Instagram className="h-6 w-6 text-violet-600" />
                  </a>
                )}
                {company.contact.x && (
                  <a href={company.contact.x}>
                    <FontAwesomeIcon icon={faXTwitter} className="h-6 w-6 text-foreground" href={company.contact.x} />
                  </a>
                )}
                {company.contact.linkedin && (
                  <a href={company.contact.linkedin}>
                    <Linkedin
                      className="h-6 w-6 text-blue-600"
                      href={company.contact.linkedin}
                    />
                  </a>
                )}
                {company.contact.whatsapp && (
                  <a href={company.contact.whatsapp}>
                    <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6 text-green-600" />
                  </a>
                )}
                </div>
              </div>
            </div>
          </div>

          {company.description && (
            <div className="mt-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-sm">{company.description}</p>
            </div>
          )}
          {/* New buttons for Jobs and Investors */}
          <div className="flex space-x-2 py-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={handleFindJobs}
                >
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  Find Jobs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={handleFindInvestors}
                >
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Find Investors
                </Button>
              </div>

        </DialogContent>
      </Dialog>

      {/* CEO Email Modal */}
      <Dialog
        open={ceoEmailModalOpen}
        onOpenChange={(open) => setCeoEmailModalOpen(open)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {company.ceo
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </div>
              <div>
                <div className="text-xl">{company.ceo}</div>
                <div className="text-sm text-muted-foreground">
                  CEO at {company.name}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {company.workEmail ||
                    `${company.ceo.split(" ")[0].toLowerCase()}@${
                      company.website.replace(/(^\w+:|^)\/\//, "").split("/")[0]
                    }`}
                </span>
              </div>
              <div className="text-sm mt-2">
                Send a direct message to {company.ceo.split(" ")[0]}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Email subject"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium flex items-center justify-between">
                <span>Message</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                >
                  {isGeneratingAI ? (
                    <>
                      <div className="animate-spin h-3 w-3 mr-1 border-2 border-b-transparent border-current rounded-full text-violet-600" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3 w-3 mr-1 text-violet-600" />
                      Generate AI
                    </>
                  )}
                </Button>
                </label>
              {/* <ReactTextareaAutocomplete
                id="message"
                type="text"
                name="sentence"
                value={emailMessage}
                placeholder={`Write a message to ${
                  company.ceo.split(" ")[0]
                }...`}
                onValueChange={handleValueChange}
                dictionary={sentenceTemplates}
              /> */}
              <Textarea
                id="message"
                value={emailMessage}
                suggestionTriggers={emailSuggestionTriggers}
                onSuggestionSelect={handleSuggestionSelect}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder={`Write a message to ${
                  company.ceo.split(" ")[0]
                }...`}
                onGenerateAI={handleGenerateAI}
                className="min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setCeoEmailModalOpen(false)}
              disabled={isSending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSending || !emailMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSending ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent border-white rounded-full" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
