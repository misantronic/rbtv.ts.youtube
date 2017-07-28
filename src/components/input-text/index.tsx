import * as React from 'react';
import styled from 'styled-components';

interface InputTextProps {
    value: string;
    className?: string;
    placeholder?: string;
    onChange(val: string): void;
}

const Input = styled.input`
    padding: 8px 12px;
    width: 100%;
    font-size: 14px;

    &:focus {
        outline: none;
    }
`

export class InputText extends React.Component<InputTextProps> {
    render(): JSX.Element {
        const { value, onChange, className, placeholder } = this.props;

        return <Input type="text" className={className} placeholder={placeholder} value={value} onChange={(e: any) => onChange(e.target.value)} />;
    }
}
