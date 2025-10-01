import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';
import { useTranslation } from '../i18n';

export const UrlEncoder: React.FC = () => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');

    const handleReset = useCallback(() => {
        setInput('');
        setOutput('');
    }, []);

    return (
        <ToolContainer title={t('tool.url.name')} description={t('tool.url.longDescription')}>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input type="radio" name="mode" value="encode" checked={mode === 'encode'} onChange={() => setMode('encode')} className="form-radio text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2">{t('tool.url.encode')}</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="mode" value="decode" checked={mode === 'decode'} onChange={() => setMode('decode')} className="form-radio text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2">{t('tool.url.decode')}</span>
                    </label>
                </div>

                <div>
                    <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('common.input')}</label>
                    <textarea
                        id="url-input"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            if (!e.target.value) {
                                setOutput('');
                                return;
                            }
                            try {
                                if (mode === 'encode') {
                                    setOutput(encodeURIComponent(e.target.value));
                                } else {
                                    setOutput(decodeURIComponent(e.target.value.replace(/\+/g, ' ')));
                                }
                            } catch (err) {
                                setOutput(t('tool.url.errorInvalidInput'));
                            }
                        }}
                        placeholder={t('tool.url.inputPlaceholder')}
                        className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                    />
                </div>
                
                <div className="relative">
                    <label htmlFor="url-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('common.output')}</label>
                    <textarea
                        id="url-output"
                        value={output}
                        readOnly
                        placeholder={t('tool.url.outputPlaceholder')}
                        className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                    />
                    {output && <CopyButton textToCopy={output} />}
                </div>

                <div className="flex items-center">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        {t('common.reset')}
                    </button>
                </div>
            </div>
        </ToolContainer>
    );
};
