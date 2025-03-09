import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getRecommendationsForUser, getUserProfile } from "../utils/api";

export default function UserVisualization() {
    const svgRef = useRef();
    const [profile, setProfile] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch user profile
                const profileData = await getUserProfile();
                setProfile(profileData);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };

        const fetchRecommendations = async () => {
            try {
                // Fetch recommendations
                const data = await getRecommendationsForUser();
                setRecommendations(data.results);
                console.log('Recommendations:', data);
            } catch (error) {
                console.error('Failed to fetch recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
        fetchRecommendations();
    }, []);

    useEffect(() => {
        if (loading || !profile || recommendations.length === 0) return;

        // Replace sample data with fetched data
        const data = {
            nodes: [
                { id: profile.username, type: "user" },
                ...recommendations.map(movie => ({ id: movie.id, type: "movie" }))
            ],
            links: recommendations.map(movie => ({
                source: profile.username,
                target: movie.id,
                value: movie.rating
            }))
        };

        const width = 900;
        const height = 900;

        // Clear any existing SVG content
        d3.select(svgRef.current).selectAll("*").remove();

        // Create the force simulation
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(200)) // Increase the distance between nodes
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        // Draw links
        const links = svg.selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .style("stroke", "#999")
            .style("stroke-width", d => Math.sqrt(d.value));

        // Draw nodes
        const nodes = svg.selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("r", 30) // Make nodes a bit bigger
            .style("fill", d => d.type === "user" ? "#ff7f0e" : "#1f77b4")
            .style("stroke", "#000") // Add black stroke
            
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        // Add labels inside the circles
        const labels = svg.selectAll("text")
            .data(data.nodes)
            .enter()
            .append("text")
            .text(d => d.id)
            .attr("font-size", 10)
            .attr("dx", -10)
            .attr("dy", 4)
            .attr("fill", "black") // Set text color to white
            .attr("font-weight", "bold"); // Add font-weight attribute for bold text

        // Update positions on each tick
        simulation.on("tick", () => {
            links
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            nodes
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });

        // Drag functions
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
    }, [loading, profile, recommendations]);

    return (
        <div className="min-h-screen">
            {loading ? (
                <div className="flex items-center justify-center">
                    <img 
                        src="/loading.gif" 
                        alt="Loading..."
                        className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px] bg-transparent"
                    />
                </div>
            ) : (
                <>
                    <div className="p-4">
                        <button 
                            onClick={() => window.location.href = '/recommendations'}
                            className=" text-white font-bold py-2 px-4 rounded"
                        >
                            Back to Recommendations
                        </button>
                    </div>
                    <div className="flex justify-center items-center">
                        <svg ref={svgRef}></svg>
                    </div>
                </>
            )}
        </div>
    );
}