import styled from "styled-components";

const Spinner = styled.div`
  border: 5px solid #f3f3f3;
  border-top: 5px solid #000;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function LoadingPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <Spinner />
    </div>
  );
}
