'use client';

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';

interface PieDataItem {
    name: string;
    value: number;
    color: string;
    percentage?: string;
}

interface DistributionChartProps {
    data: PieDataItem[];
    totalAmount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl text-sm">
                <div className="font-semibold text-dark-bg mb-1">{data.name}</div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                    <span className="text-gray-600">
                        {data.value.toFixed(2)} € ({data.percentage}%)
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

export function DistributionChart({ data, totalAmount }: DistributionChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[220px] sm:h-[400px] text-gray-400 text-sm">
                Aucune donnée pour ce mois
            </div>
        );
    }

    return (
        <div className="relative w-full h-[220px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 13, paddingTop: 20 }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Centre du Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12 sm:pb-8">
                <span className="text-2xl sm:text-3xl font-bold text-dark-bg">
                    {totalAmount.toFixed(0)} €
                </span>
                <span className="text-xs sm:text-sm text-gray-400 mt-0.5">Total</span>
            </div>
        </div>
    );
}
