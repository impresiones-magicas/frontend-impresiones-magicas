"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";

const formSchema = z.object({
    code: z.string().length(6, {
        message: "El código debe tener 6 dígitos.",
    }),
    password: z.string().min(6, {
        message: "La contraseña debe tener al menos 6 caracteres.",
    }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("reset_email");
        if (!storedEmail) {
            toast.error("Error", {
                description: "No se encontró el email de recuperación. Por favor vuelve a solicitar el código.",
            });
            router.push("/forgot-password");
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await authService.resetPassword(email, values.code, values.password);
            toast.success("Contraseña actualizada", {
                description: "Ahora puedes iniciar sesión con tu nueva contraseña.",
            });
            sessionStorage.removeItem("reset_email");
            router.push("/login");
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Código inválido o expirado.";
            toast.error("Error", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Nueva Contraseña"
            description="Introduce el código de 6 dígitos enviado a tu email y tu nueva contraseña"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-900">Código de 6 dígitos</FormLabel>
                                <FormControl>
                                    <Input placeholder="123456" {...field} className="bg-white text-gray-900 border-gray-300 text-center text-2xl tracking-widest font-bold focus-visible:ring-blue-500/50 focus-visible:border-blue-500" maxLength={6} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-900">Nueva Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} className="bg-white text-gray-900 border-gray-300 focus-visible:ring-blue-500/50 focus-visible:border-blue-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-900">Confirmar Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} className="bg-white text-gray-900 border-gray-300 focus-visible:ring-blue-500/50 focus-visible:border-blue-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Actualizando...
                            </>
                        ) : (
                            "Cambiar contraseña"
                        )}
                    </Button>

                    <div className="text-center">
                        <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-blue-600 inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver a solicitar código
                        </Link>
                    </div>
                </form>
            </Form>
        </AuthLayout>
    );
}
