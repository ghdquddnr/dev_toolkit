import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';

declare const uuid: any;

export const UuidGenerator: React.FC = () => {
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState(1);

    const generateUuids = useCallback(() => {
        const newUuids = Array.from({ length: count }, () => uuid.v4());
        setUuids(newUuids);
    }, [count]);
    
    // Generate one on initial load
    React.useEffect(() => {
        generateUuids();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ToolContainer title="UUID/GUID Generator" description="Generate universally unique identifiers (UUIDs).">
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div>
                        <label htmlFor="uuid-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number to generate</label>
                        <input
                            id="uuid-count"
                            type="number"
                            value={count}
                            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            min="1"
                            max="100"
                            className="w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                    </div>
                     <button
                        onClick={generateUuids}
                        className="self-end px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Generate
                    </button>
                </div>
                
                {uuids.length > 0 && (
                     <div className="space-y-2">
                        <h3 className="text-lg font-medium">Generated UUIDs:</h3>
                        <div className="relative p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md max-h-96 overflow-y-auto">
                            <pre className="font-mono whitespace-pre-wrap break-all">
                                {uuids.join('\n')}
                            </pre>
                            <CopyButton textToCopy={uuids.join('\n')} />
                        </div>
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};