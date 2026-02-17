'use client';

import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

interface ChartDataPoint {
    name: string;
    [key: string]: string | number;
}

interface ExpensesChartProps {
    data: ChartDataPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null;

    const total = payload.reduce((sum: number, entry: { value: number }) => sum + (entry.value || 0), 0);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-[180px]">
            <p className="text-sm font-semibold text-dark-bg mb-2">{label}</p>
            <div className="space-y-1.5">
                {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-gray-600">{entry.name}</span>
                        </div>
                        <span className="font-semibold text-dark-bg">
                            {(entry.value || 0).toFixed(2)} €
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Total</span>
                <span className="font-bold text-dark-bg">{total.toFixed(2)} €</span>
            </div>
        </div>
    );
}

export function ExpensesChart({ data }: ExpensesChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[250px] sm:h-[350px] text-gray-400 text-sm">
                Aucune donnée à afficher pour le moment.
            </div>
        );
    }

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        unit="€"
                        width={60}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Legend
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{ fontSize: 13, paddingTop: 20 }}
                    />
                    <Bar
                        dataKey="Électricité"
                        fill="#3498DB"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="Gaz"
                        fill="#F1C40F"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="Eau"
                        fill="#2ECC71"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
