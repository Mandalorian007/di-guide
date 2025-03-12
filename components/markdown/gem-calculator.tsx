"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface GemRankData {
  rank: number;
  statValue: number;
  totalCopies: number;
  dawningEchoes: number;
}

interface IbenCost {
  level: number;
  cost: number;
}

const DEFAULT_DATA: GemRankData[] = [
  { rank: 1, statValue: 8, totalCopies: 1, dawningEchoes: 0 },
  { rank: 2, statValue: 16, totalCopies: 3, dawningEchoes: 0 },
  { rank: 3, statValue: 32, totalCopies: 9, dawningEchoes: 0 },
  { rank: 4, statValue: 56, totalCopies: 27, dawningEchoes: 0 },
  { rank: 5, statValue: 148, totalCopies: 81, dawningEchoes: 0 },
  { rank: 6, statValue: 216, totalCopies: 243, dawningEchoes: 1 },
  { rank: 7, statValue: 292, totalCopies: 729, dawningEchoes: 2 },
  { rank: 8, statValue: 656, totalCopies: 2187, dawningEchoes: 21 },
  { rank: 9, statValue: 952, totalCopies: 6561, dawningEchoes: 66 },
  { rank: 10, statValue: 1256, totalCopies: 19683, dawningEchoes: 201 },
];

// Iben Fahd costs from CSV
const IBEN_COSTS: IbenCost[] = [
  { level: 1, cost: 10 },
  { level: 2, cost: 30 },
  { level: 3, cost: 50 },
  { level: 4, cost: 70 },
  { level: 5, cost: 90 },
  { level: 6, cost: 110 },
  { level: 7, cost: 130 },
  { level: 8, cost: 150 },
  { level: 9, cost: 200 },
  { level: 10, cost: 250 },
  { level: 11, cost: 300 },
  { level: 12, cost: 350 },
  { level: 13, cost: 400 },
  { level: 14, cost: 450 },
  { level: 15, cost: 500 },
  { level: 16, cost: 550 },
  { level: 17, cost: 600 },
  { level: 18, cost: 650 },
  { level: 19, cost: 700 },
  { level: 20, cost: 800 },
  { level: 21, cost: 900 },
  { level: 22, cost: 1000 },
  { level: 23, cost: 1100 },
  { level: 24, cost: 1200 },
  { level: 25, cost: 1300 },
  { level: 26, cost: 1400 },
  { level: 27, cost: 1500 },
  { level: 28, cost: 1600 },
  { level: 29, cost: 1800 },
  { level: 30, cost: 2000 },
  { level: 31, cost: 2200 },
  { level: 32, cost: 2400 },
  { level: 33, cost: 2600 },
  { level: 34, cost: 2800 },
  { level: 35, cost: 3000 },
  { level: 36, cost: 3200 },
  { level: 37, cost: 3400 },
  { level: 38, cost: 3600 },
  { level: 39, cost: 3800 },
  { level: 40, cost: 4100 },
  { level: 41, cost: 4400 },
  { level: 42, cost: 4700 },
  { level: 43, cost: 5000 },
  { level: 44, cost: 5300 },
  { level: 45, cost: 5600 },
  { level: 46, cost: 5900 },
  { level: 47, cost: 6200 },
  { level: 48, cost: 6500 },
  { level: 49, cost: 7000 },
  { level: 50, cost: 7500 },
  { level: 51, cost: 8000 },
  { level: 52, cost: 8500 },
  { level: 53, cost: 9000 },
  { level: 54, cost: 9500 },
  { level: 55, cost: 10000 },
  { level: 56, cost: 10500 },
  { level: 57, cost: 11000 },
  { level: 58, cost: 11500 },
  { level: 59, cost: 12000 },
  { level: 60, cost: 0 }, // Max level, set to 0 for calculation purposes
];

// Constants for Iben Fahd calculations
const IBEN_STAT_POINTS_PER_LEVEL = 18;
const IBEN_PLAT_PER_STONE = 9.646;

export default function GemCalculator() {
  const [platPrice, setPlatPrice] = useState<number>(400);
  const [calculatedData, setCalculatedData] = useState<Array<GemRankData & { 
    totalCost: number; 
    platPerPoint: number;
    ibenEquivalent: string;
  }>>([]);

  useEffect(() => {
    calculateCosts();
  }, [platPrice]);

  const calculateCosts = () => {
    // Calculate platinum per stat point for each Iben level
    const ibenPlatPerPoint = IBEN_COSTS.map(level => {
      if (level.level === 60) return { level: level.level, platPerPoint: Infinity }; // Handle max level
      return {
        level: level.level,
        platPerPoint: level.cost / IBEN_STAT_POINTS_PER_LEVEL
      };
    });

    const newData = DEFAULT_DATA.map((rank) => {
      // Base gem cost calculation
      const totalCost = rank.totalCopies * platPrice + (rank.dawningEchoes * 500);
      
      // Calculate platinum per stat point for this normal gem rank
      const platPerPoint = totalCost / rank.statValue;
      
      // Find closest Iben Fahd level based on platinum per stat point
      let closestIben = { level: 0, diff: Infinity, platPerPoint: 0 };
      
      for (const iben of ibenPlatPerPoint) {
        const diff = Math.abs(iben.platPerPoint - platPerPoint);
        if (diff < closestIben.diff) {
          closestIben = { 
            level: iben.level, 
            diff, 
            platPerPoint: iben.platPerPoint 
          };
        }
      }
      
      // If we're at the last Iben level, indicate it's maxed
      const ibenEquivalent = closestIben.level === 60 
        ? "Max" 
        : `Rank ${closestIben.level} (${Math.round(closestIben.platPerPoint * IBEN_STAT_POINTS_PER_LEVEL)})`;

      return {
        ...rank,
        totalCost,
        platPerPoint,
        ibenEquivalent
      };
    });

    setCalculatedData(newData);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  return (
    <div className="my-2 p-2 pt-3 border rounded-md bg-card">
      <div className="mb-0.5 flex items-center">
        <label htmlFor="platPrice" className="text-sm font-medium mr-3">
          Platinum Price per Gem:
        </label>
        <Input
          id="platPrice"
          type="number"
          min="1"
          value={platPrice}
          onChange={(e) => setPlatPrice(parseInt(e.target.value) || 400)}
          className="w-24"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="px-2 py-1 text-left">Rank</th>
              <th className="px-2 py-1 text-left">Total Copies</th>
              <th className="px-2 py-1 text-left">Dawning Echoes (plat cost)</th>
              <th className="px-2 py-1 text-left">Total Cost</th>
              <th className="px-2 py-1 text-left">Plat/Point</th>
              <th className="px-2 py-1 text-left">Iben Equivalent</th>
            </tr>
          </thead>
          <tbody>
            {calculatedData.map((row) => (
              <tr key={row.rank} className="border-t hover:bg-muted/50">
                <td className="px-2 py-1">{row.rank}</td>
                <td className="px-2 py-1">{formatNumber(row.totalCopies)}</td>
                <td className="px-2 py-1">{row.dawningEchoes} {row.dawningEchoes > 0 ? `(${formatNumber(row.dawningEchoes * 500)})` : ''}</td>
                <td className="px-2 py-1">{formatNumber(row.totalCost)}</td>
                <td className="px-2 py-1">{formatNumber(row.platPerPoint)}</td>
                <td className="px-2 py-1">{row.ibenEquivalent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}