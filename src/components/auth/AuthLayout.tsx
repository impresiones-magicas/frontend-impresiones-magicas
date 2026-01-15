"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    showBack?: boolean;
}

export function AuthLayout({
    children,
    title,
    description,
    showBack = true,
}: AuthLayoutProps) {
    const router = useRouter();

    return (
        <div
            className="flex min-h-screen flex-col bg-cyan-50 relative overflow-hidden"
            style={{ backgroundImage: "url('/leaf-pattern.png')" }}
        >
            {/* Background Pattern Overlay for better text contrast if needed */}
            <div
                className="absolute top-0 left-0 w-full h-full bg-white/30 z-0 pointer-events-none"
            ></div>

            {showBack && (
                <div className="p-4 z-10 relative">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-gray-700 hover:text-black hover:bg-white/50 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                </div>
            )}

            <div className={`flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8 z-10 relative ${showBack ? "-mt-20" : ""}`}>
                <div className="mb-8 text-center flex flex-col items-center gap-2">
                    <div className="flex w-12 h-12 bg-blue-600 rounded-full items-center justify-center text-white font-bold text-xl shadow-lg">
                        IM
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight drop-shadow-sm">Impresiones Mágicas</h1>
                </div>

                <Card className="w-full max-w-md border-gray-200 bg-white/95 backdrop-blur-sm shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-gray-900">{title}</CardTitle>
                        <CardDescription className="text-center text-gray-500">
                            {description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
