import { Suspense, type ReactNode } from "react";

export default function MenuLayout({ children }: { children: ReactNode }) {
    return <Suspense fallback={null}>{children}</Suspense>;
}