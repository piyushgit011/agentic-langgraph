import React, { useState } from "react";
import { useTheme } from "styled-components";
import { EndButton, FormTitleContent } from "../SignupFormStyles";
import { FiLock } from "react-icons/fi";
import GoogleSvg from '../../../../../assets/images/google.svg';
import AppleSvg from '../../../../../assets/images/apple.svg';
import GmailSvg from '../../../../../assets/images/gmail.svg';
import { FormMainWrapper, SocialLink, SocialLoginWrapper } from "../../LoginForm/LoginFormStyles";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Divider, Grid } from '@mui/material';
import { Button, Input, PhoneNumber, Social } from "../../../Elements/index";
import 'react-phone-input-2/lib/material.css';
import { fetchData } from '../../../../../utils/apiUtils';
import { getApiConfig } from "../../../../../api";
import { Theme } from "../../../../../assets/styles/theme";
import { Heading, Paragraph } from "../../../Elements/Typography/Typography";

interface FormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
}

interface StudentSignupFormProps {
    onBack: () => void;
    onSignupComplete: (data: FormData & { role: number }) => void;
}

const StudentSignupForm: React.FC<StudentSignupFormProps> = ({ onBack, onSignupComplete }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<string>('');
    const theme = useTheme() as Theme;
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

        if (!passwordRegex.test(formData.password)) {
            setPasswordError("Password must be 8-16 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character.");
            return;
        } else {
            setPasswordError('');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Invalid email format.");
            return;
        }

        try {
            const apiConfig = getApiConfig('checkEmail');
            const result = await fetchData(apiConfig.url, apiConfig.method, { email: formData.email });

            if (!result.success || !result.data.isUnique) {
                alert(result.data?.message || "Email is already registered.");
                return;
            }
        } catch (err) {
            console.error("❌ Email check failed:", err);
            alert("Failed to verify email uniqueness. Please try again.");
            return;
        }

        const completeData = {
            ...formData,
            role: 1 // Student role
        };
        onSignupComplete(completeData); // Send all data to next page
    };

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <FormMainWrapper>
                        <div>
                            {/* Back_Link::Start */}
                            <Button

                                type="button"
                                color="secondary"
                                direction='right'
                                className='back-button'
                                onClick={onBack}
                                label={"Back"}
                            />

                            {/* Back_Link::End */}

                            {/* Form_title_content::Start */}
                            <FormTitleContent>
                                <Heading as="h2" variant="h5" weight="semibold">
                                    Create your account with Reasonify
                                </Heading>
                                <Paragraph variant="p">
                                    With your AI Teacher, every lesson is tailored just for you. Log in to explore, learn, and grow at your own pace
                                </Paragraph>
                            </FormTitleContent>
                            {/* Form_title_content::End */}

                            {/* Student_login_form::Start */}
                            <Grid container spacing={2}>
                                {/* FirstName::Start */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 6 }}>
                                    <Input
                                        name="firstName"
                                        type="text"
                                        placeholder="First Name"
                                        icon={<PersonOutlineIcon />}
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                {/* FirstName::End */}

                                {/*LastName::Start  */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 6 }}>
                                    <Input
                                        name="lastName"
                                        type="text"
                                        placeholder="Last Name"
                                        icon={<PersonOutlineIcon />}
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                {/*LastName::End  */}

                                {/* PhoneNumber::Start */}
                                <Grid size={{ xs: 12 }}>
                                    <PhoneNumber />
                                </Grid>
                                {/* PhoneNumber::End */}

                                {/* EmailAddress::Start */}
                                <Grid size={{ xs: 12 }}>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Enter email address"
                                        icon={<AlternateEmailIcon />}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                {/* EmailAddress::End */}

                                {/* CreatePassword::Start */}
                                <Grid size={{ xs: 12 }}>
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        icon={<FiLock />}
                                        showToggle={true}
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                {/* CreatePassword::End */}
                            </Grid>
                            {/* Student_login_form::End */}

                            {/* Social_media_login::Start */}
                            <Divider style={{ margin: "40px 0 20px 0" }}>Or</Divider>

                            <Social/>
                            {/* Social_media_login::End */}
                        </div>

                        {/* Form_Actions::Start */}
                        <EndButton>
                            <Button type="submit" color="secondary" label={'Submit'}/>
                        </EndButton>
                        {/* Form_Actions::End */}
                    </FormMainWrapper>
                </form>
            </div>
        </>
    );
};

export default StudentSignupForm;
