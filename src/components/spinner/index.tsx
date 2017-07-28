import styled, { keyframes } from 'styled-components';

const spinning = keyframes`
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
`;

export const Spinner = styled.div`
    position: relative;
    width: 25px;
    height: 25px;
    pointer-events: none;
    margin-left: auto;
    margin-right: auto;
    display: block;

    &:after {
        animation: ${spinning} 500ms infinite linear;
        border-radius: .8rem;
        content: "";
        display: block;
        height: 1.6rem;
        left: 50%;
        margin-left: -.8rem;
        margin-top: -.8rem;
        position: absolute;
        top: 50%;
        width: 1.6rem;
        z-index: 1;
        border: .2rem solid #333;
        border-right-color: transparent;
        border-top-color: transparent;
    }
`;
