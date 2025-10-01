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
import { RegexGenerator } from './tools/RegexGenerator';
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
    SparklesIcon,
} from './components/Icons';


export const TOOLS: ToolDefinition[] = [
    { 
        id: Tool.BASE64, 
        name: 'tool.base64.name', 
        description: 'tool.base64.description', 
        icon: <ArrowsRightLeftIcon className="w-5 h-5" />,
        component: Base64Converter 
    },
    { 
        id: Tool.JSON_YAML, 
        name: 'tool.jsonyaml.name', 
        description: 'tool.jsonyaml.description', 
        icon: <CodeBracketIcon className="w-5 h-5" />,
        component: JsonYamlConverter 
    },
    { 
        id: Tool.URL, 
        name: 'tool.url.name', 
        description: 'tool.url.description', 
        icon: <LinkIcon className="w-5 h-5" />,
        component: UrlEncoder 
    },
    { 
        id: Tool.HASH, 
        name: 'tool.hash.name', 
        description: 'tool.hash.description', 
        icon: <ShieldCheckIcon className="w-5 h-5" />,
        component: HashGenerator 
    },
    { 
        id: Tool.UUID, 
        name: 'tool.uuid.name', 
        description: 'tool.uuid.description', 
        icon: <FingerPrintIcon className="w-5 h-5" />,
        component: UuidGenerator 
    },
    { 
        id: Tool.REGEX, 
        name: 'tool.regex.name', 
        description: 'tool.regex.description', 
        icon: <SparklesIcon className="w-5 h-5" />,
        component: RegexGenerator 
    },
    { 
        id: Tool.DIFF, 
        name: 'tool.diff.name', 
        description: 'tool.diff.description', 
        icon: <DocumentMinusIcon className="w-5 h-5" />,
        component: TextDiffTool 
    },
    { 
        id: Tool.MERGE, 
        name: 'tool.merge.name', 
        description: 'tool.merge.description', 
        icon: <DocumentPlusIcon className="w-5 h-5" />,
        component: MergeTool 
    },
    { 
        id: Tool.CRON, 
        name: 'tool.cron.name', 
        description: 'tool.cron.description', 
        icon: <ClockIcon className="w-5 h-5" />,
        component: CronGenerator 
    },
    { 
        id: Tool.TIMESTAMP, 
        name: 'tool.timestamp.name', 
        description: 'tool.timestamp.description', 
        icon: <CalendarDaysIcon className="w-5 h-5" />,
        component: TimestampConverter 
    },
    { 
        id: Tool.COLOR_PICKER, 
        name: 'tool.color.name', 
        description: 'tool.color.description', 
        icon: <SwatchIcon className="w-5 h-5" />,
        component: ColorPickerTool 
    },
    { 
        id: Tool.LOREM_IPSUM, 
        name: 'tool.lorem.name', 
        description: 'tool.lorem.description', 
        icon: <PencilSquareIcon className="w-5 h-5" />,
        component: LoremIpsumGenerator 
    },
];

export const TOOLS_MAP = new Map(TOOLS.map(tool => [tool.id, tool]));