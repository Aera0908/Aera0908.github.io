import { useEffect, type RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Trap keyboard focus inside `containerRef` while `active` is true.
 * On activation, focus moves to the first focusable element (or the container itself).
 * On deactivation, focus is restored to whatever was focused before the modal opened.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
      )

    const initial = focusables()[0] ?? container
    initial.focus({ preventScroll: true })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const list = focusables()
      if (list.length === 0) {
        e.preventDefault()
        return
      }
      const first = list[0]
      const last = list[list.length - 1]
      const activeEl = document.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (activeEl === first || !container.contains(activeEl)) {
          e.preventDefault()
          last.focus({ preventScroll: true })
        }
      } else {
        if (activeEl === last) {
          e.preventDefault()
          first.focus({ preventScroll: true })
        }
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [active, containerRef])
}
