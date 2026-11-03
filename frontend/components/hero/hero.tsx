"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
const slides = [
 { label: "People + technology", title: "Your Vision. Human Expertise. AI Possibilities.", description: "Your ideas deserve the right technology. We bring people, software and AI together to help your business move forward.", button: "Explore Our Services", href: "/services" },
 { label: "Software services", title: "Software That Works the Way You Do.", description: "From customer portals to business dashboards, we build software around your team, your workflow and your goals.", button: "Explore Software Solutions", href: "/services/software-development" },
 { label: "AI automation", title: "Less Repetition. More Possibility.", description: "Automate routine enquiries, follow-ups and everyday tasks—so your team can focus on work that needs a human touch.", button: "Discover AI Automation", href: "/services/ai-automation" },
 { label: "Customer conversations", title: "Be There When Customers Reach Out.", description: "Help customers find answers and take the next step with AI chat assistants that hand over to your team when needed.", button: "Explore AI Assistants", href: "/services/ai-automation" },
 { label: "Working together", title: "AI Supports. People Lead. Businesses Grow.", description: "Combine human judgement with AI assistance to organise information, support decisions and build better customer experiences.", button: "Let’s Build Together", href: "/inquiry" },
];
export function Hero() {
 const [active,setActive]=useState(0);
 const [paused,setPaused]=useState(false);
 const [hovered,setHovered]=useState(false);
 const [focused,setFocused]=useState(false);
 const [reduced,setReduced]=useState(true);
 const [hidden,setHidden]=useState(false);
 const touch=useRef<{x:number;y:number}|null>(null);
 const slide=slides[active];
 const stopped=paused||hovered||focused||reduced||hidden;
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const update=()=>setReduced(media.matches);
  const visibility=()=>setHidden(document.hidden);
  update();visibility();media.addEventListener("change",update);document.addEventListener("visibilitychange",visibility);
  return ()=>{media.removeEventListener("change",update);document.removeEventListener("visibilitychange",visibility);};
 },[]);
 useEffect(()=>{if(stopped)return;const timer=window.setInterval(()=>setActive(i=>(i+1)%slides.length),7000);return ()=>window.clearInterval(timer);},[stopped,active]);
 function move(direction:number){setActive(i=>(i+direction+slides.length)%slides.length);}
 return <section aria-label="Human expertise and AI services" aria-roledescription="carousel" className="sunrise-ai-hero relative isolate overflow-hidden bg-[#eaf3ff]"
 onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
 onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}
 onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}}
 onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start)return;const dx=e.changedTouches[0].clientX-start.x;const dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);}}>
 <div className="absolute inset-0" aria-hidden="true">{slides.map((item,index)=><Image key={item.label} src={`/banners/ai-collaboration-${index+1}.webp`} alt="" fill preload={index===0} loading={index===0?undefined:"lazy"} sizes="100vw" className={`sunrise-ai-image object-cover transition-opacity duration-700 motion-reduce:transition-none ${index===active?"opacity-100":"opacity-0"}`} />)}</div>
 <div className="sunrise-ai-wash absolute inset-0" aria-hidden />
 <div className="container-page relative z-10">
 <div className="sunrise-ai-copy" role="group" aria-roledescription="slide" aria-label={`${active+1} of ${slides.length}: ${slide.label}`} aria-live={stopped?"polite":"off"} aria-atomic="true">
 <p className="preview-kicker">{slide.label}</p>
 <h1 className="sunrise-ai-title mt-5 font-semibold text-[#09244e]">{slide.title}</h1>
 <p className="mt-6 max-w-lg text-base leading-relaxed text-[#27496c] sm:text-lg">{slide.description}</p>
 <Link href={slide.href} className="sunrise-tech-hero-cta mt-8 inline-flex min-h-13 items-center gap-5 rounded-full px-6 py-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{slide.button}<ArrowRight className="size-5 shrink-0" aria-hidden /></Link>
 </div>
 <div className="sunrise-ai-controls flex flex-wrap items-center gap-3" aria-label="Hero slideshow controls">
 <button type="button" onClick={()=>move(-1)} aria-label="Previous hero slide" className="sunrise-ai-control"><ArrowLeft className="size-4" aria-hidden /></button>
 <div className="flex gap-1" role="group" aria-label="Choose a hero slide">{slides.map((item,index)=><button key={item.label} type="button" onClick={()=>setActive(index)} aria-label={`Show slide ${index+1}: ${item.label}`} aria-pressed={active===index} className="sunrise-ai-dot"><span className={active===index?"bg-[#1565f0] w-6":"bg-[#7996b8] w-2"} /></button>)}</div>
 <button type="button" onClick={()=>move(1)} aria-label="Next hero slide" className="sunrise-ai-control"><ArrowRight className="size-4" aria-hidden /></button>
 {!reduced&&<button type="button" onClick={()=>setPaused(!paused)} aria-label={paused?"Play hero slideshow":"Pause hero slideshow"} className="sunrise-ai-control">{paused?<Play className="size-4" aria-hidden />:<Pause className="size-4" aria-hidden />}</button>}
 <span className="ml-1 text-xs font-medium text-[#34587e]" aria-hidden>{String(active+1).padStart(2,"0")} / 05</span>
 </div></div></section>;
}
