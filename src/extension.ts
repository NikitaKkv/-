import { window, workspace, ExtensionContext, TextEditorDecorationType, Range, TextEditor } from 'vscode';

// Функция вызываемая VS Code - при активации расширения, 
// которая принимает объект context, 
// в ней реализована вся логика расширения
export function activate(context: ExtensionContext) {
    const decorations: TextEditorDecorationType[] = [
        'rgba(255, 138, 128, 0.15)',  
        'rgba(128, 222, 234, 0.15)',  
        'rgba(220, 215, 255, 0.15)', 
        'rgba(197, 255, 192, 0.15)',  
        'rgba(255, 209, 102, 0.15)'   
    ].map(color => 
        window.createTextEditorDecorationType({
            backgroundColor: color  
        })
    );

    // Функция обновления подсветки отступов
    const update = () => {
        const editor: TextEditor | undefined = window.activeTextEditor;
        if (!editor) return;
        
        
        const levelRanges: Range[][] = decorations.map(() => []);
        
        for (let i = 0; i < editor.document.lineCount; i++) {
            const line = editor.document.lineAt(i);
            
            const indent = line.text.match(/^ */)?.[0] || '';
            
            if (!line.text.trim()) continue;  
            
            if (indent.length % 4 !== 0) continue;  
            
            const level = indent.length / 4;
            
            if (level > 0 && level <= decorations.length) {
                levelRanges[level - 1].push(new Range(i, 0, i, indent.length));
            }
        }
        
        levelRanges.forEach((ranges, idx) => editor.setDecorations(decorations[idx], ranges));
    };

    // Подписываемся на события для автоматического обновления
    context.subscriptions.push(
        workspace.onDidChangeTextDocument(update),    
        window.onDidChangeActiveTextEditor(update),   
        ...decorations 
    );

    update(); 
}

export function deactivate() {}