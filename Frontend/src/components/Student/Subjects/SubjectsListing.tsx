import React, { useState, useEffect } from 'react';
import { AllSubjectsWrapper, SubjectCard } from './SubjectsListingStyles';
import Grid from '@mui/material/Grid';
import {


    Button
} from '../../common/Elements';
import MathsImg from "../../../assets/images/maths.png";
import EnglishImg from "../../../assets/images/english.png";
import HindiImg from "../../../assets/images/hindi.png";
import ENSImg from "../../../assets/images/ens.png";
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { apiService } from '../../../services/apiService';
import { setSubjectData } from '../../../store/slices/studySlice';
import { useDispatch } from 'react-redux';
import { Heading,Paragraph } from '../../common/Elements/Typography/Typography';

interface Subject {
    label: string;
    content: string;
    image: string;
    subjectId: string;
}

interface SubjectImages {
    [key: string]: string;
}

interface SubjectContent {
    [key: string]: string;
}

const SubjectsListing: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();

    // State for subjects data
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subject images mapping
    const subjectImages: SubjectImages = {
        "Maths": MathsImg,
        "English": EnglishImg,
        "Hindi": HindiImg,
        "Gujarati": HindiImg, // Using Hindi image for Gujarati
        "Environmental Studies": ENSImg,
    };

    // Default content mapping
    const subjectContent: SubjectContent = {
        "Maths": 'We bring learning to life with engaging activities, real-world connections, and a focus on making every moment exciting.',
        "English": 'With your AI Teacher, every lesson is tailored just for you. Log in to explore, learn, and grow at your own pace.',
        "Hindi": 'We bring learning to life with engaging activities, real-world connections, and a focus on making every moment exciting.',
        "Gujarati": 'We bring learning to life with engaging activities, real-world connections, and a focus on making every moment exciting.',
        "Environmental Studies": 'With your AI Teacher, every lesson is tailored just for you. Log in to explore, learn, and grow at your own pace.',
    };

    // Fetch subjects data on component mount
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const result = await apiService.getStudentSelectedSubjects();

                if (result.success && result.data.selectedSubjects) {
                    // Map API data to component format
                    const mappedSubjects: Subject[] = result.data.selectedSubjects.map((subject: any) => ({
                        label: subject.subjectName,
                        content: subjectContent[subject.subjectName] || 'Explore and learn with personalized AI-powered lessons.',
                        image: subjectImages[subject.subjectName] || MathsImg, // Default to Maths image
                        subjectId: subject.subjectId
                    }));
                    setSubjects(mappedSubjects);

                    // Set the first subject as default in Redux if subjects exist
                    if (mappedSubjects.length > 0) {
                        const firstSubject = mappedSubjects[0];
                        dispatch(setSubjectData({
                            subjectId: firstSubject.subjectId,
                            subjectName: firstSubject.label
                        }));
                    }
                } else {
                    setError('Failed to fetch subjects');
                }
            } catch (err: any) {
                console.error('Error fetching subjects:', err);
                setError(err.message || 'Failed to load subjects');
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [dispatch]);

    if (loading) {
        return (
            <AllSubjectsWrapper>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Paragraph variant="p">Loading your subjects...</Paragraph>
                </div>
            </AllSubjectsWrapper>
        );
    }

    if (error) {
        return (
            <AllSubjectsWrapper>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Paragraph variant="p" style={{ color: 'red' }}>
                        Error: {error}
                    </Paragraph>
                </div>
            </AllSubjectsWrapper>
        );
    }

    const navigateToSubject = (subjectId: string, subjectName: string) => {
        console.log('navigateToSubject', subjectId, subjectName);
        dispatch(setSubjectData({ subjectId, subjectName }));
        navigate(`/subjects/${encodeURIComponent(subjectName)}`);
    };

    return (
        <AllSubjectsWrapper>
            <Grid container spacing={3}>
                {subjects.length > 0 ? (
                    subjects.map((sub, index) => (
                        <Grid key={sub.subjectId || index} size={{ xs: 12, sm: 6, md: 6, lg: 4 }} className="subjects_grid">
                            <SubjectCard>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 7 }}>
                                        <div className='subject_content'>
                                            <Heading as="h1" variant="h4" color={theme.colors.primary}>
                                                {sub.label}
                                            </Heading>
                                            <Paragraph variant="p">
                                                {sub.content}
                                            </Paragraph>
                                            <div className='learnMore_subject'>
                                                <Button
                                                    type="button"
                                                    color="secondary"
                                                    onClick={() => navigateToSubject(sub.subjectId, sub.label)}
                                                    label={'Learn More'}
                                                />
                                                   
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 5 }} className="subject_image_grid">
                                        <div className='subject_image'>
                                            <img src={sub.image} alt={sub.label} />
                                        </div>
                                    </Grid>
                                </Grid>
                            </SubjectCard>
                        </Grid>
                    ))
                ) : (
                    <Grid size={{ xs: 12 }}>
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Paragraph variant="p">
                                No subjects found. Please contact your administrator.
                            </Paragraph>
                        </div>
                    </Grid>
                )}
            </Grid>
        </AllSubjectsWrapper>
    );
};

export default SubjectsListing; 
