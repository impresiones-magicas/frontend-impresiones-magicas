import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen relative z-50" style={{ backgroundColor: 'var(--brand-spinner-overlay)' }}>
            <Spinner className="w-32 h-32 block" />
        </div>
    );
}
