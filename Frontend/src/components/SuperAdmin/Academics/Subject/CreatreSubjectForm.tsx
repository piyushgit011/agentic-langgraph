import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { FiBookOpen } from "react-icons/fi";
import Star from '../../../../assets/images/star.svg';

import { BsTextParagraph } from "react-icons/bs";
import {
    CreateCardBody,
    CreateCardFooter,
    CreateCardHeader,
    CreateFormWrapper,
    CreateMainCard,
    DarkButton,
    IconBox,
    IconTitle,
    InputWrapper,
    LightButton,
    StyledInput,
} from '../../CreateFormstyles';
import { Button, Input, Paragraph, Textarea } from '../../../common/Elements';


const CreatreSubjectForm: React.FC = () => {

    const [setSubject, setSelectedSubject] = useState<string>('');

    return (
        <CreateFormWrapper >
            <form>
                <CreateMainCard className='full_create_form'>
                    <CreateCardHeader>
                        <IconTitle>
                            <Paragraph>
                                <img src={Star} alt="Star" />
                                Create Subject
                            </Paragraph>
                        </IconTitle>
                    </CreateCardHeader>
                    <CreateCardBody>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <Input
                                    name="tool"
                                    type="text"
                                    label="Subject Name"
                                    placeholder="Subject Name"
                                    margin="0 0 8px 0"
                                    icon={<FiBookOpen />}
                                    value={setSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Textarea
                                    icon={<BsTextParagraph />}
                                    label='Subject description'
                                    placeholder="Subject description"
                                    rows={5}
                                />

                            </Grid>
                        </Grid>
                    </CreateCardBody>
                    <CreateCardFooter>
                        <div className='footer_buttons'>
                            <Button
                                textOnly={true}
                                label={'Cancel'}    
                                color='primary'
                            />
                            <Button
                                textOnly={true}
                                label={'Save'}
                                color='secondary'
                            />
                        </div>
                    </CreateCardFooter>
                </CreateMainCard>
            </form>
        </CreateFormWrapper>
    );
}

export default CreatreSubjectForm; 
