import { useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { ClockIcon as ClockSolidIcon } from "@heroicons/react/24/solid";

export function WatchlistIcon() {
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleWatchlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsWatchlisted(!isWatchlisted);
        // TODO: Add API call to update watchlist
    };

    return (
        <div>
            <button
                onClick={handleWatchlistClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors group"
            >
                {isWatchlisted ? (
                    <ClockSolidIcon className="w-6 h-6 text-blue-500" />
                ) : (
                    <ClockIcon className="w-6 h-6 text-white group-hover:text-blue-500 transition-colors" />
                )}
                {showTooltip && (
                    <div className="absolute left-0 top-full mt-2 px-2 py-1 bg-black/75 backdrop-blur-sm text-white text-xs rounded whitespace-nowrap">
                        {isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                    </div>
                )}
            </button>
        </div>
    );
}