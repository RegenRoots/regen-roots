
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Users,
  BarChart3,
  ShieldCheck,
  Globe,
  Zap,
  X,
  Menu,
  Award,

} from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence, useScroll } from "framer-motion";
// const inter = Inter({ subsets: ['latin'] })

export default function RegenRootsLanding() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  // const [progress, setProgress] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()


  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   try {
  //     console.log('Submitted form data:', { name, email, phone })
  //     setName('')
  //     setEmail('')
  //     setPhone('')
  //     alert('Thank you for joining our waitlist! We\'ll keep you updated on our launch.')
  //   } catch (error) {
  //     console.error('Error submitting form:', error)
  //     alert('An error occurred while submitting the form. Please try again.')
  //   }
  // }

  // useEffect(() => {
  //   const timer = setTimeout(() => setProgress(66), 500);
  //   return () => clearTimeout(timer);
  // }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleOnHoverVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50" >
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-green-500 z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm z-40">
        <div className="flex items-center" style={{ gap: "6px" }}>
          <Image
            src="/images/rootsregen.svg"
            alt="Regen Roots Logo"
            width={120}
            height={120}
            className="h-40 w-40"
          />
          <span className="text-2xl font-bold text-green-800">Regen Roots</span>
        </div>
        <nav className="hidden md:flex ml-auto gap-4 sm:gap-6">
          {["Features", "Our Vision", "Technology", "Join Waitlist"].map(
            (item) => (
              <a
                key={item}
                className="text-sm font-medium hover:text-green-600 transition-colors"
                href={`#${item.toLowerCase().replace(" ", "-")}`}
              >
                {item}
              </a>
            )
          )}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-b"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center py-4">
              {["Features", "Our Vision", "Technology", "Join Waitlist"].map(
                (item) => (
                  <a
                    key={item}
                    className="w-full text-center py-2 hover:bg-green-50 transition-colors"
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    onClick={closeMenu}
                  >
                    {item}
                  </a>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-green-100 to-green-50">
          {/* Hero Content */}
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="flex flex-col items-center space-y-4 text-center"
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-green-800 to-green-600">
                Cultivating a Sustainable Future
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl lg:text-2xl">
                Regen Roots is an upcoming decentralized platform connecting
                regenerative farmers with investors and conscious consumers.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Learn More
                </Button>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() =>
                    document
                      .getElementById("signup")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Join Waitlist
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-green-800"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              Empowering Regenerative Agriculture
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {[
                {
                  icon: Users,
                  title: "Decentralized Marketplace",
                  description:
                    "Connect regenerative farmers directly with investors and conscious consumers, fostering a sustainable agricultural ecosystem.",
                },
                {
                  icon: ShieldCheck,
                  title: "Smart Contracts",
                  description:
                    "Ensure transparent funding mechanisms and profit-sharing through blockchain-based smart contracts.",
                },
                {
                  icon: BarChart3,
                  title: "Impact Tracking",
                  description:
                    "Monitor and showcase improvements in biodiversity and carbon sequestration with real-time data and analytics.",
                },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUpVariants}
                  whileHover="hover"
                >
                  <motion.div
                    className="h-full bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                    variants={scaleOnHoverVariants}
                  >
                    <feature.icon className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Vision Section */}
        <section
          id="vision"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-100 to-white"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-green-800"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              Our Vision for the Future
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {[
                {
                  icon: Globe,
                  title: "Global Network",
                  description:
                    "Build a worldwide network of regenerative farms, promoting sustainable practices across diverse ecosystems.",
                },
                {
                  icon: Leaf,
                  title: "Sustainable Supply Chains",
                  description:
                    "Integrate with eco-friendly supply chains to create a holistic approach to sustainable food production and distribution.",
                },
                {
                  icon: Award,
                  title: "Policy Influence",
                  description:
                    "Shape agricultural policies and practices through data-driven insights and successful case studies.",
                },
              ].map((vision) => (
                <motion.div
                  key={vision.title}
                  variants={fadeInUpVariants}
                  whileHover="hover"
                >
                  <motion.div
                    className="h-full bg-white bg-opacity-50 backdrop-blur-sm rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                    variants={scaleOnHoverVariants}
                  >
                    <vision.icon className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {vision.title}
                    </h3>
                    <p className="text-gray-600">{vision.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="technology" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-green-800"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              Cutting-Edge Technology Stack
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {[
                {
                  icon: ShieldCheck,
                  title: "Blockchain",
                  description:
                    "Utilize blockchain technology for unparalleled transparency in transactions and smart contract execution.",
                },
                {
                  icon: Zap,
                  title: "IoT Devices",
                  description:
                    "Implement Internet of Things devices for real-time monitoring of farm conditions and environmental impact.",
                },
                {
                  icon: BarChart3,
                  title: "AI/ML Analytics",
                  description:
                    "Leverage artificial intelligence and machine learning for predictive analytics on crop yields and environmental outcomes.",
                },
              ].map((tech) => (
                <motion.div
                  key={tech.title}
                  variants={fadeInUpVariants}
                  whileHover="hover"
                >
                  <motion.div
                    className="h-full bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                    variants={scaleOnHoverVariants}
                  >
                    <tech.icon className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                    <p className="text-gray-600">{tech.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 to-white"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-green-800"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              How Regen Roots Works
            </motion.h2>
            <Tabs defaultValue="farmers" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="farmers" className="text-lg font-semibold">
                  For Farmers
                </TabsTrigger>
                <TabsTrigger
                  value="investors"
                  className="text-lg font-semibold"
                >
                  For Investors
                </TabsTrigger>
              </TabsList>
              <TabsContent value="farmers">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                >
                  <Card className="bg-white shadow-xl rounded-xl overflow-hidden">
                    <CardHeader className="bg-green-600 text-white">
                      <CardTitle className="text-2xl">
                        Empowering Regenerative Farmers
                      </CardTitle>
                      <CardDescription className="text-green-100">
                        Join Regen Roots to grow your sustainable farming
                        practice
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          Create a profile showcasing your regenerative farming
                          practices
                        </li>
                        <li>
                          Connect with investors interested in supporting
                          sustainable agriculture
                        </li>
                        <li>
                          Receive funding through transparent smart contracts
                        </li>
                        <li>
                          Track and share your impact on biodiversity and carbon
                          sequestration
                        </li>
                        <li>
                          Engage with a community of like-minded farmers and
                          experts
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              <TabsContent value="investors">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                >
                  <Card className="bg-white shadow-xl rounded-xl overflow-hidden">
                    <CardHeader className="bg-green-600 text-white">
                      <CardTitle className="text-2xl">
                        Investing in a Sustainable Future
                      </CardTitle>
                      <CardDescription className="text-green-100">
                        Support regenerative agriculture and track your impact
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          Browse profiles of verified regenerative farmers
                        </li>
                        <li>
                          Choose projects that align with your investment goals
                        </li>
                        <li>
                          Invest securely using blockchain-based smart contracts
                        </li>
                        <li>
                          Monitor the environmental impact of your investments
                          in real-time
                        </li>
                        <li>
                          Connect with farmers and other investors in the Regen
                          Roots community
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Progress Section
        <section id="roadmap" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-green-800"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              Roadmap to Launch
            </motion.h2>
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
              >
                <Card className="bg-white shadow-xl rounded-xl overflow-hidden mb-8">
                  <CardHeader className="bg-green-600 text-white">
                    <CardTitle className="text-2xl">Our Progress</CardTitle>
                    <CardDescription className="text-green-100">
                      We&lsquo;re 20% of the way to launch!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "66%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      viewport={{ once: true }}
                    >
                      <Progress
                        value={progress}
                        className="w-full h-4 rounded-full"
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    phase: "Phase 1: Foundation Building",
                    items: [
                      "Finalize blockchain infrastructure",
                      "Develop smart contract templates",
                      "Create user interface prototypes",
                      "Establish partnerships with initial farmers and investors",
                    ],
                  },
                  {
                    phase: "Phase 2: Platform Development",
                    items: [
                      "Implement core marketplace functionality",
                      "Integrate IoT devices for farm monitoring",
                      "Develop impact tracking dashboard",
                      "Begin beta testing with select users",
                    ],
                  },
                  {
                    phase: "Phase 3: Launch and Expansion",
                    items: [
                      "Official platform launch",
                      "Onboard first wave of farmers and investors",
                      "Implement AI/ML analytics for predictive insights",
                      "Expand educational resources and certification system",
                    ],
                  },
                ].map((phase, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariants}
                  >
                    <AccordionItem
                      value={`phase${index + 1}`}
                      className="border-b border-green-200"
                    >
                      <AccordionTrigger className="text-lg font-semibold text-green-800 hover:text-green-600 transition-colors duration-200">
                        {phase.phase}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          {phase.items.map((item, itemIndex) => (
                            <motion.li
                              key={itemIndex}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: itemIndex * 0.1,
                              }}
                              viewport={{ once: true }}
                            >
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section> */}

        {/* Signup Section */}

        <section id="signup" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                className="space-y-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-green-800">
                  Be Part of the Regenerative Revolution
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl">
                  Join our waiting list to be among the first to access Regen Roots and help shape the future of agriculture.
                </p>
              </motion.div>
              <motion.div
                className="w-full max-w-md space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
              >
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfC35-KYJtzW5I_1mmFbtQZZQUgHNV0tRfqMbRc9mr2j4Hfeg/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform text-center block"
                >
                  Join Waitlist
                </a>
                <p className="text-xs text-gray-600">
                  By clicking "Join Waitlist," you agree to our Terms of Service and Privacy Policy.
                </p>
              </motion.div>
            </div>
          </div>
        </section>



        {/* FAQ Section */}
        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 to-white"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-green-800"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "When will Regen Roots launch?",
                    answer:
                      "We're currently in the development phase and working hard to bring Regen Roots to life. While we don't have a specific launch date yet, joining our waitlist ensures you'll be among the first to know when we're ready to go live.",
                  },
                  {
                    question: "How can I get involved before the launch?",
                    answer:
                      "The best way to get involved is to join our waitlist. We'll be sharing updates, seeking feedback, and potentially offering early access to select members of our community as we approach launch.",
                  },
                  {
                    question:
                      "What makes Regen Roots different from other agricultural platforms?",
                    answer:
                      "Regen Roots stands out with its focus on regenerative agriculture, use of blockchain for transparency, and comprehensive impact tracking. We're building a holistic ecosystem that connects all stakeholders in the sustainable agriculture value chain.",
                  },
                  {
                    question:
                      "How will you ensure the reliability of impact data?",
                    answer:
                      "We're implementing a multi-faceted approach including IoT devices for real-time monitoring, third-party verifications, and blockchain technology to ensure data integrity. We're also partnering with environmental NGOs and agricultural universities to validate our methodologies.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUpVariants}
                  >
                    <AccordionItem
                      value={`item-${index + 1}`}
                      className="border-b border-green-200"
                    >
                      <AccordionTrigger className="text-lg font-semibold text-green-800 hover:text-green-600 transition-colors duration-200">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-green-800 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm text-green-200">
                Regen Roots is dedicated to revolutionizing agriculture through
                sustainable practices and innovative technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-sm hover:text-green-300 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#vision"
                    className="text-sm hover:text-green-300 transition-colors"
                  >
                    Our Vision
                  </a>
                </li>
                <li>
                  <a
                    href="#technology"
                    className="text-sm hover:text-green-300 transition-colors"
                  >
                    Technology
                  </a>
                </li>
                <li>
                  <a
                    href="#signup"
                    className="text-sm hover:text-green-300 transition-colors"
                  >
                    Join Waitlist
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-sm text-green-200">
                Email: rootsregen4@gmail.com
              </p>
              <p className="text-sm text-green-200">Phone: +254718677978</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-white hover:text-green-300 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-green-300 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-green-300 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-green-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-green-200">
              © 2024 Regen Roots. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
              <a
                className="text-sm hover:text-green-300 transition-colors"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="text-sm hover:text-green-300 transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-sm hover:text-green-300 transition-colors"
                href="#"
              >
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
