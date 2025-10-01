import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';
import { useTranslation } from '../i18n';

export const Base64Converter: React.FC = () => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [error, setError] = useState('');

    const handleConvert = useCallback(() => {
        setError('');
        setOutput('');
        if (!input) return;

        try {
            if (mode === 'encode') {
                setOutput(btoa(unescape(encodeURIComponent(input))));
            } else {
                setOutput(decodeURIComponent(escape(atob(input))));
            }
        } catch (e) {
            setError(t('tool.base64.errorInvalidInput'));
        }
    }, [input, mode, t]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                if (mode === 'encode') {
                    const base64String = result.split(',')[1];
                    setOutput(base64String);
                    setInput(`File: ${file.name}`);
                } else {
                    setInput(result);
                }
            };
            reader.onerror = () => setError(t('tool.base64.errorReadFile'));
            
            if (mode === 'encode') {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        }
    };
    
    const handleDownload = () => {
        if (!output) return;
        try {
            const isEncoded = mode === 'decode';
            const blob = isEncoded ?
                new Blob([output], { type: 'application/octet-stream' }) :
                new Blob([output], { type: 'text/plain' });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = isEncoded ? 'decoded.bin' : 'encoded.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch(e) {
            setError(t('tool.base64.errorDownload'));
        }
    };

    const handleReset = useCallback(() => {
        setInput('');
        setOutput('');
        setError('');
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }, []);

    return (
        <ToolContainer title={t('tool.base64.name')} description={t('tool.base64.longDescription')}>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input type="radio" name="mode" value="encode" checked={mode === 'encode'} onChange={() => setMode('encode')} className="form-radio text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2">{t('tool.base64.encode')}</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="mode" value="decode" checked={mode === 'decode'} onChange={() => setMode('decode')} className="form-radio text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2">{t('tool.base64.decode')}</span>
                    </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <label htmlFor="base64-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('common.input')}</label>
                        <textarea
                            id="base64-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t(mode === 'encode' ? 'tool.base64.inputPlaceholderEncode' : 'tool.base64.inputPlaceholderDecode')}
                            className="w-full h-48 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                        />
                    </div>
                     <div className="relative">
                        <label htmlFor="base64-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('common.output')}</label>
                        <textarea
                            id="base64-output"
                            value={output}
                            readOnly
                            placeholder={t('tool.base64.outputPlaceholder')}
                            className="w-full h-48 p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                        />
                        {output && <CopyButton textToCopy={output} />}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex flex-wrap items-center gap-4">
                     <button
                        onClick={handleConvert}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        {t('common.convert')}
                    </button>
                     <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        {t('common.reset')}
                    </button>
                    <div>
                        <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
                           {t(mode === 'encode' ? 'tool.base64.uploadEncode' : 'tool.base64.uploadDecode')}
                        </label>
                         <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                    {output && (
                         <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            {t('tool.base64.downloadResult')}
                        </button>
                    )}
                </div>
            </div>
        </ToolContainer>
    );
};
