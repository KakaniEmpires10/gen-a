import * as React from "react"

const MOBILE_BREAKPOINT = 640
const TABLET_BREAKPOINT = 768

export function useResponsive() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const tql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`)
    const onChangeMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    const onChangeTablet = () => {
      setIsTablet(window.innerWidth < TABLET_BREAKPOINT)
    }
    mql.addEventListener("change", onChangeMobile)
    tql.addEventListener("change", onChangeTablet)

    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    setIsTablet(window.innerWidth < TABLET_BREAKPOINT)

    return () => {
      mql.removeEventListener("change", onChangeMobile)
      tql.removeEventListener("change", onChangeMobile)
    }
  }, [])

  return {
    isMobile: !!isMobile,
    isTablet: !!isTablet
  }
}
