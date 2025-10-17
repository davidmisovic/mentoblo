'use client'

import { forwardRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Store for managing global state
const useStore = () => {
  const [background, setBackground] = useState("#ff6b35")
  
  const setStore = (newState: { background?: string }) => {
    if (newState.background) {
      setBackground(newState.background)
    }
  }
  
  return [{ background }, setStore] as const
}

// Random color generator
const randomColor = () => {
  const colors = [
    "#ff6b35", "#667eea", "#764ba2", "#f093fb", "#f5576c", 
    "#4facfe", "#00f2fe", "#ff9a9e", "#a8edea", "#fed6e3"
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// HOC for rotation animation
export function withRotate(Component: any) {
  const WrappedComponent = forwardRef<any, any>((props, ref) => {
    const [isRotated, setIsRotated] = useState(false)
    
    return (
      <Component
        ref={ref}
        {...props}
        className={cn(
          "transition-transform duration-500 ease-in-out",
          isRotated && "rotate-90",
          props.className
        )}
        onClick={(e: any) => {
          setIsRotated(!isRotated)
          props.onClick?.(e)
        }}
      />
    )
  })
  
  WrappedComponent.displayName = `withRotate(${Component.displayName || Component.name})`
  return WrappedComponent
}

// HOC for hover scale animation
export function withHover(Component: any) {
  const WrappedComponent = forwardRef<any, any>((props, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    
    return (
      <Component
        ref={ref}
        {...props}
        className={cn(
          "transition-transform duration-200 ease-in-out",
          isHovered && "scale-105",
          props.className
        )}
        onMouseEnter={(e: any) => {
          setIsHovered(true)
          props.onMouseEnter?.(e)
        }}
        onMouseLeave={(e: any) => {
          setIsHovered(false)
          props.onMouseLeave?.(e)
        }}
      />
    )
  })
  
  WrappedComponent.displayName = `withHover(${Component.displayName || Component.name})`
  return WrappedComponent
}

// HOC for random color animation
export function withRandomColor(Component: any) {
  const WrappedComponent = forwardRef<any, any>((props, ref) => {
    const [store, setStore] = useStore()
    const [isAnimating, setIsAnimating] = useState(false)
    
    return (
      <Component
        ref={ref}
        {...props}
        className={cn(
          "transition-all duration-500 ease-in-out",
          isAnimating && "animate-pulse",
          props.className
        )}
        style={{
          backgroundColor: store.background,
          ...props.style
        }}
        onClick={(e: any) => {
          setIsAnimating(true)
          setStore({ background: randomColor() })
          setTimeout(() => setIsAnimating(false), 500)
          props.onClick?.(e)
        }}
      />
    )
  })
  
  WrappedComponent.displayName = `withRandomColor(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Enhanced header component with animations
interface AnimatedHeaderProps {
  children: React.ReactNode
  className?: string
}

export const AnimatedHeader = forwardRef<HTMLDivElement, AnimatedHeaderProps>(
  ({ children, className }, ref) => {
    const [isScrolled, setIsScrolled] = useState(false)
    
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10)
      }
      
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          isScrolled 
            ? "bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-sm" 
            : "bg-white/80 backdrop-blur-xl border-slate-200/50",
          className
        )}
      >
        {children}
      </header>
    )
  }
)

AnimatedHeader.displayName = "AnimatedHeader"

// Animated logo component
interface AnimatedLogoProps {
  className?: string
  onClick?: () => void
}

export const AnimatedLogo = forwardRef<HTMLDivElement, AnimatedLogoProps>(
  ({ className, onClick }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center space-x-3 cursor-pointer transition-all duration-300",
          isHovered && "scale-105",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div className={cn(
          "w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-300",
          isHovered && "rotate-12 scale-110"
        )}>
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <span className="text-xl font-bold text-slate-900 transition-colors duration-300">
          Mentoblo
        </span>
      </div>
    )
  }
)

AnimatedLogo.displayName = "AnimatedLogo"

// Animated navigation item
interface AnimatedNavItemProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
  className?: string
}

export const AnimatedNavItem = forwardRef<HTMLAnchorElement, AnimatedNavItemProps>(
  ({ href, children, isActive, className }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          "relative px-4 py-2 text-sm font-medium transition-all duration-200",
          isActive 
            ? "text-orange-600" 
            : "text-slate-600 hover:text-slate-900",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
        <div className={cn(
          "absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-200",
          isActive ? "w-full" : isHovered ? "w-full" : "w-0"
        )} />
      </a>
    )
  }
)

AnimatedNavItem.displayName = "AnimatedNavItem"

// Animated button component
interface AnimatedButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = 'primary', size = 'md', className, onClick }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isPressed, setIsPressed] = useState(false)
    
    const baseClasses = "relative overflow-hidden transition-all duration-200 font-medium"
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm", 
      lg: "px-6 py-3 text-base"
    }
    const variantClasses = {
      primary: "bg-orange-500 hover:bg-orange-600 text-white",
      outline: "border-2 border-slate-200 hover:border-orange-500 text-slate-700 hover:text-orange-500",
      ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          isHovered && "scale-105",
          isPressed && "scale-95",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={onClick}
      >
        <span className="relative z-10">{children}</span>
        {variant === 'primary' && (
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 transition-opacity duration-200",
            isHovered && "opacity-100"
          )} />
        )}
      </button>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"
