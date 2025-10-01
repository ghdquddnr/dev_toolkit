import React, { useState, useCallback, useRef } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';
import { useTranslation } from '../i18n';

declare const CryptoJS: any;

const HASH_ALGORITHMS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];

export const HashGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [algorithm, setAlgorithm] = useState('SHA-256');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateHash = useCallback((text: string) => {
        if (!text) {
            setOutput('');
            return;
        }
        const hashFunc = CryptoJS[algorithm];
        if (hashFunc) {
            setOutput(hashFunc(text).toString(CryptoJS.enc.Hex));
        }
    }, [algorithm]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const binaryStr = event.target?.result;
                if (binaryStr) {
                    const wordArray = CryptoJS.lib.WordArray.create(binaryStr);
                    const hashFunc = CryptoJS[algorithm];
                    if (hashFunc) {
                        const hash = hashFunc(wordArray).toString(CryptoJS.enc.Hex);
                        setOutput(hash);
                        setInput(`File: ${file.name} (${file.size} bytes)`);
                    }
                }
            };
            reader.onerror = () => setOutput(t('tool.hash.errorReadFile'));
            reader.readAsArrayBuffer(file);
        }
    };
    
    const handleHashFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleReset = useCallback(() => {
        setInput('');
        setOutput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    return (
        <ToolContainer title={t('tool.hash.name')} description={t('tool.hash.longDescription')}>
            <div className="space-y-4">
                <div className="flex flex-wrap items-end gap-4">
                     <div>
                        <label htmlFor="hash-algo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.hash.algorithm')}</label>
                        <select
                            id="hash-algo"
                            value={algorithm}
                            onChange={(e) => {
                                setAlgorithm(e.target.value);
                                generateHash(input);
                            }}
                            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        >
                            {HASH_ALGORITHMS.map(alg => <option key={alg} value={alg}>{alg}</option>)}
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleHashFileClick}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                       {t('tool.hash.hashFile')}
                    </button>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        {t('common.reset')}
                    </button>
                </div>

                <div>
                    <label htmlFor="hash-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.hash.textInput')}</label>
                    <textarea
                        id="hash-input"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            generateHash(e.target.value);
                        }}
                        placeholder={t('tool.hash.inputPlaceholder')}
                        className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                    />
                </div>
                
                <div className="relative">
                    <label htmlFor="hash-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.hash.generatedHash')}</label>
                    <input
                        id="hash-output"
                        type="text"
                        value={output}
                        readOnly
                        placeholder={t('tool.hash.outputPlaceholder')}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 font-mono text-gray-900 dark:text-white"
                    />
                    {output && <CopyButton textToCopy={output} />}
                </div>
            </div>
        </ToolContainer>
    );
};
