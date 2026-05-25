import React from 'react';

// Helper to toggle checkbox in raw markdown string
export const toggleMarkdownCheckbox = (text, targetIdx) => {
    let currentIdx = 0;
    // Matches '- [ ]', '- [x]', '* [ ]', '* [x]' at the beginning of a line
    const regex = /^(\s*[-\*]\s*\[)([ xX])(\]\s*.*$)/gm;
    
    return text.replace(regex, (match, prefix, status, suffix) => {
        if (currentIdx === targetIdx) {
            const newStatus = status === ' ' ? 'x' : ' ';
            currentIdx++;
            return `${prefix}${newStatus}${suffix}`;
        }
        currentIdx++;
        return match;
    });
};

const MarkdownRenderer = ({ text, onToggleCheckbox }) => {
    // GUARD CLAUSE: Skill clean-code - js-early-exit
    if (!text || !text.trim()) {
        return null;
    }

    // 1. Escapar HTML para prevenir inyecciones de código (XSS)
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 2. Encabezados (headers #, ##, ###)
    html = html.replace(/^### (.*$)/gim, '<h5 class="text-xs font-bold text-zinc-300 mt-2 mb-1">$1</h5>');
    html = html.replace(/^## (.*$)/gim, '<h4 class="text-sm font-semibold text-zinc-200 mt-2 mb-1">$1</h4>');
    html = html.replace(/^# (.*$)/gim, '<h3 class="text-md font-bold text-zinc-100 mt-2 mb-1">$1</h3>');

    // 3. Blockquotes (considerando el escape previo de > a &gt;)
    html = html.replace(/^&gt;\s?(.*$)/gim, '<blockquote class="border-l-2 border-zinc-700 pl-2.5 italic text-zinc-400 my-1.5 bg-zinc-950/40 py-1 pr-2 rounded-r">$1</blockquote>');

    // 4. Elementos de lista de tareas / Checkboxes interactivos (en una sola pasada para preservar orden de indices)
    let checkboxIdx = 0;
    html = html.replace(/^(\s*)([-\*])\s*\[([ xX])\]\s*(.*$)/gim, (match, spaces, bullet, status, content) => {
        const idx = checkboxIdx++;
        const isChecked = status.toLowerCase() === 'x';
        const indentLevel = spaces ? spaces.length : 0;
        const paddingLeft = indentLevel > 0 ? `${indentLevel * 12}px` : '0px';
        
        if (isChecked) {
            return `<div class="flex items-center gap-2 text-zinc-350 my-1" style="padding-left: ${paddingLeft}"><input type="checkbox" checked data-idx="${idx}" class="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer" /><span class="line-through text-zinc-500 text-sm">${content}</span></div>`;
        } else {
            return `<div class="flex items-center gap-2 text-zinc-350 my-1" style="padding-left: ${paddingLeft}"><input type="checkbox" data-idx="${idx}" class="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer" /><span class="text-zinc-300 text-sm">${content}</span></div>`;
        }
    });

    // 5. Elementos de lista desordenada comunes (- o *) que no son checkboxes
    html = html.replace(/^(\s*)-\s*(?!\[ \]|\[x\])(.*$)/gim, (match, spaces, content) => {
        const indentLevel = spaces ? spaces.length : 0;
        const paddingLeft = indentLevel > 0 ? `${indentLevel * 12}px` : '0px';
        return `<li class="list-disc ml-4 text-zinc-300 text-sm my-0.5" style="padding-left: ${paddingLeft}">${content}</li>`;
    });
    html = html.replace(/^(\s*)\*\s*(?!\[ \]|\[x\])(.*$)/gim, (match, spaces, content) => {
        const indentLevel = spaces ? spaces.length : 0;
        const paddingLeft = indentLevel > 0 ? `${indentLevel * 12}px` : '0px';
        return `<li class="list-disc ml-4 text-zinc-300 text-sm my-0.5" style="padding-left: ${paddingLeft}">${content}</li>`;
    });

    // 6. Negrita y Cursiva
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-zinc-100">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-zinc-300">$1</em>');
    html = html.replace(/__(.*?)__/g, '<strong class="font-bold text-zinc-100">$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em class="italic text-zinc-300">$1</em>');

    // 7. Código en línea
    html = html.replace(/`(.*?)`/g, '<code class="bg-zinc-950/60 px-1.5 py-0.5 rounded text-emerald-400 font-mono text-[11px]">$1</code>');

    // 8. Enlaces (Skill ui-ux-pro-max - no-emoji-icons)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline cursor-pointer">$1</a>');

    // 9. Saltos de línea
    html = html.split('\n').join('<br />');

    // Limpieza de etiquetas br sobrantes en bloques especiales
    html = html.replace(/<\/div><br \/>/g, '</div>');
    html = html.replace(/<\/blockquote><br \/>/g, '</blockquote>');
    html = html.replace(/<\/li><br \/>/g, '</li>');
    html = html.replace(/<\/h3><br \/>/g, '</h3>');
    html = html.replace(/<\/h4><br \/>/g, '</h4>');
    html = html.replace(/<\/h5><br \/>/g, '</h5>');

    const handleContainerClick = (e) => {
        // Cláusula de guardia: verificar si el clic fue en un input checkbox
        if (e.target.tagName !== 'INPUT' || e.target.type !== 'checkbox') return;
        
        // Evitar el comportamiento nativo del navegador para que React controle el estado limpiamente
        e.preventDefault();
        
        const idxStr = e.target.getAttribute('data-idx');
        if (idxStr !== null && onToggleCheckbox) {
            onToggleCheckbox(parseInt(idxStr, 10));
        }
    };

    return (
        <div 
            className="space-y-1 text-zinc-300 break-words selection:bg-emerald-500/30"
            dangerouslySetInnerHTML={{ __html: html }}
            onClick={handleContainerClick}
        />
    );
};

// Skill react-best-practices: rerender-memo (memorización de componente costoso)
export default React.memo(MarkdownRenderer);
