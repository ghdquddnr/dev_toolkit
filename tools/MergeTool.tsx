import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';

declare const Diff: any; // Using jsdiff's global Diff object

interface MergeToolProps {
    isLibLoaded: boolean;
}

export const MergeTool: React.FC<MergeToolProps> = ({ isLibLoaded }) => {
    const [versionA, setVersionA] = useState(`Line 1 from A\nLine 2 from A`);
    const [versionB, setVersionB] = useState(`Line 1 from B\nLine 2 from B`);
    const [merged, setMerged] = useState('');
    const [error, setError] = useState('');

    const performMerge = useCallback(() => {
        setError('');
        if (!isLibLoaded || typeof Diff === 'undefined') {
            setError('Error: The diffing library (jsdiff) has not loaded yet. Please wait a moment.');
            return;
        }

        try {
            const diffResult = Diff.diffLines(versionA, versionB);
            let mergedText = '';

            diffResult.forEach((part: any) => {
                if (part.added) {
                    mergedText += `+ ${part.value}`;
                } else if (part.removed) {
                    mergedText += `- ${part.value}`;
                } else {
                    mergedText += `  ${part.value}`;
                }
            });
            
            setMerged(mergedText.trim());
        } catch (e: any) {
            setError(`An error occurred during merge: ${e.message}`);
        }

    }, [versionA, versionB, isLibLoaded]);

    return (
        <ToolContainer title="2-Way Merge Tool" description="Combine two text versions, highlighting differences.">
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md text-blue-800 dark:text-blue-200">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3.03.543M9 6v15H4.5M12 6.042V12m0-5.958A9.067 9.067 0 0 1 15 3.75c1.052 0 2.062.18 3.03.543M15 6v15H9M12 12.042V18m0-5.958A8.967 8.967 0 0 0 6 18c-1.052 0-2.062.18-3.03.543M6 18v3H1.5M12 18.042V21m0-2.958A9.067 9.067 0 0 1 15 21c1.052 0 2.062.18 3.03.543M18 18v3h3.5" />
                    </svg>
                    How to Use the 2-Way Merge Tool
                </h3>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Version A:</strong> Paste the first text version here.</li>
                    <li><strong>Version B:</strong> Paste the second text version here.</li>
                    <li>Click the "Merge" button to combine the texts.</li>
                    <li>Lines unique to Version A will be prefixed with <code className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">-</code>.</li>
                    <li>Lines unique to Version B will be prefixed with <code className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">+</code>.</li>
                    <li>Common lines will be prefixed with <code className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">  </code> (two spaces).</li>
                </ul>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Changed from 3 to 2 columns */} 
                    <div>
                        <label htmlFor="version-a" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Version A</label>
                        <textarea
                            id="version-a"
                            value={versionA}
                            onChange={(e) => setVersionA(e.target.value)}
                            className="w-full h-48 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                        />
                    </div>
                    <div>
                        <label htmlFor="version-b" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Version B</label>
                        <textarea
                            id="version-b"
                            value={versionB}
                            onChange={(e) => setVersionB(e.target.value)}
                            className="w-full h-48 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={performMerge}
                        disabled={!isLibLoaded}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLibLoaded ? 'Merge' : 'Loading Library...'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                {merged && (
                    <div className="relative">
                        <label htmlFor="merged-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Merged Result</label>
                        <textarea
                            id="merged-output"
                            value={merged}
                            readOnly
                            placeholder="Result will appear here..."
                            className="w-full h-64 p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                        />
                        <CopyButton textToCopy={merged} />
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};