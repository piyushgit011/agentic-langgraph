import { useState } from 'react';
// import { useTheme } from 'styled-components';
import { Grid } from '@mui/material';
import { MdOndemandVideo } from "react-icons/md";
import Star from '../../../../assets/images/star.svg';

import { BsTextParagraph } from "react-icons/bs";
import {
  CreateCardBody,
  CreateCardFooter,
  CreateCardHeader,
  CreateFormWrapper,
  CreateMainCard,
  IconTitle,
} from '../../CreateFormstyles';
import { Button, Input, Paragraph, Textarea } from '../../../common/Elements';


export default function EditClassForm() {

  const [setclass, setSelectedClass] = useState<string>('Class4');

  return (
    <CreateFormWrapper >
      <form>
        <CreateMainCard className='full_create_form'>
          <CreateCardHeader>
            <IconTitle>
              <Paragraph>
                <img src={Star} alt="Star" />
                Edit class details
              </Paragraph>
            </IconTitle>
          </CreateCardHeader>
          <CreateCardBody>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Input
                  name="tool"
                  type="text"
                  label="Class name"
                  placeholder="Class name"
                  margin="0 0 8px 0"
                  icon={<MdOndemandVideo />}
                  value={setclass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Textarea
                  icon={<BsTextParagraph />}
                  label='Class description'
                  placeholder="Class description"
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
} 
