"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Volume2 } from "lucide-react";

type Recognition = {
 lang:string; continuous:boolean; interimResults:boolean;
 onresult:((event:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;
 onerror:((event:{error:string})=>void)|null; onend:(()=>void)|null;
 start:()=>void; abort:()=>void;
};
type VoiceWindow = Window & {SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};

export function VoiceControls({open,busy,reply,onTranscript}:{open:boolean;busy:boolean;reply:string;onTranscript:(text:string)=>void}) {
 const [supported,setSupported]=useState(false);
 const [canSpeak,setCanSpeak]=useState(false);
 const [listening,setListening]=useState(false);
 const [speaking,setSpeaking]=useState(false);
 const [language,setLanguage]=useState("en-IN");
 const [notice,setNotice]=useState("");
 const recognition=useRef<Recognition|null>(null);
 useEffect(()=>{const w=window as VoiceWindow;setSupported(Boolean(w.SpeechRecognition||w.webkitSpeechRecognition));setCanSpeak("speechSynthesis" in window);return()=>{recognition.current?.abort();window.speechSynthesis?.cancel();};},[]);
 useEffect(()=>{if(!open||busy){recognition.current?.abort();window.speechSynthesis?.cancel();setListening(false);setSpeaking(false);}},[open,busy]);
 function listen(){
  if(listening){recognition.current?.abort();return;}
  window.speechSynthesis?.cancel();setSpeaking(false);setNotice("");
  const w=window as VoiceWindow;const Constructor=w.SpeechRecognition||w.webkitSpeechRecognition;if(!Constructor)return;
  const instance=new Constructor();recognition.current=instance;instance.lang=language;instance.continuous=false;instance.interimResults=false;
  instance.onresult=e=>{onTranscript(Array.from(e.results).map(result=>result[0].transcript).join(" "));setNotice("Review your question, then press Send.");};
  instance.onerror=e=>{setNotice(e.error==="not-allowed"?"Microphone access was blocked. Allow it in your browser, or type your question.":e.error==="no-speech"?"No speech detected. Try again or type your question.":"Voice input is unavailable right now. Please type your question.");setListening(false);};
  instance.onend=()=>{setListening(false);recognition.current=null;};
  try{instance.start();setListening(true);setNotice("Listening… tap Stop when finished.");}catch{setNotice("Could not start the microphone. Please type your question.");}
 }
 function read(){
  window.speechSynthesis.cancel();
  if(speaking){setSpeaking(false);return;}
  const utterance=new SpeechSynthesisUtterance(reply.replace(/\*\*/g,"").slice(0,6000));utterance.lang=language;
  const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(language.slice(0,2)));if(voice)utterance.voice=voice;
  utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>{setSpeaking(false);setNotice("Spoken audio is unavailable. You can read the reply above.");};
  setSpeaking(true);window.speechSynthesis.speak(utterance);
 }
 return <div className="mb-3 space-y-2">
  <div className="flex flex-wrap items-center gap-2">
   <label className="sr-only" htmlFor="assistant-language">Voice language</label>
   <select id="assistant-language" value={language} disabled={listening||speaking} onChange={e=>setLanguage(e.target.value)} className="min-h-10 rounded-lg border border-line bg-white px-2 text-xs"><option value="en-IN">English</option><option value="hi-IN">हिन्दी</option></select>
   {supported&&<button type="button" disabled={busy} onClick={listen} aria-pressed={listening} className="flex min-h-10 items-center gap-1.5 rounded-lg border border-primary/30 px-3 text-xs text-primary disabled:opacity-40">{listening?<Square className="size-4"/>:<Mic className="size-4"/>}{listening?"Stop mic":"Ask by voice"}</button>}
   {canSpeak&&<button type="button" disabled={busy||!reply||listening} onClick={read} className="flex min-h-10 items-center gap-1.5 rounded-lg border border-line px-3 text-xs disabled:opacity-40"><Volume2 className="size-4"/>{speaking?"Stop audio":"Read reply"}</button>}
  </div>
  <p role="status" className="text-[11px] leading-relaxed text-text-muted">{notice|| (supported?"Tap the mic to dictate, review, then send. Your browser may use its speech service.":"Voice input is not supported in this browser. You can still type your question.")}</p>
 </div>;
}
