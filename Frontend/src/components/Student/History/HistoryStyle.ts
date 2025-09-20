import { Box } from "@mui/material";
import { styled } from "styled-components";

export const HistoryWrapper = styled(Box)`

`;

export const HistoryCard = styled.div`
  padding: 8px 10px;
  margin-bottom: 10px;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor};
  border-radius: 10px;
  background: ${({ theme }: { theme: any }) => theme.colors.white};
  gap: 20px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;

  .chapter_name {
    display: flex;
    gap: 5px;
  }

  
  .history_topic {
    margin-top: 10px;
  }
  .history_topic p 
  {
  display:flex;
  gap:3px;
  // font-size:${({ theme }: { theme: any }) => theme.fontSizes.sm}
  align-items: baseline;
  }
  .history_topic svg {
    position: relative;
    top: 2px;
  }

  @media (max-width: 767px) {
    flex-wrap: wrap;
    display: inline-block;
  }
  
  .history_topic {
    margin-bottom: 5px;
    margin-top: 5px;
  }
`;

export const FilterMain = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 767px) {
    flex-wrap: wrap;
  }
`;

export const HistoryData = styled.div`
  margin-top: 15px;
  
  .history_time_status {
    margin-bottom: 5px;
    display: block;
    color: ${({ theme }: { theme: any }) => theme.colors.dark};
    font-weight: ${({ theme }: { theme: any }) => theme.fontWeights.medium};
  }
`;

export const HistoryDataTime = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HistoryDate = styled.div`
  display: flex;
  align-items: flex-start;
  
  svg {
    margin-right: 5px;
    width: 18px;
    height: 18px;
    color: ${({ theme }: { theme: any }) => theme.colors.primary};
  }
  
  .tag_title {
    color: ${({ theme }: { theme: any }) => theme.colors.primary};
    font-weight: ${({ theme }: { theme: any }) => theme.fontWeights.medium};
    margin-right: 5px;
  }
`;

export const HistorySubject = styled.div`
  background: ${({ theme }: { theme: any }) => theme.colors.secondary};
  padding: 2px 8px;
  border-radius: 5px;
  color: ${({ theme }: { theme: any }) => theme.colors.white};
  font-weight: ${({ theme }: { theme: any }) => theme.fontWeights.medium};
  display: flex;
  align-items: center;
  position: absolute;
  right: 10px;
  top: 6px;
  font-size: ${({ theme }: { theme: any }) => theme.fontSizes.xs};
  white-space: nowrap;

  @media (max-width: 767px) {
    position: unset;
    display: inline-block;
    margin-bottom: 5px;
  }
`;

export const ChapterNumber = styled.div`
  background: ${({ theme }: { theme: any }) => theme.colors.primary};
  color: ${({ theme }: { theme: any }) => theme.colors.white};
  padding: 2px 10px;
  border-radius: 15px;
  font-size: ${({ theme }: { theme: any }) => theme.fontSizes.sm};
  display: inline-flex;
  align-items: center;
  height:20px;
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: ${({ theme }: { theme: any }) => theme.fontWeights?.regular || 500};
  font-size: ${({ theme }: { theme: any }) => theme.fontSizes?.xs || "12px"};
  display: inline-block;

  /* ✅ Background depends on status */
  background: ${({ status, theme }: { status: string; theme: any }) => {
    switch (status) {
      case "Completed":
        return theme.colors?.completedbg || "#e6f9ec";
      case "Pending":
        return theme.colors?.pendingbg || "#fff4e5";
      case "In Progress":
        return theme.colors?.inProcessbg || "#e3f2fd";
      case "Failed":
        return theme.colors?.failedbg || "#fdecea";
      default:
        return "#eee";
    }
  }};

  /* ✅ Text color depends on status */
  color: ${({ status, theme }: { status: string; theme: any }) => {
    switch (status) {
      case "Completed":
        return theme.colors?.completedText || "#2e7d32";
      case "Pending":
        return theme.colors?.pendingText || "#f57c00";
      case "In Progress":
        return theme.colors?.inProcessText || "#1565c0";
      case "Failed":
        return theme.colors?.failedText || "#c62828";
      default:
        return "#333";
    }
  }};
`;

export const SubjectBadge = styled.div`
  background: ${({ theme }: { theme: any }) => theme.colors.secondary};
  color: ${({ theme }: { theme: any }) => theme.colors.primary};
  font-size: ${({ theme }: { theme: any }) => theme.fontSizes.sm};
  border: 1px solid #e0e0e0;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: ${({ theme }: { theme: any }) => theme.fontWeights.medium};
  display: inline-flex;
  align-items: center;
`;

export const HistoryTitleMain = styled.div``;

export const HistoryTitleList = styled.div`
  display: flex;

  .chapter_title_number {
    color: ${({ theme }: { theme: any }) => theme.colors.primary || "#7B19D8"};
    margin-right: 5px;
  }
`;

export const HistoryTopicMain = styled.div`
  display: flex;

  .chapter_title_number {
    color: ${({ theme }: { theme: any }) => theme.colors.primary || "#7B19D8"};
    margin-right: 5px;
  }
`;

export const HistoryTopicList = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3px;

  svg {
    position: relative;
    top: 2px;
    margin-right: 5px;
  }
`;

export const HistoryDay = styled.div`
  margin-bottom: 10px;
`;

export const HistoryCardMain = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height:calc(100vh - 165px);
  justify-content: space-between;
`;

export const HistoryCardHeader = styled.div``;

export const HistoryCardBody = styled.div``;

export const HistoryCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Historypagination = styled.div`
  .MuiButtonBase-root {
    font-family: ${({ theme }: { theme: any }) => theme.fonts.primary};
    font-weight: ${({ theme }: { theme: any }) => theme.fontWeights.medium};
    color: ${({ theme }: { theme: any }) => theme.colors.dark};
  }
  
  .MuiButtonBase-root.Mui-selected {
    background-color: ${({ theme }: { theme: any }) => theme.colors.secondary};
    color: ${({ theme }: { theme: any }) => theme.colors.white};
  }
`;

export const HistoryDataRander = styled.div`
  margin-bottom: 8px;
`;

// View_chat_history_style::Start
export const ChatHistoryWrapper = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.white};
  border-radius: 20px;
  height: calc(100vh - 165px);
  display: flex;
  flex-direction: column;
`;

export const ChatHistoryHeader = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor};
`;

export const ChatHistoryBody = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #fff;
`;

export const ChatHistoryFooter = styled.div`
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  margin: 10px;
`;
// View_chat_history_style::End 
