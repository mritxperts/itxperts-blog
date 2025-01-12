import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #f8f9fa;
  border-top: 1px solid #ddd;
  text-align: center;
  padding: 20px 0;
  margin-top: 20px;
  color: #555;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>© {new Date().getFullYear()} React Blog. All rights reserved.</p>
      <p>
        Powered by <a href="https://itxperts.co.in" target="_blank" rel="noopener noreferrer">ITxperts</a>
      </p>
    </FooterContainer>
  );
};

export default Footer;
