export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F5EE] px-4 py-8 text-foreground dark:bg-[#151514]">
            {children}
        </div>
    );
}
