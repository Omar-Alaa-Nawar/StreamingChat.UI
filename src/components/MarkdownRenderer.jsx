import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../context/ThemeContext";

/**
 * MarkdownRenderer Component - Phase 6.12
 *
 * Renders markdown content with syntax highlighting for code blocks.
 * Supports GitHub Flavored Markdown (GFM) features like tables, strikethrough, etc.
 *
 * Features:
 * - Syntax highlighting with theme-aware styles
 * - Tables, task lists, strikethrough (GFM)
 * - Inline code and code blocks
 * - Links, images, blockquotes
 * - Responsive and accessible
 * - Full dark mode support
 *
 * Usage:
 *   <MarkdownRenderer content="# Hello **world**" />
 */
const MarkdownRenderer = ({ content }) => {
  const { theme } = useTheme();

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks with syntax highlighting
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            return !inline && language ? (
              <SyntaxHighlighter
                style={theme === "dark" ? vscDarkPlus : vs}
                language={language}
                PreTag="div"
                className="rounded-lg my-2 text-sm"
                customStyle={{
                  margin: "0.5rem 0",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mt-3 mb-2 text-gray-900 dark:text-gray-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-3 mb-1 text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold mt-2 mb-1 text-gray-900 dark:text-gray-100">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="text-[15px] leading-relaxed my-2 text-gray-800 dark:text-gray-200">
              {children}
            </p>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {children}
            </a>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-2 space-y-1 text-gray-800 dark:text-gray-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-2 space-y-1 text-gray-800 dark:text-gray-200">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[15px] leading-relaxed">{children}</li>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 italic text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">
              {children}
            </td>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-4 border-gray-300 dark:border-gray-600" />
          ),

          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),

          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),

          // Strikethrough (GFM)
          del: ({ children }) => (
            <del className="line-through text-gray-600 dark:text-gray-400">
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
