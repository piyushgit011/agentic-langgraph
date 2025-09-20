import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Box, Divider, Grid } from '@mui/material';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FiLock } from "react-icons/fi";
import {
    FormTitleContent,
    EndButton,
    FormMainWrapper,
    SignupLink,
} from './LoginFormStyles';
import {
    Button,
    Input,
    Checkbox,
    Social,
} from '../../Elements';
import GoogleSvg from '../../../../assets/images/google.svg';
import AppleSvg from '../../../../assets/images/apple.svg';
import GmailSvg from '../../../../assets/images/gmail.svg';
import { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { Heading, Paragraph } from '../../Elements';
import { StyledLink } from '../../Elements';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();

    const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<FormErrors>({
        email: '',
        password: '',
    });

    const [checked, setChecked] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
        if (error) dispatch(clearError());
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);

        const validationErrors: FormErrors = {
            email: '',
            password: ''
        };

        if (!formData.email.trim()) {
            validationErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            validationErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password.trim()) {
            validationErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(validationErrors);

        // Check if there are validation errors
        const hasErrors = Object.values(validationErrors).some(error => error !== '');
        if (hasErrors) {
            console.log('Validation errors found:', validationErrors);
            return;
        }

        console.log('Dispatching loginUser action with credentials:', formData);
        dispatch(loginUser(formData));
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            console.log('User authenticated:', user);

            // Redirect based on user role
            switch (user.role) {
                case 'Student':
                    navigate("/student/dashboard");
                    break;
                case 'Teacher':
                    navigate("/teacher/dashboard");
                    break;
                case 'Admin':
                    navigate("/admin/dashboard");
                    break;
                case 'SuperAdmin':
                    navigate("/superadmin/dashboard");
                    break;
                case 'Parent':
                    navigate("/parent/dashboard");
                    break;
                default:
                    navigate("/home");
                    break;
            }
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <FormMainWrapper>
                    <div>
                        {/* Form_title_content::Start */}
                        <FormTitleContent>
                            <Heading as="h2" variant="h5" weight="semibold">
                                Login to your Reasonify account
                            </Heading>
                            <Paragraph>
                                Partner with us to create intelligent, impactful, and future-ready AI solutions together.
                            </Paragraph>
                        </FormTitleContent>
                        {/* Form_title_content::End */}

                        {/* Student_login_form::Start */}

                        <Grid container spacing={2}>
                            {/* Email_Address::Start */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    icon={<MdOutlineAlternateEmail />}
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    errorText={errors.email}
                                />

                            </Grid>
                            {/* Email_Address::End */}


                            {/* Password::Start */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    icon={<FiLock />}
                                    showToggle={true}
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    errorText={errors.password}
                                />
                            </Grid>
                            {/* Password::End */}
                        </Grid>
                        <div>



                        </div>
                        {/* Student_login_form::End */}

                        {/* Checkbox_remember_me::Start */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                            <Checkbox
                                id="remember-me"
                                label={'Remember Me'}
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                            />

                            <StyledLink to="/forgot-password" color={theme.colors.primary} fontWeight={theme.fontWeights.semibold}>
                                Forgot password?
                            </StyledLink>
                        </Box>
                        {/* Checkbox_remember_me::End */}

                        {/* Social_media_login::Start */}
                        <Divider style={{ margin: "40px 0 20px 0" }}>Or</Divider>
                        <Social/>
                        {/* Social_media_login::End */}

                        {/* Sign_up_link::Start */}
                        <SignupLink>
                            <Paragraph variant="p">
                                Don't have an account?{' '}
                                <StyledLink to="/signup">
                                    Sign Up
                                </StyledLink>
                            </Paragraph>
                        </SignupLink>
                        {/* Sign_up_link::End */}
                    </div>

                    {/* Form_Actions::Start */}
                    <EndButton>
                        <Button
                            type="submit"
                            color="secondary"
                            disabled={loading}
                            label={loading ? 'Logging in...' : 'Login'}
                        />
                    </EndButton>
                    {/* Form_Actions::End */}
                </FormMainWrapper>
            </form>
        </div>
    );
};

export default LoginForm;
