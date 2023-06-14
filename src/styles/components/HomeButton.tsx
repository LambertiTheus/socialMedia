import { type PropsWithChildren } from "react";
import Link from "next/link"

export const HomeButton = (props: PropsWithChildren) => {
    return (
        <header className="flex items-center justify-between px-4 py-2 border-b border-blue-200 bg-white shadow-md">
            <Link href="/">
                <button className="text-blue-600 hover:text-blue-800">🐦 Home</button>
            </Link>
        </header>
    )
}
