import { AuthRedirect } from "@/src/components/auth/AuthRedirect";

export default function MobileAppPage() {
    return (
        <div className="min-h-screen flex items-center justify-center text-center">
            <div className="max-w-md space-y-4">
                <h1 className="text-2xl font-semibold">
                    Mobile App Required
                </h1>

                <p className="text-gray-600">
                    User and business services are available on our mobile app.
                    Please download the app to continue.
                </p>

                <div className="flex gap-4 justify-center">
                    <a href="#" className="underline">Android App</a>
                    <a href="#" className="underline">iOS App</a>
                </div>
            </div>
        </div>
    );
}
