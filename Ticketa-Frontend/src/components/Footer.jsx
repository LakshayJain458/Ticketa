import { toast } from "sonner";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Globe } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("🎉 Thanks for subscribing! Stay tuned for updates.");
    setEmail("");
  };

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-gradient-to-b from-black via-gray-950 to-black text-gray-400">
      {/* Glow background effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-20 w-72 h-72 bg-cyan-600/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-violet-600/20 blur-3xl rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand section */}
        <div>
          <h2 className="text-2xl font-bold text-white">Ticketa</h2>
          <p className="mt-3 text-sm text-gray-400 max-w-xs">
            Discover, book & manage events effortlessly. Your gateway to live
            experiences.
          </p>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Stay Updated
          </h3>
          <p className="mt-3 text-sm">
            Subscribe to our newsletter for the latest events & offers.
          </p>
          <form onSubmit={handleSubscribe} className="mt-4 flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-lg bg-gray-900 border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-r-lg text-white text-sm transition"
            >
              Join
            </button>
          </form>
        </div>

        {/* Socials */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Made by Lakshay Jain
          </h3>
          <div className="flex gap-5">
            <a
              href="https://github.com/LakshayJain458"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/lakshay-jain001/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="https://lakshayjain-dev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Globe className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 mt-10 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-white">Ticketa</span> — Built with ❤️ by Lakshay Jain.
      </div>
    </footer>
  );
};

export default Footer;
