import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";

export interface TextAreaInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextAreaInput = React.forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex h-18 w-full text-text1 rounded-xl font-PeydaBold border-2 border-primary bg-transparent px-3 py-2 text-xl ring-offset-background placeholder:text-text3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y overflow-y-auto",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

TextAreaInput.displayName = "TextAreaInput";

export { TextAreaInput };
