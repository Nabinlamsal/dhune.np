"use client";

import { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
}

export function SearchInput({
    className,
    wrapperClassName,
    ...props
}: SearchInputProps) {
    return (
        <div
            className={cn(
                "relative w-full max-w-sm",
                wrapperClassName
            )}
        >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                {...props}
                className={cn(
                    "w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    className
                )}
            />
        </div>
    );
}