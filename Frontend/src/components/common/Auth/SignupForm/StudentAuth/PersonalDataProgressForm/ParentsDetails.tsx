import React, { useEffect, useState } from 'react';
import { FormTitleContent } from '../../SignupFormStyles';
import { Grid } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { PhoneNumber,Input} from '../../../../Elements';
import { Heading, Paragraph } from '../../../../Elements/Typography/Typography';

interface ParentsDetailsData {
    fatherName?: string;
    fatherPhone?: string;
    motherName?: string;
    motherPhone?: string;
}

interface ParentsDetailsProps {
    initialData?: ParentsDetailsData;
    onDataChange: (data: ParentsDetailsData) => void;
}

const ParentsDetails: React.FC<ParentsDetailsProps> = ({ initialData = {}, onDataChange }) => {
    const [fatherName, setFatherName] = useState<string>(initialData.fatherName || '');
    const [fatherPhone, setFatherPhone] = useState<string>(initialData.fatherPhone || '');
    const [motherName, setMotherName] = useState<string>(initialData.motherName || '');
    const [motherPhone, setMotherPhone] = useState<string>(initialData.motherPhone || '');

    useEffect(() => {
        onDataChange({
            fatherName,
            fatherPhone,
            motherName,
            motherPhone,
        });
    }, [fatherName, fatherPhone, motherName, motherPhone, onDataChange]);

    return (
        <div>
            {/* Form_title_content::Start */}
            <div>
                <FormTitleContent>
                 <Heading as="h2" variant="h5" weight="semibold">
                        Add your parent's details
                    </Heading>
                    <Paragraph variant="p">
                        With your AI Teacher, every lesson is tailored just for you. Log in to explore, learn, and grow at your own pace.
                    </Paragraph>

                </FormTitleContent>
            </div>
            {/* Form_title_content::End */}

            {/* Parent_data_form::Start */}
            <Grid container spacing={2}>

                {/* FirstName::Start */}
                <Grid size={{ xs: 12 }}>
                    <Input
                        name="Father"
                        type="text"
                        placeholder="Father's Name"
                        icon={<PersonOutlineIcon />}
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                    />
                </Grid>
                {/* FirstName::End */}

                {/* PhoneNumber::Start */}
                <Grid size={{ xs: 12 }}>
                    <PhoneNumber
                        noMargin
                        value={fatherPhone}
                        onChange={(phone) => setFatherPhone(phone)}
                        placeholder="Father's Phone number"
                    />
                </Grid>
                {/* PhoneNumber::End */}

                {/*LastName::Start  */}
                <Grid size={{ xs: 12 }}>
                    <Input
                        name="Mother"
                        type="text"
                        placeholder="Mother's Name"
                        icon={<PersonOutlineIcon />}
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                    />
                </Grid>
                {/*LastName::End  */}

                {/* PhoneNumber::Start */}
                <Grid size={{ xs: 12 }}>
                    <PhoneNumber
                        noMargin
                        value={motherPhone}
                        onChange={(phone) => setMotherPhone(phone)}
                        placeholder="Mother's Phone number"
                    />
                </Grid>
                {/* PhoneNumber::End */}

            </Grid>
            {/* Parent_data_form::End */}
        </div>
    );
};

export default ParentsDetails;
