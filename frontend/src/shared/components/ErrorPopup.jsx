import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import ErrorIcon from "./ErrorIcon";
import RedButton from "./RedButton1";

const initBox = keyframes`
  from {
    transform: scale(110%);
  }

  to {
    transform: scale(100%);
  }
`;

const initLayout = keyframes`
  from {
    background-color: rgba(0, 0, 0, 0.0);
  }

  to {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const Layout = styled.div`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${initLayout} 0.15s linear;
  z-index: 99999;
`;

export default function ErrorPopUp({ header, message, action }) {
  return (
    <Layout>
      <PopUp header={header} message={message} action={action} />
    </Layout>
  );
}

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  border-radius: 3px;
  padding: 2rem 2rem;
  min-width: 30rem;
  animation: ${initBox} 0.15s linear;
`;

const IconContainer = styled.div``;

const BodyContainer = styled.div`
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PopUp = ({ header, message, action }) => {
  const onCLickOk = (ev) => {
    ev.preventDefault();
    action();
  };

  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  });

  return (
    <Container>
      <IconContainer>
        <ErrorIcon />
      </IconContainer>
      <BodyContainer>
        <h4>{header}</h4>
        <p>{message}</p>
      </BodyContainer>
      <ButtonContainer>
        <RedButton onClick={(ev) => onCLickOk(ev)}>Ok</RedButton>
      </ButtonContainer>
    </Container>
  );
};
