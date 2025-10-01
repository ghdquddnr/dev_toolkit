import React, { useState, useEffect, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';
import { useTranslation } from '../i18n';

declare const moment: any;

interface ConvertedTimes {
    unix: string;
    utc: string;
    local: string;
    relative: string;
}

export const TimestampConverter: React.FC = () => {
    const { t, language } = useTranslation();
    const [input, setInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
    const [times, setTimes] = useState<ConvertedTimes | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Set moment.js locale when language changes
        moment.locale(language);

        const convertTime = () => {
            if (!input.trim()) {
                setTimes(null);
                setError('');
                return;
            }

            let m;
            if (/^\d+$/.test(input)) {
                const numInput = Number(input);
                m = numInput > 1000000000000 ? moment(numInput) : moment.unix(numInput);
            } else {
                m = moment(input);
            }
            
            if (m.isValid()) {
                setTimes({
                    unix: m.unix().toString(),
                    utc: m.utc().format('YYYY-MM-DD HH:mm:ss Z'),
                    local: m.local().format('YYYY-MM-DD HH:mm:ss Z'),
                    relative: m.fromNow(),
                });
                setError('');
            } else {
                setTimes(null);
                setError(t('tool.timestamp.errorInvalid'));
            }
        };
        convertTime();
    }, [input, language, t]);
    
    const handleReset = useCallback(() => {
        setInput(Math.floor(Date.now() / 1000).toString());
    }, []);

    const OutputField = ({ label, value }: { label: string; value: string }) => (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <input
                type="text"
                value={value}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <CopyButton textToCopy={value} />
        </div>
    );

    return (
        <ToolContainer title={t('tool.timestamp.name')} description={t('tool.timestamp.longDescription')}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="timestamp-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.timestamp.inputLabel')}</label>
                    <input
                        id="timestamp-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('tool.timestamp.inputPlaceholder')}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <div className="flex items-center gap-4 mt-2">
                        <button onClick={() => setInput(Math.floor(Date.now() / 1000).toString())} className="text-sm text-primary-600 hover:underline">{t('tool.timestamp.useCurrentTime')}</button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
                        >
                            {t('common.reset')}
                        </button>
                    </div>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                {times && (
                    <div className="space-y-4">
                        <OutputField label={t('tool.timestamp.unixTimestamp')} value={times.unix} />
                        <OutputField label={t('tool.timestamp.utc')} value={times.utc} />
                        <OutputField label={t('tool.timestamp.localTime')} value={times.local} />
                        <OutputField label={t('tool.timestamp.relativeTime')} value={times.relative} />
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};
