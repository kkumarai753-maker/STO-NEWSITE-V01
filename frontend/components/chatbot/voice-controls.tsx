"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { AssistantMascot, type AssistantMood } from "./assistant-mascot";

type Recognition = {
 lang:string; continuous:boolean; interimResults:boolean;
 onresult:((event:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;
 onerror:((event:{error:string})=>void)|null; onend:(()=>void)|null;
 start:()=>void; stop:()=>void; abort:()=>void;
};
type VoiceWindow = Window & {SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};
type Reply = {id:string;content:string;error?:boolean};
const errorMessage = (code:string) => {
 if (["not-allowed","service-not-allowed","NotAllowedError","SecurityError"].includes(code)) return "Microphone blocked. In Chrome, open the site controls beside the address, allow Microphone, then try again.";
 if (["audio-capture","NotFoundError","NotReadableError"].includes(code)) return "No working microphone found. Check your device or headset and try again.";
 if(code === "network") return "Chrome’s speech service could not connect. Check your connection, turn off a blocking VPN if needed, or use text chat.";
 if(code === "no-speech") return "I didn’t hear a question. Tap Start voice conversation and try again.";
 return "Voice input could not start. Try again in an updated Chrome browser, or use text chat.";
};

export function VoiceControls({open,busy,reply,onTranscript,onMoodChange}:{open:boolean;busy:boolean;reply?:Reply;onTranscript:(text:string)=>void;onMoodChange:(mood:AssistantMood)=>void}) {
 const [supported,setSupported]=useState(false);
 const [canSpeak,setCanSpeak]=useState(false);
 const [active,setActive]=useState(false);
 const [permission,setPermission]=useState<"prompt"|"granted"|"denied"|"unavailable">("prompt");
 const [mood,setMood]=useState<AssistantMood>("idle");
 const [language,setLanguage]=useState("en-IN");
 const [notice,setNotice]=useState("");
 const session=useRef(false),waiting=useRef(false),lastReply=useRef(""),audioVersion=useRef(0);
 const recognition=useRef<Recognition|null>(null);
 const utteranceRef=useRef<SpeechSynthesisUtterance|null>(null);
 const playbackTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const callbacks=useRef({onTranscript,onMoodChange});
 const current=useRef({language,reply});
 useEffect(()=>{callbacks.current={onTranscript,onMoodChange};current.current={language,reply};});
 function changeMood(next:AssistantMood){setMood(next);callbacks.current.onMoodChange(next);}
 function stop(message="Voice conversation stopped."){
  session.current=false;waiting.current=false;audioVersion.current++;
  if(playbackTimer.current)clearTimeout(playbackTimer.current);
  recognition.current?.abort();recognition.current=null;
  window.speechSynthesis?.cancel();utteranceRef.current=null;
  setActive(false);changeMood("idle");setNotice(message);
 }
 function listen(){
  if(!session.current)return;
  const w=window as VoiceWindow;const Constructor=w.SpeechRecognition||w.webkitSpeechRecognition;
  if(!Constructor){stop("This browser does not support voice input. Please use text chat.");return;}
  const instance=new Constructor();recognition.current=instance;
  instance.lang=current.current.language;instance.continuous=false;instance.interimResults=false;
  let transcript="",failed=false;
  instance.onresult=event=>{transcript=Array.from(event.results).map(result=>result[0].transcript).join(" ").trim();};
  instance.onerror=event=>{failed=true;if(session.current)stop(errorMessage(event.error));};
  instance.onend=()=>{
   if(recognition.current===instance)recognition.current=null;
   if(!session.current||failed)return;
   if(!transcript){stop(errorMessage("no-speech"));return;}
   waiting.current=true;lastReply.current=current.current.reply?.id??"";
   changeMood("thinking");setNotice("Thinking about your question…");
   callbacks.current.onTranscript(transcript);
  };
  try{instance.start();changeMood("listening");setNotice("Listening. Ask your question; I’ll send it and speak the answer automatically.");}
  catch{stop(errorMessage("start"));}
 }
 function speak(text:string,resumeListening:boolean){
  if(!window.speechSynthesis){stop("Spoken audio is unavailable. Please read the reply in chat.");return;}
  const version=++audioVersion.current;
  window.speechSynthesis.cancel();window.speechSynthesis.resume();
  const clean=text.replace(/\*\*/g,"").replace(/\/(?:build-your-proposal|services)[^\s]*/g,"the service link in this chat").slice(0,6000);
  const utterance=new SpeechSynthesisUtterance(clean);utteranceRef.current=utterance;
  utterance.lang=/[\u0900-\u097f]/.test(clean)?"hi-IN":current.current.language;
  const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith(utterance.lang.slice(0,2)));if(voice)utterance.voice=voice;
  utterance.onstart=()=>{if(playbackTimer.current)clearTimeout(playbackTimer.current);if(version===audioVersion.current){changeMood("speaking");setNotice("Speaking…");}};
  utterance.onend=()=>{if(playbackTimer.current)clearTimeout(playbackTimer.current);if(version!==audioVersion.current)return;utteranceRef.current=null;changeMood("idle");if(resumeListening&&session.current)listen();else setNotice("Reply finished.");};
  utterance.onerror=()=>{if(version===audioVersion.current)stop("Chrome could not play the voice. Check media volume and site sound permission, then tap Read reply to try again.");};
  playbackTimer.current=setTimeout(()=>{if(version===audioVersion.current)stop("Chrome did not start the audio. Check media volume and site sound permission, then tap Read reply.");},8000);
  try{window.speechSynthesis.speak(utterance);}catch{stop("Audio could not start. Check your volume and tap Read reply.");}
 }
 async function start(){
  if(active){stop();return;}
  if(!supported||!canSpeak){setNotice("Voice conversation is unavailable in this browser. Please use text chat or open the site directly in Chrome.");return;}
  audioVersion.current++;if(playbackTimer.current)clearTimeout(playbackTimer.current);window.speechSynthesis?.cancel();
  session.current=true;setActive(true);setNotice("Requesting microphone access…");
  try{
   if(window.isSecureContext===false)throw new Error("Voice needs a secure HTTPS page.");
   if(navigator.mediaDevices?.getUserMedia){
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    stream.getTracks().forEach(track=>track.stop());setPermission("granted");
   }
   if(session.current)listen();
  }catch(error){
   if(error instanceof Error && ["NotAllowedError","SecurityError"].includes(error.name))setPermission("denied");
   stop(errorMessage(error instanceof Error?error.name:"start"));
  }
 }
 useEffect(()=>{
  const w=window as VoiceWindow;setSupported(Boolean(w.SpeechRecognition||w.webkitSpeechRecognition));setCanSpeak("speechSynthesis" in window);window.speechSynthesis?.getVoices();
  return()=>{session.current=false;audioVersion.current++;if(playbackTimer.current)clearTimeout(playbackTimer.current);recognition.current?.abort();window.speechSynthesis?.cancel();};
 },[]);
 useEffect(()=>{
  let disposed=false;let status:PermissionStatus|undefined;
  if(!navigator.mediaDevices?.getUserMedia)setPermission("unavailable");
  if(navigator.permissions?.query)void navigator.permissions.query({name:"microphone" as PermissionName}).then(result=>{
   if(disposed)return;status=result;setPermission(result.state);result.onchange=()=>{setPermission(result.state);if(result.state==="denied")stop(errorMessage("not-allowed"));};
  }).catch(()=>{});
  return()=>{disposed=true;if(status)status.onchange=null;};
 },[]);
 useEffect(()=>{const visibility=()=>{if(document.hidden&&session.current)stop("Voice stopped because the page is in the background. Tap Start to resume.");};document.addEventListener("visibilitychange",visibility);return()=>document.removeEventListener("visibilitychange",visibility);},[]);
 useEffect(()=>{if(!open)stop("");},[open]); // Closing must stop both recording and playback.
 useEffect(()=>{
  if(!busy&&waiting.current&&reply&&reply.id!==lastReply.current){
   waiting.current=false;lastReply.current=reply.id;
   if(reply.error){session.current=false;setActive(false);}
   speak(reply.content,!reply.error);
  }
 },[busy,reply]);
 return <div className="mb-3 rounded-xl border border-primary/20 bg-primary-light/45 p-3">
  <div className="flex items-center gap-3">
   <AssistantMascot mood={busy?"thinking":mood} className="size-20 shrink-0" />
   <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#123967]">Talk to Sunrise</p><p role="status" className="mt-1 text-xs leading-relaxed text-text-muted">{notice||(supported&&canSpeak?"A voice conversation: you speak, I answer aloud.":"Voice unavailable here. Text chat still works; try opening this page directly in Chrome.")}</p></div>
  </div>
  {!active && permission!=="granted" && <div className="mt-2 rounded-lg border border-primary/20 bg-white p-3 text-xs leading-relaxed">
   <p className="font-semibold">{permission==="denied" ? "Microphone access is blocked" : "Microphone permission"}</p>
   <p className="mt-1">{permission==="denied" ? "Open Chrome’s site controls beside the address → Permissions → Microphone → Allow. Then return here and try again." : "Choose Enable mic & start below, then Allow in your browser’s permission prompt. Chrome controls whether access is one-time or remembered."}</p>
   <button type="button" onClick={()=>{stop("Text chat selected. Type your question below.");document.getElementById("chat-input")?.focus();}} className="mt-2 min-h-9 text-primary underline">Use text chat instead</button>
  </div>}
  <div className="mt-2 flex flex-wrap items-center gap-2">
   <label className="sr-only" htmlFor="assistant-language">Voice language</label>
   <select id="assistant-language" value={language} disabled={active||mood==="speaking"} onChange={event=>setLanguage(event.target.value)} className="min-h-10 rounded-lg border border-line bg-white px-2 text-xs"><option value="en-IN">English</option><option value="hi-IN">हिन्दी</option></select>
   <button type="button" disabled={!active&&(busy||!supported||!canSpeak)} onClick={()=>void start()} aria-pressed={active} className="flex min-h-11 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-white disabled:opacity-45">{active?<Square className="size-4"/>:<Mic className="size-4"/>}{active?"End voice conversation":permission==="granted"?"Start voice conversation":permission==="denied"?"Retry microphone":"Enable mic & start"}</button>
   {active&&mood==="listening"&&<button type="button" onClick={()=>recognition.current?.stop()} className="min-h-10 rounded-lg border border-primary/30 px-3 text-xs">Send spoken question</button>}
   {canSpeak&&<button type="button" disabled={busy||!reply||active} onClick={()=>mood==="speaking"?stop():speak(reply?.content??"",false)} className="flex min-h-10 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs disabled:opacity-40"><Volume2 className="size-4"/>{mood==="speaking"?"Stop audio":"Read reply"}</button>}
  </div>
  <p className="mt-2 text-[10px] leading-relaxed text-text-muted">Mic starts only when you choose voice. Speech uses your browser’s service. You can end the conversation anytime.</p>
 </div>;
}
