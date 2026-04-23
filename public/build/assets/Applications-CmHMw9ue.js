import{r as p,j as a,H as c,L as d}from"./app-CVntrhLK.js";import{A as x}from"./AppNavbar-BrJR2gSp.js";import"./Notification-CNOxME_k.js";import"./Dropdown-sxoWQw6F.js";import"./transition-BEd-xrNC.js";function u({auth:t,applications:i}){const[o,s]=p.useState(!1),n=t?.user,r=()=>{s(!o)},l=()=>{s(!1)};return a.jsxs(a.Fragment,{children:[a.jsx(c,{title:"My Applications - GiftedTalent"}),a.jsx(x,{user:n,onMenuToggle:r,isMenuOpen:o}),o&&a.jsx("div",{className:"mobile-overlay",onClick:l}),a.jsxs("div",{className:"applications-container",children:[a.jsxs("div",{className:"applications-header",children:[a.jsxs("h1",{children:[a.jsx("i",{className:"fa-solid fa-file"})," My Applications"]}),a.jsx("p",{children:"Track all the jobs you've applied for"})]}),i&&i.length===0?a.jsxs("div",{className:"no-applications",children:[a.jsx("i",{className:"fa-regular fa-file"}),a.jsx("h3",{children:"No Applications Yet"}),a.jsx("p",{children:"You haven't applied to any jobs yet. Start browsing and apply to your first job!"}),a.jsxs(d,{href:"/search-jobs",className:"browse-jobs-btn",children:[a.jsx("i",{className:"fa-solid fa-magnifying-glass"})," Browse Jobs"]})]}):a.jsx("div",{className:"applications-list",children:i.map(e=>a.jsxs("div",{className:"application-card",children:[a.jsxs("div",{className:"application-header",children:[a.jsx("h3",{children:e.title}),a.jsx("span",{className:`status-badge ${e.status}`,children:e.status})]}),a.jsxs("p",{className:"company-name",children:[a.jsx("i",{className:"fa-solid fa-building"})," ",e.company]}),a.jsxs("p",{className:"location",children:[a.jsx("i",{className:"fa-solid fa-location-dot"})," ",e.location]}),a.jsxs("p",{className:"applied-date",children:[a.jsx("i",{className:"fa-regular fa-calendar"})," Applied on ",new Date(e.applied_at).toLocaleDateString()]})]},e.id))})]}),a.jsx("style",{children:`
                .applications-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                
                .applications-header {
                    margin-bottom: 30px;
                }
                
                .applications-header h1 {
                    font-size: 28px;
                    color: #1f2937;
                    margin-bottom: 8px;
                }
                
                .applications-header h1 i {
                    color: #0A2463;
                    margin-right: 10px;
                }
                
                .applications-header p {
                    color: #6b7280;
                }
                
                .no-applications {
                    text-align: center;
                    padding: 80px 20px;
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #e5e7eb;
                }
                
                .no-applications i {
                    font-size: 64px;
                    color: #cbd5e1;
                    margin-bottom: 16px;
                }
                
                .no-applications h3 {
                    font-size: 20px;
                    color: #1f2937;
                    margin-bottom: 8px;
                }
                
                .no-applications p {
                    color: #6b7280;
                    margin-bottom: 24px;
                }
                
                .browse-jobs-btn {
                    display: inline-block;
                    padding: 12px 28px;
                    background: #0A2463;
                    color: white;
                    text-decoration: none;
                    border-radius: 30px;
                    transition: all 0.3s;
                }
                
                .browse-jobs-btn:hover {
                    background: #1e3a5f;
                    transform: translateY(-2px);
                }
                
                .applications-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                
                .application-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                    transition: all 0.3s;
                }
                
                .application-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    border-color: #0A2463;
                }
                
                .application-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                
                .application-header h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: capitalize;
                }
                
                .status-badge.pending {
                    background: #fef3c7;
                    color: #d97706;
                }
                
                .status-badge.accepted {
                    background: #d1fae5;
                    color: #059669;
                }
                
                .status-badge.rejected {
                    background: #fee2e2;
                    color: #dc2626;
                }
                
                .status-badge.reviewed {
                    background: #dbeafe;
                    color: #2563eb;
                }
                
                .company-name, .location, .applied-date {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 8px 0;
                }
                
                .company-name i, .location i, .applied-date i {
                    color: #0A2463;
                    width: 20px;
                    margin-right: 8px;
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
                
                @media (max-width: 768px) {
                    .applications-container {
                        padding: 20px 16px;
                    }
                    
                    .application-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .no-applications {
                        padding: 50px 20px;
                    }
                    
                    .no-applications i {
                        font-size: 48px;
                    }
                }
            `})]})}export{u as default};
