import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = (variant: keyof typeof buttonVariantsMap = "default") => buttonVariantsMap[variant];

// Helper function to handle both string and object inputs
const getButtonVariant = (variant: any) => {
  if (typeof variant === 'string') {
    return buttonVariants(variant as keyof typeof buttonVariantsMap);
  }
  if (typeof variant === 'object' && variant !== null) {
    // Handle object inputs by finding the first truthy key
    const keys = Object.keys(variant) as (keyof typeof buttonVariantsMap)[];
    const activeKey = keys.find(key => variant[key]);
    return activeKey ? buttonVariants(activeKey) : buttonVariants();
  }
  return buttonVariants();
};

// Export the helper function for external use
export { getButtonVariant };

// Helper function to handle size inputs
const getButtonSize = (size: any) => {
  if (typeof size === 'string') {
    return buttonSizes[size as keyof typeof buttonSizes] || buttonSizes.default;
  }
  return buttonSizes.default;
};

const buttonVariantsMap = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariantsMap;
  size?: keyof typeof buttonSizes;
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, disabled, asChild, children, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button";
    const buttonProps = asChild ? {} : {
      className: cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        getButtonVariant(variant),
        getButtonSize(size),
        className
      ),
      disabled: disabled || loading,
      ref,
      ...props
    };

    return (
      <Comp {...buttonProps}>
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
