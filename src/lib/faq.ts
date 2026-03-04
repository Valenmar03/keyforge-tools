import { Shield, Lock, Zap, Wifi, HelpCircle } from "lucide-react";

export type FaqItem = {
    question: string;
    answer: string;
    icon: React.ElementType;
  };
  
export const faqs: FaqItem[] = [
    {
      question: "Is my data safe using these tools?",
      answer:
        "Yes. All tools run 100% client-side in your browser. No data is transmitted to any server. Your passwords, tokens, and sensitive information never leave your device. You can verify this by checking your browser’s Network tab—there should be no requests triggered by using a tool.",
      icon: Shield,
    },
    {
      question: "How does client-side execution work?",
      answer:
        "When you load a page, the JavaScript for that tool is downloaded to your browser. After that, all processing happens locally on your computer. For example, password generation uses crypto.getRandomValues(), a cryptographically secure random API built into modern browsers. No server is involved.",
      icon: Lock,
    },
    {
      question: "Are the random numbers truly random?",
      answer:
        "We use crypto.getRandomValues(), a cryptographically secure pseudo-random number generator (CSPRNG). It sources entropy from your operating system’s randomness pool. This is the same class of API used for generating cryptographic keys in many real-world applications.",
      icon: Zap,
    },
    {
      question: "Can I use these tools offline?",
      answer:
        "Yes. Once a page is loaded, you can disconnect and keep using the tool because the logic runs in your browser. The only limitation is navigation to pages you haven’t loaded yet (unless you cache them).",
      icon: Wifi,
    },
    {
      question: "Do you use any analytics or tracking?",
      answer:
        "No. We don’t include analytics scripts or tracking pixels. We also avoid collecting IP addresses or usage data. Privacy tools should practice what they preach.",
      icon: Lock,
    },
    {
      question: "Why should I trust these tools?",
      answer:
        "Three reasons: (1) Everything runs locally—verify via Network tab. (2) We rely on well-established, browser-native APIs like crypto.getRandomValues(). (3) The security approach is transparent and follows common best practices (e.g., avoiding modulo bias in random generation).",
      icon: Shield,
    },
    {
      question: "Are these tools suitable for production use?",
      answer:
        "For many use cases, yes—passwords/tokens/UUIDs are suitable. For operations like bcrypt hashing, we recommend doing it server-side in production. The bcrypt tool is best treated as educational/demo unless you use a real bcrypt library and understand the constraints.",
      icon: Zap,
    },
    {
      question: "What browsers are supported?",
      answer:
        "All modern browsers: Chrome, Firefox, Safari, Edge (latest versions). The tools require JavaScript and crypto.getRandomValues(). Internet Explorer is not supported.",
      icon: HelpCircle,
    },
    {
      question: "Can I contribute or report bugs?",
      answer:
        "Yes—feedback is welcome. If you find a bug or have a feature request, share it with us. Security-related issues are especially appreciated.",
      icon: HelpCircle,
    },
    {
      question: "Why create yet another developer tools site?",
      answer:
        "Many online tools process data on servers (and often include analytics). We wanted a truly private, fast, client-side toolbox where developers can work with sensitive data without transmission concerns.",
      icon: HelpCircle,
    },
  ];