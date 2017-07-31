import * as React from 'react';
import styled from 'styled-components';

type Border = 'default' | 'none' | 'error';

export interface InputTextProps {
    value: string;
    className?: string;
    placeholder?: string;
    border?: Border;
    padding?: string;
    autofocus?: boolean;
    onChange(val: string): void;
    onKeyDown?(e: any): void;
}

const styles = {
    border: (props: InputTextProps): string => {
        switch (props.border) {
            case 'error':
                return '1px solid red';
            case 'none':
                return 'none';
            default:
                return '1px solid #ccc';
        }
    }
};

const Input = styled.input`
    width: 100%;
    height: 36px;
    padding: 8px 12px;
    border: ${styles.border};

    &:focus {
        outline: none;
    }
`;

export class InputText extends React.PureComponent<InputTextProps> {
    static defaultProps = {
        border: 'default'
    };

    render(): JSX.Element {
        const { value, onChange, onKeyDown, className, placeholder, padding, autofocus } = this.props;
        
        return (
            <Input
                type="text"
                className={className}
                placeholder={placeholder}
                value={value}
                padding={padding}
                autofocus={autofocus}
                onChange={(e: any) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
            />
        );
    }
}
