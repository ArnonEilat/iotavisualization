import React from 'react';
import PropTypes from 'prop-types';
import * as d3Scale from 'd3-scale';

const Axis = ({x, endX, y, startVal, endVal, ticks}) => {
  const tickSize = 5;

  const xScale = d3Scale.scaleLinear().domain([startVal, endVal]);
  xScale.range([x, endX]);
  const tickValues = xScale.ticks(ticks);

  return (
    <g fill='none' className='unselectable'>
      <text
        stroke='#000'
        fontSize='15'
        textAnchor='middle'
        x={(x+endX)/2}
        y={y - tickSize}>
        Time
      </text>
      <line
        stroke='#000'
        strokeWidth='1'
        x1={x}
        x2={endX}
        y1={y}
        y2={y} />
      {tickValues.map(value =>
        <line
          key={value}
          stroke='#000'
          strokeWidth='2'
          x1={xScale(value)}
          y1={y}
          x2={xScale(value)}
          y2={y + tickSize} />
      )}
      {tickValues.map(value =>
        <text
          key={value}
          fill='#000'
          stroke='#000'
          fontSize='15'
          textAnchor='middle'
          x={xScale(value)}
          y={y + 3.2 * tickSize}>
          {value}
        </text>
      )}}
    </g>
  );
};

Axis.propTypes = {
  x: PropTypes.number.isRequired,
  endX: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  startVal: PropTypes.number.isRequired,
  endVal: PropTypes.number.isRequired,
  ticks: PropTypes.number.isRequired,
};

const Marker = ({color, id, nodeRadius}) =>
  <marker
    id={id}
    viewBox='0 -5 10 10'
    refX={nodeRadius+20}
    refY={0}
    markerWidth={5}
    markerHeight={3}
    fill={color}
    orient='auto' >
    <path d='M0,-5L10,0L0,5'/>
  </marker>;

Marker.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  nodeRadius: PropTypes.number.isRequired,
};

const Tangle = props =>
  <div>
    <svg width={props.width} height={props.height}>
      <defs>
        <Marker color='green' id='arrowhead' nodeRadius={props.nodeRadius} />
        <Marker color='red' id='arrowhead-approved' nodeRadius={props.nodeRadius} />
      </defs>
      <g>
        {props.links.map(link =>
          <path className={`links${props.approvedLinks.has(link) ? ' approved' : ''}`}
            key={`${link.source.name}->${link.target.name}`}
            d={ `M ${link.source.x} ${link.source.y} ` +
              `L ${link.target.x} ${link.target.y}`}
            strokeWidth='2' markerEnd={props.approvedLinks.has(link) ? 'url(#arrowhead-approved)' : 'url(#arrowhead)'}
          /> )}
      </g>
      <g>
        {props.nodes.map(node =>
          <g transform={`translate(${node.x},${node.y})`} key={node.name}
            className={`
               ${props.approvedNodes.has(node) ? 'approved' : ''}` +
              `${props.tips.has(node) ? ' tip' : ''}`}>
            <rect width={props.nodeRadius} height={props.nodeRadius}
              x={-props.nodeRadius/2}
              y={-props.nodeRadius/2}
              rx={props.nodeRadius/5}
              ry={props.nodeRadius/5}
              stroke='black'
              strokeWidth='1px'
              fill='white'
              name={node.name}
              onMouseEnter={props.mouseEntersNodeHandler}
              onMouseLeave={props.mouseLeavesNodeHandler} >
            </rect>
            {props.showLabels && <text
              className='unselectable'
              fill='#666' fontFamily='Helvetica'
              alignmentBaseline='middle' textAnchor='middle'
              pointerEvents='none'>
              {node.name}
            </text>}
          </g>)}
      </g>
      <g>
        <Axis
          x={props.leftMargin}
          endX={props.width - props.rightMargin}
          y={props.height - 20}
          ticks={8}
          startVal={0}
          endVal={props.nodes.length < 2 ? 1 : Math.max(...props.nodes.map(n => n.time))}
          />
      </g>
    </svg>
  </div>;

Tangle.propTypes = {
  links: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  leftMargin: PropTypes.number.isRequired,
  rightMargin: PropTypes.number.isRequired,
  nodeRadius: PropTypes.number.isRequired,
  mouseEntersNodeHandler: PropTypes.func,
  mouseLeavesNodeHandler: PropTypes.func,
  approvedNodes: PropTypes.any,
  approvedLinks: PropTypes.any,
};

export default Tangle;
