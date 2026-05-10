import React, { useState } from 'react';

const SetupScreen = ({ onSetupComplete }) => {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [domainStack, setDomainStack] = useState('');
  const [companyStyle, setCompanyStyle] = useState('');

  const roles = ["SDE", "Principal Engineer", "TPM", "EM", "Scrum Master", "Delivery Manager", "Business Analyst"];
  const levels = ["Junior", "Mid", "Senior", "Staff", "Principal"];
  
  const techStacks = [
    "iOS (Swift, SwiftUI)",
    "Node.js (Backend, Microservices)",
    "JavaScript (Frontend, TypeScript, React)",
    "Android (Kotlin, Compose)", 
    "Java (Spring Boot, Cloud Native)",
    "C++ (Low-level, Performance)",
    "Python (AI, Data Science, FastAPI)", 
    "Go (Cloud Native, Scalability)", 
    "CI/CD & Platform Engineering", 
    "Cloud Architecture (AWS/Azure/GCP)"
  ];
  
  const managementFocus = [
    "Agile/Scrum Methodologies", 
    "Product Roadmap & Strategy", 
    "Resource & Capacity Planning", 
    "Stakeholder Management", 
    "Delivery Excellence", 
    "Process Optimization",
    "Technical Program Execution"
  ];

  const baFocus = [
    "Requirements Engineering",
    "Process Modeling (BPMN)",
    "Data Analytics & SQL",
    "User Story Mapping",
    "UAT & Gap Analysis",
    "Business Case Development"
  ];
  
  const companyStyles = ["FAANG", "High-Growth Startup", "Mid-size Tech", "Legacy Enterprise"];

  const isTechnicalRole = ["SDE", "Principal Engineer", "EM"].includes(role);
  const isBARole = role === "Business Analyst";

  const getFocusOptions = () => {
    if (isTechnicalRole) return techStacks;
    if (isBARole) return baFocus;
    return managementFocus;
  };

  const getFocusLabel = () => {
    if (isTechnicalRole) return "CORE TECH STACK";
    if (isBARole) return "ANALYTICS & FOCUS AREA";
    return "MANAGEMENT FOCUS AREA";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role && level && domainStack && companyStyle) {
      onSetupComplete({ role, level, domainStack, companyStyle });
    } else {
      alert("Please fill all fields to begin your 2026 assessment.");
    }
  };

  return (
    <div className="setup-screen">
      <div className="setup-header">
        <h1>DevPrep.ai</h1>
        <p className="setup-subtitle">Elite 2026 Career Intelligence Suite</p>
      </div>

      <div className="setup-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>YOUR ROLE</label>
            <select value={role} onChange={(e) => { setRole(e.target.value); setDomainStack(''); }}>
              <option value="">Select role</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>EXPERIENCE LEVEL</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Select your level</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>{getFocusLabel()}</label>
            <select value={domainStack} onChange={(e) => setDomainStack(e.target.value)}>
              <option value="">Select focus</option>
              {getFocusOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>TARGET COMPANY CULTURE</label>
            <select value={companyStyle} onChange={(e) => setCompanyStyle(e.target.value)}>
              <option value="">Select target culture</option>
              {companyStyles.map(cs => <option key={cs} value={cs}>{cs}</option>)}
            </select>
          </div>
          
          <button type="submit" className="primary-btn wide-btn">
            Initiate 2026 Evaluation 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;
