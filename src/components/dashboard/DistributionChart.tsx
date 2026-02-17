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
}

interface DistributionChartProps {
    data: PieDataItem[];
    totalAmount: number;
}

export function DistributionChart({ data, totalAmount }: DistributionChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
                Aucune donnée pour ce mois
            </div>
        );
    }

    return (
        <div className="relative w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(2)} €`, '']}
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            fontSize: '13px',
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => (
                            <span className="text-xs text-gray-600">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Centre du Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ marginBottom: '40px' }}>
                <span className="text-2xl font-bold text-dark-bg">
                    {totalAmount.toFixed(0)} €
                </span>
                <span className="text-xs text-gray-400 mt-0.5">Total</span>
            </div>
        </div>
    );
}
