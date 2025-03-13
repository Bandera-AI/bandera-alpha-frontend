
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { pageTransition, fadeUpItem, staggerContainer } from "@/lib/framer-transitions";

const Description = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" asChild className="mr-4">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">No More Manual Work. Just Sales.</h1>
        </div>
        
        <div className="space-y-16">
          {/* Page 1: The Problem */}
          <motion.section 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="glass-card p-8 rounded-xl"
          >
            <motion.h2 variants={fadeUpItem} className="text-2xl font-semibold mb-6 text-gradient">
              The Problem – Why Traditional Lead Gen is Broken
            </motion.h2>
            
            <motion.p variants={fadeUpItem} className="mb-6 text-muted-foreground">
              For years, sales teams have relied on multiple disconnected tools—Clay, Apollo, ZoomInfo, LinkedIn scraping, and manual outreach—to generate leads. But these tools come with major problems:
            </motion.p>
            
            <motion.ul variants={staggerContainer} className="space-y-4 list-disc list-inside text-muted-foreground ml-4">
              <motion.li variants={fadeUpItem}>
                <span className="font-medium text-foreground">Scattered Data</span> – Finding, enriching, and verifying leads requires switching between platforms, exporting CSVs, and constant manual work.
              </motion.li>
              <motion.li variants={fadeUpItem}>
                <span className="font-medium text-foreground">Low-Quality Leads</span> – Many leads are outdated, missing key contact details, or irrelevant to your business.
              </motion.li>
              <motion.li variants={fadeUpItem}>
                <span className="font-medium text-foreground">Time-Consuming Outreach</span> – Writing messages, personalizing emails, and managing follow-ups manually is inefficient.
              </motion.li>
              <motion.li variants={fadeUpItem}>
                <span className="font-medium text-foreground">Missed Opportunities</span> – Without intelligent lead scoring and timing optimization, many high-potential leads slip through the cracks.
              </motion.li>
            </motion.ul>
            
            <motion.p variants={fadeUpItem} className="mt-6 font-medium">
              The result? Hours of manual work, lower response rates, and missed revenue opportunities.
            </motion.p>
          </motion.section>
          
          {/* Page 2: The Solution */}
          <motion.section 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="glass-card p-8 rounded-xl"
          >
            <motion.h2 variants={fadeUpItem} className="text-2xl font-semibold mb-6 text-gradient">
              The Solution – Bandera AI Automates Everything
            </motion.h2>
            
            <motion.p variants={fadeUpItem} className="mb-6 text-muted-foreground">
              Bandera AI eliminates the need for manual lead generation, data verification, and outreach management. Our AI-powered platform does everything—so you can focus on closing deals.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={fadeUpItem} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-bandera-magenta/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-bandera-magenta"></div>
                </div>
                <p className="text-sm"><span className="font-medium">AI-Powered Lead Discovery</span> – Automatically finds high-intent leads from LinkedIn, X (Twitter), Meta, and other sources.</p>
              </motion.div>
              
              <motion.div variants={fadeUpItem} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-bandera-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-bandera-purple"></div>
                </div>
                <p className="text-sm"><span className="font-medium">Auto-Enriched & Verified Data</span> – AI fills in missing emails, phone numbers, company details, and verifies accuracy.</p>
              </motion.div>
              
              <motion.div variants={fadeUpItem} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-bandera-blue/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-bandera-blue"></div>
                </div>
                <p className="text-sm"><span className="font-medium">Predictive AI Scoring</span> – Prioritizes leads based on likelihood to engage and convert.</p>
              </motion.div>
              
              <motion.div variants={fadeUpItem} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-bandera-magenta/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-bandera-magenta"></div>
                </div>
                <p className="text-sm"><span className="font-medium">AI-Generated Outreach</span> – Pre-written, high-converting emails, LinkedIn DMs, and follow-ups tailored to your prospects.</p>
              </motion.div>
              
              <motion.div variants={fadeUpItem} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-bandera-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-bandera-purple"></div>
                </div>
                <p className="text-sm"><span className="font-medium">Smart Multi-Channel Outreach</span> – AI sequences across email, LinkedIn, X (Twitter), and WhatsApp for a true omnichannel approach.</p>
              </motion.div>
              
              <motion.div variants={fadeUpItem} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-bandera-blue/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-bandera-blue"></div>
                </div>
                <p className="text-sm"><span className="font-medium">Automated Follow-Ups & Timing</span> – AI tracks prospect behavior and follows up at the right moment.</p>
              </motion.div>
              
              <motion.div variants={fadeUpItem} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-bandera-magenta/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-bandera-magenta"></div>
                </div>
                <p className="text-sm"><span className="font-medium">CRM Auto-Sync</span> – Seamlessly integrates with HubSpot, Salesforce, Pipedrive, and other CRMs.</p>
              </motion.div>
              
              <motion.div variants={fadeUpItem} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-bandera-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-bandera-purple"></div>
                </div>
                <p className="text-sm"><span className="font-medium">Data Ownership & Compliance</span> – Fully GDPR/CCPA compliant with encrypted storage for complete data security.</p>
              </motion.div>
            </motion.div>
          </motion.section>
          
          {/* Page 3: The Future */}
          <motion.section 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="glass-card p-8 rounded-xl"
          >
            <motion.h2 variants={fadeUpItem} className="text-2xl font-semibold mb-6 text-gradient">
              The Future of Sales – Try Bandera AI Now
            </motion.h2>
            
            <motion.p variants={fadeUpItem} className="mb-6 text-muted-foreground">
              Bandera AI is not just another lead gen tool—it's the future of sales automation.
            </motion.p>
            
            <motion.p variants={fadeUpItem} className="mb-6 text-muted-foreground">
              With our end-to-end AI-driven approach, you can:
            </motion.p>
            
            <motion.ul variants={staggerContainer} className="space-y-4 list-disc list-inside text-muted-foreground ml-4">
              <motion.li variants={fadeUpItem}>Eliminate manual prospecting and focus only on engaged, high-quality leads.</motion.li>
              <motion.li variants={fadeUpItem}>Ditch multiple tools and consolidate everything into one seamless platform.</motion.li>
              <motion.li variants={fadeUpItem}>Close more deals with AI-driven personalization and automated follow-ups.</motion.li>
            </motion.ul>
            
            <motion.p variants={fadeUpItem} className="mt-6 font-medium">
              No more spreadsheets. No more wasted time. Just a smarter, faster way to generate and convert leads.
            </motion.p>
            
            <motion.div variants={fadeUpItem} className="mt-8">
              <Button size="lg" className="bg-bandera-gradient hover:opacity-90 transition-opacity" asChild>
                <Link to="/view-demo">
                  <Play className="mr-2 h-4 w-4" />
                  Get Your Free Demo
                </Link>
              </Button>
            </motion.div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default Description;
