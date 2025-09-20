import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Tooltip,
  Icon
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookIcon from '@mui/icons-material/Book';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BuildIcon from '@mui/icons-material/Build';
import { curriculumService, Unit, Topic } from '../services/curriculumService';

interface TopicSelectorProps {
  onTopicSelect: (topic: Topic) => void;
  selectedTopicNumber?: string;
  className?: string;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  onTopicSelect,
  selectedTopicNumber,
  className
}) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<number | null>(1); // Default to Unit 1 expanded

  useEffect(() => {
    loadCurriculumData();
  }, []);

  const loadCurriculumData = async () => {
    try {
      setLoading(true);
      setError(null);
      const curriculumData = await curriculumService.getAllCurriculum();
      setUnits(curriculumData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load curriculum');
    } finally {
      setLoading(false);
    }
  };

  const handleUnitToggle = (unitNumber: number) => {
    setExpandedUnit(expandedUnit === unitNumber ? null : unitNumber);
  };

  const handleTopicClick = (topic: Topic) => {
    onTopicSelect(topic);
  };

  const getTopicStatusColor = (topicNumber: string) => {
    if (selectedTopicNumber === topicNumber) {
      return 'primary';
    }
    return 'default';
  };

  const getTopicTools = (topicNumber: string) => {
    return curriculumService.getTopicTools(topicNumber);
  };

  const renderToolIcon = (tool: string) => {
    switch (tool) {
      case 'number_line':
        return <Icon>timeline</Icon>;
      case 'pattern_finder':
        return <Icon>pattern</Icon>;
      case 'sequence_builder':
        return <Icon>view_list</Icon>;
      case 'pattern_analyzer':
        return <Icon>analytics</Icon>;
      case 'visualization_tools':
        return <Icon>visibility</Icon>;
      case 'shape_builder':
        return <BuildIcon />;
      default:
        return <Icon>extension</Icon>;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading curriculum...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box className={className}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BookIcon sx={{ mr: 1 }} />
        Select a Topic to Teach
      </Typography>

      {units.map((unit) => (
        <Accordion
          key={unit.unit_number}
          expanded={expandedUnit === unit.unit_number}
          onChange={() => handleUnitToggle(unit.unit_number)}
          sx={{ mb: 2, boxShadow: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`unit-${unit.unit_number}-content`}
            id={`unit-${unit.unit_number}-header`}
            sx={{
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              '&:hover': { backgroundColor: 'primary.main' }
            }}
          >
            <Typography variant="h6" component="h3">
              Unit {unit.unit_number}: {unit.unit_title}
            </Typography>
            <Chip
              label={`${unit.topics.length} topics`}
              size="small"
              sx={{ ml: 'auto', mr: 2 }}
              color="secondary"
            />
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {unit.topics.map((topic) => (
                <Grid item xs={12} sm={6} md={4} key={topic.topic_number}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: selectedTopicNumber === topic.topic_number ? 2 : 1,
                      borderColor: selectedTopicNumber === topic.topic_number 
                        ? 'primary.main' 
                        : 'divider',
                      backgroundColor: selectedTopicNumber === topic.topic_number 
                        ? 'action.selected' 
                        : 'background.paper',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <CardActionArea onClick={() => handleTopicClick(topic)}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Chip
                            label={topic.topic_number}
                            color={getTopicStatusColor(topic.topic_number)}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                          {selectedTopicNumber === topic.topic_number && (
                            <PlayArrowIcon color="primary" sx={{ ml: 1 }} />
                          )}
                        </Box>
                        
                        <Typography variant="h6" component="h4" gutterBottom>
                          {topic.topic_title}
                        </Typography>
                        
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mb: 2
                          }}
                        >
                          {topic.content.paragraphs[1] || 'No preview available'}
                        </Typography>

                        {/* Interactive Tools */}
                        {getTopicTools(topic.topic_number).length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                              Interactive Tools:
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                              {getTopicTools(topic.topic_number).map((tool) => (
                                <Tooltip key={tool} title={tool.replace('_', ' ')}>
                                  <Chip
                                    icon={renderToolIcon(tool)}
                                    label={tool.replace('_', ' ')}
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                  />
                                </Tooltip>
                              ))}
                            </Box>
                          </Box>
                        )}

                        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            {topic.content.word_count} words • {topic.content.paragraph_count} sections
                          </Typography>
                          {curriculumService.hasInteractiveTools(topic.topic_number) && (
                            <Chip
                              icon={<BuildIcon />}
                              label="Interactive"
                              size="small"
                              color="success"
                              variant="filled"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      {units.length === 0 && !loading && (
        <Alert severity="info">
          No curriculum data available. Please ensure the backend service is running.
        </Alert>
      )}
    </Box>
  );
};

export default TopicSelector;