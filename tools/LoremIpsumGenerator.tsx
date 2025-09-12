import React, { useState, useCallback, useEffect } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';

// The library is loaded from a CDN and attaches itself to the window object.
declare global {
    interface Window {
        loremIpsum: (options: {
            count: number;
            units: 'paragraphs' | 'sentences' | 'words';
            format: 'plain' | 'html';
        }) => string;
    }
}

type Unit = 'paragraphs' | 'sentences' | 'words';

export const LoremIpsumGenerator: React.FC = () => {
    const [count, setCount] = useState(3);
    const [units, setUnits] = useState<Unit>('paragraphs');
    const [output, setOutput] = useState('Loading library...');

    const generateText = useCallback(() => {
        if (typeof window.loremIpsum !== 'function') {
            setOutput('Error: The lorem-ipsum library could not be loaded. Please refresh the page.');
            return;
        }

        try {
            const text = window.loremIpsum({
                count,
                units,
                format: 'plain'
            });
            setOutput(text);
        } catch (error) {
            setOutput('An error occurred while generating text.');
            console.error(error);
        }
    }, [count, units]);

    // Generate on load after ensuring the library is available
    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 50; // Try for 5 seconds (50 * 100ms)
        
        const checkAndGenerate = () => {
            if (typeof window.loremIpsum === 'function') {
                generateText();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkAndGenerate, 100);
            } else {
                setOutput('Error: The lorem-ipsum library could not be loaded. Please check your internet connection and refresh the page.');
            }
        };

        checkAndGenerate();
    }, [generateText]);

    return (
        <ToolContainer title="Lorem Ipsum Generator" description="Generate placeholder text for your designs and mockups.">
            <div className="space-y-4">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label htmlFor="li-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                        <input
                            id="li-count"
                            type="number"
                            value={count}
                            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            min="1"
                            className="w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="li-units" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Units</label>
                        <select
                            id="li-units"
                            value={units}
                            onChange={(e) => setUnits(e.target.value as Unit)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        >
                            <option value="paragraphs">Paragraphs</option>
                            <option value="sentences">Sentences</option>
                            <option value="words">Words</option>
                        </select>
                    </div>
                    <button
                        onClick={generateText}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Generate
                    </button>
                </div>
                
                <div className="relative">
                    <label htmlFor="li-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Generated Text</label>
                    <textarea
                        id="li-output"
                        value={output}
                        readOnly
                        className="w-full h-80 p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                    />
                    {output && !output.startsWith('Error:') && !output.startsWith('Loading') && <CopyButton textToCopy={output} />}
                </div>
            </div>
        </ToolContainer>
    );
};