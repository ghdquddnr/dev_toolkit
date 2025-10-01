import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';
import { useTranslation } from '../i18n';

declare const uuid: any;

export const UuidGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState(1);

    const generateUuids = useCallback(() => {
        const newUuids = Array.from({ length: count }, () => uuid.v4());
        setUuids(newUuids);
    }, [count]);
    
    React.useEffect(() => {
        generateUuids();
    }, []);

    const handleReset = useCallback(() => {
        setCount(1);
        setUuids([uuid.v4()]);
    }, []);

    return (
        <ToolContainer title={t('tool.uuid.name')} description={t('tool.uuid.longDescription')}>
            <div className="space-y-4">
                <div className="flex items-end gap-4">
                    <div>
                        <label htmlFor="uuid-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.uuid.numberToGenerate')}</label>
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
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        {t('common.generate')}
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        {t('common.reset')}
                    </button>
                </div>
                
                {uuids.length > 0 && (
                     <div className="space-y-2">
                        <h3 className="text-lg font-medium">{t('tool.uuid.generatedUuids')}</h3>
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
