import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';

declare const CryptoJS: any;

const HASH_ALGORITHMS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];

export const HashGenerator: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [algorithm, setAlgorithm] = useState('SHA-256');

    const generateHash = useCallback((text: string) => {
        if (!text) {
            setOutput('');
            return;
        }
        
        const hashFunc = CryptoJS[algorithm];
        if (hashFunc) {
            setOutput(hashFunc(text).toString(CryptoJS.enc.Hex));
        }
    }, [algorithm]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const binaryStr = event.target?.result;
                if (binaryStr) {
                    const wordArray = CryptoJS.lib.WordArray.create(binaryStr);
                    const hashFunc = CryptoJS[algorithm];
                    if (hashFunc) {
                        const hash = hashFunc(wordArray).toString(CryptoJS.enc.Hex);
                        setOutput(hash);
                        setInput(`File: ${file.name} (${file.size} bytes)`);
                    }
                }
            };
            reader.onerror = () => setOutput('Error reading file.');
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <ToolContainer title="Hash Generator" description="Generate hash values for text or files using various algorithms.">
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                     <div>
                        <label htmlFor="hash-algo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Algorithm</label>
                        <select
                            id="hash-algo"
                            value={algorithm}
                            onChange={(e) => {
                                setAlgorithm(e.target.value);
                                generateHash(input); // Re-hash on algo change if there is input
                            }}
                            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        >
                            {HASH_ALGORITHMS.map(alg => <option key={alg} value={alg}>{alg}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="file-upload-hash" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 opacity-0">File</label>
                        <label htmlFor="file-upload-hash-btn" className="cursor-pointer px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
                           Hash a File
                        </label>
                         <input id="file-upload-hash-btn" type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>

                <div>
                    <label htmlFor="hash-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text Input</label>
                    <textarea
                        id="hash-input"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            generateHash(e.target.value);
                        }}
                        placeholder="Enter text to hash..."
                        className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                    />
                </div>
                
                <div className="relative">
                    <label htmlFor="hash-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Generated Hash</label>
                    <input
                        id="hash-output"
                        type="text"
                        value={output}
                        readOnly
                        placeholder="Result will appear here..."
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 font-mono text-gray-900 dark:text-white"
                    />
                    {output && <CopyButton textToCopy={output} />}
                </div>
            </div>
        </ToolContainer>
    );
};