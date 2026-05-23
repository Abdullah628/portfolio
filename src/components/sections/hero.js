import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { keyframes } from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import emoImage from '../../images/emo.webp';

const float1 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -15px) rotate(5deg); }
  50% { transform: translate(-5px, -25px) rotate(-3deg); }
  75% { transform: translate(-15px, -10px) rotate(4deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(-12px, -20px) rotate(-4deg); }
  50% { transform: translate(8px, -30px) rotate(6deg); }
  75% { transform: translate(15px, -8px) rotate(-2deg); }
`;

const float3 = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -10px) rotate(3deg); }
  50% { transform: translate(-10px, -20px) rotate(-5deg); }
  75% { transform: translate(-8px, -30px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;
  position: relative;
  overflow: hidden;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
    max-width: 100%;
    white-space: normal;
    text-align: center;

    @media (max-width: 480px) {
      padding: 1rem 1.25rem;
      font-size: var(--fz-xs);

      &:hover,
      &:focus,
      &:focus-visible,
      &:active {
        transform: none;
        box-shadow: none;
      }
    }
  }
`;

const StyledFloatingLogos = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  @media (max-width: 480px) {
    display: none;
  }
`;

const StyledLogoIcon = styled.div`
  position: absolute;
  opacity: 0.12;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.25;
  }

  svg {
    width: ${props => props.size || 48}px;
    height: ${props => props.size || 48}px;
    fill: ${props => props.color || 'var(--green)'};
    filter: drop-shadow(0 0 6px ${props => props.glow || 'rgba(100, 255, 218, 0.3)'});
  }

  img {
    width: ${props => props.size || 48}px;
    height: ${props => props.size || 48}px;
    filter: drop-shadow(0 0 6px ${props => props.glow || 'rgba(100, 255, 218, 0.3)'});
  }

  &.float-1 {
    animation: ${float1} ${props => props.duration || 8}s ease-in-out infinite;
  }
  &.float-2 {
    animation: ${float2} ${props => props.duration || 10}s ease-in-out infinite;
  }
  &.float-3 {
    animation: ${float3} ${props => props.duration || 12}s ease-in-out infinite;
  }
  &.pulse {
    animation: ${pulse} 4s ease-in-out infinite;
  }
`;

const StyledHeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const StyledHeroLayout = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 620px) minmax(280px, 1fr);
  align-items: center;
  gap: clamp(24px, 5vw, 72px);

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const StyledHeroImageWrap = styled.div`
  position: relative;
  justify-self: end;
  transform: translateX(-24px);
  width: min(420px, 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: none;
  background: transparent;

  img {
    position: relative;
    z-index: 2;
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  @media (max-width: 1080px) {
    justify-self: start;
    transform: none;
    width: min(340px, 85vw);
  }
`;

// Tech logo SVG paths
const techLogos = [
  {
    name: 'PostgreSQL',
    top: '20%',
    left: '62%',
    size: 52,
    color: '#336791',
    glow: 'rgba(51, 103, 145, 0.3)',
    animClass: 'float-1',
    duration: 9,
    imgSrc: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg',
  },
  {
    name: 'Ubuntu',
    top: '32%',
    left: '58%',
    size: 44,
    color: '#E95420',
    glow: 'rgba(233, 84, 32, 0.3)',
    animClass: 'float-3',
    duration: 10,
    imgSrc: 'https://www.vectorlogo.zone/logos/ubuntu/ubuntu-icon.svg',
  },
  {
    name: 'Linux',
    top: '42%',
    left: '56%',
    size: 42,
    color: '#FBC02D',
    glow: 'rgba(251, 192, 45, 0.3)',
    animClass: 'float-1',
    duration: 11,
    imgSrc: 'https://www.vectorlogo.zone/logos/linux/linux-icon.svg',
  },
  {
    name: 'ChatGPT',
    top: '22%',
    left: '72%',
    size: 46,
    color: '#10A37F',
    glow: 'rgba(16, 163, 127, 0.3)',
    animClass: 'float-2',
    duration: 10,
    imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  },
  {
    name: 'Docker',
    top: '26%',
    right: '4%',
    size: 56,
    color: '#2496ED',
    glow: 'rgba(36, 150, 237, 0.3)',
    animClass: 'float-2',
    duration: 11,
    path: 'M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186zm5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185zm-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.186.186 0 00-.185-.186H5.136a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185zm-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185zM23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.687 11.687 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.028 12.028 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z',
  },
  {
    name: 'GitHub',
    top: '80%',
    right: '6%',
    size: 50,
    color: '#e6f1ff',
    glow: 'rgba(230, 241, 255, 0.2)',
    animClass: 'float-3',
    duration: 10,
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
  {
    name: 'Python',
    top: '84%',
    left: '64%',
    size: 44,
    color: '#3776AB',
    glow: 'rgba(55, 118, 171, 0.3)',
    animClass: 'float-1',
    duration: 13,
    path: 'M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.68H3.23l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z',
  },
  {
    name: 'VS Code',
    top: '92%',
    right: '22%',
    size: 46,
    color: '#007ACC',
    glow: 'rgba(0, 122, 204, 0.3)',
    animClass: 'float-1',
    duration: 10,
    path: 'M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z',
  },
  {
    name: 'Node.js',
    top: '82%',
    left: '15%',
    size: 44,
    color: '#339933',
    glow: 'rgba(51, 153, 51, 0.3)',
    animClass: 'float-2',
    duration: 11,
    path: 'M11.998 24c-.321 0-.641-.084-.922-.247L8.14 22.016c-.438-.245-.224-.332-.08-.383.626-.218.752-.268 1.42-.647.07-.04.162-.025.234.015l2.255 1.339a.29.29 0 0 0 .272 0l8.795-5.076a.277.277 0 0 0 .134-.238V6.95a.282.282 0 0 0-.137-.242l-8.791-5.072a.278.278 0 0 0-.271 0L3.383 6.708a.285.285 0 0 0-.139.241v10.076a.27.27 0 0 0 .138.237l2.412 1.392c1.309.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.11.255.253v9.978c0 1.744-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.55L2.566 18.69a1.854 1.854 0 0 1-.922-1.604V6.95c0-.66.353-1.277.922-1.603L11.36.27a1.923 1.923 0 0 1 1.846 0l8.794 5.077c.572.326.922.943.922 1.603v10.138a1.852 1.852 0 0 1-.922 1.603l-8.794 5.076a1.848 1.848 0 0 1-.926.247z',
  },
  {
    name: 'C++',
    top: '30%',
    left: '82%',
    size: 42,
    color: '#00599C',
    glow: 'rgba(0, 89, 156, 0.3)',
    animClass: 'float-3',
    duration: 9,
    path: 'M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 0 1 6.156 3.553l-3.076 1.78a3.567 3.567 0 0 0-3.08-1.78A3.56 3.56 0 0 0 8.444 12 3.56 3.56 0 0 0 12 15.555a3.57 3.57 0 0 0 3.08-1.778l3.078 1.78A7.135 7.135 0 0 1 12 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z',
  },
  {
    name: 'TypeScript',
    top: '44%',
    left: '94%',
    size: 40,
    color: '#3178C6',
    glow: 'rgba(49, 120, 198, 0.3)',
    animClass: 'float-2',
    duration: 12,
    path: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.473.597.615.954.142.356.214.77.214 1.24 0 .748-.149 1.36-.444 1.837-.296.476-.689.847-1.182 1.114-.492.268-1.047.453-1.665.557a8.929 8.929 0 0 1-1.899.146c-.699 0-1.352-.066-1.961-.198a5.95 5.95 0 0 1-1.572-.555v-2.699c.244.186.5.35.769.492.269.142.535.261.799.357.264.097.515.169.753.218.237.049.41.073.598.073.357 0 .636-.04.838-.12.2-.08.349-.19.443-.33a.874.874 0 0 0 .164-.493.792.792 0 0 0-.189-.525c-.126-.17-.318-.335-.576-.497-.258-.162-.568-.326-.93-.491-.514-.225-.95-.465-1.31-.72a4.21 4.21 0 0 1-.886-.812 2.956 2.956 0 0 1-.498-.991c-.102-.37-.152-.795-.152-1.279 0-.69.141-1.277.423-1.76.282-.482.663-.877 1.142-1.184a5.304 5.304 0 0 1 1.625-.713 7.327 7.327 0 0 1 1.874-.242zm-6.363.45h2.893v1.86H12.59v8.19H10.4v-8.19H7.476V10.2h4.649z',
  },
  {
    name: 'Git',
    top: '46%',
    left: '3%',
    size: 42,
    color: '#F05032',
    glow: 'rgba(240, 80, 50, 0.3)',
    animClass: 'float-2',
    duration: 14,
    path: 'M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.66 2.66c.645-.222 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187',
  },
  {
    name: 'MongoDB',
    top: '92%',
    left: '55%',
    size: 38,
    color: '#47A248',
    glow: 'rgba(71, 162, 72, 0.3)',
    animClass: 'float-3',
    duration: 10,
    path: 'M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z',
  },
  {
    name: 'React.js',
    top: '20%',
    left: '48%',
    size: 40,
    color: '#61DAFB',
    glow: 'rgba(97, 218, 251, 0.3)',
    animClass: 'float-2',
    duration: 11,
    imgSrc: 'https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg',
  },
];

const FloatingLogos = () => (
  <StyledFloatingLogos>
    {techLogos.map((logo, i) => (
      <StyledLogoIcon
        key={logo.name}
        className={logo.animClass}
        size={logo.size}
        color={logo.color}
        glow={logo.glow}
        duration={logo.duration}
        style={{
          top: logo.top,
          left: logo.left,
          right: logo.right,
          animationDelay: `${i * 0.5}s`,
        }}
        title={logo.name}>
        {logo.imgSrc ? (
          <img
            src={logo.imgSrc}
            alt=""
            loading="lazy"
            onError={e => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <svg viewBox={logo.viewBox || '0 0 24 24'} xmlns="http://www.w3.org/2000/svg">
            <path d={logo.path} />
          </svg>
        )}
      </StyledLogoIcon>
    ))}
  </StyledFloatingLogos>
);

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Abdullah.</h2>;
  const three = (
    <h3 className="big-heading">I design scalable, fault-tolerant software systems.</h3>
  );
  const four = (
    <>
      <p>
        I’m a software engineer focused on distributed systems, event-driven architecture, and
        production reliability. I build with strong API contracts, performance optimization,
        observability, and secure-by-design engineering, while selectively integrating AI where it
        improves system capability and developer velocity at{' '}
        <a href="https://octopi-digital.com/" target="_blank" rel="noreferrer">
          Octopi Digital LLC.
        </a>
      </p>
    </>
  );
  // const five = (
  //   <a
  //     className="email-link"
  //     href="https://ecommerce-store-76tn.onrender.com/"
  //     target="_blank"
  //     rel="noreferrer">
  //     Check out my Recent Work!
  //   </a>
  // );
  const five = (
    <a className="email-link" href="https://tainc.org/" target="_blank" rel="noreferrer">
      Explore My Latest Software Product
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      <FloatingLogos />
      <StyledHeroLayout>
        <StyledHeroContent>
          {prefersReducedMotion ? (
            <>
              {items.map((item, i) => (
                <div key={i}>{item}</div>
              ))}
            </>
          ) : (
            <TransitionGroup component={null}>
              {isMounted &&
                items.map((item, i) => (
                  <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                    <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
                  </CSSTransition>
                ))}
            </TransitionGroup>
          )}
        </StyledHeroContent>

        <StyledHeroImageWrap>
          <img src={emoImage} alt="Cute emo robot illustration" loading="eager" />
        </StyledHeroImageWrap>
      </StyledHeroLayout>
    </StyledHeroSection>
  );
};

export default Hero;
