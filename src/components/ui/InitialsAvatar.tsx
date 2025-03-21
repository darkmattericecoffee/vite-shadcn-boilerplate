import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface InitialsAvatarProps {
  name: string;
  size?: 's' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackClassName?: string;
  colorIndex?: number; // Add optional colorIndex prop
}

/**
 * Generates a colored avatar with initials based on the provided name
 */
export const InitialsAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  InitialsAvatarProps & React.ComponentPropsWithoutRef<typeof Avatar>
>(({ name, size = 'md', className, fallbackClassName, colorIndex, ...props }, ref) => {
  // Get initials from name (up to 2 characters)
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Colors array
  const colors = [
    'bg-blue-500 text-white',
    'bg-green-500 text-white',
    'bg-purple-500 text-white',
    'bg-yellow-500 text-black',
    'bg-pink-500 text-white',
    'bg-indigo-500 text-white',
    'bg-red-500 text-white',
    'bg-orange-500 text-white',
    'bg-teal-500 text-white',
    'bg-cyan-500 text-white',
  ];

  // Generate a consistent color based on name or use provided colorIndex
  const getAvatarColor = (name: string, index?: number): string => {
    if (index !== undefined) {
      return colors[index % colors.length];
    }
    
    // Simple hash function to pick a consistent color
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  // Size classes mapping
  const sizeClasses = {
    s: 'h-6 w-6 text-xs mr-1',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  return (
    <Avatar
      ref={ref}
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      <AvatarFallback
        className={cn(
          "font-medium",
          getAvatarColor(name, colorIndex),
          fallbackClassName
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
});

InitialsAvatar.displayName = "InitialsAvatar";
export default InitialsAvatar;