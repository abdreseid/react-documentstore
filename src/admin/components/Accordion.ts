import styled from 'styled-components';

export const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
  
`;

export const Container = styled.div`
  position: absolute;
  box-shadow: 2px 10px 35px 1px rgba(153, 153, 153, 0.3);
`;

export const Wrap = styled.div`
  background: #272727;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: center;
  cursor: pointer;
  margin-top: 0.5rem;
  h1 {
    padding: 2rem;
    font-size: 2rem;
  }
  span {
    margin-right: 1.5rem;
  }
`;

export const Dropdown = styled.div`
  
  color: #00ffb9;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #00ffb9;
  border-top: 1px solid #00ffb9;
  p {
    font-size: 2rem;
  }
`;