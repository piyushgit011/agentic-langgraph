import styled from 'styled-components';


// Form_main_container::Start
export const FormMainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 150px);
    box-shadow: none;
    @media (max-width: 1024px) {
        height: 100%;
    }
`;
// Form_main_container::End


// Form_end_button::Start
export const EndButton = styled.div`
    display: flex;
    justify-content: end;
    margin-top: 20px;
    @media (max-width: 1024px) {
        margin-top: 60px;
    }
`;
// Form_end_button::End

// Form_title_css::Start
export const FormTitleContent = styled.div`
    margin-bottom: 30px;

    h2 
    {
     margin-bottom: 5px;
    }

`;
export const SignupLink = styled.div`
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;
// Form_title_css::End
