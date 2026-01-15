import { Sidebar } from '@/components/admin/Sidebar';
import { AdminGuard } from '@/components/admin/AdminGuard';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-background transition-colors duration-300">
                <Sidebar />
                <main className="lg:pl-64 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
