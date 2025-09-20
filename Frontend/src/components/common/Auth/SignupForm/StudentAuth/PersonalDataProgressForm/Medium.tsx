import React, { useState, useEffect } from 'react';
import { FormTitleContent } from '../../SignupFormStyles';
import { Heading, Paragraph, } from '../../../../Elements/Typography/Typography';
import { GrayCard, SearchSelectWrappper, SearchWrapper, SuggestionList } from './StudentPersonalInformation';
import { Grid } from '@mui/material';
import Searchbar from '../../../../Elements/Searchbar/Searchbar';
import { fetchData } from '../../../../../../utils/apiUtils';
import { getApiConfig } from '../../../../../../api';

interface Language {
    id: number;
    name: string;
}

interface ApiLanguage {
    languageId: number;
    languageName: string;
}

interface MediumProps {
    initialData?: {
        languageId?: number | null;
    };
    onDataChange: (languageId: number) => void;
}

const Medium: React.FC<MediumProps> = ({ initialData = {}, onDataChange }) => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(initialData.languageId || null);
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Language[]>([]);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const apiConfig = getApiConfig('languages');
                const result = await fetchData(apiConfig.url, apiConfig.method);
                console.log("Languages API response:", result);

                const data = result.data as ApiLanguage[];
                if (Array.isArray(data)) {
                    const formatted: Language[] = data.map((lang) => ({
                        id: lang.languageId,
                        name: lang.languageName
                    }));
                    setLanguages(formatted);
                }
            } catch (error) {
                console.error("Error fetching languages:", error);
            }
        };

        fetchLanguages();
    }, []);

    useEffect(() => {
        if (onDataChange && selectedLanguageId) {
            onDataChange(selectedLanguageId); // ✅ return only languageId
        }
    }, [selectedLanguageId, onDataChange]);

    const handleLanguage = (lang: Language) => {
        setSelectedLanguageId(lang.id);
        setQuery(lang.name);
        setSuggestions([]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        const filtered = languages.filter((lang) =>
            lang.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
    };

    return (
        <div>
            {/* Form_title_content::Start */}
            <div>
                <FormTitleContent>
                    <Heading as="h2" variant="h5" weight="semibold">
                        Select your school medium
                    </Heading>
                    <Paragraph variant="p">
                        Partner with us to create intelligent, impactful, and future-ready AI solutions together.
                    </Paragraph>

                </FormTitleContent>
            </div>
            {/* Form_title_content::End */}

            {/* All_Mediums_Content::Start */}
            <div>
                <Grid container spacing={3}>
                    {languages.map((lang) => (
                        <Grid key={lang.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                            <GrayCard
                                onClick={() => handleLanguage(lang)}
                                $active={selectedLanguageId === lang.id}
                            >
                                <Paragraph variant="p">
                                    {lang.name}
                                </Paragraph>
                            </GrayCard>
                        </Grid>
                    ))}
                </Grid>
            </div>
            {/* All_Mediums_Content::End */}

            {/* All_medium_search_select::Start */}
            <SearchSelectWrappper>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <SearchWrapper>
                            <Searchbar
                                value={query}
                                onChange={handleChange}
                                placeholder="Find other medium" />
                            {query && suggestions.length > 0 && (
                                <SuggestionList>
                                    {suggestions.map((item) => (
                                        <li key={item.id} onClick={() => handleLanguage(item)}>
                                            {item.name}
                                        </li>
                                    ))}
                                </SuggestionList>
                            )}
                        </SearchWrapper>
                    </Grid>
                </Grid>
            </SearchSelectWrappper>
            {/* All_medium_search_select::End */}
        </div>
    );
};

export default Medium;
