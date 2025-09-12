

import React, { useState, useMemo } from 'react';
import { ToolContainer } from '../components/ToolContainer';

declare const Diff: any;

interface DiffPart {
    value: string;
    added?: boolean;
    removed?: boolean;
}

interface TextDiffToolProps {
    isLibLoaded: boolean;
}

export const TextDiffTool: React.FC<TextDiffToolProps> = ({ isLibLoaded }) => {
    const [textA, setTextA] = useState('This is the original text.');
    const [textB, setTextB] = useState('This is the modified text, with changes.');
    const [viewType, setViewType] = useState<'inline' | 'side-by-side'>('inline');
    
    const diffResult: DiffPart[] = useMemo(() => {
        if (!isLibLoaded || typeof Diff === 'undefined') return [];
        return Diff.diffChars(textA, textB);
    }, [textA, textB, isLibLoaded]);
    
    const renderInlineDiff = () => (
         <pre className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md whitespace-pre-wrap break-all">
            {diffResult.map((part, index) => {
                const color = part.added ? 'bg-green-100 dark:bg-green-900/50' : part.removed ? 'bg-red-100 dark:bg-red-900/50' : 'bg-transparent';
                return <span key={index} className={color}>{part.value}</span>;
            })}
        </pre>
    );
    
    const renderSideBySideDiff = () => {
        const left = diffResult.filter(part => !part.added).map((part, index) => {
            const color = part.removed ? 'bg-red-100 dark:bg-red-900/50' : 'bg-transparent';
            return <span key={`left-${index}`} className={color}>{part.value}</span>;
        });
         const right = diffResult.filter(part => !part.removed).map((part, index) => {
            const color = part.added ? 'bg-green-100 dark:bg-green-900/50' : 'bg-transparent';
            return <span key={`right-${index}`} className={color}>{part.value}</span>;
        });
        
        return (
            <div className="grid grid-cols-2 gap-4">
                 <pre className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md whitespace-pre-wrap break-all h-full">{left}</pre>
                 <pre className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md whitespace-pre-wrap break-all h-full">{right}</pre>
            </div>
        );
    };

    return (
        <ToolContainer title="Text Diff Tool" description="Compare two blocks of text and highlight the differences.">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="text-a" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original Text</label>
                        <textarea
                            id="text-a"
                            value={textA}
                            onChange={(e) => setTextA(e.target.value)}
                            className="w-full h-48 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                        />
                    </div>
                    <div>
                        <label htmlFor="text-b" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modified Text</label>
                        <textarea
                            id="text-b"
                            value={textB}
                            onChange={(e) => setTextB(e.target.value)}
                            className="w-full h-48 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600 font-mono"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-2">Differences</h3>
                     <div className="flex items-center space-x-4 mb-4">
                        <label className="flex items-center">
                            <input type="radio" name="viewType" value="inline" checked={viewType === 'inline'} onChange={() => setViewType('inline')} className="form-radio text-primary-600 focus:ring-primary-500" />
                            <span className="ml-2">Inline</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="viewType" value="side-by-side" checked={viewType === 'side-by-side'} onChange={() => setViewType('side-by-side')} className="form-radio text-primary-600 focus:ring-primary-500" />
                            <span className="ml-2">Side-by-side</span>
                        </label>
                    </div>
                     {!isLibLoaded ? (
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
                            <p>Loading diffing library...</p>
                        </div>
                    ) : (
                        viewType === 'inline' ? renderInlineDiff() : renderSideBySideDiff()
                    )}
                </div>
            </div>
        </ToolContainer>
    );
};