"use client"

/**
 * @module ChakraProvider
 * Связующее звено между кастомной темой (system) и React-компонентами.
 */
import { ChakraProvider } from "@chakra-ui/react"
// Импортируем нашу настроенную систему вместо стандартной
import { system } from "src/theme"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  return (
    /** * Заменяем value={defaultSystem} на нашу кастомную систему.
     * Теперь все компоненты будут видеть токены brand.500, bg.canvas и т.д.
     */
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}