export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - signup/signin (auth pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!auth/signup|auth/signin|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
