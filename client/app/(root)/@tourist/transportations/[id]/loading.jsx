export default function Loading() {
    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="w-48 h-8 mb-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <div className="w-32 h-6 mb-2 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="w-full h-64 mb-4 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="w-32 h-6 mb-2 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="w-48 h-8 mb-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid gap-4 mb-4 md:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <div className="w-32 h-4 mb-2 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    );
}