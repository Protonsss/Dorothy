import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Chart.css';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showGrid?: boolean;
  animate?: boolean;
}

export function LineChart({
  data,
  width = 600,
  height = 300,
  color = '#1a8cff',
  showGrid = true,
  animate = true,
}: LineChartProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scalePoint()
      .domain(data.map(d => d.label))
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Grid
    if (showGrid) {
      svg.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(d3.axisLeft(y)
          .tickSize(-innerWidth)
          .tickFormat(() => ''));
    }

    // Line generator
    const line = d3.line<ChartDataPoint>()
      .x(d => x(d.label) || 0)
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Draw line
    const path = svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 3)
      .attr('d', line);

    // Animate line drawing
    if (animate) {
      const pathLength = path.node()?.getTotalLength() || 0;
      path
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(1500)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
    }

    // Add gradient area under line
    const area = d3.area<ChartDataPoint>()
      .x(d => x(d.label) || 0)
      .y0(innerHeight)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0);

    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#line-gradient)')
      .attr('d', area);

    // Add dots
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.label) || 0)
      .attr('cy', d => y(d.value))
      .attr('r', 0)
      .attr('fill', color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .transition()
      .delay((_, i) => i * 50)
      .duration(500)
      .attr('r', 5);

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .attr('color', 'rgba(255, 255, 255, 0.5)');

    svg.append('g')
      .call(d3.axisLeft(y))
      .attr('color', 'rgba(255, 255, 255, 0.5)');

  }, [data, width, height, color, showGrid, animate]);

  return <svg ref={svgRef} className="chart-svg" />;
}

interface BarChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  animate?: boolean;
}

export function BarChart({
  data,
  width = 600,
  height = 300,
  animate = true,
}: BarChartProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', d => d.color || '#1a8cff')
      .attr('rx', 6)
      .transition()
      .delay((_, i) => i * 100)
      .duration(animate ? 800 : 0)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.value))
      .attr('height', d => innerHeight - y(d.value));

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .attr('color', 'rgba(255, 255, 255, 0.5)');

    svg.append('g')
      .call(d3.axisLeft(y))
      .attr('color', 'rgba(255, 255, 255, 0.5)');

  }, [data, width, height, animate]);

  return <svg ref={svgRef} className="chart-svg" />;
}
