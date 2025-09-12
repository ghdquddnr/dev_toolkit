

import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';

declare const Diff: any;

interface MergeToolProps {
    isLibLoaded: boolean;
}

export const MergeTool: React.FC<MergeToolProps> = ({ isLibLoaded }) => {
    const [baseText, setBaseText] = useState('const x = 1;\nconst y = 2;\nconst z = 3;');
    const [versionA, setVersionA] = useState('const x = 10;\nconst y = 2;\nconst z = 3;');
    const [versionB, setVersionB] = useState('const x = 1;\nconst y = 2;\nconst z = 30;');
    const [merged, setMerged] = useState('');
    const [error, setError] = useState('');

    const performMerge = useCallback(() => {
        setError('');
        if (!isLibLoaded || typeof Diff === 'undefined') {
            setError('Error: The diffing library (jsdiff) has not loaded yet. Please wait a moment.');
            return;
        }

        try {
            const diff3 = Diff.diff3Merge(versionA, baseText, versionB, true);
            
            let mergeResult = '';
            for (const item of diff3) {
                if (item.ok) {
                    mergeResult += item.ok.join('\n') + '\n';
                } else if (item.conflict) {
                    mergeResult += '<<<<<<< Version A\n';
                    mergeResult += item.conflict.a.join('\n') + '\n';
                    mergeResult += '=======\n';
                    mergeResult += item.conflict.b.join('\n') + '\n';
                    mergeResult += '>>>>>>> Version B\n';
                }
            }
            
            setMerged(mergeResult.trim());
        } catch (e: any) {
            setError(`An error occurred during merge: ${e.message}`);
        }
    }, [baseText, versionA, versionB, isLibLoaded]);

    return (
        <ToolContainer title="Merge Tool" description="Perform a 3-way merge between a base version and two modified versions.">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="base-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base</label>
                        <textarea
                            id="base-text"
                            value={baseText}
                            onChange={(e) => setBaseText(e.target.value)}
                            className="w-full h-48 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                        />
                    </div>
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