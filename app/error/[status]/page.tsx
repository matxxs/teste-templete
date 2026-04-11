import DynamicErrorPage from "./error-client"

export function generateStaticParams() {
  return [
    { status: "401" },
    { status: "403" },
    { status: "404" },
    { status: "500" },
  ]
}

export default function Page() {
  return <DynamicErrorPage />
}
