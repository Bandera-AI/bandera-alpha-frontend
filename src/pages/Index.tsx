
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SystemizedPoints from "@/components/SystemizedPoints";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();
  
  useEffect(() => {
    // Show welcome toast with feature highlight
    const timer = setTimeout(() => {
      if (isHomePage) {
        toast({
          title: "Welcome to Bandera AI",
          description: "The most advanced AI-powered lead generation platform.",
        });
      }
    }, 2000);
    
    // Simulate loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(loadingTimer);
    };
  }, [toast, isHomePage]);
  
  return (
    <ThemeProvider>
      <motion.div
        className="min-h-screen bg-gradient-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading Bandera AI...</p>
            </div>
          </div>
        ) : (
          <>
            {isHomePage ? (
              <>
                <Hero />
                
                {/* New "No More Manual Work" Section */}
                <section className="section-padding relative overflow-hidden">
                  {/* Background elements */}
                  <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-bandera-purple/5 blur-3xl -z-10" />
                  <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-bandera-magenta/5 blur-3xl -z-10" />
                  
                  <div className="container-custom">
                    <motion.div
                      className="text-center max-w-3xl mx-auto mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.h2 
                        className="text-3xl md:text-4xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      >
                        <span className="inline-flex items-center">
                          <Zap className="h-8 w-8 mr-2 text-yellow-400" />
                          <span>No More Manual Work.</span>
                        </span>
                        <span className="text-gradient block mt-2">Just Sales.</span>
                      </motion.h2>
                      
                      <motion.p 
                        className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                      >
                        Bandera AI transforms lead generation by automating the entire process from discovery to outreach. 
                        Eliminate manual prospecting and focus only on what matters — closing deals.
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <Button size="lg" className="bg-bandera-gradient hover:opacity-90 transition-opacity text-white" onClick={() => navigate('/description')}>
                          {/* <Link to="/description"> */}
                            Learn How It Works
                            <ArrowRight className="ml-2 h-4 w-4" />
                          {/* </Link> */}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </section>
                
                <section className="section-padding">
                  <div className="container-custom">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        The <span className="text-gradient">Future</span> of Sales Automation
                      </h2>
                      <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        Bandera AI eliminates manual work completely, allowing your sales team to focus on what matters most - building relationships and closing deals.
                      </p>
                    </div>
                    
                    <SystemizedPoints />
                  </div>
                </section>
                
                <Team />
                <Contact />
                <Footer />
              </>
            ) : (
              <Outlet />
            )}
          </>
        )}
      </motion.div>
    </ThemeProvider>
  );
};

export default Index;
