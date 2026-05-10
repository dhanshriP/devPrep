import React, { useState } from 'react';

const SetupScreen = ({ onSetupComplete }) => {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [domainStack, setDomainStack] = useState('');
  const [companyStyle, setCompanyStyle] = useState('');

  const roles = ["SDE", "Principal Engineer", "TPM", "EM", "Scrum Master", "Delivery Manager"];
  const levels = ["Junior", "Mid", "Senior", "Staff", "Principal"];
  
  const techStacks = [
    "Android (Kotlin, Jetpack Compose)", 
    "React (Node.js)", 
    "Python (Django/Flask)", 
    "Go (Microservices)", 
    "CI/CD", 
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
  
  const companyStyles = ["FAANG", "Startup", "Mid-size", "Enterprise"];

  const isTechnicalRole = role === "SDE" || role === "Principal Engineer" || role === "EM";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role && level && domainStack && companyStyle) {
      onSetupComplete({ role, level, domainStack, companyStyle });
    } else {
      alert("Please fill all fields to start the interview.");
    }
  };

  return (
    <div className="setup-screen">
      <div className="setup-header">
        <h1>DevPrep.ai</h1>
        <p className="setup-subtitle">Personalize your high-stakes interview experience</p>
      </div>

      <div className="setup-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Your Role</label>
            <select id="role" value={role} onChange={(e) => {
              setRole(e.target.value);
              setDomainStack(''); // Reset selection when role changes
            }}>
              <option value="">Select your role</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="level">Experience Level</label>
            <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Select your level</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="domainStack">
              {isTechnicalRole ? "Core Tech Stack" : "Primary Focus Area"}
            </label>
            <select id="domainStack" value={domainStack} onChange={(e) => setDomainStack(e.target.value)}>
              <option value="">Select {isTechnicalRole ? "stack" : "focus"}</option>
              {isTechnicalRole 
                ? techStacks.map(ds => <option key={ds} value={ds}>{ds}</option>)
                : managementFocus.map(mf => <option key={mf} value={mf}>{mf}</option>)
              }
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="companyStyle">Target Company Culture</label>
            <select id="companyStyle" value={companyStyle} onChange={(e) => setCompanyStyle(e.target.value)}>
              <option value="">Select company style</option>
              {companyStyles.map(cs => <option key={cs} value={cs}>{cs}</option>)}
            </select>
          </div>
          
          <button type="submit" className="primary-btn wide-btn">
            Launch Mock Interview 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;
