
import React from 'react';
import { Tool, ToolDefinition } from './types';
import { Base64Converter } from './tools/Base64Converter';
import { JsonYamlConverter } from './tools/JsonYamlConverter';
import { UrlEncoder } from './tools/UrlEncoder';
import { HashGenerator } from './tools/HashGenerator';
import { UuidGenerator } from './tools/UuidGenerator';
import { TextDiffTool } from './tools/TextDiffTool';
import { MergeTool } from './tools/MergeTool';
import { CronGenerator } from './tools/CronGenerator';
import { TimestampConverter } from './tools/TimestampConverter';
import { ColorPickerTool } from './tools/ColorPickerTool';
import { LoremIpsumGenerator } from './tools/LoremIpsumGenerator';
import {
    ArrowsRightLeftIcon,
    CodeBracketIcon,
    LinkIcon,
    ShieldCheckIcon,
    FingerPrintIcon,
    DocumentMinusIcon,
    DocumentPlusIcon,
    ClockIcon,
    CalendarDaysIcon,
    SwatchIcon,
    PencilSquareIcon,
} from './components/Icons';


export const TOOLS: ToolDefinition[] = [
    { 
        id: Tool.BASE64, 
        name: 'Base64', 
        description: 'Encode/decode Base64 data', 
        icon: <ArrowsRightLeftIcon className="w-5 h-5" />,
        component: Base64Converter 
    },
    { 
        id: Tool.JSON_YAML, 
        name: 'JSON/YAML/Props', 
        description: 'Convert between JSON, YAML, & Properties', 
        icon: <CodeBracketIcon className="w-5 h-5" />,
        component: JsonYamlConverter 
    },
    { 
        id: Tool.URL, 
        name: 'URL Encoder', 
        description: 'Encode/decode URL components', 
        icon: <LinkIcon className="w-5 h-5" />,
        component: UrlEncoder 
    },
    { 
        id: Tool.HASH, 
        name: 'Hash Gen', 
        description: 'Generate MD5, SHA hashes', 
        icon: <ShieldCheckIcon className="w-5 h-5" />,
        component: HashGenerator 
    },
    { 
        id: Tool.UUID, 
        name: 'UUID Gen', 
        description: 'Generate UUIDs', 
        icon: <FingerPrintIcon className="w-5 h-5" />,
        component: UuidGenerator 
    },
    { 
        id: Tool.DIFF, 
        name: 'Text Diff', 
        description: 'Compare two text blocks', 
        icon: <DocumentMinusIcon className="w-5 h-5" />,
        component: TextDiffTool 
    },
    { 
        id: Tool.MERGE, 
        name: 'Merge Tool', 
        description: '3-way text merge', 
        icon: <DocumentPlusIcon className="w-5 h-5" />,
        component: MergeTool 
    },
    { 
        id: Tool.CRON, 
        name: 'Cron Gen', 
        description: 'Create cron expressions', 
        icon: <ClockIcon className="w-5 h-5" />,
        component: CronGenerator 
    },
    { 
        id: Tool.TIMESTAMP, 
        name: 'Timestamp', 
        description: 'Convert timestamps', 
        icon: <CalendarDaysIcon className="w-5 h-5" />,
        component: TimestampConverter 
    },
    { 
        id: Tool.COLOR_PICKER, 
        name: 'Color Picker', 
        description: 'Pick and convert colors', 
        icon: <SwatchIcon className="w-5 h-5" />,
        component: ColorPickerTool 
    },
    { 
        id: Tool.LOREM_IPSUM, 
        name: 'Lorem Ipsum', 
        description: 'Generate placeholder text', 
        icon: <PencilSquareIcon className="w-5 h-5" />,
        component: LoremIpsumGenerator 
    },
];

export const TOOLS_MAP = new Map(TOOLS.map(tool => [tool.id, tool]));