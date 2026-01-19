"use client";

import { useState } from "react";
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
    email: z.string().email({
        message: "Por favor introduce un email válido.",
    }),
});

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await authService.forgotPassword(values.email);
            toast.success("Código enviado", {
                description: "Revisa tu correo (o la consola del backend) para ver tu código de recuperación.",
            });
            // Store email in sessionStorage to use it on the reset page
            sessionStorage.setItem("reset_email", values.email);
            router.push("/reset-password");
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "No se pudo enviar el código.";
            toast.error("Error", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Recuperar Contraseña"
            description="Introduce tu email para recibir un código de recuperación"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-900">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="nombre@ejemplo.com" {...field} className="bg-white text-gray-900 border-gray-300 focus-visible:ring-blue-500/50 focus-visible:border-blue-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            "Enviar código"
                        )}
                    </Button>

                    <div className="text-center">
                        <Link href="/login" className="text-sm text-gray-500 hover:text-blue-600 inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </form>
            </Form>
        </AuthLayout>
    );
}
