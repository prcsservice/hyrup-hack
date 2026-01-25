"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useCallback } from "react";

/* ======================================================
   CONSTANTS & DATA
====================================================== */

const MAP_VIEWBOX = "0 0 600 700";
const MAP_TRANSFORM = "translate(0 0) scale(1)";

// Graph Nodes (States) - Ordered for geographic highlight sweep
// Path: J&K → South via West → Kerala → East coast up → Northeast → Central → back
export const NODES = [
    // 1. NORTH TO SOUTH (West side)
    { id: "srinagar", x: 260, y: 80, label: "J&K" },
    { id: "shimla", x: 275, y: 120, label: "Himachal" },
    { id: "chandigarh", x: 250, y: 140, label: "Punjab" },
    { id: "panchkula", x: 260, y: 150, label: "Haryana" },
    { id: "delhi", x: 265, y: 165, label: "Delhi" },
    { id: "jaipur", x: 195, y: 220, label: "Rajasthan" },
    { id: "ahmedabad", x: 160, y: 300, label: "Gujarat" },
    { id: "mumbai", x: 175, y: 395, label: "Maharashtra" },
    { id: "panaji", x: 165, y: 445, label: "Goa" },
    { id: "bangalore", x: 250, y: 510, label: "Karnataka" },
    { id: "kochi", x: 210, y: 580, label: "Kerala" },
    // 2. SOUTH TO NORTH (East side)
    { id: "chennai", x: 310, y: 530, label: "Tamil Nadu" },
    { id: "amaravati", x: 290, y: 460, label: "Andhra Pradesh" },
    { id: "hyderabad", x: 260, y: 420, label: "Telangana" },
    { id: "raipur", x: 290, y: 340, label: "Chhattisgarh" },
    { id: "bhubaneswar", x: 360, y: 360, label: "Odisha" },
    { id: "ranchi", x: 360, y: 290, label: "Jharkhand" },
    { id: "patna", x: 370, y: 240, label: "Bihar" },
    { id: "kolkata", x: 410, y: 310, label: "West Bengal" },
    // 3. NORTHEAST SWEEP
    { id: "gangtok", x: 410, y: 180, label: "Sikkim" },
    { id: "guwahati", x: 455, y: 220, label: "Assam" },
    { id: "itanagar", x: 495, y: 185, label: "Arunachal" },
    { id: "kohima", x: 515, y: 225, label: "Nagaland" },
    { id: "imphal", x: 515, y: 260, label: "Manipur" },
    { id: "aizawl", x: 500, y: 300, label: "Mizoram" },
    { id: "agartala", x: 465, y: 290, label: "Tripura" },
    { id: "shillong", x: 455, y: 245, label: "Meghalaya" },
    // 4. CENTRAL (back towards North)
    { id: "bhopal", x: 240, y: 310, label: "Madhya Pradesh" },
    { id: "lucknow", x: 320, y: 210, label: "Uttar Pradesh" },
    { id: "dehradun", x: 300, y: 130, label: "Uttarakhand" },
    // Loop back to J&K (srinagar)
];

// State-specific issue news (hackathon-relevant topics)
export const STATE_NEWS: Record<string, { headline: string; issue: string; category: string }> = {
    srinagar: {
        headline: "Healthcare Access Gap",
        issue: "Remote areas report 40% shortage in medical staff and critical equipment.",
        category: "HEALTH"
    },
    chandigarh: {
        headline: "Air Quality Crisis",
        issue: "Winter AQI levels hit 'severe' category for 45 consecutive days.",
        category: "CLIMATE"
    },
    delhi: {
        headline: "Traffic Congestion Costs",
        issue: "Commuters lose 1.5 hours daily; economic loss estimated at ₹1 lakh crore/year.",
        category: "INFRA"
    },
    jaipur: {
        headline: "Water Scarcity Alert",
        issue: "Groundwater levels dropped 60% in 5 years; 200 villages face drought.",
        category: "CLIMATE"
    },
    lucknow: {
        headline: "School Absenteeism Surge",
        issue: "ASER 2024 reports 45% chronic absenteeism in government schools.",
        category: "EDUCATION"
    },
    kolkata: {
        headline: "Urban Flooding Crisis",
        issue: "Outdated drainage causes annual floods affecting 3 million residents.",
        category: "INFRA"
    },
    gangtok: {
        headline: "Landslide Early Warning",
        issue: "Climate change increases landslide frequency by 300% in 10 years.",
        category: "CLIMATE"
    },
    guwahati: {
        headline: "Flood Relief Delays",
        issue: "28 districts affected; relief distribution takes 72+ hours to reach.",
        category: "DISASTER"
    },
    itanagar: {
        headline: "Digital Divide",
        issue: "Only 15% schools have internet; remote learning remains inaccessible.",
        category: "EDUCATION"
    },
    shillong: {
        headline: "Youth Unemployment",
        issue: "Graduate unemployment at 34%; skill-job mismatch persists.",
        category: "ECONOMY"
    },
    kohima: {
        headline: "Road Connectivity Gap",
        issue: "40% villages lack all-weather road access; emergencies delayed.",
        category: "INFRA"
    },
    imphal: {
        headline: "Healthcare Shortage",
        issue: "1 doctor per 10,000 population; specialist care requires travel.",
        category: "HEALTH"
    },
    aizawl: {
        headline: "Waste Management Crisis",
        issue: "No proper landfill; plastic pollution threatens biodiversity.",
        category: "ENVIRONMENT"
    },
    agartala: {
        headline: "Agricultural Distress",
        issue: "Rubber prices crashed 40%; 50,000 farmers seek alternative income.",
        category: "ECONOMY"
    },
    ahmedabad: {
        headline: "Industrial Pollution",
        issue: "Textile effluents contaminate Sabarmati; 2 lakh affected by water quality.",
        category: "ENVIRONMENT"
    },
    mumbai: {
        headline: "Affordable Housing Crisis",
        issue: "60% live in informal settlements; rent consumes 50% of income.",
        category: "URBAN"
    },
    bhopal: {
        headline: "Teacher Shortage",
        issue: "65,000 schools have <10 students; 1.44 lakh teachers in underutilized posts.",
        category: "EDUCATION"
    },
    hyderabad: {
        headline: "NEET Integrity Crisis",
        issue: "Paper leak scandal erodes trust; students demand transparent reforms.",
        category: "EDUCATION"
    },
    chennai: {
        headline: "Water Crisis Returns",
        issue: "Reservoirs at 20% capacity; desalination plants running at full load.",
        category: "CLIMATE"
    },
    bangalore: {
        headline: "Traffic & Infra Bottleneck",
        issue: "Metro delays and road congestion cost IT sector ₹20,000 cr annually.",
        category: "INFRA"
    },
    kochi: {
        headline: "Coastal Erosion Threat",
        issue: "Rising seas erode 40km of coastline; fishing communities displaced.",
        category: "CLIMATE"
    },
    // NEW STATES
    shimla: {
        headline: "Tourist Overcrowding",
        issue: "Infrastructure strain as tourist footfall exceeds carrying capacity by 200%.",
        category: "URBAN"
    },
    dehradun: {
        headline: "Forest Fire Crisis",
        issue: "Climate change triggers 500+ forest fires annually; wildlife corridors threatened.",
        category: "CLIMATE"
    },
    panchkula: {
        headline: "Groundwater Depletion",
        issue: "Water table drops 3m/year; 60% blocks classified as over-exploited.",
        category: "CLIMATE"
    },
    patna: {
        headline: "School Dropout Crisis",
        issue: "40% students drop out before Class 10; child labor persists in rural areas.",
        category: "EDUCATION"
    },
    ranchi: {
        headline: "Mining Displacement",
        issue: "50,000 tribal families displaced; rehabilitation promises unfulfilled.",
        category: "SOCIAL"
    },
    bhubaneswar: {
        headline: "Cyclone Preparedness Gap",
        issue: "Coastal villages lack storm shelters; evacuation routes remain inadequate.",
        category: "DISASTER"
    },
    raipur: {
        headline: "Malnutrition Hotspot",
        issue: "38% children under 5 are stunted; anemia affects 60% of women.",
        category: "HEALTH"
    },
    panaji: {
        headline: "Waste Management Crisis",
        issue: "Tourism generates 600 tonnes/day waste; landfills at 150% capacity.",
        category: "ENVIRONMENT"
    },
    amaravati: {
        headline: "Capital City Stalled",
        issue: "Farmers await promised compensation; planned infrastructure remains on paper.",
        category: "INFRA"
    },
};

// Graph Edges
const EDGES = [
    // North India connections
    ["srinagar", "shimla"], ["shimla", "chandigarh"], ["shimla", "dehradun"],
    ["chandigarh", "panchkula"], ["panchkula", "delhi"], ["dehradun", "delhi"],
    ["delhi", "jaipur"], ["delhi", "lucknow"], ["jaipur", "ahmedabad"],
    // Central & East
    ["lucknow", "patna"], ["patna", "ranchi"], ["ranchi", "kolkata"],
    ["kolkata", "bhubaneswar"], ["bhubaneswar", "raipur"], ["raipur", "bhopal"],
    ["lucknow", "bhopal"], ["bhopal", "ahmedabad"],
    // West & South  
    ["ahmedabad", "mumbai"], ["mumbai", "panaji"], ["panaji", "bangalore"],
    ["mumbai", "hyderabad"], ["bhopal", "hyderabad"], ["raipur", "hyderabad"],
    ["hyderabad", "amaravati"], ["amaravati", "chennai"], ["hyderabad", "bangalore"],
    ["bangalore", "chennai"], ["bangalore", "kochi"], ["chennai", "kochi"],
    // NE Connections
    ["kolkata", "gangtok"], ["gangtok", "guwahati"], ["guwahati", "itanagar"],
    ["guwahati", "shillong"], ["guwahati", "kohima"], ["kohima", "imphal"],
    ["imphal", "aizawl"], ["aizawl", "agartala"], ["agartala", "shillong"]
];

/* ======================================================
   MAIN COMPONENT
====================================================== */

interface AnimatedIndiaMapProps {
    onStateChange?: (stateId: string, index: number) => void;
}

export function AnimatedIndiaMap({ onStateChange }: AnimatedIndiaMapProps) {
    const [activeNodeIndex, setActiveNodeIndex] = useState(0);

    const nodeMap = useMemo(() => Object.fromEntries(NODES.map(n => [n.id, n])), []);

    // Get the currently active node
    const activeNode = NODES[activeNodeIndex];

    // Notify parent of state change
    useEffect(() => {
        if (onStateChange && activeNode) {
            onStateChange(activeNode.id, activeNodeIndex);
        }
    }, [activeNode, activeNodeIndex, onStateChange]);

    // Cycle through ALL nodes one by one
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveNodeIndex(prev => (prev + 1) % NODES.length);
        }, 4000); // 4 seconds per state (allows reading time)
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
                className="relative w-[850px] h-[850px] pointer-events-auto"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 0.75 }}
                transition={{ duration: 1.5 }}
                style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                    // Diagonal tilt - reduced rotateX to show full map, translate to center
                    transform: "rotateX(10deg) rotateZ(30deg) translateY(60px) translateX(20px)",
                }}
            >
                <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                    <svg viewBox={MAP_VIEWBOX} className="absolute inset-0 w-full h-full overflow-visible">
                        <defs>
                            <filter id="glow-node">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="glow-strong">
                                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <g transform={MAP_TRANSFORM}>
                            {/* 1. Underlying Connections */}
                            <NetworkEdges nodeMap={nodeMap} activeNodeId={activeNode?.id} />

                            {/* 2. All Nodes with highlight on active one */}
                            <NetworkNodes nodes={NODES} activeNodeId={activeNode?.id} />

                            {/* 3. Active Node Label (rendered on top) */}
                            <ActiveNodeLabel node={activeNode} />
                        </g>
                    </svg>
                </div>
            </motion.div>
        </div>
    );
}

/* ======================================================
   SUB-COMPONENTS
====================================================== */

function NetworkEdges({ nodeMap, activeNodeId }: { nodeMap: any, activeNodeId: string | undefined }) {
    return (
        <g className="edges">
            {EDGES.map(([a, b], i) => {
                const start = nodeMap[a];
                const end = nodeMap[b];
                if (!start || !end) return null;

                // Highlight edges connected to active node
                const isConnected = a === activeNodeId || b === activeNodeId;

                return (
                    <motion.line
                        key={i}
                        x1={start.x} y1={start.y}
                        x2={end.x} y2={end.y}
                        stroke={isConnected ? "#FF4D00" : "#444"}
                        strokeWidth={isConnected ? 1.5 : 1}
                        strokeOpacity={isConnected ? 0.8 : 0.35}
                        initial={false}
                        animate={{
                            stroke: isConnected ? "#FF4D00" : "#444",
                            strokeOpacity: isConnected ? 0.8 : 0.35
                        }}
                        transition={{ duration: 0.3 }}
                    />
                );
            })}
        </g>
    );
}

function NetworkNodes({ nodes, activeNodeId }: { nodes: any[], activeNodeId: string | undefined }) {
    return (
        <g className="nodes">
            {nodes.map((node) => {
                const isActive = node.id === activeNodeId;
                return (
                    <g key={node.id}>
                        {/* Pulse ring for active node */}
                        {isActive && (
                            <motion.circle
                                cx={node.x} cy={node.y}
                                r={12}
                                fill="none"
                                stroke="#FF4D00"
                                strokeWidth={1}
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        )}

                        {/* Outer Ring */}
                        <motion.circle
                            cx={node.x} cy={node.y}
                            r={isActive ? 10 : 4}
                            fill="#000"
                            stroke={isActive ? "#FF4D00" : "#666"}
                            strokeWidth={isActive ? 2 : 1}
                            animate={{ r: isActive ? 10 : 4 }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Inner Core */}
                        <motion.circle
                            cx={node.x} cy={node.y}
                            r={isActive ? 5 : 2}
                            fill={isActive ? "#FF4D00" : "#888"}
                            filter={isActive ? "url(#glow-strong)" : undefined}
                            animate={{ r: isActive ? 5 : 2 }}
                            transition={{ duration: 0.3 }}
                        />
                    </g>
                );
            })}
        </g>
    );
}

function ActiveNodeLabel({ node }: { node: any }) {
    if (!node) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.g
                key={node.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {/* Label background */}
                <rect
                    x={node.x + 15}
                    y={node.y - 12}
                    width={node.label.length * 8 + 20}
                    height={24}
                    rx={4}
                    fill="rgba(0,0,0,0.95)"
                    stroke="#FF4D00"
                    strokeWidth="1"
                />

                {/* Connecting line */}
                <line
                    x1={node.x + 10} y1={node.y}
                    x2={node.x + 15} y2={node.y}
                    stroke="#FF4D00"
                    strokeWidth="2"
                />

                {/* Label text */}
                <text
                    x={node.x + 25} y={node.y + 5}
                    fill="#FFF"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                >
                    {node.label.toUpperCase()}
                </text>
            </motion.g>
        </AnimatePresence>
    );
}
