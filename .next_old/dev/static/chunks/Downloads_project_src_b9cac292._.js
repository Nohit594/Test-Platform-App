(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/project/src/components/LatexRenderer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LatexRenderer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/project/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/project/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$react$2d$katex$2f$dist$2f$react$2d$katex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/project/node_modules/react-katex/dist/react-katex.js [app-client] (ecmascript)");
'use client';
;
;
;
;
function LatexRenderer(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "20350bf9c7c7276dc5f1bcf0e86a474fbbff156786846cd15cb134dcb891abe6") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "20350bf9c7c7276dc5f1bcf0e86a474fbbff156786846cd15cb134dcb891abe6";
    }
    const { text, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    if (!text) {
        return null;
    }
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /(\\\[[\s\S]*?\\\]|\\\(.*?\\\)|(?:\$\$[\s\S]*?\$\$)|(?:\$.*?\$))/g;
        $[1] = t2;
    } else {
        t2 = $[1];
    }
    const regex = t2;
    let t3;
    let t4;
    if ($[2] !== className || $[3] !== text) {
        const parts = text.split(regex);
        t3 = className;
        t4 = parts.map(_LatexRendererPartsMap);
        $[2] = className;
        $[3] = text;
        $[4] = t3;
        $[5] = t4;
    } else {
        t3 = $[4];
        t4 = $[5];
    }
    let t5;
    if ($[6] !== t3 || $[7] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t3,
            children: t4
        }, void 0, false, {
            fileName: "[project]/Downloads/project/src/components/LatexRenderer.tsx",
            lineNumber: 51,
            columnNumber: 10
        }, this);
        $[6] = t3;
        $[7] = t4;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    return t5;
}
_c = LatexRenderer;
function _LatexRendererPartsMap(part, index) {
    if (part.startsWith("\\[")) {
        const content = part.slice(2, -2);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$react$2d$katex$2f$dist$2f$react$2d$katex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockMath"], {
            children: content
        }, index, false, {
            fileName: "[project]/Downloads/project/src/components/LatexRenderer.tsx",
            lineNumber: 63,
            columnNumber: 12
        }, this);
    } else {
        if (part.startsWith("\\(")) {
            const content_0 = part.slice(2, -2);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$react$2d$katex$2f$dist$2f$react$2d$katex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InlineMath"], {
                children: content_0
            }, index, false, {
                fileName: "[project]/Downloads/project/src/components/LatexRenderer.tsx",
                lineNumber: 67,
                columnNumber: 14
            }, this);
        } else {
            if (part.startsWith("$$")) {
                const content_1 = part.slice(2, -2);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$react$2d$katex$2f$dist$2f$react$2d$katex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockMath"], {
                    children: content_1
                }, index, false, {
                    fileName: "[project]/Downloads/project/src/components/LatexRenderer.tsx",
                    lineNumber: 71,
                    columnNumber: 16
                }, this);
            } else {
                if (part.startsWith("$")) {
                    const content_2 = part.slice(1, -1);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$react$2d$katex$2f$dist$2f$react$2d$katex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InlineMath"], {
                        children: content_2
                    }, index, false, {
                        fileName: "[project]/Downloads/project/src/components/LatexRenderer.tsx",
                        lineNumber: 75,
                        columnNumber: 18
                    }, this);
                } else {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        dangerouslySetInnerHTML: {
                            __html: part
                        }
                    }, index, false, {
                        fileName: "[project]/Downloads/project/src/components/LatexRenderer.tsx",
                        lineNumber: 77,
                        columnNumber: 18
                    }, this);
                }
            }
        }
    }
}
var _c;
__turbopack_context__.k.register(_c, "LatexRenderer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/project/src/app/student/results/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ResultPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/project/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/project/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/project/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/project/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/project/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$src$2f$components$2f$LatexRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/project/src/components/LatexRenderer.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function ResultPage(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(32);
    if ($[0] !== "6dba79ca60e9efc2e8222f7e391b8f201a718a9ed882822c20b5144bc0f63ebf") {
        for(let $i = 0; $i < 32; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6dba79ca60e9efc2e8222f7e391b8f201a718a9ed882822c20b5144bc0f63ebf";
    }
    const { params } = t0;
    const resolvedParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const testId = resolvedParams.id;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    let t1;
    let t2;
    if ($[1] !== router || $[2] !== testId) {
        t1 = ({
            "ResultPage[useEffect()]": ()=>{
                const studentName = localStorage.getItem("studentName");
                if (!studentName) {
                    router.push("/student");
                    return;
                }
                fetch(`/api/student/results/${testId}?name=${encodeURIComponent(studentName)}`).then(_ResultPageUseEffectAnonymous).then(setData).catch({
                    "ResultPage[useEffect() > (anonymous)()]": (err)=>{
                        setError(err.message);
                        setLoading(false);
                    }
                }["ResultPage[useEffect() > (anonymous)()]"]).finally({
                    "ResultPage[useEffect() > (anonymous)()]": ()=>setLoading(false)
                }["ResultPage[useEffect() > (anonymous)()]"]);
            }
        })["ResultPage[useEffect()]"];
        t2 = [
            testId,
            router
        ];
        $[1] = router;
        $[2] = testId;
        $[3] = t1;
        $[4] = t2;
    } else {
        t1 = $[3];
        t2 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    if (loading) {
        let t3;
        if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-slate-950 flex items-center justify-center text-slate-500",
                children: "Loading Results..."
            }, void 0, false, {
                fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                lineNumber: 73,
                columnNumber: 12
            }, this);
            $[5] = t3;
        } else {
            t3 = $[5];
        }
        return t3;
    }
    if (error) {
        let t3;
        if ($[6] !== error) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xl",
                children: error
            }, void 0, false, {
                fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                lineNumber: 83,
                columnNumber: 12
            }, this);
            $[6] = error;
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        let t4;
        if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
            t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/student",
                className: "text-cyan-400 hover:underline",
                children: "Return to Dashboard"
            }, void 0, false, {
                fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                lineNumber: 91,
                columnNumber: 12
            }, this);
            $[8] = t4;
        } else {
            t4 = $[8];
        }
        let t5;
        if ($[9] !== t3) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4",
                children: [
                    t3,
                    t4
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                lineNumber: 98,
                columnNumber: 12
            }, this);
            $[9] = t3;
            $[10] = t5;
        } else {
            t5 = $[10];
        }
        return t5;
    }
    if (!data) {
        return null;
    }
    let t3;
    if ($[11] !== data.testTitle) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500",
            children: data.testTitle
        }, void 0, false, {
            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
            lineNumber: 111,
            columnNumber: 10
        }, this);
        $[11] = data.testTitle;
        $[12] = t3;
    } else {
        t3 = $[12];
    }
    let t4;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-slate-400 mt-2",
            children: "Analysis Report"
        }, void 0, false, {
            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
            lineNumber: 119,
            columnNumber: 10
        }, this);
        $[13] = t4;
    } else {
        t4 = $[13];
    }
    let t5;
    if ($[14] !== t3) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
            lineNumber: 126,
            columnNumber: 10
        }, this);
        $[14] = t3;
        $[15] = t5;
    } else {
        t5 = $[15];
    }
    let t6;
    if ($[16] !== data.score) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-4xl font-bold text-cyan-400",
            children: data.score
        }, void 0, false, {
            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
            lineNumber: 134,
            columnNumber: 10
        }, this);
        $[16] = data.score;
        $[17] = t6;
    } else {
        t6 = $[17];
    }
    let t7;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-slate-500 text-sm",
            children: "Total Score"
        }, void 0, false, {
            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
            lineNumber: 142,
            columnNumber: 10
        }, this);
        $[18] = t7;
    } else {
        t7 = $[18];
    }
    let t8;
    if ($[19] !== t6) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-right",
            children: [
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
            lineNumber: 149,
            columnNumber: 10
        }, this);
        $[19] = t6;
        $[20] = t8;
    } else {
        t8 = $[20];
    }
    let t9;
    if ($[21] !== t5 || $[22] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-8 flex justify-between items-end border-b border-slate-800 pb-6",
            children: [
                t5,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
            lineNumber: 157,
            columnNumber: 10
        }, this);
        $[21] = t5;
        $[22] = t8;
        $[23] = t9;
    } else {
        t9 = $[23];
    }
    let t10;
    if ($[24] !== data.analysis) {
        t10 = data.analysis.map(_ResultPageDataAnalysisMap);
        $[24] = data.analysis;
        $[25] = t10;
    } else {
        t10 = $[25];
    }
    let t11;
    if ($[26] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-8",
            children: t10
        }, void 0, false, {
            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
            lineNumber: 174,
            columnNumber: 11
        }, this);
        $[26] = t10;
        $[27] = t11;
    } else {
        t11 = $[27];
    }
    let t12;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-10 text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/student",
                className: "px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition-colors",
                children: "Back to Dashboard"
            }, void 0, false, {
                fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                lineNumber: 182,
                columnNumber: 46
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
            lineNumber: 182,
            columnNumber: 11
        }, this);
        $[28] = t12;
    } else {
        t12 = $[28];
    }
    let t13;
    if ($[29] !== t11 || $[30] !== t9) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-slate-950 text-white p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-4xl mx-auto",
                children: [
                    t9,
                    t11,
                    t12
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                lineNumber: 189,
                columnNumber: 69
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
            lineNumber: 189,
            columnNumber: 11
        }, this);
        $[29] = t11;
        $[30] = t9;
        $[31] = t13;
    } else {
        t13 = $[31];
    }
    return t13;
}
_s(ResultPage, "IO6hlukmmS3bsLB0Um90U8Gunj0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ResultPage;
function _ResultPageDataAnalysisMap(q) {
    const options = JSON.parse(q.options);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `p-6 rounded-2xl border ${q.isCorrect ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `font-bold text-lg ${q.isCorrect ? "text-green-400" : "text-red-400"}`,
                        children: [
                            "Q",
                            q.number
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                        lineNumber: 200,
                        columnNumber: 185
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$src$2f$components$2f$LatexRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            text: q.text
                        }, void 0, false, {
                            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                            lineNumber: 200,
                            columnNumber: 317
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                        lineNumber: 200,
                        columnNumber: 292
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                lineNumber: 200,
                columnNumber: 152
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 pl-10",
                children: options.map({
                    "ResultPage[data.analysis.map() > options.map()]": (opt, idx)=>{
                        let optionClass = "bg-slate-900 border-slate-800 text-slate-400";
                        if (idx === q.correctAnswer) {
                            optionClass = "bg-green-500/20 border-green-500/50 text-green-300 font-medium";
                        } else {
                            if (idx === q.studentAnswer && !q.isCorrect) {
                                optionClass = "bg-red-500/20 border-red-500/50 text-red-300";
                            }
                        }
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `p-3 rounded-lg border ${optionClass} flex items-center justify-between`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex-1 mr-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$src$2f$components$2f$LatexRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        text: opt
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                                        lineNumber: 210,
                                        columnNumber: 148
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 118
                                }, this),
                                idx === q.correctAnswer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-bold text-green-500 uppercase px-2 whitespace-nowrap",
                                    children: "Correct Answer"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 211
                                }, this),
                                idx === q.studentAnswer && idx !== q.correctAnswer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$project$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-bold text-red-500 uppercase px-2 whitespace-nowrap",
                                    children: "Your Answer"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 372
                                }, this)
                            ]
                        }, idx, true, {
                            fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                            lineNumber: 210,
                            columnNumber: 18
                        }, this);
                    }
                }["ResultPage[data.analysis.map() > options.map()]"])
            }, void 0, false, {
                fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
                lineNumber: 200,
                columnNumber: 360
            }, this)
        ]
    }, q.id, true, {
        fileName: "[project]/Downloads/project/src/app/student/results/[id]/page.tsx",
        lineNumber: 200,
        columnNumber: 10
    }, this);
}
function _ResultPageUseEffectAnonymous(res) {
    if (!res.ok) {
        if (res.status === 403) {
            throw new Error("Results are not available yet.");
        }
        throw new Error("Failed to load results");
    }
    return res.json();
}
var _c;
__turbopack_context__.k.register(_c, "ResultPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_project_src_b9cac292._.js.map