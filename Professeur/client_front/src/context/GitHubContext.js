import React, { createContext, useContext } from 'react';

const GitHubContext = createContext();

export const GitHubProvider = ({ children, clientId }) => {
  const handleGitHubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?Ov23liXiPg89uvMwvlMY=${clientId}&scope=user:email`;
  };

  return (
    <GitHubContext.Provider value={{ handleGitHubLogin }}>
      {children}
    </GitHubContext.Provider>
  );
};

export const useGitHub = () => useContext(GitHubContext);