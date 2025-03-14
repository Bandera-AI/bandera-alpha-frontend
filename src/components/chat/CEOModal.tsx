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
import { CEOData, CompanyData } from "@/types/chat";
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
import { LeadScorePolygon } from "./LeadScorePolygon";

interface CEOModalProps {
  ceo: CEOData;
  isOpen: boolean;
  onClose: () => void;
  onFindJobs?: (companyName: string) => void;
  onFindInvestors?: (companyName: string) => void;
}

export const CEOModal = ({
  ceo,
  isOpen,
  onClose,
  onFindJobs,
  onFindInvestors,
}: CEOModalProps) => {
  const [ceoEmailModalOpen, setCeoEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState(`Regarding ${ceo.name}`);
  const [emailMessage, setEmailMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [addingContact, setAddingContact] = useState<{
    email: boolean;
    linkedin: boolean;
    twitter: boolean;
  }>({
    email: false,
    linkedin: false,
    twitter: false
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
        `Hello ${ceo.company.split(' ')[0]}, 

I recently learned about ${ceo.name}'s impressive achievements in the ${ceo.industry} sector. Your approach to innovation and growth has caught my attention, and I believe there could be potential synergies between our organizations.

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
    hello: `Hello ${ceo.company.split(" ")[0]}, I came across ${
      ceo.name
    } and wanted to connect.`,
    hi: `Hi ${
      ceo.company.split(" ")[0]
    }, saw that you guys are hiring Software Engineer, we are specializing in placing top engineer talents across the globe, mind to a quick chat? `,
    "I'm reach": `I'm reaching out regarding ${ceo.name}'s innovative work in the ${ceo.industry} sector.`,
    "would you": `Would you be available for a 15-minute call next week to discuss how ${ceo.name} and our company could collaborate?`,
    "I'm follow": `I'm following up on our previous conversation about ${ceo.name}'s products.`,
    "I'd like": `I'd like to explore potential partnership opportunities between our organizations in the ${ceo.industry} market.`,
    "I'm interest": `I'm interested in your approach to ${ceo.industry} and would love to learn more.`,
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
        description: `Your message has been sent to ${ceo.company}`,
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
      onFindJobs(ceo.name);
    }
  };

  const handleFindInvestors = () => {
    onClose(); // Close the modal first
    if (onFindInvestors) {
      onFindInvestors(ceo.name);
    }
  };
  const handleAddContact = (platform: 'email' | 'linkedin' | 'twitter') => {
    setAddingContact(prev => ({ ...prev, [platform]: true }));
    
    // Create a new contact object
    const newContact: Contact = {
      id: `${platform}-${Date.now()}`,
      name: ceo.company,
      platform: platform,
      company: ceo.name,
      position: "CEO",
      ...(platform === 'email' && { email: ceo.workEmail || `${ceo.company.split(' ')[0].toLowerCase()}@${ceo.website.replace(/(^\w+:|^)\/\//, "").split('/')[0]}` }),
      ...(platform === 'linkedin' && { handle: ceo.company.split(' ')[0].toLowerCase() }),
      ...(platform === 'twitter' && { handle: ceo.company.split(' ')[0].toLowerCase() }),
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
        description: `${ceo.company} has been added to your ${platform} contacts.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Contact Exists",
        description: `${ceo.company} is already in your ${platform} contacts.`,
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
    setEmailSubject(`Regarding ${ceo.name}`);
  }, [ceoEmailModalOpen, ceo])
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Building className="h-5 w-5" />
              {ceo.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {ceo.industry} • {ceo.location}
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
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Company:</span> {ceo.company}
                    <Mail className="h-6 w-6 text-blue-500 ml-auto" />
                  </div>
                  <div className="flex p-2 items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Website:</span>{" "}
                    <a
                      href={ceo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {ceo.website.replace(/(^\w+:|^)\/\//, "")}
                    </a>
                  </div>
                  <div className="flex p-2 items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span>{" "}
                    {ceo.location}
                  </div>
                </div>
              </div>
              <hr className="bg-primary-foreground text-foreground" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Contact Information
                </h3>
                <div className="space-y-0">
                  {ceo.workEmail && (
                    <div className="flex items-center p-2 gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium w-10">Work:</span>{" "}
                      <a
                        href={`mailto:${ceo.workEmail}`}
                        className="text-blue-600"
                      >
                        {ceo.workEmail}
                      </a>
                    </div>
                  )}
                  {ceo.salesEmail && (
                    <div className="flex items-center p-2 gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium w-10">Sales:</span>{" "}
                      <a
                        href={`mailto:${ceo.salesEmail}`}
                        className="text-blue-600"
                      >
                        {ceo.salesEmail}
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
                        <Twitter className="h-3 w-3 mr-1 text-blue-600" />
                        Twitter
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
                        ceo.leadScores.rank
                      )} font-medium text-xl`}
                    >
                      {ceo.leadScores.rank}
                </span>
              </h3>
              <div className="space-y-4">
                <LeadScorePolygon scores={{
                  engagement: ceo.leadScores.engagement,
                  firmographicFit: ceo.leadScores.firmographicFit,
                  conversion: ceo.leadScores.conversion
                }} />

              </div>
              <div className="space-y-3 mt-10 mr-2 ">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Contact Links
                </h3>
                <div className="flex gap-4 h-8 items-center ">
                {ceo.contact.phone && (
                  <a href={ceo.contact.phone}>
                    <Phone className="h-6 w-6 text-green-600" />
                  </a>
                )}
                {ceo.contact.instagram && (
                  <a href={ceo.contact.instagram}>
                    <Instagram className="h-6 w-6 text-violet-600" />
                  </a>
                )}
                {ceo.contact.x && (
                  <a href={ceo.contact.x}>
                    <Twitter
                      className="h-6 w-6 text-foreground"
                      href={ceo.contact.x}
                    />
                  </a>
                )}
                {ceo.contact.linkedin && (
                  <a href={ceo.contact.linkedin}>
                    <Linkedin
                      className="h-6 w-6 text-blue-600"
                      href={ceo.contact.linkedin}
                    />
                  </a>
                )}
                </div>
              </div>
            </div>
          </div>

          {ceo.description && (
            <div className="mt-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-sm">{ceo.description}</p>
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
                {ceo.company
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </div>
              <div>
                <div className="text-xl">{ceo.company}</div>
                <div className="text-sm text-muted-foreground">
                  CEO at {ceo.name}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {ceo.workEmail ||
                    `${ceo.company.split(" ")[0].toLowerCase()}@${
                      ceo.website.replace(/(^\w+:|^)\/\//, "").split("/")[0]
                    }`}
                </span>
              </div>
              <div className="text-sm mt-2">
                Send a direct message to {ceo.company.split(" ")[0]}
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
                  ceo.company.split(" ")[0]
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
                  ceo.company.split(" ")[0]
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
