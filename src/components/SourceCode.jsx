// @flow
import React, { PureComponent } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monoBlue } from 'react-syntax-highlighter/styles/hljs';

type SourceCodeState = {
    file: string
};

const highlighterStyles = {
    fontFamily: 'monospace',
    maxHeight: '471px',
    overflow: 'auto'
};

class SourceCode extends PureComponent<any, SourceCodeState> {
    state = {
        file: ''
    };

    componentDidMount() {
        fetch('/misc/traders.txt')
            .then(response => response.text())
            .then(file => this.setState({ file }))
    }

    render() {
        const { file } = this.state;

        if (!file) {
            return null;
        }

        return (
            <SyntaxHighlighter showLineNumbers customStyle={highlighterStyles} language="javascript" style={monoBlue}>
                {file}
            </SyntaxHighlighter>
        )
    }

}

export default SourceCode;