import React, { useEffect, useState } from 'react';
import { ButtonRow, ProgressCircle, ProgressContainer } from "../SignupFormStyles";
import { EndButton, FormMainWrapper } from '../../LoginForm/LoginFormStyles';
import { Grid } from '@mui/material';
import { Button } from '../../../Elements';
import PersonalInformation from './PersonalDataProgressForm/PersonalInformation';
import Medium from './PersonalDataProgressForm/Medium';
import Board from './PersonalDataProgressForm/Board';
import Class from './PersonalDataProgressForm/Class';
import ParentsDetails from './PersonalDataProgressForm/ParentsDetails';
import Subjects from './PersonalDataProgressForm/Subjects';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../../../../utils/apiUtils';
import { getApiConfig } from '../../../../../api';

interface UserData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
}

interface PersonalInformationData {
    dob?: Date | { $d: Date };
    gender?: string;
    country?: string;
    state?: string;
    city?: string;
    zipCode?: string;
}

interface ParentsDetailsData {
    fatherName?: string;
    fatherPhone?: string;
    motherName?: string;
    motherPhone?: string;
}

interface SubjectsData {
    subjects?: number[];
}

interface FormData {
    personalInformation: PersonalInformationData;
    parentsDetails: ParentsDetailsData;
    languageId: number | null;
    boardId: number | null;
    gradeId: number | null;
    subjects: SubjectsData;
}

interface StudentPersonalDataFormProps {
    userData: UserData;
    role?: number;
    onBack: () => void;
}

const steps = [1, 2, 3, 4, 5, 6];

const StudentPersonalDataForm: React.FC<StudentPersonalDataFormProps> = ({ userData, role, onBack }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        personalInformation: {},
        parentsDetails: {},
        languageId: null,
        boardId: null,
        gradeId: null,
        subjects: { subjects: [] },
    });

    useEffect(() => {
        setCurrentStep(1);
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        const { personalInformation, parentsDetails, languageId, boardId, gradeId, subjects } = formData;

        const payload = {
            firstName: userData?.firstName?.trim() || '',
            lastName: userData?.lastName?.trim() || '',
            phoneNumber: userData?.phone?.replace(/\s+/g, '') || '',
            email: userData?.email?.trim() || '',
            password: userData?.password || '',
            birthDate: personalInformation?.dob
                ? (typeof personalInformation.dob === 'object' && 'toISOString' in personalInformation.dob
                    ? personalInformation.dob.toISOString()
                    : (personalInformation.dob as { $d: Date }).$d.toISOString())
                : new Date().toISOString(),
            gender: personalInformation?.gender?.toLowerCase() || '',
            photo: '',
            country: personalInformation?.country || '',
            state: personalInformation?.state || '',
            city: personalInformation?.city || '',
            zipcode: personalInformation?.zipCode || '',
            fathersName: parentsDetails?.fatherName?.trim() || '',
            fathersNumber: parentsDetails?.fatherPhone?.replace(/\s+/g, '') || '',
            mothersName: parentsDetails?.motherName?.trim() || '',
            mothersNumber: parentsDetails?.motherPhone?.replace(/\s+/g, '') || '',
            boardId: formData.boardId || 0,
            gradeId: formData.gradeId || 0,
            languageId: formData.languageId || 0,
            roleId: role || 2,
            createdBy: userData?.firstName?.trim() || 'admin',
            selectedSubjectIds: (subjects?.subjects) || [],
        };

        console.log('✅ Payload:', payload);

        const errors: string[] = [];
        if (!payload.firstName) errors.push('First name is required');
        if (!payload.lastName) errors.push('Last name is required');
        if (!payload.email) errors.push('Email is required');
        if (!payload.phoneNumber) errors.push('Phone number is required');
        if (!payload.password) errors.push('Password is required');
        if (!payload.fathersName) errors.push('Father\'s name is required');
        if (!payload.mothersName) errors.push('Mother\'s name is required');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10,}$/;

        if (payload.email && !emailRegex.test(payload.email)) {
            errors.push('Invalid email format');
        }
        if (payload.phoneNumber && !phoneRegex.test(payload.phoneNumber.replace(/\D/g, ''))) {
            errors.push('Invalid phone number format');
        }

        if (errors.length > 0) {
            alert(`Validation errors:\n${errors.join('\n')}`);
            return;
        }

        try {
            const apiConfig = getApiConfig('registration');
            const result = await fetchData(apiConfig.url, apiConfig.method, payload);

            console.log('✅ Registration success:', result);
            navigate('/login');
            alert('Registration successful!');
        } catch (err) {
            console.error('❌ Registration error:', err);
            alert('Something went wrong while registering');
        }
    };

    return (
        <div>
            <form>
                <FormMainWrapper>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={4} lg={8}>
                            <ProgressContainer>
                                {steps.map((num) => (
                                    <ProgressCircle key={num} $active={num <= currentStep}>
                                        {num}
                                    </ProgressCircle>
                                ))}
                            </ProgressContainer>
                        </Grid>
                    </Grid>

                    {currentStep === 1 && (
                        <PersonalInformation
                            initialData={formData.personalInformation}
                            onDataChange={(data) => setFormData(prev => ({ ...prev, personalInformation: data }))}
                        />
                    )}
                    {currentStep === 2 && (
                        <ParentsDetails
                            initialData={formData.parentsDetails}
                            onDataChange={(data) => setFormData(prev => ({ ...prev, parentsDetails: data }))}
                        />
                    )}
                    {currentStep === 3 && (
                        <Medium
                            initialData={{ languageId: formData.languageId }}
                            onDataChange={(id) => setFormData(prev => ({ ...prev, languageId: id }))}
                        />
                    )}
                    {currentStep === 4 && (
                        <Board
                            initialData={{ boardId: formData.boardId }}
                            onDataChange={(id) => setFormData(prev => ({ ...prev, boardId: id }))}
                        />
                    )}
                    {currentStep === 5 && (
                        <Class
                            initialData={{ gradeId: formData.gradeId }}
                            selectedBoardId={formData.boardId}
                            onDataChange={(id) => setFormData(prev => ({ ...prev, gradeId: id }))}
                        />
                    )}
                    {currentStep === 6 && (
                        <Subjects
                            initialData={formData.subjects}
                            boardId={formData.boardId}
                            gradeId={formData.gradeId}
                            onDataChange={(data) => setFormData(prev => ({ ...prev, subjects: data }))}
                        />
                    )}

                    <EndButton>
                        <ButtonRow>
                            {currentStep > 1 && (
                                <Button
                                    color="primary"
                                    direction="left"
                                    onClick={handleBack}
                                    label={'Previous'}
                                />

                            )}
                            {currentStep < steps.length && (
                                <Button
                                    color="secondary"
                                    onClick={handleNext}
                                    label={'Next'}
                                />
                            )}
                            {currentStep === steps.length && (
                                <Button
                                    color="secondary"
                                    onClick={handleSubmit}
                                    label={'Submit'}
                                />
                            )}
                    </ButtonRow>
                </EndButton>
            </FormMainWrapper>
        </form>
        </div >
    );
};

export default StudentPersonalDataForm;
