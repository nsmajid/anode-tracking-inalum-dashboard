import { FC } from "react"
import { VisuallyHidden } from "@react-aria/visually-hidden"
import { SwitchProps, useSwitch } from "@heroui/switch"
import { useTheme } from "next-themes"
import clsx from "clsx"

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons"
import { useMounted } from "@/hooks/mounted"
import { THEME_TYPE } from "@/config/constants"

export interface ThemeSwitchProps {
  className?: string
  classNames?: SwitchProps["classNames"]
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const isMounted = useMounted()

  const { theme, setTheme } = useTheme()

  const onChange = () => {
    theme === THEME_TYPE.LIGHT
      ? setTheme(THEME_TYPE.DARK)
      : setTheme(THEME_TYPE.LIGHT)
  }

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === THEME_TYPE.LIGHT,
    onChange,
  })

  // Prevent Hydration Mismatch
  if (!isMounted) return <div className="w-6 h-6" />

  return (
    <Component
      aria-label={isSelected ? "Switch to dark mode" : "Switch to light mode"}
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer",
          className,
          classNames?.base,
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-auto h-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-default-500",
              "pt-px",
              "px-0",
              "mx-0",
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {isSelected ? (
          <MoonFilledIcon size={22} />
        ) : (
          <SunFilledIcon size={22} />
        )}
      </div>
    </Component>
  )
}
