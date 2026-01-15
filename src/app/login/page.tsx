"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
    email: z.string().email({
        message: "Por favor introduce un email válido.",
    }),
    pass: z.string().min(1, {
        message: "La contraseña es requerida.",
    }),
});

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            pass: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await authService.login(values);
            login(response.access_token, response.user);
            toast.success("Login correcto", {
                description: "Bienvenido de nuevo.",
            });

            if (response.user.role === 'admin') {
                router.push("/admin/dashboard");
            } else {
                router.push("/");
            }
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Ha ocurrido un error inesperado.";
            toast.error("Error en el login", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleGoogleLogin = () => {
        toast.info("Próximamente", {
            description: "El inicio de sesión con Google estará disponible pronto.",
        });
    };

    return (
        <AuthLayout
            title="Iniciar Sesión"
            description="Introduce tu email y contraseña para acceder"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <FormField
                        control={form.control}
                        name="pass"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-900">Contraseña</FormLabel>
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
                                Entrando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-gray-400 font-bold tracking-widest leading-none py-1 rounded-full border border-gray-100 italic transition-transform duration-300 hover:scale-105">
                                O CONTINUAR CON
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" type="button" className="w-full border-gray-200 bg-white hover:bg-gray-50 text-gray-900" onClick={handleGoogleLogin}>
                        <svg
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fab"
                            data-icon="google"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 488 512"
                        >
                            <path
                                fill="currentColor"
                                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            ></path>
                        </svg>
                        Google
                    </Button>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">¿No tienes cuenta? </span>
                        <Link href="/register" className="text-blue-600 hover:underline font-medium">
                            Regístrate
                        </Link>
                    </div>
                </form>
            </Form>
        </AuthLayout >
    );
}
