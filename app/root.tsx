import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router'
import type { LinksFunction } from 'react-router'
import '../src/index.css'
import Header from '../src/components/layout/Header'
import Footer from '../src/components/layout/Footer'

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const is404 = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-background text-foreground">
      <div className="text-6xl mb-4 text-primary">🌲</div>
      <h1 className="text-3xl font-bold mb-2">
        {is404 ? 'Nie znaleziono strony' : 'Coś poszło nie tak'}
      </h1>
      <p className="text-muted-foreground mb-6">
        {is404
          ? 'Tej sprawności jeszcze nie ma w naszej książeczce.'
          : 'Spróbuj ponownie za chwilę.'}
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-medium transition-colors"
      >
        ← Wróć na stronę główną
      </a>
    </div>
  )
}
