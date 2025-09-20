import React, { useState } from 'react';
import StudentSignupForm from "./StudentAuth/StudentSignupForm";
import RoleSelectionStep from './RoleSelectionStep';
import StudentPersonalDataForm from './StudentAuth/StudentPersonalDataForm';

interface UserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    [key: string]: any;
}

const SignupForm: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [step, setStep] = useState<number>(1);

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRole) {
            setStep(2);
        } else {
            setStep(1);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSignupComplete = (data: UserData) => {
        setUserData(data);
        setStep(3); // Go to next step
    };

    return (
        <>
            {/* Role_selection_component::Start */}
            {step === 1 && (
                <RoleSelectionStep
                    selectedRole={selectedRole}
                    onSelectRole={setSelectedRole}
                    onContinue={handleContinue}
                />
            )}
            {/* Role_selection_component::End */}

            {/* Student_Signup_Form::Start */}
            {step === 2 && selectedRole === 1 && (
                <StudentSignupForm
                    onBack={handleBack}
                    onSignupComplete={handleSignupComplete}
                />
            )}
            {/* Student_Signup_Form::End */}

            {/* Student_Personal_information_progress_Form_component::Start */}
            {step === 3 && selectedRole === 1 && (
                <StudentPersonalDataForm
                    onBack={handleBack}
                    userData={userData}
                    role={selectedRole}
                />
            )}
            {/* Student_Personal_information_progress_Form_component::End */}
        </>
    );
};

export default SignupForm;
