import React, { useState, useEffect, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';
import { useTranslation } from '../i18n';

declare const cronstrue: any;

const initialCronState = {
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
};

export const CronGenerator: React.FC = () => {
    const { t, language } = useTranslation();
    const [cron, setCron] = useState(initialCronState);
    const [cronString, setCronString] = useState('* * * * *');
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        const newCronString = `${cron.minute} ${cron.hour} ${cron.dayOfMonth} ${cron.month} ${cron.dayOfWeek}`;
        setCronString(newCronString);
        try {
            // Cronstrue supports locales, so we pass the current language
            const locale = language === 'zh' ? 'zh_CN' : language;
            setExplanation(cronstrue.toString(newCronString, { locale }));
        } catch (e: any) {
            setExplanation(t('tool.cron.errorInvalid', { message: e.message }));
        }
    }, [cron, language, t]);

    const handleCronChange = (part: keyof typeof cron, value: string) => {
        setCron(prev => ({ ...prev, [part]: value }));
    };

    const handleReset = useCallback(() => {
        setCron(initialCronState);
    }, []);

    const CronInput = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder: string }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
            />
        </div>
    );
    
    return (
        <ToolContainer title={t('tool.cron.name')} description={t('tool.cron.longDescription')}>
            <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <CronInput label={t('tool.cron.minute')} value={cron.minute} onChange={v => handleCronChange('minute', v)} placeholder="0-59" />
                    <CronInput label={t('tool.cron.hour')} value={cron.hour} onChange={v => handleCronChange('hour', v)} placeholder="0-23" />
                    <CronInput label={t('tool.cron.dayOfMonth')} value={cron.dayOfMonth} onChange={v => handleCronChange('dayOfMonth', v)} placeholder="1-31" />
                    <CronInput label={t('tool.cron.month')} value={cron.month} onChange={v => handleCronChange('month', v)} placeholder="1-12" />
                    <CronInput label={t('tool.cron.dayOfWeek')} value={cron.dayOfWeek} onChange={v => handleCronChange('dayOfWeek', v)} placeholder="0-6" />
                </div>
                
                <div className="flex items-center">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        {t('common.reset')}
                    </button>
                </div>
                
                <div>
                    <h3 className="text-lg font-medium mb-2">{t('tool.cron.result')}</h3>
                    <div className="relative p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
                        <pre className="font-mono text-lg">{cronString}</pre>
                        <CopyButton textToCopy={cronString} />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-2">{t('tool.cron.explanation')}</h3>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
                        <p className="text-blue-800 dark:text-blue-200">{explanation}</p>
                    </div>
                </div>
            </div>
        </ToolContainer>
    );
};
