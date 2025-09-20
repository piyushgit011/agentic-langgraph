import Card from '@mui/material/Card';
import styled from 'styled-components';

// Subject_Listing_page_style::Start
export const AllSubjectsWrapper = styled.div`
  .subjects_grid {
    display: flex;
  }
`;

export const SubjectCard = styled(Card)`
  background-color: white;
  border: 5px solid #DECDFF;
  border-radius: 30px !important;
  position: relative;
  box-shadow: unset !important;
  display: flex;

  img {
    width: 100%;
    height: 100%;
  }

  .subject_image {
    display: flex;
    justify-content: end;
    align-items: end;
    padding: 30px 0px 0px 0px;
  }
  
  .learnMore_subject {
    margin-top: 15px;
  }
  
  .subject_content {
    padding: 30px 0px 30px 30px;
  }
  
  .subject_image_grid {
    display: flex;
    justify-content: end;
    align-items: end;
  }

  @media (max-width: 991.5px) {
    .subject_content {
      padding: 15px;
    }
    .subject_image {
      padding: 0px;
    }
    .subject_image_grid {
      justify-content: center;
    }
    img {
      width: 80%;
      height: 80%;
    }
    .subject_image {
      justify-content: center;
    }
  }
`;
// Subject_Listing_page_style::End

// Single_subject_details_style::Start
export const PageWrapper = styled.div`
  display: flex;
  gap: 20px;
  height: calc(100vh - 165px);

  @media (max-width: 991.5px) {
    display: block;
  }
`;

export const LeftSidebar = styled.div`
  flex: 0 0 260px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: #fff;
  overflow-y: auto;

  .subject_title {
    padding: 10px 15px;
    border-bottom: 1px solid #e0e0e0;
  }

   .subject_title h3{
  display:flex;
  }

  @media (max-width: 991.5px) {
    height: 100%;
  }
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

export const StatIcon = styled.div`
  font-size: 20px;
  color: #666;
  display: flex;
  align-items: center;
  border-right: 1px solid #e0e0e0;
  padding: 10px 15px;

  svg {
    color: #00695C;
  }
`;

export const StatLabel = styled.span`
  flex: 1;
  font-weight: 500;
  color: #7B19D8;
`;

export const StatValue = styled.span`
  color: #7c3aed;
  font-weight: bold;
  padding: 8px 15px;
`;

export const ProgressBarWrapper = styled.div`
  margin: 14px 0;
`;

export const ProgressLabel = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
`;

export const ProgressBar = styled.div`
  background: #e5e5e5;
  border-radius: 10px;
  height: 8px;
`;

export const ProgressFill = styled.div<{ width: number; color: string }>`
  width: ${({ width }) => width}%;
  background: ${({ color }) => color};
  height: 100%;
  border-radius: 10px;
`;

export const RightContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;

  @media (max-width: 1024px) {
    height: 100%;
  }
`;

export const ChapterCard = styled.div`
  display: flex;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: #fff;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 12px;
  }

  @media (min-width: 481px) {
    gap: 16px;
  }
`;

export const ProgressCircle = styled.div`
  width: 80px;
  height: 80px;
`;

export const ChapterMainRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ChapterDataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const ChapterInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ChapterTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

export const ChapterTag = styled.span`
  background: #7e22ce;
  color: #fff;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 400;
`;

export const TopicCountBadge = styled.span`
  background: #73D673;
  color: #343A40;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
  font-weight: 600;
`;

export const TopicList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
  font-size: 14px;
  color: #555;

  li {
    margin: 2px 0;
    display: flex;
    align-items: center;

    svg {
      width: 12px;
      transform: rotate(90deg);
      margin-right: 6px;
    }
  }
`;

export const ShowToggle = styled.li`
  color: #7B19D8;
  cursor: pointer;
  font-weight: 500;
  padding-left: 5px;
`;

export const LetsStartButton = styled.div`
  display: flex;
  justify-content: end;
  align-items: end;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }

  button .icon-circle {
    width: 30px;
    height: 30px;
  }
`;

export const StartButton = styled.button`
  background: #00695c;
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  border: none;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #004d40;
  }
`;

export const CardTitleWrapper = styled.div`
  img {
    margin-right: 5px;
  }
`;

export const ChapterOverallProgress = styled.div`
  .progress_data {
    padding: 0px 15px;
  }

  .subject_title {
    border-bottom: 0;
    margin-top: 10px;
    padding: 10px 15px 5px;
  }
`;
// Single_subject_details_style::End

// Single_chapte_page_style::Start
export const ChapterItem = styled.div<{ active: boolean }>`
  padding: 8px 15px;
  border-bottom: 1px solid #e5e7eb;
  background-color: ${({ active }) => (active ? '#1e7d73' : '#fff')};
  color: ${({ active }) => (active ? 'white' : '#111827')};
  cursor: pointer;

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  span {
    font-size: 0.875rem;
    color: ${({ active }) => (active ? '#fffff' : '#4b5563')};
  }

  &:hover {
    background-color: ${({ active }) => (active ? '#1e7d73' : '#f9fafb')};
  }
`;
// Single_chapte_page_style::End

export const TopicCard = styled.div`
  background: #fff;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  margin-bottom: 1rem;
  padding: 12px;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h4`
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  span {
    color: #7c3aed;
  }
  
  img {
    margin-right: 5px;
  }
  
  .topic_name {
    margin-left: 5px;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PlayIcon = styled.div`
  background: #7c3aed;
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
`;

export const ExpandedContent = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const SubTopicList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  color: #374151;

  li {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
`;

export const ToggleButton = styled.button`
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const AnimatedContent = styled.div<{ isOpen: boolean }>`
  overflow: hidden;
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  transition: max-height 0.3s ease;
  display: flex;
  gap: 1rem;
  padding-top: ${({ isOpen }) => (isOpen ? '1rem' : '0')};
`;

export const CollapsibleWrapper = styled.div`
  overflow: hidden;
  transition: height 0.4s ease;
`;

export const CollapsibleInner = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  justify-content: space-between;
`;

export const ChapterInfoContainer = styled.div`
  gap: 1rem;
  margin-bottom: 10px;
  flex-wrap: wrap;
  
  .chapter_tag {
    display: inline-block;
    margin-bottom: 8px;
  }
`;

export const ChapterBox = styled.div`
  background: #fff;
  box-shadow: ${({ theme }: { theme: any }) => theme.shadow.shadowInput};
  border-radius: 20px;
  padding: 1rem 1.5rem;
  flex: 1;
  border: 1px solid #e0e0e0;
  min-width: 300px;
`;

export const Badge = styled.span`
  background-color: #7c3aed;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: inline-block;
  margin-bottom: 0.5rem;
`;

export const ActivitiesList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: #1f2937;

  svg {
    color: #7c3aed;
  }
`;

export const ActivityItem = styled.li`
  font-size: 0.9rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

export const Dot = styled.span<{ color?: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color || '#10b981'};
  display: inline-block;
`;

export const ActionIconsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  align-items: center;

  button {
    background: #f5f5f5;
    border: none;
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #e0e0e0;
    }

    svg {
      font-size: 16px;
      color: #333;
    }
  }
`; 
