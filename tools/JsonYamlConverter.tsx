
import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';

declare const jsyaml: any;

export const JsonYamlConverter: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');
    const [error, setError] = useState('');

    const handleConvert = useCallback(() => {
        setError('');
        setOutput('');
        if (!input) return;

        try {
            if (mode === 'json-to-yaml') {
                const jsonObj = JSON.parse(input);
                setOutput(jsyaml.dump(jsonObj));
            } else {
                const yamlObj = jsyaml.load(input);
                setOutput(JSON.stringify(yamlObj, null, 2));
            }
        } catch (e: any) {
            setError(`Conversion failed: ${e.message}`);
        }
    }, [input, mode]);
    
    const switchMode = () => {
        setMode(prev => prev === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml');
        setInput(output);
        setOutput(input);
        setError('');
    }

    return (
        <ToolContainer title="JSON <> YAML Converter" description="Convert data between JSON and YAML formats seamlessly.">
            <div className="space-y-4">
                <div className="flex items-center justify-center">
                    <span className="font-semibold">{mode === 'json-to-yaml' ? 'JSON' : 'YAML'}</span>
                    <button onClick={switchMode} className="p-2 mx-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Switch conversion direction">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </button>
                    <span className="font-semibold">{mode === 'json-to-yaml' ? 'YAML' : 'JSON'}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <label htmlFor="json-yaml-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Input ({mode === 'json-to-yaml' ? 'JSON' : 'YAML'})
                        </label>
                        <textarea
                            id="json-yaml-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Enter ${mode === 'json-to-yaml' ? 'JSON' : 'YAML'} here...`}
                            className="w-full h-72 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                            spellCheck="false"
                        />
                    </div>
                     <div className="relative">
                        <label htmlFor="json-yaml-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                           Output ({mode === 'json-to-yaml' ? 'YAML' : 'JSON'})
                        </label>
                        <textarea
                            id="json-yaml-output"
                            value={output}
                            readOnly
                            placeholder="Result will appear here..."
                            className="w-full h-72 p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                            spellCheck="false"
                        />
                        {output && <CopyButton textToCopy={output} />}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex items-center">
                     <button
                        onClick={handleConvert}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Convert
                    </button>
                </div>
            </div>
        </ToolContainer>
    );
};
