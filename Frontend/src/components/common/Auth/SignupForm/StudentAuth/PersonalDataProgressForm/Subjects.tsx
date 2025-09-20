import React, { useState, useEffect } from 'react';
import { FormTitleContent } from '../../SignupFormStyles';
import { Grid } from '@mui/material';
import CustomCheckbox from '../../../../Elements/Checkbox/CustomCheckbox';
import { fetchData } from '../../../../../../utils/apiUtils';
import { getApiConfig } from '../../../../../../api';
import { Heading, Paragraph,} from '../../../../Elements/Typography/Typography';

interface Subject {
    subjectId: number;
    subjectName: string;
}

interface SubjectsState {
    [key: number]: boolean;
}

interface SubjectsData {
    subjects: number[];
}

interface SubjectsProps {
    initialData?: SubjectsState;
    onDataChange: (data: SubjectsData) => void;
    boardId: number | null;
    gradeId: number | null;
}

const Subjects: React.FC<SubjectsProps> = ({ initialData = {}, onDataChange, boardId, gradeId }) => {
    const [subjectList, setSubjectList] = useState<Subject[]>([]);
    const [subjects, setSubjects] = useState<SubjectsState>({});

    useEffect(() => {
        if (boardId && gradeId) {
            const apiConfig = getApiConfig('subjectByBoardGrade');
            const url = `${apiConfig.url}?boardId=${boardId}&gradeId=${gradeId}`;

            fetchData(url, apiConfig.method)
                .then(result => {
                    if (result?.success && Array.isArray(result?.data)) {
                        setSubjectList(result.data);

                        // Initialize checkboxes based on available subjects and initialData
                        const initialSubjectState = result.data.reduce<SubjectsState>((acc, subject) => ({
                            ...acc,
                            [subject.subjectId]: initialData?.[subject.subjectId] || false
                        }), {});
                        setSubjects(initialSubjectState);
                    }
                })
                .catch(err => {
                    console.error("❌ Failed to fetch subjects:", err);
                });
        }
    }, [boardId, gradeId, initialData]);

    const handleCheckboxChange = (id: number) => {
        const updated = { ...subjects, [id]: !subjects[id] };
        setSubjects(updated);
    };

    useEffect(() => {
        const selectedSubjects = Object.entries(subjects)
            .filter(([_, checked]) => checked)
            .map(([id]) => parseInt(id));
        onDataChange({ subjects: selectedSubjects });
    }, [subjects, onDataChange]);

    return (
        <div>
            {/* Form_title_content::Start */}
            <div>
                <FormTitleContent>
                    <Heading as="h2" variant="h4">
                        Select your subjects
                    </Heading>
                    <Paragraph variant="p">
                        With your AI Teacher, every lesson is tailored just for you. Log in to explore, learn, and grow at your own pace
                    </Paragraph>
                </FormTitleContent>
            </div>
            {/* Form_title_content::End */}

            {/* All_Mediums_Content::Start */}
            <div>
                <Grid container spacing={3}>
                    {subjectList.map(({ subjectId, subjectName }) => (
                        <Grid size={12} key={subjectId}>
                            <CustomCheckbox
                                id={subjectId.toString()}
                                label={subjectName}
                                checked={subjects[subjectId] || false}
                                onChange={() => handleCheckboxChange(subjectId)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
            {/* All_Mediums_Content::End */}
        </div>
    );
};

export default Subjects;
