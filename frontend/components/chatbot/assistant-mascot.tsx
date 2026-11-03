export type AssistantMood = "idle" | "listening" | "thinking" | "speaking";
export function AssistantMascot({mood="idle",className=""}:{mood?:AssistantMood;className?:string}) {
 return <svg viewBox="0 0 160 160" aria-hidden="true" className={`sunrise-mascot mascot-${mood} ${className}`}>
  <ellipse cx="80" cy="149" rx="42" ry="6" fill="#1565f0" opacity=".12"/>
  <g className="mascot-body">
   <path d="M53 108Q80 96 107 108L113 139Q80 155 47 139Z" fill="#e9f4ff" stroke="#9dbde5" strokeWidth="2"/>
   <circle cx="80" cy="126" r="10" fill="#1565f0"/><circle className="mascot-core" cx="80" cy="126" r="5" fill="#6ee7ff"/>
   <g className="mascot-arm"><path d="M111 121L129 111L133 91" fill="none" stroke="#b8d2ef" strokeWidth="13" strokeLinecap="round"/><path d="M131 93L127 78M134 91L136 75M137 94L144 81" stroke="#e9f4ff" strokeWidth="6" strokeLinecap="round"/></g>
   <path d="M49 121L35 132" stroke="#b8d2ef" strokeWidth="13" strokeLinecap="round"/>
   <g className="mascot-head">
    <path d="M80 35V20" stroke="#1565f0" strokeWidth="5"/><circle cx="80" cy="17" r="7" fill="#ff9418"/>
    <rect x="22" y="62" width="14" height="30" rx="7" fill="#1565f0"/><rect x="124" y="62" width="14" height="30" rx="7" fill="#1565f0"/>
    <rect x="29" y="34" width="102" height="78" rx="35" fill="#f7fbff" stroke="#adc7e6" strokeWidth="2"/>
    <rect x="39" y="45" width="82" height="56" rx="24" fill="#071c43"/>
    <g className="mascot-eyes" fill="#56dfff"><rect x="54" y="62" width="13" height="16" rx="6.5"/><rect x="93" y="62" width="13" height="16" rx="6.5"/></g>
    <path className="mascot-smile" d="M69 85Q80 95 91 85" stroke="#56dfff" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <ellipse className="mascot-mouth" cx="80" cy="87" rx="10" ry="6" fill="#56dfff"/>
   </g>
  </g>
 </svg>;
}
