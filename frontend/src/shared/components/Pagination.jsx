import styled from "styled-components";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

const Button = styled.button`
  min-width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => (p.$active ? "#1d1d1f" : "white")};
  color: ${(p) => (p.$active ? "white" : "#1d1d1f")};
  border: 1px solid ${(p) => (p.$active ? "#1d1d1f" : "#e5e5e7")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(p) => (p.$active ? "#1d1d1f" : "#f5f5f7")};
    border-color: ${(p) => (p.$active ? "#1d1d1f" : "#d1d1d6")};
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const IconButton = styled(Button)`
  &:hover:not(:disabled) {
    background: #f5f5f7;
  }
`;

export default function Pagination({ currentPage, totalPage, setCurrentPage }) {
  const getPages = () => {
    const pages = [];

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPage, currentPage + 2);

    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPage, 5);
      } else if (endPage === totalPage) {
        startPage = Math.max(1, totalPage - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPages();

  if (totalPage === 0) return null;

  return (
    <Container>
      <IconButton
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(1)}
        aria-label="First page"
      >
        <MdKeyboardDoubleArrowLeft size={18} />
      </IconButton>

      {pages.map((p) => (
        <Button
          key={p}
          $active={p === currentPage}
          onClick={() => setCurrentPage(p)}
          aria-label={`Page ${p}`}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </Button>
      ))}

      <IconButton
        disabled={currentPage === totalPage}
        onClick={() => setCurrentPage(totalPage)}
        aria-label="Last page"
      >
        <MdKeyboardDoubleArrowRight size={18} />
      </IconButton>
    </Container>
  );
}
