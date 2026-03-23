/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Music2, 
  Home, 
  Search, 
  Plus, 
  MessageSquare, 
  User,
  Menu,
  Lock
} from 'lucide-react';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Show popup after 2 seconds or interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowPopup(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const triggerBlock = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    if (showPopup) {
      setShowPopup(false);
      setHasInteracted(true);
      return;
    }
    setCurrentIndex(1);
    setIsBlocked(true);
    setShowPopup(false);
    setHasInteracted(true);
  };

  const handleInteraction = () => {
    if (showPopup) {
      setShowPopup(false);
      setHasInteracted(true);
    } else if (!hasInteracted) {
      setHasInteracted(true);
      setShowPopup(true);
    }
  };

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex === 0) {
      setCurrentIndex(1);
      setIsBlocked(true);
      setShowPopup(false);
      setHasInteracted(true);
    }
    // Backward scrolling (down) is disabled
  };

  // Mouse wheel handling for desktop
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 30) {
      handleSwipe(e.deltaY > 0 ? 'up' : 'down');
      handleInteraction();
    }
  };

  // Touch handling for mobile swipe
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;
    if (Math.abs(diff) > 50) {
      handleSwipe(diff > 0 ? 'up' : 'down');
    }
    touchStart.current = null;
    handleInteraction();
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-screen w-full bg-black overflow-hidden font-sans text-white select-none touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onClick={handleInteraction}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/50 to-transparent">
        <Menu className="w-6 h-6 cursor-pointer" onClick={triggerBlock} />
        <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1 backdrop-blur-md cursor-pointer" onClick={triggerBlock}>
          <div className="w-4 h-4 bg-[#ff0050] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="text-xs font-semibold">Abrir aplicativo</span>
        </div>
        <Search className="w-6 h-6 cursor-pointer" onClick={triggerBlock} />
      </div>

      {/* Video Feed */}
      <div className="h-full w-full relative">
        <AnimatePresence mode="wait">
          {currentIndex === 0 ? (
            <motion.div
              key="video-1"
              initial={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 h-full w-full"
            >
              <video
                src="https://tudoprahoje.site/tikhot/images/qid5070v1_h264_450_640.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />
              <VideoOverlay 
                username="victória" 
                description="ELA NÃO FOI MAL TRATADA NEM JUDIADA NESSE VIDEO TA GENTE!!EL" 
                likes="10.5M"
                comments="54.6K"
                shares="3.6M"
                onAction={triggerBlock}
              />
            </motion.div>
          ) : (
            <motion.div
              key="video-2"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 h-full w-full bg-[#121212] flex items-center justify-center"
            >
              {/* Blocked Content Simulation */}
              <div className="absolute inset-0 opacity-20 grayscale blur-sm">
                 <video
                  src="https://tudoprahoje.site/tikhot/images/qid5070v1_h264_450_640.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center px-8">
                <div className="w-20 h-20 bg-[#ff0050] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,0,80,0.4)]">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">Acesso Bloqueado</h2>
                <p className="text-gray-300 mb-8 text-sm">Faça a verificação para liberar o APP e continuar assistindo.</p>
                <a 
                  href="https://tudoprahoje.site/tikhot/"
                  className="bg-[#ff0050] text-white font-bold py-4 px-12 rounded-full text-lg hover:scale-105 transition-transform active:scale-95 shadow-lg"
                >
                  VERIFICAR AGORA
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interaction Popup */}
      <AnimatePresence>
        {showPopup && !isBlocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-6"
          >
            <div className="flex flex-col items-center text-center max-w-xs">
              <motion.div
                animate={{ y: [0, -40, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="mb-8"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-white rounded-2xl flex items-center justify-center">
                    <div className="w-1 h-4 bg-white rounded-full opacity-50" />
                  </div>
                  <div className="absolute -right-4 -bottom-4">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 10V30M10 20H30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </motion.div>
              <p className="text-lg font-medium leading-tight mb-8">
                Role a tela, use as teclas ↑ ↓ ou clique nas setas à direita para navegar no seu feed.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 bg-black border-t border-white/10">
        <NavItem icon={<Home className="w-6 h-6" />} label="Início" active />
        <NavItem icon={<Search className="w-6 h-6" />} label="Descobrir" onClick={triggerBlock} />
        <div className="relative flex items-center justify-center w-12 h-8 cursor-pointer" onClick={triggerBlock}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#00f2ea] to-[#ff0050] rounded-lg" />
          <div className="absolute inset-[2px] bg-white rounded-md flex items-center justify-center">
            <Plus className="w-5 h-5 text-black" />
          </div>
        </div>
        <NavItem icon={<MessageSquare className="w-6 h-6" />} label="Caixa de" onClick={triggerBlock} />
        <NavItem icon={<User className="w-6 h-6" />} label="Perfil" onClick={triggerBlock} />
      </div>
    </div>
  );
}

function VideoOverlay({ username, description, likes, comments, shares, onAction }: { 
  username: string; 
  description: string;
  likes: string;
  comments: string;
  shares: string;
  onAction: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end p-4 pb-24 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
      <div className="flex justify-between items-end">
        <div className="flex-1 pr-12">
          <h3 className="font-bold text-base mb-2 flex items-center">
            {username} <span className="ml-2 text-xs opacity-70">🪗</span>
          </h3>
          <p className="text-sm line-clamp-2 mb-3 leading-snug">
            {description} <span className="font-bold">mais</span>
          </p>
          <div className="flex items-center space-x-2">
            <Music2 className="w-4 h-4 animate-spin-slow" />
            <span className="text-xs truncate">n original- {username} som</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-5 pointer-events-auto">
          <div className="relative mb-2 cursor-pointer" onClick={onAction}>
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
              <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#ff0050] rounded-full p-0.5">
              <Plus className="w-3 h-3" />
            </div>
          </div>
          
          <SidebarIcon icon={<Heart className="w-8 h-8 fill-white" />} label={likes} onClick={onAction} />
          <SidebarIcon icon={<MessageCircle className="w-8 h-8 fill-white" />} label={comments} onClick={onAction} />
          <SidebarIcon icon={<Share2 className="w-8 h-8 fill-white" />} label={shares} onClick={onAction} />
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 border-4 border-gray-900 animate-spin-slow overflow-hidden cursor-pointer" onClick={onAction}>
             <img src="https://picsum.photos/seed/disc/100/100" alt="Disc" referrerPolicy="no-referrer" className="opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarIcon({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      {icon}
      <span className="text-[11px] font-bold mt-1">{label}</span>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div className={`flex flex-col items-center cursor-pointer ${active ? 'opacity-100' : 'opacity-50'}`} onClick={onClick}>
      {icon}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </div>
  );
}
