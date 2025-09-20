import React, { useState, useMemo, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { PerosonalInfoWrapper } from './StudentPersonalInformation';
import { FormTitleContent } from '../../../LoginForm/LoginFormStyles';
import { Grid } from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { RiGovernmentLine } from "react-icons/ri";
import { MdOutlineMyLocation, MdOutlinePinDrop } from "react-icons/md";
import { IoEarthOutline } from "react-icons/io5";
import { PiCityDuotone } from "react-icons/pi";
import { Select, Input, Textarea, DatePicker, Label,RadioButton} from '../../../../Elements';
import { Heading, Paragraph } from '../../../../Elements/Typography/Typography';


interface PersonalInformationData {
    dob?: string;
    age?: string;
    gender?: string;
    country?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    address1?: string;
    address2?: string;
}

interface PersonalInformationProps {
    onDataChange: (data: PersonalInformationData) => void;
    initialData?: PersonalInformationData;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ onDataChange, initialData = {} }) => {
    const [selectedCountry, setSelectedCountry] = useState<string>(initialData.country || '');
    const [selectedState, setSelectedState] = useState<string>(initialData.state || '');
    const [selectedCity, setSelectedCity] = useState<string>(initialData.city || '');
    const [selectedAge, setSelectedAge] = useState<string>(initialData.age || '');
    const [gender, setGender] = useState<string>(initialData.gender || 'boy');
    const [zipCode, setZipCode] = useState<string>(initialData.zipCode || '');
    const [address1, setAddress1] = useState<string>(initialData.address1 || '');
    const [address2, setAddress2] = useState<string>(initialData.address2 || '');

    const countries = useMemo(() => Country.getAllCountries(), []);
    const states = useMemo(() => State.getStatesOfCountry(selectedCountry), [selectedCountry]);
    const cities = useMemo(() => City.getCitiesOfState(selectedCountry, selectedState), [selectedCountry, selectedState]);
    const ages = Array.from({ length: 8 }, (_, i) => 9 + i);
    const genderOptions = ['Boy', 'Girl'];

    // 🔁 Sync data to parent form
    useEffect(() => {
        onDataChange({
            age: selectedAge,
            gender,
            country: selectedCountry,
            state: selectedState,
            city: selectedCity,
            zipCode,
            address1,
            address2,
        });
    }, [selectedAge, gender, selectedCountry, selectedState, selectedCity, zipCode, address1, address2, onDataChange]);

    return (
        <>
            {/* Form_title_content::Start */}
            <FormTitleContent>
             <Heading as="h2" variant="h5" weight="semibold">
                    Please fill up your personal information
                </Heading>
                <Paragraph variant="p">
                    Partner with us to create intelligent, impactful, and future-ready AI solutions together.
                </Paragraph>


            </FormTitleContent>
            {/* Form_title_content::End */}
            <PerosonalInfoWrapper>
                <Grid container spacing={2}>

                    {/* Date of Birth */}
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <DatePicker
                            value={null}
                            onChange={() => { }}
                            placeholder="Date of Birth"
                        />
                    </Grid>

                    {/* Age */}
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Select
                            id="age"
                            icon={<ChildCareIcon />}
                            value={selectedAge}
                            onChange={(e) => setSelectedAge(e.target.value)}
                            options={ages.map((age) => ({
                                value: age,
                                label: `${age} Years`,
                            }))}
                            placeholder="Select Age"
                        />
                    </Grid>

                    {/* Country */}
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Select
                            id="country"
                            icon={<IoEarthOutline />}
                            value={selectedCountry}
                            onChange={(e) => {
                                setSelectedCountry(e.target.value);
                                setSelectedState('');
                                setSelectedCity('');
                            }}
                            options={countries.map((country) => ({
                                value: country.isoCode,
                                label: country.name,
                            }))}
                            placeholder="Select Country"
                        />
                    </Grid>

                    {/* State */}
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Select
                            id="state"
                            icon={<RiGovernmentLine />}
                            value={selectedState}
                            onChange={(e) => {
                                setSelectedState(e.target.value);
                                setSelectedCity('');
                            }}
                            options={states.map((state) => ({
                                value: state.isoCode,
                                label: state.name,
                            }))}
                            placeholder="Select State"
                            disabled={!selectedCountry}
                        />
                    </Grid>

                    {/* City */}
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Select
                            id="city"
                            icon={<PiCityDuotone />}
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            options={cities.map((city) => ({
                                value: city.name,
                                label: city.name,
                            }))}
                            placeholder="Select City"
                            disabled={!selectedState}
                        />
                    </Grid>

                    {/* Zip Code */}
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Input
                            name="zipCode"
                            type="text"
                            placeholder="Zip Code"
                            icon={<MdOutlinePinDrop />}
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </Grid>

                    {/* Gender */}
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Label label="Gender" />
                        <RadioButton
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            options={genderOptions}
                        />
                    </Grid>

                    {/* Address Line 1 */}
                    <Grid size={{ xs: 12 }}>
                        <Textarea
                            name="address1"
                            placeholder="Address Line 1"
                            icon={<MdOutlineMyLocation />}
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            rows={2}
                            noMargin
                        />
                    </Grid>

                    {/* Address Line 2 */}
                    <Grid size={{ xs: 12 }}>
                        <Textarea
                            name="address2"
                            placeholder="Address Line 2 (Optional)"
                            icon={<MdOutlineMyLocation />}
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            rows={2}
                            noMargin
                        />
                    </Grid>

                </Grid>
            </PerosonalInfoWrapper>
        </>
    );
};

export default PersonalInformation;
