import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black/10 relative z-50">
            <Spinner className="w-32 h-32 block" />
        </div>
    );
}
