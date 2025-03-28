import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  change: number;
  iconBgColor: string;
  iconColor: string;
}

export function StatsCard({ title, value, icon, change, iconBgColor, iconColor }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
          <i className={`fas fa-${icon} text-xl`}></i>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-${change >= 0 ? 'green' : 'red'}-500 text-sm font-medium`}>
          <i className={`fas fa-arrow-${change >= 0 ? 'up' : 'down'} mr-1`}></i>
          {Math.abs(change)}%
        </span>
        <span className="text-slate-500 text-sm ml-2">From last month</span>
      </div>
    </div>
  );
}
