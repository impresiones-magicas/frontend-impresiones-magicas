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
    name: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres.",
    }),
    email: z.string().email({
        message: "Por favor introduce un email válido.",
    }),
    pass: z.string().min(6, {
        message: "La contraseña debe tener al menos 6 caracteres.",
    }),
    confirmPass: z.string(),
}).refine((data) => data.pass === data.confirmPass, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPass"],
});

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            pass: "",
            confirmPass: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await authService.register({
                name: values.name,
                email: values.email,
                pass: values.pass,
                role: 'user' // Default role
            });

            // Auto-login after successful registration
            const loginResponse = await authService.login({
                email: values.email,
                pass: values.pass
            });

            login(loginResponse.access_token, loginResponse.user);

            toast.success("Cuenta creada y sesión iniciada", {
                description: `Bienvenido/a, ${values.name}!`,
            });
            router.push("/"); // Redirect to home after success
        } catch (error: unknown) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Ha ocurrido un error inesperado.";
            toast.error("Error en el registro", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Crear Cuenta"
            description="Introduce tus datos para registrarte"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">Nombre Completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tu nombre" {...field} className="bg-background text-foreground" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="nombre@ejemplo.com" {...field} className="bg-background text-foreground" />
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
                                <FormLabel className="text-foreground">Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} className="bg-background text-foreground" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPass"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground">Confirmar Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} className="bg-background text-foreground" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creando cuenta...
                            </>
                        ) : (
                            "Registrarse"
                        )}
                    </Button>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Inicia sesión
                        </Link>
                    </div>
                </form>
            </Form>
        </AuthLayout>
    );
}
