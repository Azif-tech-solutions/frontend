import { createContext, useContext } from 'react'
//navContext.jsx
/**
 * Gives any screen — and the shared PageHeader — access to the app's navigate
 * function, so breadcrumbs can route without every screen threading a prop.
 */
const NavCtx = createContext(null)

export function NavProvider({ value, children }) {
  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook lives alongside its Provider
export function useNavigateTo() {
  return useContext(NavCtx)
}
