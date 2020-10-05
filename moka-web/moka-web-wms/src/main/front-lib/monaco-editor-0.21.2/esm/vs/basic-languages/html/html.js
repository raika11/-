/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { languages } from '../fillers/monaco-editor-core.js';
var EMPTY_ELEMENTS = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
];
export var conf = {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
    comments: {
        blockComment: ['<!--', '-->']
    },
    brackets: [
        ['<!--', '-->'],
        ['<', '>'],
        ['${', '}'],
        ['{', '}'],
        ['(', ')']
    ],
    autoClosingPairs: [
        { open: '${', close: '}' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
    ],
    surroundingPairs: [
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '${', close: '}' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '<', close: '>' }
    ],
    onEnterRules: [
        {
            beforeText: new RegExp("<(?!(?:" + EMPTY_ELEMENTS.join('|') + "))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$", 'i'),
            afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
            action: {
                indentAction: languages.IndentAction.IndentOutdent
            }
        },
        {
            beforeText: new RegExp("<(?!(?:" + EMPTY_ELEMENTS.join('|') + "))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$", 'i'),
            action: { indentAction: languages.IndentAction.Indent }
        }
    ],
    folding: {
        markers: {
            start: new RegExp('^\\s*<!--\\s*#region\\b.*-->'),
            end: new RegExp('^\\s*<!--\\s*#endregion\\b.*-->')
        }
    }
};
export var language = {
    defaultToken: '',
    tokenPostfix: '.html',
    ignoreCase: true,
    // The main tokenizer for our languages
    tokenizer: {
        root: [
            [/<!DOCTYPE/, 'metatag', '@doctype'],
            // temsTag
            [/<\/?tems:([a-z]+)([^\/>]*)\/?>/, 'temsTag'],
            [/<!--/, 'comment', '@comment'],
            [/(<)((?:[\w\-]+:)?[\w\-]+)(\s*)(\/>)/, ['delimiter', 'tag', '', 'delimiter']],
            [/(<)(script)/, ['delimiter', { token: 'tag', next: '@script' }]],
            [/(<)(style)/, ['delimiter', { token: 'tag', next: '@style' }]],
            // temsToken
            [/([^\$<\/>\}]*)(\$\{)/, ['text', { token: 'temsToken', next: '@temsToken' }]],
            [/(<)((?:[\w\-]+:)?[\w\-]+)/, ['delimiter', { token: 'tag', next: '@otherTag' }]],
            [/(<\/)((?:[\w\-]+:)?[\w\-]+)/, ['delimiter', { token: 'tag', next: '@otherTag' }]],
            [/</, 'delimiter'],
            // text
            [/[^<]+/]
        ],
        doctype: [
            [/[^>]+/, 'metatag.content'],
            [/>/, 'metatag', '@pop']
        ],
        comment: [
            [/-->/, 'comment', '@pop'],
            [/[^-]+/, 'comment.content'],
            [/./, 'comment.content']
        ],
        temsToken: [
            [/[^"}]*?\}/, 'temsToken', '@pop'],
            [/[^"}]*(?=")/, 'attribute.value', '@pop'],
            [/.{0}/, 'text', '@pop']
        ],
        attrTemsToken: [
            [/"/, 'attribute.value', '@pop'],
            [/([^${}"]*?\})([^${}"]*)(\$\{)/, ['temsToken', 'attribute.value', {token: 'temsToken', next: '@temsToken'}]],
            [/([^${}"]*?\})([^$"]*)(\$\{)/, ['temsToken', 'attribute.value', {token: 'temsToken', next: '@temsToken'}]],
            [/([^$}"]*)(\$\{)/, ['attribute.value', {token: 'temsToken', next: '@temsToken'}]],
            [/(\$\{[^}"]*\})(")/, ['temsToken', {token: 'attribute.value', next: '@pop'}]],
            [/([^${}"]*?\})([^$"]*)(")/, ['temsToken', 'attribute.value', {token: 'attribute.value', next: '@pop'}]],
            [/([^${}"]*?\})([^"]+")/, ['temsToken', {token: 'attribute.value', next: '@pop'}]],
            [/[^"]+"/, 'attribute.value', '@pop']
        ],
        otherTag: [
            [/\/?>/, 'delimiter', '@pop'],
            // "문자*${ -> 뒤를 attrTemsToken에서 처리
            [/("[^"\$]*)(\$\{)/, ['attribute.value', { token: 'temsToken', next: '@attrTemsToken' }]],
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/[ \t\r\n]+/] // whitespace
        ],
        // -- BEGIN <script> tags handling
        // After <script
        script: [
            [/type/, 'attribute.name', '@scriptAfterType'],
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [
                />/,
                {
                    token: 'delimiter',
                    next: '@scriptEmbedded',
                    nextEmbedded: 'text/javascript'
                }
            ],
            [/[ \t\r\n]+/],
            [/(<\/)(script\s*)(>)/, ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }]]
        ],
        // After <script ... type
        scriptAfterType: [
            [/=/, 'delimiter', '@scriptAfterTypeEquals'],
            [
                />/,
                {
                    token: 'delimiter',
                    next: '@scriptEmbedded',
                    nextEmbedded: 'text/javascript'
                }
            ],
            [/[ \t\r\n]+/],
            [/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
        ],
        // After <script ... type =
        scriptAfterTypeEquals: [
            [
                /"([^"]*)"/,
                {
                    token: 'attribute.value',
                    switchTo: '@scriptWithCustomType.$1'
                }
            ],
            [
                /'([^']*)'/,
                {
                    token: 'attribute.value',
                    switchTo: '@scriptWithCustomType.$1'
                }
            ],
            [
                />/,
                {
                    token: 'delimiter',
                    next: '@scriptEmbedded',
                    nextEmbedded: 'text/javascript'
                }
            ],
            [/[ \t\r\n]+/],
            [/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
        ],
        // After <script ... type = $S2
        scriptWithCustomType: [
            [
                />/,
                {
                    token: 'delimiter',
                    next: '@scriptEmbedded.$S2',
                    nextEmbedded: '$S2'
                }
            ],
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/[ \t\r\n]+/],
            [/<\/script\s*>/, { token: '@rematch', next: '@pop' }]
        ],
        scriptEmbedded: [
            [/<\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
            [/[^<]+/, '']
        ],
        // -- END <script> tags handling
        // -- BEGIN <style> tags handling
        // After <style
        style: [
            [/type/, 'attribute.name', '@styleAfterType'],
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [
                />/,
                {
                    token: 'delimiter',
                    next: '@styleEmbedded',
                    nextEmbedded: 'text/css'
                }
            ],
            [/[ \t\r\n]+/],
            [/(<\/)(style\s*)(>)/, ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }]]
        ],
        // After <style ... type
        styleAfterType: [
            [/=/, 'delimiter', '@styleAfterTypeEquals'],
            [
                />/,
                {
                    token: 'delimiter',
                    next: '@styleEmbedded',
                    nextEmbedded: 'text/css'
                }
            ],
            [/[ \t\r\n]+/],
            [/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
        ],
        // After <style ... type =
        styleAfterTypeEquals: [
            [
                /"([^"]*)"/,
                {
                    token: 'attribute.value',
                    switchTo: '@styleWithCustomType.$1'
                }
            ],
            [
                /'([^']*)'/,
                {
                    token: 'attribute.value',
                    switchTo: '@styleWithCustomType.$1'
                }
            ],
            [
                />/,
                {
                    token: 'delimiter',
                    next: '@styleEmbedded',
                    nextEmbedded: 'text/css'
                }
            ],
            [/[ \t\r\n]+/],
            [/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
        ],
        // After <style ... type = $S2
        styleWithCustomType: [
            [
                />/,
                {
                    token: 'delimiter',
                    next: '@styleEmbedded.$S2',
                    nextEmbedded: '$S2'
                }
            ],
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/[ \t\r\n]+/],
            [/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
        ],
        styleEmbedded: [
            [/<\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
            [/[^<]+/, '']
        ]
        // -- END <style> tags handling
    }
};
// TESTED WITH:
// <!DOCTYPE html>
// <html>
// <head>
//   <title>Monarch Workbench</title>
//   <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//   <!----
//   -- -- -- a comment -- -- --
//   ---->
//   <style bah="bah">
//     body { font-family: Consolas; } /* nice */
//   </style>
// </head
// >
// a = "asd"
// <body>
//   <br/>
//   <div
//   class
//   =
//   "test"
//   >
//     <script>
//       function() {
//         alert("hi </ script>"); // javascript
//       };
//     </script>
//     <script
// 	bah="asdfg"
// 	type="text/css"
// 	>
//   .bar { text-decoration: underline; }
//     </script>
//   </div>
// </body>
// </html>
