
import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';

export const UrlEncoder: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');

    const handleConvert = useCallback(() => {
        if (!input) {
            setOutput('');
            return;
        }
        try {
            if (mode === 'encode') {
                setOutput(encodeURIComponent(input));
            } else {
                setOutput(decodeURIComponent(input));
            }
        } catch (e) {
            setOutput('Invalid input for decoding.');
        }
    }, [input, mode]);

    return (
        <ToolContainer title="URL Encoder/Decoder" description="Encode or decode strings for use in URLs.">
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input type="radio" name="mode" value="encode" checked={mode === 'encode'} onChange={() => setMode('encode')} className="form-radio text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2">Encode</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="mode" value="decode" checked={mode === 'decode'} onChange={() => setMode('decode')} className="form-radio text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2">Decode</span>
                    </label>
                </div>

                <div>
                    <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input</label>
                    <textarea
                        id="url-input"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            // Live conversion
                            if (!e.target.value) {
                                setOutput('');
                                return;
                            }
                            try {
                                if (mode === 'encode') {
                                    setOutput(encodeURIComponent(e.target.value));
                                } else {
                                    setOutput(decodeURIComponent(e.target.value));
                                }
                            } catch (err) {
                                setOutput('Invalid input for decoding.');
                            }
                        }}
                        placeholder="Enter URL or text..."
                        className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                    />
                </div>
                
                <div className="relative">
                    <label htmlFor="url-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output</label>
                    <textarea
                        id="url-output"
                        value={output}
                        readOnly
                        placeholder="Result will appear here..."
                        className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                    />
                    {output && <CopyButton textToCopy={output} />}
                </div>
            </div>
        </ToolContainer>
    );
};
