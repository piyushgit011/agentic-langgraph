import { createGlobalStyle } from 'styled-components';
import PoppinsRegular from '../fonts/Poppins-Regular.ttf';
import PoppinsMedium from '../fonts/Poppins-Medium.ttf';
import PoppinsSemiBold from '../fonts/Poppins-SemiBold.ttf';
import PoppinsBold from '../fonts/Poppins-Bold.ttf';

const GlobalStyle = createGlobalStyle`
  /* Font Faces under one name: 'Poppins' */
  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsRegular}) format('truetype');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsMedium}) format('truetype');
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsSemiBold}) format('truetype');
    font-weight: 600;
    font-style: normal;
  }
  @font-face {
    font-family: 'Poppins';
    src: url(${PoppinsBold}) format('truetype');
    font-weight: 700;
    font-style: normal;
  }

  /* Reset and Base Styles */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Poppins', sans-serif;
    font-size: ${({ theme }: { theme: any }) => theme.fontSizes.base};
    background-color: ${({ theme }: { theme: any }) => theme.colors.background};
    color: ${({ theme }: { theme: any }) => theme.colors.text};
  }
  
  a,
  input,
  textarea,
  select,
  button {
    font-family: 'Poppins', sans-serif;
  }

  ::placeholder {
    font-family: 'Poppins', sans-serif;
  }

  input:-webkit-autofill {
    -webkit-text-fill-color: #000 !important;
    transition: background-color 100000s ease-in-out 0s;
  }
  
  img {
    width: 100%;
  }
`;

export default GlobalStyle; 
