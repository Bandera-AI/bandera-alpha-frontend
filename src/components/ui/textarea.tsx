import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
  suggestionTriggers?: Record<string, string>;
  onSuggestionSelect?: (suggestion: string) => void;
  onGenerateAI?: () => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      maxRows,
      suggestionTriggers = {},
      onSuggestionSelect,
      onGenerateAI,
      ...props
    },
    ref
  ) => {
    const [suggestion, setSuggestion] = useState<string>("");
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const combinedRef = (node: HTMLTextAreaElement) => {
      // Update both refs
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
      internalRef.current = node;
    };

    useEffect(() => {
      if (!props.value || typeof props.value !== "string") {
        setSuggestion("");
        return;
      }

      const value = props.value.toString().toLowerCase().trim();

      // Only show suggestions if input is at least 2 characters
      if (value.length < 2) {
        setSuggestion("");
        return;
      }

      // Check for trigger words
      for (const trigger in suggestionTriggers) {
        if (value.includes(trigger.toLowerCase())) {
          setSuggestion(suggestionTriggers[trigger]);
          return;
        }
      }

      // If no specific trigger, check for context-based suggestions
      if (value.includes("thank")) {
        setSuggestion("Thank you for your time and consideration.");
      } else if (value.includes("i'm interest")) {
        setSuggestion(
          "I'm interested in discussing potential partnership opportunities."
        );
      } else if (value.includes("would")) {
        setSuggestion(
          "Would you be available for a brief call next week to discuss this further?"
        );
      } else if (value.includes("i have")) {
        setSuggestion(
          "I have a few questions regarding your company's services."
        );
      } else if (value.includes("i want")) {
        setSuggestion(
          "I wanted to introduce myself and learn more about your company."
        );
      } else {
        setSuggestion("");
      }
    }, [props.value, suggestionTriggers]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Tab key completes the suggestion
      if (e.key === "Tab" && suggestion) {
        e.preventDefault();

        if (internalRef.current && onSuggestionSelect) {
          onSuggestionSelect(suggestion);
        }
      }

      // Original onKeyDown handler if provided
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          style={maxRows ? { maxHeight: `${maxRows * 1.5}rem` } : undefined}
          ref={combinedRef}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {suggestion && (
          <div className="absolute top-0 px-3 py-2 text-sm pointer-events-none w-full">
            <span className="invisible">{props.value}</span>
            <span className="text-muted-foreground opacity-50">
              {suggestion.substring((props.value?.toString() || "").length)}
            </span>
          </div>
        )}
        
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
