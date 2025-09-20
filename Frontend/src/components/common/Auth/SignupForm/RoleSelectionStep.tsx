import React from 'react';
import { RoleCard, RoleLabel, RoleCardWrapper, } from "./SignupFormStyles";
import StudentImg from '../../../../assets/images/student.svg';
import TeacherImg from '../../../../assets/images/teacher.svg';
import ParentImg from '../../../../assets/images/parent.svg';
import AdminImg from '../../../../assets/images/admin.svg';
import { FormMainWrapper, FormTitleContent, EndButton } from "../LoginForm/LoginFormStyles";
import { Button } from "../../Elements";
import { Heading, Paragraph } from '../../Elements/Typography/Typography';
import { useNavigate } from 'react-router-dom';

interface Role {
    id: number;
    label: string;
    image: string;
}

interface RoleSelectionStepProps {
    selectedRole: number | null;
    onSelectRole: (roleId: number) => void;
    onContinue: (e: React.FormEvent) => void;
}

const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({ selectedRole, onSelectRole, onContinue }) => {
    const navigate = useNavigate();
    const roles: Role[] = [
        { id: 1, label: 'Student', image: StudentImg },
        { id: 2, label: 'Teacher', image: TeacherImg },
        { id: 3, label: 'Parent', image: ParentImg },
        { id: 4, label: 'Admin', image: AdminImg },
    ];

    return (
        <div>
            <form action="">
                <FormMainWrapper>
                    <div>
                        {/* Back_Link::Start */}
                        <Button

                            type="button"
                            color="secondary"
                            direction='right'
                            className='back-button'
                            onClick={() => navigate('/')}
                            label={'Back'}

                        />

                        {/* Back_Link::End */}

                        {/* Form_title_content::Start */}
                        <FormTitleContent>
                            <Heading as="h2" variant="h5" weight="semibold">
                                Please select your role
                            </Heading>
                            <Paragraph variant="p">
                                Partner with us to create intelligent, impactful, and future-ready AI solutions together.
                            </Paragraph>
                        </FormTitleContent>
                        {/* Form_title_content::End */}

                        {/* RoleForm::Start */}
                        <RoleCardWrapper>
                            {roles.map((role) => (
                                <RoleCard
                                    key={role.id}
                                    onClick={() => onSelectRole(role.id)}
                                    $active={selectedRole === role.id}
                                >
                                    <img src={role.image} alt={role.label} />
                                    <RoleLabel>{role.label}</RoleLabel>
                                </RoleCard>
                            ))}
                        </RoleCardWrapper>
                        {/* RoleForm::End */}
                    </div>

                    <div>
                        {/* Form_Actions::Start */}
                        <EndButton>
                            <Button
                                type="submit"
                                color="secondary"
                                onClick={onContinue}
                                label='Continue'
                            />
                        </EndButton>
                        {/* Form_Actions::End */}
                    </div>
                </FormMainWrapper>
            </form>
        </div>
    );
};

export default RoleSelectionStep;
