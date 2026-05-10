import React, { useState } from 'react';

const SetupScreen = ({ onSetupComplete }) => {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [domainStack, setDomainStack] = useState('');
  const [companyStyle, setCompanyStyle] = useState('');

  const roles = ["SDE", "Principal Engineer", "TPM", "EM", "Scrum Master", "Delivery Manager"];
  const levels = ["Junior", "Mid", "Senior", "Staff", "Principal"];
  const domainStacks = ["Android (Kotlin, Jetpack Compose)", "React (Node.js)", "Python (Django/Flask)", "Go (Microservices)", "CI/CD", "Cloud Architecture (AWS/Azure/GCP)"];
  const companyStyles = ["FAANG", "Startup", "Mid-size", "Enterprise"];

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
      <h1>Interview Setup</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select your role</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="level">Level:</label>
          <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Select your level</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="domainStack">Domain/Stack:</label>
          <select id="domainStack" value={domainStack} onChange={(e) => setDomainStack(e.target.value)}>
            <option value="">Select domain/stack</option>
            {domainStacks.map(ds => <option key={ds} value={ds}>{ds}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="companyStyle">Target Company Style:</label>
          <select id="companyStyle" value={companyStyle} onChange={(e) => setCompanyStyle(e.target.value)}>
            <option value="">Select company style</option>
            {companyStyles.map(cs => <option key={cs} value={cs}>{cs}</option>)}
          </select>
        </div>
        
        <button type="submit">Start Interview</button>
      </form>
    </div>
  );
};

export default SetupScreen;
