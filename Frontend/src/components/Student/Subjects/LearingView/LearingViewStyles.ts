import styled, { keyframes } from "styled-components";

export const LearningViewWrapper = styled.div`
  display: flex;
  width: 100%;

  .current_topic_title {
    display: flex;
    align-items:center;
  }

  .back-button {
    border-right: 1px solid ${({ theme }) => theme.colors.borderColor};
    padding: 0px 10px 0px 0px;
    margin-bottom: 0px;
  }

  @media (max-width: 991.5px) {
    display: block;

    .back-button
    {
    display:none;
    }
  }

`;

export const LearningLeftSide = styled.div<{ $mode?: 'default' | 'FullVideo' | 'FullChatView' }>`
  width: ${({ $mode }) =>
    $mode === 'default' ? '75%' :
      $mode === 'FullVideo' ? '100%' :
        '0%'};
  overflow: hidden; 
  transition: all 0.3s ease;

  @media (max-width: 991.5px) {
    width: ${({ $mode }) =>
    $mode === 'default' ? '100%' :
      $mode === 'FullVideo' ? '100%' :
        '0%'};
  }
`;
export const LearingRightSide = styled.div<{ $mode?: 'default' | 'FullVideo' | 'FullChatView' }>`
  width: ${({ $mode }) =>
    $mode === 'default' ? '25%' :
      $mode === 'FullChatView' ? '100%' :
        '0%'};
   height: ${({ $mode }) =>
    $mode === 'default' ? ' calc(100vh - 92px)' :
      $mode === 'FullChatView' ? ' calc(100vh - 144px)' :
        'calc(100vh - 92px)'};
  transition: all 0.3s ease;
  display: ${({ $mode }) =>
    $mode === 'default' ? 'block' :
      $mode === 'FullChatView' ? 'block' :
        'none'};

          @media (max-width: 991.5px) {
    width: ${({ $mode }) =>
    $mode === 'default' ? '100%' :
      $mode === 'FullChatView' ? '100%' :
        '0%'};
  }

  @media (max-width: 991.5px) {
    display:none;
  }
`;

// Topbar_Style::Start
export const LearingTopbar = styled.div`
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  width: 100%;
  height:50px;
  
   @media (max-width: 991.5px) {
    height:100%;
    padding:5px;
  }

`;

export const CurrentTopicData = styled.div`
  display: flex;
  padding-left: 10px;

  @media (max-width: 991.5px) {
    padding-left:0px;
  }
`;

export const BoldSmallText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

export const RegularSmallText = styled.p`
  margin-left: 5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.dark};
`;

export const NextButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.dark};

  svg {
    margin-left: 5px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;
// Topbar_Style::End

// AI_chatbot_Style::Start
export const ChatWrapper = styled.div<{ $mode?: 'default' | 'FullChatView' }>`
  width: 100%;
  height: 100%;
border-left: ${({ $mode, theme }) =>
    $mode === 'FullChatView'
      ? '0px'
      : `1px solid ${theme.colors.borderColor}`};
  display: flex;
  flex-direction: column;
  font-family: 'Poppins', sans-serif;
  background-color: #ffff;
  border-radius: ${({ $mode }) =>
    $mode === 'FullChatView'
      ? '0px 0px 24px 24px'
      : '0px'};
`;

export const ChatHeader = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  background-color: #ffff;
`;

export const TutorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    border-radius: 50%;
  }
`;

export const TutorName = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
`;

export const TutorRole = styled.span`
  font-size: 12px;
  color: #7b19d8;
`;

export const ChatBody = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #fff;
`;

export const AIMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;

  .tutor_icon {
    width: 30px;
    min-width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .tutor_icon svg {
    height: 1rem;
    width: 1rem;
  }
`;

export const StudentMessage = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
  background: #F3F3F3;
  border-radius: 10px;
  padding: 10px;
  width: 95%;
`;

export const StudentMessageWrapper = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 10px;
`;

export const MessageText = styled.p`
  background-color: #ffff;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.4;
`;

export const MessageTime = styled.span`
  font-size: 11px;
  color: #999;
  margin-top: 5px;
`;

export const ChatFooter = styled.div`
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  margin:10px;
`;

export const ChatInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #3e3e3e;
  background-color: transparent;
  width:100%;
`;
export const ChatInputWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-top:10px;
`;
export const ChatIpnutUploadIcon = styled.div`
  display:flex;
  align-items:center;
  gap:5px;
`;

export const IconButton = styled.button`
  background-color: #f6f6f6;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    color: #7b19d8;
    width: 18px;
    height: 18px;
  }
`;

export const SendButton = styled.button`
  background-color: #21786e;
  border: none;
  border-radius: 10px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    color: #fff;
    width: 18px;
    height: 18px;
  }
`;
export const SquareButtons = styled.button`
  background-color: #F6F6F6;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  width: 35px;
  height: 35px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    color: #7b19d8;
    height: 1.3rem !important;
    width: 1.3rem !important;
  }
`;

export const AiIcon = styled.div`
  background-color: #7b19d8;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    color: #fff;
    height: 1.5rem;
    width: 1.5rem;
  }
`;

export const TutorModeButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const AiMessageTextTime = styled.div`
  display: inline-flex;
  flex-direction: column;
  border-radius: 10px;
  padding: 10px;
  max-width: 85%;
  width: fit-content;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
`;

export const ThinkingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const Dot = styled.div<{ color?: string; delay?: string }>`
  width: 10px;
  height: 10px;
  background-color: ${({ color }) => color || '#000'};
  border-radius: 50%;
  animation: ${bounce} 1s infinite ease-in-out;
  animation-delay: ${({ delay }) => delay || '0s'};
`;

export const ThinkingText = styled.span`
  font-size: 16px;
  color: #434875;
  font-weight: 400;
  margin-left: 5px;
`;

export const NextTpoicsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  

   @media (max-width: 991.5px) {
    display:none;
  }

`;

export const RoundedCornerButton = styled.button`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 20px;
  padding: 3px 10px;
  cursor: pointer;
  color: white;
  &.rounded_icon_btn svg
  {
    margin-right:5px;
  }
    &.step_rounded_btn
    {
     background: ${({ theme }) => theme.colors.white};
     color:${({ theme }) => theme.colors.text};
     border:1px solid ${({ theme }) => theme.colors.borderColor};
     font-size:14px;
    }
         &.step_rounded_btn.active 
         {
              background: ${({ theme }) => theme.colors.primary};
               color:${({ theme }) => theme.colors.white};
         }
       &.step_rounded_btn svg 
       {
       margin-right:8px;
       }
       &.step_rounded_btn.completed {
  background-color:${({ theme }) => theme.colors.secondary}; /* green for completed */
  color: #fff;
}
&.step_rounded_btn.active {
  background-color:${({ theme }) => theme.colors.primary}; /* blue for active step */
  color: #fff;
}
`;

export const TutorModeShowButton = styled.div<{ $mode?: 'normal' | 'expanded' | string }>`
  display: ${({ $mode }) =>
    $mode === 'normal' ? 'none' :
      $mode === 'expanded' ? 'none' :
        'block'};
`;

// AI_chatbot_Style::End

export const LearningLeftBodyContent = styled.div`
  width: 100%;
  height: calc(100vh - 90px); // assuming topbar is 90px
  overflow-y: auto;

   @media (max-width: 991.5px) {
    height:100%;
  }
`;




// Learning_steps_style::Start
export const LearingStepsButtons = styled.div`
display:inline-flex;
gap:15px;
align-items: center;
position:relative;
white-space:nowrap;
width:fit-content;

  &::after {
  content:"";
  background:white;
  height:5px;
  width:100%;
  position:absolute;
  z-index:-2;

  }

`;
export const LearningContentMain = styled.div`
padding:15px;
`;
export const LearingViewStepaCard = styled.div`
display: flex;
flex-direction: column; 
height: calc(100vh - 156px);
`;
export const LearningBodyContent = styled.div`
padding:15px 0px;
background:white;
border-radius:15px;
margin:15px 0px;
border:1px solid #e0e0e0;
padding:15px;
flex: 1; 

  video 
  {
  height: calc(100vh - 330px);
  width: 100%;
  max-width: 100%;
  object-fit: cover;
  border-radius:10px;
  }

`;

export const LearingFooter = styled.div`
display:flex;
justify-content:end;
gap:10px;
padding:0px 0px 15px 0px;

  @media (max-width: 576px) {
    flex-wrap:wrap;
    justify-content:start;
  }


`;

export const AiTutorwrapperSM = styled.div`
  display: none;

  @media (max-width: 991.5px) {
    display: flex;
    position: fixed;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    gap: 10px;
    z-index: 5;
    justify-content: center;
    background-color:white;
    border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
    padding:10px;
  }

  .rounded_icon_btn
  {
    background-color: ${({ theme }) => theme.colors.primary};
    padding:5px 15px;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

`;


export const AiTutorButton = styled.button`
    background-color: #7B19D8;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border-radius: 50%;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer !important;

    svg 
    {
    font-size:24px;
    }
`;


// Learning_steps_style::Start


// Learning_steps_style::End

