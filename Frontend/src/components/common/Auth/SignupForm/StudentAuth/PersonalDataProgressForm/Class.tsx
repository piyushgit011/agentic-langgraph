import React, { useState, useEffect } from 'react';
import { FormTitleContent } from '../../SignupFormStyles';
import { Heading, Paragraph } from '../../../../Elements';
import {
    GrayCard
} from './StudentPersonalInformation';
import { Grid } from '@mui/material';
import { fetchData } from '../../../../../../utils/apiUtils';
import { getApiConfig } from '../../../../../../api';

interface Grade {
    id: number;
    name: string;
}

interface ApiGrade {
    gradeId: number;
    gradeName: string;
}

interface ClassProps {
    initialData?: {
        gradeId?: number | null;
    };
    selectedBoardId: number | null;
    onDataChange: (gradeId: number) => void;
}

const Class: React.FC<ClassProps> = ({ initialData = {}, selectedBoardId, onDataChange }) => {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [selectedGradeId, setSelectedGradeId] = useState<number | null>(initialData.gradeId || null);

    // Fetch grades from API
    useEffect(() => {
        const fetchGrades = async () => {
            if (!selectedBoardId) {
                return;
            }

            try {
                const apiConfig = getApiConfig('gradeByBoard');
                const url = `${apiConfig.url}?boardId=${selectedBoardId}`;
                const result = await fetchData(url, apiConfig.method);

                console.log("Grades API response:", result);

                const gradeList = result.data as ApiGrade[];

                if (Array.isArray(gradeList)) {
                    const formattedGrades: Grade[] = gradeList.map(grade => ({
                        id: grade.gradeId,
                        name: grade.gradeName,
                    }));
                    setGrades(formattedGrades);
                } else {
                    console.error("Invalid grades format");
                }
            } catch (error) {
                console.error("Error fetching grades:", error);
            }
        };

        fetchGrades();
    }, [selectedBoardId]);

    // Update parent with selected gradeId (only ID returned)
    useEffect(() => {
        if (onDataChange && selectedGradeId) {
            onDataChange(selectedGradeId); // 👈 updated to return only ID
        }
    }, [selectedGradeId, onDataChange]);

    const handleClassSelect = (grade: Grade) => {
        setSelectedGradeId(grade.id);
    };

    return (
        <div>
            {/* Form Title */}
            <FormTitleContent>
                <Heading as="h2" variant="h5" weight="semibold">
                    Select your Class
                </Heading>
                <Paragraph variant="p">
                    Partner with us to create intelligent, impactful, and future-ready AI solutions together.
                </Paragraph>

            </FormTitleContent>

            {/* Class Cards */}
            <Grid container spacing={3}>
                {grades.length === 0 ? (
                    <p style={{ color: 'gray', paddingLeft: '1rem' }}>Loading classes...</p>
                ) : (
                    grades.map((grade) => (
                        <Grid key={grade.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                            <GrayCard
                                onClick={() => handleClassSelect(grade)}
                                $active={selectedGradeId === grade.id}
                            >
                                <Paragraph variant="p">
                                    {grade.name}
                                </Paragraph>
                            </GrayCard>
                        </Grid>
                    ))
                )}
            </Grid>
        </div>
    );
};

export default Class;
