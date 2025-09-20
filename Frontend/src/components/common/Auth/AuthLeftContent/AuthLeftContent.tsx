import React, { useState } from 'react';
import { LogoHeader, LogoWrapper, AuthFormLayout, customStyles, LangSelectWrapper } from './AuthLeftContentStyles';
import ReasonifyLogo from "../../../../assets/images/reasonify-logo.svg";
import { Link, useLocation } from 'react-router-dom';
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";
import Select, { SingleValue } from 'react-select';
import ISO6391 from 'iso-639-1';
import { Grid } from '@mui/material';

interface LanguageOption {
    value: string;
    label: string;
}

const languageOptions: LanguageOption[] = ISO6391.getAllCodes().map(code => ({
    value: code,
    label: `${ISO6391.getNativeName(code)} (${ISO6391.getName(code)})`
}));

// Find English option as default
const defaultLanguage = languageOptions.find(lang => lang.value === 'en');

const AuthLeftContent: React.FC = () => {
    const location = useLocation();
    const [selectedLang, setSelectedLang] = useState<LanguageOption | null>(defaultLanguage || null);

    const handleChange = (selectedOption: SingleValue<LanguageOption>) => {
        setSelectedLang(selectedOption);
        console.log("Selected language:", selectedOption);
    };

    return (
        <>
            <LogoHeader>
                <Grid container spacing={{ xs: 1, lg: 3 }} style={{ width: "100%" }}>
                    {/* Logo */}
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <LogoWrapper>
                            <Link to="/">
                                <img src={ReasonifyLogo} alt="Logo" style={{ height: '40px' }} />
                            </Link>
                        </LogoWrapper>
                    </Grid>
                    {/* Language Select */}
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <LangSelectWrapper>
                            <Select<LanguageOption>
                                styles={customStyles}
                                className='lang_selector'
                                options={languageOptions}
                                value={selectedLang}
                                onChange={handleChange}
                                placeholder="Choose a language"
                                isSearchable
                            />
                        </LangSelectWrapper>
                    </Grid>
                </Grid>
            </LogoHeader>
            <AuthFormLayout>
                {location.pathname === '/signup' ? <SignupForm /> : <LoginForm />}
            </AuthFormLayout>
        </>
    );
};

export default AuthLeftContent;
