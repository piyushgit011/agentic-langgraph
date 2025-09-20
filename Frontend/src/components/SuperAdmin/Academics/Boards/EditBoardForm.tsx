import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { FiBookOpen } from "react-icons/fi"
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

const EditBoardForm: React.FC = () => {
  const [board, setBoard] = useState<string>('');

  return (
    <CreateFormWrapper>
      <form>
        <CreateMainCard className='full_create_form'>
          <CreateCardHeader>
            <IconTitle>
              <Paragraph>
                <img src={Star} alt="Star" />
                Edit board details
              </Paragraph>
            </IconTitle>
          </CreateCardHeader>
          <CreateCardBody>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Input
                  name="tool"
                  type="text"
                  label="Board name"
                  placeholder="Board name"
                  margin="0 0 8px 0"
                  icon={<FiBookOpen />}
                  value={board}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoard(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Textarea
                  icon={<BsTextParagraph />}
                  label='Board description'
                  placeholder="Board description"
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
                label={'Update'}
                color='secondary'
              />
            </div>
          </CreateCardFooter>
        </CreateMainCard>
      </form>
    </CreateFormWrapper>
  );
};

export default EditBoardForm; 
