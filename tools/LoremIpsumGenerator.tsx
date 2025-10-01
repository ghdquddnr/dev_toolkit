import React, { useState, useCallback } from 'react';
import { ToolContainer } from '../components/ToolContainer';
import { CopyButton } from '../components/CopyButton';
import { useTranslation } from '../i18n';

const generateLoremIpsum = (count: number, type: 'paragraphs' | 'sentences' | 'words'): string => {
    const words = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit',
        'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut', 'orci', 'gravida', 'imperdiet', 'nullam', 'purus',
        'lacinia', 'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis', 'laoreet', 'auctor', 'mauris', 'non', 'velit',
        'eros', 'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa', 'volutpat', 'venenatis', 'sed', 'eu', 'molestie',
        'lacus', 'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus', 'at', 'magna', 'vestibulum', 'turpis',
        'ac', 'diam', 'tincidunt', 'id', 'condimentum', 'enim', 'sodales', 'in', 'hac', 'habitasse', 'platea', 'dictumst',
        'aenean', 'neque', 'fusce', 'augue', 'leo', 'eget', 'semper', 'mattis', 'tortor', 'scelerisque', 'nulla', 'interdum',
        'tellus', 'malesuada', 'rhoncus', 'porta', 'sem', 'aliquet', 'et', 'nam', 'suspendisse', 'potenti', 'morbi', 'faucibus',
        'sociis', 'natoque', 'penatibus', 'et', 'magnis', 'dis', 'parturient', 'montes', 'nascetur', 'ridiculus', 'mus'
    ];

    const generateWords = (num: number) => {
        let result = [];
        for (let i = 0; i < num; i++) {
            result.push(words[Math.floor(Math.random() * words.length)]);
        }
        return result.join(' ');
    };

    const generateSentences = (num: number) => {
        let result = [];
        for (let i = 0; i < num; i++) {
            let sentence = generateWords(Math.floor(Math.random() * 10) + 5);
            sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
            result.push(sentence);
        }
        return result.join(' ');
    };

    const generateParagraphs = (num: number) => {
        let result = [];
        for (let i = 0; i < num; i++) {
            result.push(generateSentences(Math.floor(Math.random() * 5) + 3));
        }
        return result.join('\n\n');
    };

    switch (type) {
        case 'words':
            return generateWords(count);
        case 'sentences':
            return generateSentences(count);
        case 'paragraphs':
            return generateParagraphs(count);
        default:
            return '';
    }
};

const defaultCount = 5;
const defaultType = 'paragraphs';

export const LoremIpsumGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [count, setCount] = useState(defaultCount);
    const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>(defaultType);
    const [output, setOutput] = useState('');

    const handleGenerate = useCallback(() => {
        setOutput(generateLoremIpsum(count, type));
    }, [count, type]);

    const handleReset = useCallback(() => {
        setCount(defaultCount);
        setType(defaultType);
    }, []);

    React.useEffect(() => {
        handleGenerate();
    }, [handleGenerate]);

    return (
        <ToolContainer title={t('tool.lorem.name')} description={t('tool.lorem.longDescription')}>
            <div className="space-y-4">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label htmlFor="li-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.lorem.count')}</label>
                        <input
                            id="li-count"
                            type="number"
                            value={count}
                            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            min="1"
                            className="w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                         <label htmlFor="li-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.lorem.type')}</label>
                         <select
                            id="li-type"
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                             className="w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        >
                            <option value="paragraphs">{t('tool.lorem.paragraphs')}</option>
                            <option value="sentences">{t('tool.lorem.sentences')}</option>
                            <option value="words">{t('tool.lorem.words')}</option>
                        </select>
                    </div>
                     <button
                        onClick={handleGenerate}
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

                 <div className="relative">
                    <label htmlFor="li-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tool.lorem.generatedText')}</label>
                    <textarea
                        id="li-output"
                        value={output}
                        readOnly
                        placeholder={t('tool.lorem.outputPlaceholder')}
                        className="w-full h-72 p-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-white dark:text-gray-900 dark:border-gray-600"
                        spellCheck="false"
                    />
                    {output && <CopyButton textToCopy={output} />}
                </div>

            </div>
        </ToolContainer>
    );
};
