
import { SocialLoginWrapper, SocialLink } from './SocialMediaStyles';
import GoogleSvg from '../../../../assets/images/google.svg';
import AppleSvg from '../../../../assets/images/apple.svg';
import GmailSvg from '../../../../assets/images/gmail.svg';

type Props = {
  align?: 'flex-start' | 'center' | 'flex-end';
};

export default function SocialLogin({ align = 'center' }: Props) {
  return (
    <SocialLoginWrapper display="flex" justifyContent={align} mb={2}>
      <SocialLink to="/google">
        <img src={GoogleSvg} alt="Google" />
        Google
      </SocialLink>
      <SocialLink to="/apple">
        <img src={AppleSvg} alt="Apple" />
        Apple
      </SocialLink>
      <SocialLink to="/email">
        <img src={GmailSvg} alt="Email" />
        Email
      </SocialLink>
    </SocialLoginWrapper>
  );
}
