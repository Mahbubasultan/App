import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

interface FinchartProps {
  data: any[];
  title?: string;
  description?: string;
  className?: string;
}

interface FinchartLineProps extends FinchartProps {
  dataKey: string;
  color?: string;
  strokeWidth?: number;
  showArea?: boolean;
  xAxisKey?: string;
  height?: number;
}

interface FinchartBarProps extends FinchartProps {
  dataKey: string;
  color?: string;
  xAxisKey?: string;
  height?: number;
}

// Custom Tooltip
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
        <p className="text-xs text-text-secondary font-medium">{label}</p>
        <p className="text-sm font-bold text-text-primary">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Fintech Line Chart - smooth curved line with optional area
 */
export const FinchartLine: React.FC<FinchartLineProps> = ({
  data,
  dataKey,
  title,
  description,
  color = '#16A34A',
  strokeWidth = 2.5,
  showArea = false,
  xAxisKey = 'name',
  height = 300,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-card border border-gray-100 p-4 sm:p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg sm:text-xl font-semibold text-text-primary">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        {showArea ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xAxisKey} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="url(#gradientColor)"
              dot={false}
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xAxisKey} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={strokeWidth}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Fintech Bar Chart
 */
export const FinchartBar: React.FC<FinchartBarProps> = ({
  data,
  dataKey,
  title,
  description,
  color = '#16A34A',
  xAxisKey = 'name',
  height = 300,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-card border border-gray-100 p-4 sm:p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg sm:text-xl font-semibold text-text-primary">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xAxisKey} stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[12, 12, 0, 0]}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinchartLine;
