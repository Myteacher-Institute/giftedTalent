import{r as i,j as e,H as v,L as w}from"./app-wHtWkFyz.js";import{A as N}from"./AppNavbar-Bm5gEqZh.js";/* empty css                     */import"./app-CgMJy1no.js";import"./Notification-BEMlKbwk.js";import"./Dropdown-b8vzYxM5.js";import"./transition-BRq6Hqw0.js";import"./ApplicationLogo-DOT7DSp6.js";/* empty css            */function E({auth:h,messages:f,otherUser:t}){const[n,d]=i.useState(!1),[s,l]=i.useState(""),[c,p]=i.useState(!1),[r,u]=i.useState(f||[]),o=h?.user,b=()=>{d(!n)},y=()=>{d(!1)},x=async()=>{if(s.trim()){p(!0);try{const a=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),g=await fetch("/messages/send",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":a},body:JSON.stringify({receiver_id:t?.id,message:s})}),m=await g.json();g.ok?(l(""),u([...r,{id:m.data.id,sender_id:o?.id,message:s,created_at:new Date().toISOString(),is_read:0}]),window.alertify&&alertify.success("Message sent!")):window.alertify&&alertify.error(m.message||"Failed to send")}catch(a){console.error("Error sending message:",a)}finally{p(!1)}}},j=a=>a?.charAt(0)?.toUpperCase()||"U";return e.jsxs(e.Fragment,{children:[e.jsx(v,{title:`Chat with ${t?.name} - GiftedTalent`}),e.jsx(N,{user:o,onMenuToggle:b,isMenuOpen:n}),n&&e.jsx("div",{className:"mobile-overlay",onClick:y}),e.jsxs("div",{className:"chat-container",children:[e.jsxs("div",{className:"chat-header",children:[e.jsxs(w,{href:"/messages",className:"back-btn",children:[e.jsx("i",{className:"fa-solid fa-arrow-left"})," Back"]}),e.jsxs("div",{className:"chat-user",children:[e.jsx("div",{className:"chat-avatar",children:e.jsx("div",{className:"avatar-placeholder",children:j(t?.name)})}),e.jsx("h3",{children:t?.name})]})]}),e.jsx("div",{className:"chat-messages",children:r.length===0?e.jsxs("div",{className:"no-messages",children:[e.jsx("i",{className:"fa-regular fa-envelope"}),e.jsx("p",{children:"No messages yet. Start a conversation!"})]}):r.map(a=>e.jsx("div",{className:`message-bubble ${a.sender_id===o?.id?"sent":"received"}`,children:e.jsxs("div",{className:"message-content",children:[e.jsx("p",{children:a.message}),e.jsx("small",{children:new Date(a.created_at).toLocaleString()})]})},a.id))}),e.jsxs("div",{className:"chat-input",children:[e.jsx("textarea",{placeholder:"Type your message...",value:s,onChange:a=>l(a.target.value),onKeyPress:a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),x())}}),e.jsx("button",{onClick:x,disabled:c||!s.trim(),children:c?e.jsx("i",{className:"fa-solid fa-spinner fa-spin"}):e.jsx("i",{className:"fa-regular fa-paper-plane"})})]})]}),e.jsx("style",{children:`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 60px);
                    max-width: 800px;
                    margin: 0 auto;
                    background: #f8fafc;
                }
                .chat-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 16px 20px;
                    background: white;
                    border-bottom: 1px solid #e5e7eb;
                }
                .back-btn {
                    color: #0A2463;
                    text-decoration: none;
                    font-size: 16px;
                }
                .chat-user {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .chat-avatar {
                    width: 40px;
                    height: 40px;
                }
                .avatar-placeholder {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #0A2463, #1e3a5f);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                }
                .chat-user h3 {
                    font-size: 18px;
                    margin: 0;
                }
                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .message-bubble {
                    display: flex;
                }
                .message-bubble.sent {
                    justify-content: flex-end;
                }
                .message-bubble.received {
                    justify-content: flex-start;
                }
                .message-content {
                    max-width: 70%;
                    padding: 10px 16px;
                    border-radius: 18px;
                }
                .message-bubble.sent .message-content {
                    background: #0A2463;
                    color: white;
                }
                .message-bubble.received .message-content {
                    background: white;
                    color: #1f2937;
                    border: 1px solid #e5e7eb;
                }
                .message-content small {
                    font-size: 10px;
                    opacity: 0.7;
                    display: block;
                    margin-top: 5px;
                }
                .chat-input {
                    padding: 16px;
                    background: white;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 10px;
                }
                .chat-input textarea {
                    flex: 1;
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 24px;
                    resize: none;
                    font-family: inherit;
                    font-size: 14px;
                }
                .chat-input button {
                    width: 48px;
                    height: 48px;
                    background: #0A2463;
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                }
                .chat-input button:disabled {
                    opacity: 0.5;
                }
                .no-messages {
                    text-align: center;
                    padding: 60px;
                    color: #6b7280;
                }
                .no-messages i {
                    font-size: 48px;
                    margin-bottom: 16px;
                }
                .mobile-overlay {
                    position: fixed;
                    top: 60px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 1001;
                }
            `})]})}export{E as default};
