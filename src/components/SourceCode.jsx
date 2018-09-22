// @flow
import React, { PureComponent, Fragment } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monoBlue } from 'react-syntax-highlighter/styles/hljs';

type SourceCodeState = {
    file: string
};

const highlighterStyles = {
    fontFamily: 'monospace'
};

const imageStyles = {
    width: '100%'
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
            <Fragment>
                <p>Text on the top</p>
                <img style={imageStyles} src="/misc/sim_schema.png" alt="schema"/>
                <p>Text on the bottom</p>
                <SyntaxHighlighter showLineNumbers customStyle={highlighterStyles} language="javascript" style={monoBlue}>
                    {file}
                </SyntaxHighlighter>
            </Fragment>
        )
    }

}

export default SourceCode;