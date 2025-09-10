import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

// Root
export const DropdownMenu = DropdownMenuPrimitive.Root;

// Trigger with `asChild` support
export const DropdownMenuTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger ref={ref} className={cn(className)} {...props} />
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// Content
export const DropdownMenuContent = ({ className, sideOffset = 4, ...props }) => (
  <DropdownMenuPrimitive.Content
    sideOffset={sideOffset}
    className={cn(
      "bg-gray-900 text-white z-50 min-w-[10rem] rounded-xl border border-gray-700 p-1 shadow-xl",
      className
    )}
    {...props}
  />
);

// Label
export const DropdownMenuLabel = DropdownMenuPrimitive.Label;

// Separator
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;

// Item
export const DropdownMenuItem = ({ className, ...props }) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "relative flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-800 focus:bg-gray-800 outline-none",
      className
    )}
    {...props}
  />
);

// Checkbox Item
export const DropdownMenuCheckboxItem = ({ className, ...props }) => (
  <DropdownMenuPrimitive.CheckboxItem
    className={cn(
      "relative flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-800 focus:bg-gray-800 outline-none",
      className
    )}
    {...props}
  />
);

// Radio Group
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// Radio Item
export const DropdownMenuRadioItem = ({ className, ...props }) => (
  <DropdownMenuPrimitive.RadioItem
    className={cn(
      "relative flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-800 focus:bg-gray-800 outline-none",
      className
    )}
    {...props}
  />
);

// Sub Menu
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuSubTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-800 focus:bg-gray-800 outline-none",
      className
    )}
    {...props}
  />
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

export const DropdownMenuSubContent = ({ className, ...props }) => (
  <DropdownMenuPrimitive.SubContent
    className={cn(
      "bg-gray-900 text-white rounded-xl border border-gray-700 p-1 shadow-xl",
      className
    )}
    {...props}
  />
);

// Item Indicator
export const DropdownMenuItemIndicator = DropdownMenuPrimitive.ItemIndicator;
