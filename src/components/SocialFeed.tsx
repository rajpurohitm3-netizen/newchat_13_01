"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Youtube, 
  Instagram, 
  ChevronLeft, 
  Search,
  LogIn,
  RefreshCw,
  Lock,
  Zap,
  ExternalLink,
  Plus,
  Trash2,
  Globe,
  Activity,
  User,
  Layout,
  Link as LinkIcon,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function SocialFeed({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"youtube" | "instagram">("youtube");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [inputLink, setInputLink] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        const yt = localStorage.getItem(`social_yt_${session.user.id}`);
        const ig = localStorage.getItem(`social_ig_${session.user.id}`);
        if (yt) setYoutubeLink(yt);
        if (ig) setInstagramLink(ig);
      }
    };
    fetchUser();
  }, []);

  const handleConnect = () => {
    if (!inputLink) {
      toast.error("Please enter a valid profile link");
      return;
    }
    
    try {
        new URL(inputLink);
    } catch (_) {
        toast.error("Invalid URL format");
        return;
    }

    setIsConnecting(true);
    setTimeout(() => {
      if (activeTab === "youtube") {
        setYoutubeLink(inputLink);
        localStorage.setItem(`social_yt_${userId}`, inputLink);
      } else {
        setInstagramLink(inputLink);
        localStorage.setItem(`social_ig_${userId}`, inputLink);
      }
      setInputLink("");
      setIsConnecting(false);
      toast.success(`${activeTab === 'youtube' ? 'YouTube' : 'Instagram'} connected successfully!`);
    }, 1500);
  };

  const handleDisconnect = () => {
    if (activeTab === "youtube") {
      setYoutubeLink("");
      localStorage.removeItem(`social_yt_${userId}`);
    } else {
      setInstagramLink("");
      localStorage.removeItem(`social_ig_${userId}`);
    }
    toast.success("Account disconnected");
  };

  const currentLink = activeTab === "youtube" ? youtubeLink : instagramLink;

  return (
    <div className="h-full flex flex-col bg-[#010101] text-white overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${activeTab === "youtube" ? "from-red-900/10 via-transparent to-transparent" : "from-purple-900/10 via-transparent to-pink-900/5"}`} />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 p-4 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl bg-black/40">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/5 text-white/40 hover:text-white rounded-xl h-10 w-10 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-black italic tracking-tighter uppercase flex items-center gap-2">
                Social <span className={activeTab === "youtube" ? "text-red-500" : "text-pink-500"}>Nexus</span>
            </h2>
          </div>
        </div>

        <div className="flex bg-zinc-900/50 border border-white/10 p-1.5 rounded-2xl w-full sm:w-auto shadow-2xl">
          <button 
            onClick={() => { setActiveTab("youtube"); setInputLink(""); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "youtube" ? "bg-red-600 text-white shadow-lg shadow-red-900/40" : "text-white/30 hover:text-white hover:bg-white/5"}`}
          >
            <Youtube className="w-4 h-4" /> YouTube
          </button>
          <button 
            onClick={() => { setActiveTab("instagram"); setInputLink(""); }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "instagram" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-900/40" : "text-white/30 hover:text-white hover:bg-white/5"}`}
          >
            <Instagram className="w-4 h-4" /> Instagram
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto p-6 sm:p-12 custom-scrollbar z-10">
        <AnimatePresence mode="wait">
          {!currentLink ? (
            <motion.div 
              key="connect-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto mt-8 sm:mt-16 space-y-10"
            >
              <div className="text-center space-y-6">
                <motion.div 
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-28 h-28 mx-auto rounded-[2.5rem] flex items-center justify-center ${activeTab === 'youtube' ? 'bg-red-600' : 'bg-gradient-to-tr from-purple-600 to-pink-600'} shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/5`}
                >
                  {activeTab === 'youtube' ? <Youtube className="w-14 h-14" /> : <Instagram className="w-14 h-14" />}
                </motion.div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">Direct <span className={activeTab === 'youtube' ? 'text-red-500' : 'text-pink-500'}>Connect</span></h3>
                    <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
                      Initialize secure uplink to your {activeTab} profile matrix.
                    </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Profile Matrix Link</label>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                        <div className="relative bg-zinc-900/80 border border-white/10 rounded-2xl flex items-center px-5 focus-within:border-indigo-500/50 transition-all">
                            <LinkIcon className="w-4 h-4 text-white/20 mr-4" />
                            <input 
                                type="text"
                                placeholder={`Paste ${activeTab} profile link...`}
                                value={inputLink}
                                onChange={(e) => setInputLink(e.target.value)}
                                className="w-full bg-transparent py-5 text-sm outline-none placeholder:text-white/10"
                            />
                        </div>
                    </div>
                </div>
                
                <Button 
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className={`w-full py-8 rounded-[1.8rem] font-black uppercase tracking-[0.3em] text-[11px] ${activeTab === 'youtube' ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90'} transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 overflow-hidden group`}
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Authorize Uplink
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg"><Lock className="w-3 h-3 text-emerald-500" /></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Secured</span>
                </div>
                <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-indigo-500/10 rounded-lg"><Zap className="w-3 h-3 text-indigo-500" /></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Instant</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-6xl mx-auto space-y-10"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-10 bg-zinc-900/40 border border-white/10 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-64 h-64 ${activeTab === 'youtube' ? 'bg-red-600/5' : 'bg-pink-600/5'} blur-[100px] rounded-full`} />
                
                <div className="flex items-center gap-6 relative z-10">
                  <motion.div 
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    className={`p-6 rounded-[2.2rem] ${activeTab === 'youtube' ? 'bg-red-600 shadow-red-900/30' : 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-pink-900/30'} shadow-2xl`}
                  >
                    {activeTab === 'youtube' ? <Youtube className="w-10 h-10" /> : <Instagram className="w-10 h-10" />}
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">{activeTab === 'youtube' ? 'YouTube' : 'Instagram'}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] truncate max-w-[240px] lg:max-w-md">{currentLink}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto relative z-10">
                  <Button 
                    onClick={() => window.open(currentLink, "_blank")}
                    className="flex-1 lg:flex-none bg-white text-black hover:bg-zinc-200 rounded-2xl h-16 px-10 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Matrix
                  </Button>
                  <Button 
                    onClick={handleDisconnect}
                    variant="ghost"
                    className="flex-1 lg:flex-none text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl h-16 px-6 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-zinc-900/40 border border-white/10 rounded-[3rem] p-10 space-y-10">
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Uplink Status</h4>
                            <div className="flex items-center justify-between">
                            <p className="text-4xl font-black italic text-emerald-500 uppercase">Active</p>
                            <Activity className="w-8 h-8 text-emerald-500/50" />
                            </div>
                        </div>
                        
                        <div className="h-px bg-white/5" />
                        
                        <div className="space-y-6">
                            {[
                                { label: "Signal Latency", value: "0.8ms", color: "text-white" },
                                { label: "Data Pipeline", value: "Optimal", color: "text-indigo-400" },
                                { label: "Neural Load", value: "4%", color: "text-purple-400" }
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{stat.label}</span>
                                    <span className={`text-xs font-black ${stat.color}`}>{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest h-14 rounded-2xl">
                                Run Diagnostics
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-2 bg-zinc-900/40 border border-white/10 rounded-[3rem] p-10 flex flex-col relative overflow-hidden group">
                  <div className={`absolute -top-40 -right-40 w-96 h-96 ${activeTab === 'youtube' ? 'bg-red-600/5' : 'bg-pink-600/5'} blur-[100px] rounded-full pointer-events-none`} />
                  
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Visual Interface</h4>
                    <Globe className="w-5 h-5 text-white/10" />
                  </div>
                  
                  <div className="flex-1 min-h-[400px] bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-8 relative group/view">
                    <div className="relative">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-20px] border-2 border-dashed border-indigo-500/20 rounded-full" 
                        />
                        <div className="p-8 bg-white/5 rounded-full relative z-10 shadow-2xl">
                            <Layout className="w-16 h-16 text-indigo-400" />
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                      <p className="text-2xl font-black uppercase italic tracking-tighter">Matrix Ready</p>
                      <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                        The {activeTab} matrix has been synchronized. Initialize the secure portal to interact with your content signals.
                      </p>
                    </div>

                    <Button 
                      onClick={() => window.open(currentLink, "_blank")}
                      className={`h-16 px-12 rounded-2xl ${activeTab === 'youtube' ? 'bg-red-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'} text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10`}
                    >
                      Initialize Portal
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Profile", icon: User, color: "text-blue-400" },
                  { label: "Matrix", icon: Layout, color: "text-purple-400" },
                  { label: "Search", icon: Search, color: "text-indigo-400" },
                  { label: "Connect", icon: Plus, color: "text-orange-400" }
                ].map((item, i) => (
                  <button key={i} className="p-8 bg-zinc-900/40 border border-white/10 rounded-[2.5rem] hover:bg-white/5 transition-all flex flex-col items-center gap-4 group">
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 group-hover:bg-white/10 transition-all">
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
