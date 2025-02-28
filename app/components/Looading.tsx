export default function Loading() {
    return( 
        <div className="flex items-center justify-center h-screen">
            <img 
                src="/loading.gif" 
                alt="Loading..."
                className="w-16 h-16 animate-spin"
            />
        </div>
    );
}
