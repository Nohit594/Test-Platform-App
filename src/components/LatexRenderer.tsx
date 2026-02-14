'use client';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import React from 'react';

interface LatexRendererProps {
    text: string;
    className?: string;
}

export default function LatexRenderer({ text, className = '' }: LatexRendererProps) {
    if (!text) return null;

    // Split by LaTeX delimiters
    // Matches:
    // 1. \[ ... \]  (Block)
    // 2. \( ... \)  (Inline)
    // 3. $$ ... $$  (Block)
    // 4. $ ... $    (Inline)
    const regex = /(\\\[[\s\S]*?\\\]|\\\(.*?\\\)|(?:\$\$[\s\S]*?\$\$)|(?:\$.*?\$))/g;

    const parts = text.split(regex);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                if (part.startsWith('\\[')) {
                    // Block Math \[ ... \]
                    const content = part.slice(2, -2);
                    return <BlockMath key={index}>{content}</BlockMath>;
                } else if (part.startsWith('\\(')) {
                    // Inline Math \( ... \)
                    const content = part.slice(2, -2);
                    return <InlineMath key={index}>{content}</InlineMath>;
                } else if (part.startsWith('$$')) {
                    // Block Math $$ ... $$
                    const content = part.slice(2, -2);
                    return <BlockMath key={index}>{content}</BlockMath>;
                } else if (part.startsWith('$')) {
                    // Inline Math $ ... $
                    const content = part.slice(1, -1);
                    return <InlineMath key={index}>{content}</InlineMath>;
                } else {
                    // Plain text - render with HTML for line breaks if needed, or just text
                    // If the text contains HTML tags (like <br>, <img>), we need to render them safely 
                    // BUT since we are splitting by regex, we might break HTML tags if we aren't careful.
                    // Ideally, the input should just be text + latex.
                    // Given the user uses <br> and <img>, let's try to render HTML for text parts.
                    return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
                }
            })}
        </span>
    );
}
