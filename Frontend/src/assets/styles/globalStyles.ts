// src/styles/GlobalStyle.ts

import { createGlobalStyle } from 'styled-components';

// Import TTF font files
import PoppinsRegular from '../fonts/Poppins-Regular.ttf';
import PoppinsMedium from '../fonts/Poppins-Medium.ttf';
import PoppinsBold from '../fonts/Poppins-Bold.ttf';
import PoppinsSemiBold from '../fonts/Poppins-SemiBold.ttf';

const GlobalStyle = createGlobalStyle`
  /* Local font faces from src folder */
  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsRegular}) format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: block;
  }

  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsMedium}) format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: block;
  }

  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsSemiBold}) format('truetype');
    font-weight: 600;
    font-style: normal;
    font-display: block;
  }

  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsBold}) format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: block;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.primary || 'Poppins, sans-serif'};
    -webkit-font-smoothing: antialiased;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.primary || 'Poppins, sans-serif'};
    font-size: 1rem;
    font-weight: 400;
    outline: none;
    border: none;
  }

  ul, ol {
    list-style: none;
  }

  h1 {
    font-size: 3rem;
  }

  h1, h2, h3, h4, h5, h6, p, span {
    font-family: ${({ theme }) => theme.fonts.primary || 'Poppins, sans-serif'};
  }

  @media (max-width: 1024px) {    
   
    html 
    {
     font-size:14px;
    }
    body 
    {
      background-color:${({ theme }) => theme.colors.pageColor};
    }
  }

  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export default GlobalStyle;
