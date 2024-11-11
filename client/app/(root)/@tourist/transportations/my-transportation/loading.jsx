export default function Loading() {
    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="w-64 h-8 mb-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-12 mb-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-4 bg-white rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}